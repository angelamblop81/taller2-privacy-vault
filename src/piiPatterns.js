/**
 * Patrones para detectar PII en texto libre.
 * El orden de aplicación (correo -> teléfono -> nombre) evita
 * que un nombre capture partes de un email o que un teléfono
 * se confunda con dígitos de otro dato.
 */

// Correos: usuario + @ + dominio (ej. dborda@gmail.com)
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

// Teléfonos colombianos (10 dígitos) y variantes con +57, espacios o guiones.
// Ejemplos: 3152319157, +57 315 231 9157, 315-231-9157
const PHONE_REGEX = /(?:\+57[\s.-]*)?(?:\d[\s.-]*){9}\d/g;

/**
 * Nombres de persona: dos o más palabras capitalizadas.
 * Admite tildes y partículas frecuentes (de, del, la, los, las).
 * Ejemplo: Dago Borda, Ana María López, Juan de la Cruz
 */
const NAME_REGEX =
  /\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+(?:de(?:l)?|la|los|las)\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+|\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+\b/g;

module.exports = {
  EMAIL_REGEX,
  PHONE_REGEX,
  NAME_REGEX
};
