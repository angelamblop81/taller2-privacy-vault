
require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('No se encontró GEMINI_API_KEY en el archivo .env');
}

async function generateResponse(message) {
  try {
    const { GoogleGenAI } = await import('@google/genai');

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction:
          'Eres un asistente que responde de manera clara, útil y breve. ' +
          'Si recibes tokens de anonimización como NAME_12345678, ' +
          'EMAIL_12345678 o PHONE_12345678, consérvalos exactamente ' +
          'como aparecen. No intentes adivinar los datos originales.'
      }
    });

    return response.text;
  } catch (error) {
    console.error('Error al consultar Gemini:', error.message);
    throw error;
  }
}

module.exports = { generateResponse };
