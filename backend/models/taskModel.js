const pool = require('../config/dbConfig');
const logger = require('../logger');

const getAllTasks = async () => {
    logger.info('Fetching all tasks from the database');
    const result = await pool.query('SELECT * FROM tasks');
    return result.rows;
};

const getTaskById = async (id) => {
    logger.info(`Fetching task with ID ${id}`);
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0];
};

const getAllTasksByUserId = async (userId) => {
    logger.info(`Fetching tasks for user ID ${userId}`);
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    return result.rows;
  };

  const createTask = async (title, description, user_id) => {
    try {
        logger.info(`Creating new task for user ID ${user_id}: "${title}"`);
        const result = await pool.query(
            'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
            [title, description, user_id]
        );
        logger.info('Task created:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        logger.error('Error creating task:', error);
        throw new Error('Error creating task: ' + error.message);
    }
};

const updateTask = async (id, title, description, status) => {
    logger.info(`Updating task with ID ${id} to title: "${title}", description: "${description}"`);
    const result = await pool.query(
        'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
        [title, description, status, id]
    );
    return result.rows[0];
};

const deleteTask = async (id) => {
    logger.info(`Deleting task with ID ${id}`);
    const result = await pool.query(
        'DELETE FROM tasks WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

module.exports = { getAllTasks, getTaskById, getAllTasksByUserId, createTask, updateTask, deleteTask };
