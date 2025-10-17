const { Pool } = require('pg');
const pathToEnv = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
require('dotenv').config({ path: pathToEnv });

const isTestEnvironment = process.env.NODE_ENV === 'test';

// Configure database connection based on environment
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl:  {
    rejectUnauthorized: false
  }
};

const pool = new Pool(dbConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
    throw err;
  }
};

module.exports = {pool, connectDB};
