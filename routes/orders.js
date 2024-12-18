const express = require('express');
const pool = require('../db');
const router = express.Router();

// Middleware for validating request data
const validateOrderData = (req, res, next) => {
  const { user_id, total } = req.body;
  if (!user_id || !total) {
    return res.status(400).json({ error: 'Missing user_id or total in the request body' });
  }
  next();
};

// Get all orders
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM orders WHERE order_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Create a new order
router.post('/', validateOrderData, async (req, res) => {
  const { user_id, total } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *',
      [user_id, total]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Update an order
router.put('/:id', validateOrderData, async (req, res) => {
  const { id } = req.params;
  const { user_id, total } = req.body;
  try {
    const result = await pool.query(
      'UPDATE orders SET user_id = $1, total = $2 WHERE order_id = $3 RETURNING *',
      [user_id, total, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM orders WHERE order_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
