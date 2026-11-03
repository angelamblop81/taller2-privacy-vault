
const express = require('express');
const { anonymizeMessage } = require('./src/anonymizer');
const { resolveOriginal } = require('./src/vault');
const { connectDB } = require('./src/database');
const { generateResponse } = require('./src/openaiService');

const TOKEN_REGEX = /\b(?:NAME|EMAIL|PHONE)_[0-9a-f]{8}\b/g;

const app = express();

app.use(express.json());

// Ruta inicial
app.get('/', (req, res) => {
  res.send('¡Privacy Vault está funcionando!');
});

// POST /anonymize
app.post('/anonymize', async (req, res) => {
  try {
    const { message } = req.body || {};

    if (message === undefined || message === null) {
      return res.status(400).json({
        error: 'El campo "message" es obligatorio.'
      });
    }

    if (typeof message !== 'string') {
      return res.status(400).json({
        error: 'El campo "message" debe ser una cadena de texto.'
      });
    }

    const anonymizedMessage = await anonymizeMessage(message);

    return res.status(200).json({ anonymizedMessage });

  } catch (error) {
    console.error('Error al anonimizar:', error.message);

    return res.status(500).json({
      error: 'No se pudo anonimizar el mensaje.'
    });
  }
});

// POST /deanonymize
app.post('/deanonymize', async (req, res) => {
  try {
    const { message } = req.body || {};

    if (message === undefined || message === null) {
      return res.status(400).json({
        error: 'El campo "message" es obligatorio.'
      });
    }

    if (typeof message !== 'string') {
      return res.status(400).json({
        error: 'El campo "message" debe ser una cadena de texto.'
      });
    }

    const tokens = [...new Set(message.match(TOKEN_REGEX) || [])];

    let originalMessage = message;

    for (const token of tokens) {
      const originalValue = await resolveOriginal(token);

      if (originalValue !== undefined) {
        originalMessage = originalMessage.replaceAll(token, originalValue);
      }
    }

    return res.status(200).json({ originalMessage });

  } catch (error) {
    console.error('Error al desanonimizar:', error.message);

    return res.status(500).json({
      error: 'No se pudo desanonimizar el mensaje.'
    });
  }
});

// POST /secureChatGPT
app.post('/secureChatGPT', async (req, res) => {
  try {
    const { message } = req.body || {};

    if (message === undefined || message === null) {
      return res.status(400).json({
        error: 'El campo "message" es obligatorio.'
      });
    }

    if (typeof message !== 'string') {
      return res.status(400).json({
        error: 'El campo "message" debe ser una cadena de texto.'
      });
    }

    // 1. Anonimizar el mensaje
    const anonymizedMessage = await anonymizeMessage(message);

    // 2. Enviar el mensaje anonimizado a OpenAI
    const aiResponse = await generateResponse(anonymizedMessage);

    // 3. Identificar tokens en la respuesta
    const tokens = [...new Set(
      aiResponse.match(TOKEN_REGEX) || []
    )];

    // 4. Restaurar los datos originales
    let finalResponse = aiResponse;

    for (const token of tokens) {
      const originalValue = await resolveOriginal(token);

      if (originalValue !== undefined) {
        finalResponse = finalResponse.replaceAll(token, originalValue);
      }
    }

    // 5. Devolver los resultados
    return res.status(200).json({
      anonymizedMessage,
      aiResponse,
      finalResponse
    });

  } catch (error) {
    console.error('Error en secureChatGPT:', error.message);

    return res.status(500).json({
      error: 'No se pudo procesar la solicitud segura.'
    });
  }
});

// Manejo de JSON mal formado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'El cuerpo de la petición no es un JSON válido.'
    });
  }

  return next(err);
});

const PORT = 3001;

// Conectar primero a MongoDB y después iniciar el servidor
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo iniciar la aplicación:', error.message);
  });
