
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

const connectionInfo = uri
  ? uri.match(/^mongodb\+srv:\/\/([^:]+):[^@]+@([^/?]+)/)
  : null;

console.log('Diagnóstico de MongoDB:');
console.log('Usuario:', connectionInfo?.[1] || 'No encontrado');
console.log('Clúster:', connectionInfo?.[2] || 'No encontrado');
console.log('Base de datos:', dbName || 'No encontrada');

let client;
let database;

async function connectDB() {
  try {
    if (!uri) {
      throw new Error('No se encontró MONGODB_URI en el archivo .env');
    }

    client = new MongoClient(uri);

    await client.connect();

    database = client.db(dbName);

    console.log('¡Conexión exitosa con MongoDB Atlas!');

    return database;
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    throw error;
  }
}

function getDB() {
  if (!database) {
    throw new Error('La base de datos todavía no está conectada.');
  }

  return database;
}

module.exports = {
  connectDB,
  getDB
};
