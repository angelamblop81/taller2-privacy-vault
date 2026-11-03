# Prompts utilizados – Privacy Vault

## Taller 2: Comprobando la viabilidad de nuestra iniciativa

Este documento recopila los prompts utilizados como apoyo durante el desarrollo del proyecto Privacy Vault.

Los prompts permitieron orientar la construcción de las funcionalidades de anonimización, desanonimización, persistencia de datos e integración con inteligencia artificial.

**Nota:** Los prompts 1 y 2 corresponden a las instrucciones iniciales documentadas durante el desarrollo. Los prompts 3 al 6 fueron reconstruidos y organizados a partir del proceso de implementación, por lo que no representan transcripciones literales de las conversaciones originales.

---
Prompt #1: utilizado para crear /anonymize
------------------------------------------------------------------------------------------------------------
Actúa como un desarrollador senior especializado en Node.js, Express y expresiones regulares (RegEx).
Estoy construyendo un Data Privacy Vault para anonimizar información personal (PII).
Necesito implementar la primera funcionalidad del proyecto:
1. Endpoint POST /anonymize
•	Debe recibir un JSON con una propiedad message que contenga un texto.
•	Debe identificar nombres de personas, correos electrónicos y números de teléfono.
•	Debe reemplazar cada dato personal por un token alfanumérico único.
•	Debe conservar el resto del mensaje original.
•	Debe devolver un JSON con la propiedad anonymizedMessage.
•	Debe mantener un registro temporal de las parejas entre el dato original y su token para permitir la posterior desanonimización.
Ejemplo de entrada:
{"message":"oferta de trabajo para Dago Borda con email dborda@gmail.com y teléfono 3152319157"}
La respuesta debe contener el mensaje anonimizado y utilizar tokens diferentes para nombres, correos y teléfonos.
2. Buenas prácticas
•	Utiliza Node.js y Express.
•	Utiliza expresiones regulares para identificar los datos personales.
•	Organiza el código de manera clara.
•	Incluye comentarios explicativos.
•	Valida que el mensaje exista y sea una cadena de texto.
•	Maneja los errores correctamente.
3. Configuración
El servidor debe ejecutarse en el puerto 3001.
Por favor, revisa el archivo app.js que ya existe y adapta el proyecto sin eliminar funcionalidades útiles.
Antes de realizar cambios, explícame qué archivos necesitas crear o modificar y qué hará cada uno. Después implementa la solución paso a paso.
------------------------------------------------------------------------------------------------------------

 
 Prompt #2: utilizado para crear /deanonymize
------------------------------------------------------------------------------------------------------------
Estamos desarrollando el proyecto Privacy Vault del Taller 2.
Necesito implementar el endpoint POST /deanonymize en app.js.
Requisitos:
1.	Importar la función resolveOriginal desde ./src/vault.
2.	Recibir un JSON con esta estructura:
{ "message": "texto con tokens" }
3.	Validar que el campo message exista y sea una cadena de texto. Si no cumple, responder con HTTP 400 y un mensaje de error claro.
4.	Utilizar resolveOriginal para reemplazar todos los tokens encontrados en el mensaje por sus valores originales.
5.	Si un token no existe en la bóveda, dejarlo intacto.
6.	Responder con esta estructura:
{ "originalMessage": "texto recuperado" }
7.	Mantener funcionando GET / y POST /anonymize.
8.	No modificar innecesariamente otros archivos ni cambiar el puerto 3001.
Antes de realizar cambios, revisa cómo están implementados actualmente anonymizer.js y vault.js para respetar la estructura existente.
Al finalizar, explícame qué modificaste y muestra el código completo actualizado de app.js.
------------------------------------------------------------------------------------------------------------
 

Prompt #3: Integración de MongoDB Atlas para la persistencia de datos
------------------------------------------------------------------------------------------------------------
Estamos desarrollando el proyecto Privacy Vault del Taller 2 utilizando Node.js y Express. Actualmente, el sistema realiza la anonimización y desanonimización de datos personales, pero necesitamos reemplazar el almacenamiento temporal en memoria por una solución de persistencia utilizando MongoDB Atlas.
Ayúdame a implementar esta funcionalidad teniendo en cuenta los siguientes requisitos:
1.	Utilizar el paquete oficial mongodb para conectarse a MongoDB Atlas.
2.	Utilizar dotenv para leer las variables de entorno desde el archivo .env, evitando exponer credenciales directamente en el código.
3.	Crear el archivo src/database.js para gestionar la conexión y permitir acceder a la base de datos desde otros módulos.
4.	Utilizar una base de datos llamada privacy_vault y una colección llamada token_vault.
5.	Adaptar el archivo src/vault.js para almacenar los tokens generados junto con el valor original, el tipo de dato y la fecha de creación.
6.	Implementar una función que permita consultar el valor original a partir de un token.
7.	Adaptar las funciones que interactúan con MongoDB para trabajar de manera asíncrona (async/await).
8.	Mantener la compatibilidad con las funcionalidades existentes de anonimización y desanonimización.
9.	Explicar qué cambios deben realizarse en cada archivo y cómo probar que la información se almacena correctamente.
Importante: no incluir credenciales reales en el código fuente ni compartir información sensible.
------------------------------------------------------------------------------------------------------------


Prompt 4: Integración inicial con OpenAI
------------------------------------------------------------------------------------------------------------

Estamos desarrollando el proyecto Privacy Vault del Taller 2 utilizando Node.js y Express. Necesitamos integrar un servicio de inteligencia artificial que permita procesar mensajes después de que la información personal haya sido anonimizada.
Ayúdame a implementar la integración con la API de OpenAI teniendo en cuenta los siguientes requisitos:
1.	Utilizar el SDK oficial de OpenAI para Node.js.
2.	Leer la clave de acceso desde la variable de entorno OPENAI_API_KEY, almacenada en el archivo .env.
3.	Crear o adaptar el archivo src/openaiService.js para centralizar la comunicación con el modelo de inteligencia artificial.
4.	Implementar una función asíncrona llamada generateResponse(message) que reciba un mensaje y devuelva el texto generado por el modelo.
5.	Implementar el manejo de errores para identificar problemas durante la comunicación con la API.
6.	Evitar exponer las credenciales en el código fuente o en los mensajes de error.
7.	Exportar la función para que pueda ser utilizada desde app.js.
8.	Mantener una estructura modular y compatible con el proyecto existente.
Explica los cambios necesarios y cómo realizar una prueba de funcionamiento del servicio.
------------------------------------------------------------------------------------------------------------

Prompt 5: creación del endpoint /secureChatGPT
Continuamos con el desarrollo del proyecto Privacy Vault del Taller 2 utilizando Node.js y Express.
Necesitamos implementar un nuevo endpoint llamado POST /secureChatGPT que integre las funcionalidades de anonimización, procesamiento mediante inteligencia artificial y recuperación de los datos originales.
Ten en cuenta los siguientes requisitos:
1.	Recibir un mensaje mediante el campo message en el cuerpo de la solicitud.
2.	Validar que el campo message exista y que su contenido sea una cadena de texto.
3.	Utilizar la función anonymizeMessage() para identificar y reemplazar los datos personales por tokens.
4.	Enviar únicamente el mensaje anonimizado a la función generateResponse(), encargada de comunicarse con el servicio de inteligencia artificial.
5.	Recibir la respuesta generada por el modelo e identificar los tokens de anonimización presentes en ella.
6.	Consultar MongoDB Atlas mediante la función resolveOriginal() para recuperar los valores originales asociados a cada token.
7.	Reemplazar los tokens encontrados por sus respectivos valores originales.
8.	Devolver una respuesta JSON con los siguientes campos:
o	anonymizedMessage: mensaje anonimizado enviado al modelo.
o	aiResponse: respuesta generada por el modelo, conservando los tokens.
o	finalResponse: respuesta final con los datos originales restaurados.
9.	Implementar manejo de errores para evitar que la aplicación falle ante problemas durante el procesamiento.
10.	Mantener los endpoints existentes /anonymize y /deanonymize, sin alterar su funcionamiento.
11.	Mantener el servidor funcionando en el puerto 3001.
Explica cómo integrar el endpoint en app.js y cómo probar el flujo completo utilizando PowerShell.
------------------------------------------------------------------------------------------------------------
Prompt 6: Adaptación del servicio de OpenAI a Gemini
------------------------------------------------------------------------------------------------------------
Durante el desarrollo del proyecto Privacy Vault del Taller 2 se intentó realizar la integración con OpenAI, pero no fue posible continuar debido a la falta de créditos disponibles en la API.
Con autorización del monitor del taller, decidimos utilizar Gemini como proveedor alternativo de inteligencia artificial.
Ayúdame a adaptar el servicio existente teniendo en cuenta los siguientes requisitos:
1.	Utilizar el SDK oficial de Google para Node.js mediante el paquete @google/genai.
2.	Leer la clave de acceso desde la variable de entorno GEMINI_API_KEY, almacenada en el archivo .env.
3.	Mantener el archivo src/openaiService.js para evitar modificar las importaciones existentes en app.js.
4.	Utilizar el modelo gemini-3.8-flash, indicado por el monitor del taller.
5.	Mantener la función asíncrona generateResponse(message) para conservar la compatibilidad con el endpoint /secureChatGPT.
6.	Configurar una instrucción para que Gemini conserve exactamente los tokens de anonimización, como NAME_12345678, EMAIL_12345678 y PHONE_12345678, sin intentar adivinar los datos originales.
7.	Implementar manejo de errores sin exponer la clave de acceso.
8.	Mantener las credenciales fuera del código fuente y utilizar variables de entorno.
9.	Explicar los cambios realizados y cómo comprobar que la integración funciona correctamente.
Importante: la adaptación debe mantener el flujo existente de anonimización, procesamiento mediante inteligencia artificial y recuperación de los datos originales.

