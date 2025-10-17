// tests/setup.js
const { pool, connectDB } = require('../config/dbConfig');
const app = require('../server'); // Adjust path as necessary
const request = require('supertest');

beforeAll(async () => {
    console.log('Connecting to the test database...');
    await connectDB();
  });
  
  afterAll(async () => {
    await pool.end();
    console.log('Test database connection closed.');
  });

module.exports = { app, request };