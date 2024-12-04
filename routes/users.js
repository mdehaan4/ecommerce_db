const express = require('express');
const pool = require('../db');
const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  console.log('POST /users called');
  const { username, email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [username, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get all users
router.get('/', async (req, res) => {
  console.log('GET /users called');
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
  console.log(`GET /users/${req.params.id} called`);
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  console.log(`PUT /users/${req.params.id} called`);
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const result = await pool.query(
        'UPDATE users SET username = $1, email = $2, password = $3 WHERE user_id = $4 RETURNING *',
        [username, email, password, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).send('User not found');
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  // Delete a user
  router.delete('/:id', async (req, res) => {
    console.log(`DELETE /users/${req.params.id} called`);
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).send('User not found');
      }
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  module.exports = router;

  