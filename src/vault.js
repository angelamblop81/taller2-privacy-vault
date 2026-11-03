
const { getDB } = require('./database');
const crypto = require('crypto');

const COLLECTION_NAME = 'token_vault';

function generateToken(prefix) {
  const uniquePart = crypto.randomBytes(4).toString('hex');
  return `${prefix}_${uniquePart}`;
}

async function getOrCreateToken(originalValue, type) {
  const db = getDB();
  const collection = db.collection(COLLECTION_NAME);

  // Buscar si el dato ya tiene un token
  const existing = await collection.findOne({
    originalValue,
    type
  });

  if (existing) {
    return existing.token;
  }

  // Generar un token nuevo
  let token;

  do {
    token = generateToken(type);
  } while (await collection.findOne({ token }));

  // Guardar la asociación en MongoDB
  await collection.insertOne({
    token,
    originalValue,
    type,
    createdAt: new Date()
  });

  return token;
}

async function resolveOriginal(token) {
  const db = getDB();
  const collection = db.collection(COLLECTION_NAME);

  const record = await collection.findOne({ token });

  return record ? record.originalValue : undefined;
}

module.exports = {
  getOrCreateToken,
  resolveOriginal
};
