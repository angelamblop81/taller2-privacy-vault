# Privacy Vault – Taller 2

## 1. Descripción del proyecto

Privacy Vault es una aplicación desarrollada con Node.js y Express que permite proteger información personal antes de enviarla a un servicio de inteligencia artificial.

La solución identifica datos personales mediante expresiones regulares (Regex), los reemplaza por tokens de anonimización y almacena la relación entre los tokens y los valores originales en MongoDB Atlas.

Posteriormente, permite enviar el mensaje protegido a un modelo de inteligencia artificial mediante Gemini y recuperar los datos originales en la respuesta final.

## 2. Objetivo

Desarrollar un prototipo funcional que permita reducir la exposición de información personal durante el procesamiento de mensajes mediante inteligencia artificial, utilizando mecanismos de anonimización, almacenamiento persistente y recuperación controlada de datos.

## 3. Funcionalidades principales

- **Anonimización:** identifica nombres, correos electrónicos y números telefónicos, y los reemplaza por tokens.
- **Persistencia:** almacena los tokens y sus valores originales en MongoDB Atlas.
- **Desanonimización:** permite recuperar los valores originales mediante los tokens almacenados.
- **Integración con IA:** envía mensajes anonimizados a Gemini para su procesamiento.
- **Procesamiento seguro:** integra la anonimización, la consulta al modelo y la recuperación de información en el endpoint `/secureChatGPT`.

## 4. Tecnologías utilizadas

| Tecnología | Utilidad |
|---|---|
| Node.js | Entorno de ejecución de JavaScript. |
| Express | Creación del servidor y los endpoints. |
| MongoDB Atlas | Almacenamiento persistente de tokens y datos originales. |
| Google Gemini | Procesamiento de mensajes mediante inteligencia artificial. |
| `@google/genai` | SDK para la integración con Gemini. |
| `mongodb` | Conexión con MongoDB Atlas. |
| `dotenv` | Gestión de variables de entorno. |
| Regex | Identificación de datos personales. |

## 5. Estructura del proyecto

```text
taller2-privacy-vault/
│
├── src/
│   ├── anonymizer.js
│   ├── database.js
│   ├── openaiService.js
│   ├── piiPatterns.js
│   └── vault.js
│
├── app.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── README.md
└── PROMPTS.md
```

**Descripción de los archivos principales:**

- `app.js`: configura el servidor Express y define los endpoints.
- `src/piiPatterns.js`: contiene las expresiones regulares para identificar datos personales.
- `src/anonymizer.js`: realiza la sustitución de datos personales por tokens.
- `src/vault.js`: genera los tokens y administra su almacenamiento y recuperación.
- `src/database.js`: gestiona la conexión con MongoDB Atlas.
- `src/openaiService.js`: contiene la función de integración con Gemini, manteniendo el nombre original del archivo por compatibilidad con el proyecto.

## 6. Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js y npm instalados.
- Una cuenta de MongoDB Atlas.
- Una base de datos configurada en MongoDB Atlas.
- Una clave de acceso a Gemini API.

## 7. Instalación y configuración

### Paso 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd taller2-privacy-vault
```

Reemplazar `URL_DEL_REPOSITORIO` por la dirección del repositorio de GitHub.

### Paso 2. Instalar las dependencias

```bash
npm install
```

### Paso 3. Configurar las variables de entorno

Crear un archivo llamado `.env` en la carpeta principal del proyecto y agregar las siguientes variables:

```env
MONGODB_URI=tu_cadena_de_conexion
MONGODB_DB_NAME=privacy_vault
GEMINI_API_KEY=tu_clave_de_gemini
```

Reemplazar los valores de ejemplo por las credenciales correspondientes.

**Importante:** el archivo `.env` contiene información sensible y no debe publicarse en GitHub. El proyecto incluye `.env.example` como referencia para configurar las variables necesarias.

### Paso 4. Configurar MongoDB Atlas

Configurar la conexión a MongoDB Atlas y verificar que exista la base de datos `privacy_vault` con la colección `token_vault`.

### Paso 5. Ejecutar el servidor

```bash
node app.js
```

Si la configuración es correcta, se mostrarán mensajes similares a los siguientes:

```text
¡Conexión exitosa con MongoDB Atlas!
Servidor ejecutándose en http://localhost:3001
```

## 8. Endpoints disponibles

La aplicación cuenta con los siguientes endpoints:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Verifica que el servidor esté funcionando. |
| POST | `/anonymize` | Anonimiza la información personal de un mensaje. |
| POST | `/deanonymize` | Recupera los datos originales mediante los tokens. |
| POST | `/secureChatGPT` | Integra anonimización, procesamiento con Gemini y recuperación de datos. |

### Ejemplo 1. Anonimización

**Solicitud:**

```json
{
  "message": "La cliente Maria Lopez tiene el correo maria@example.com y telefono 3001234567"
}
```

**Respuesta esperada (los tokens pueden variar):**

```json
{
  "anonymizedMessage": "La cliente NAME_12345678 tiene el correo EMAIL_12345678 y telefono PHONE_12345678"
}
```

### Ejemplo 2. Desanonimización

**Solicitud:**

```json
{
  "message": "La cliente NAME_12345678 tiene el correo EMAIL_12345678"
}
```

**Resultado:** el sistema consulta MongoDB Atlas y reemplaza los tokens registrados por sus valores originales.

### Ejemplo 3. Procesamiento seguro con inteligencia artificial

**Solicitud:**

```json
{
  "message": "La cliente Maria Lopez, con correo maria@example.com y telefono 3001234567, solicita ayuda para recuperar el acceso a su cuenta bancaria. Resume su solicitud y conserva literalmente los tokens de anonimización."
}
```

**Respuesta:** el endpoint devuelve tres campos:

- `anonymizedMessage`: mensaje protegido enviado a Gemini.
- `aiResponse`: respuesta del modelo con los tokens conservados.
- `finalResponse`: respuesta final con los datos originales recuperados.

## 9. Consideraciones de seguridad

- Las credenciales se administran mediante variables de entorno.
- El archivo `.env` está excluido del repositorio mediante `.gitignore`.
- Los mensajes enviados al modelo de inteligencia artificial contienen tokens en lugar de los datos personales detectados.
- La información original se conserva en MongoDB Atlas para permitir su recuperación.
- El prototipo utiliza expresiones regulares y, por lo tanto, no garantiza la detección de todos los tipos de información personal.
- Para un entorno empresarial se recomienda implementar cifrado de los datos almacenados, controles de acceso, auditoría y políticas de retención.

## 10. Autoría y contexto académico

Proyecto desarrollado como parte del Taller 2 – Comprobando la viabilidad de nuestra iniciativa, de la Maestría en IA para Negocios Digitales.

La solución corresponde a un prototipo académico orientado a demostrar la viabilidad de proteger información personal durante el procesamiento de solicitudes mediante inteligencia artificial.