
const { EMAIL_REGEX, PHONE_REGEX, NAME_REGEX } = require('./piiPatterns');
const { getOrCreateToken } = require('./vault');

async function replaceMatches(text, regex, type) {
  const matches = [...text.matchAll(regex)];

  let result = text;

  for (const match of matches) {
    const normalized = match[0].trim();
    const token = await getOrCreateToken(normalized, type);

    result = result.replace(match[0], token);
  }

  return result;
}

/**
 * Anonimiza correos, teléfonos y nombres,
 * conservando el resto del texto.
 */
async function anonymizeMessage(message) {
  let anonymized = message;

  anonymized = await replaceMatches(anonymized, EMAIL_REGEX, 'EMAIL');
  anonymized = await replaceMatches(anonymized, PHONE_REGEX, 'PHONE');
  anonymized = await replaceMatches(anonymized, NAME_REGEX, 'NAME');

  return anonymized;
}

module.exports = {
  anonymizeMessage
};
