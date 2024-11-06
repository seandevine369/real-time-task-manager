const pool = require('../db');
const logger = require('../logger');

const getAllUsers = async () => {
    logger.info('Fetching all users from the database');
    const result = await pool.query('SELECT id, name, email, created_at, updated_at FROM users');
    return result.rows; 
};


const getUserById = async (id) => {
    logger.info(`Fetching user with ID ${id}`);
    const result = await pool.query(
        'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1', [id]
    );
    return result.rows[0];
};

const createUser = async (name, email) => {
    logger.info(`Creating new user: ${name} (${email})`);
    const defaultPasswordHash = 'hashed_password_123';  // Replace with actual hashing logic later
    const result = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at, updated_at',
        [name, email, defaultPasswordHash]
    );
    return result.rows[0];
};

const updateUser = async (id, name, email) => {
    logger.info(`Updating user with ID ${id} to name: ${name}, email: ${email}`);
    const result = await pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at, updated_at',
        [name, email, id]
    );
    return result.rows[0];
};

const deleteUser = async (id) => {
    logger.info(`Deleting user with ID ${id}`);
    const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id, name, email, created_at, updated_at',
        [id]
    );
    return result.rows[0];
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
