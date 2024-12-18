const express = require('express');
const pool = require('../db'); // Adjust the path as needed
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "products"');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get a specific product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM "products" WHERE product_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Product not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create a new product
router.post('/', async (req, res) => {
  const { name, description, price } = req.body; // No category data
  try {
    const result = await pool.query(
      'INSERT INTO "products" (name, description, price) VALUES ($1, $2, $3) RETURNING *',
      [name, description, price] // Insert without category
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body; // No category data
  try {
    const result = await pool.query(
      'UPDATE "products" SET name = $1, description = $2, price = $3 WHERE product_id = $4 RETURNING *',
      [name, description, price, id] // Update without category
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Product not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM "products" WHERE product_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Product not found');
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
