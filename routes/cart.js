const express = require('express');
const pool = require('../db'); // Import the database connection
const router = express.Router();

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add a new cart for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Cart created successfully
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  const { userId } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO carts (user_id, created_at) 
       VALUES ($1, NOW()) 
       RETURNING *`,
      [userId]
    );

    res.status(201).json({ message: 'Cart created successfully', cart: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/cart/{cartId}:
 *   post:
 *     summary: Add a product to a cart
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product added to cart
 *       500:
 *         description: Server error
 */
router.post('/:cartId', async (req, res) => {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [cartId, productId, quantity]
    );

    res.status(201).json({ message: 'Product added to cart', cartItem: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/cart/{cartId}:
 *   get:
 *     summary: Get the contents of a cart
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: string
 *                       stock:
 *                         type: integer
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       quantity:
 *                         type: integer
 *       500:
 *         description: Server error
 */
router.get('/:cartId', async (req, res) => {
  const { cartId } = req.params;

  try {
    const result = await pool.query(
      `SELECT products.*, cart_items.quantity 
       FROM cart_items 
       JOIN products ON cart_items.product_id = products.product_id 
       WHERE cart_items.cart_id = $1`,
      [cartId]
    );

    res.status(200).json({ cartItems: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/cart/{cartId}:
 *   delete:
 *     summary: Delete a cart and its items
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router.delete('/:cartId', async (req, res) => {
  const { cartId } = req.params;

  try {
    // Delete all items in the cart
    await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    // Delete the cart itself
    const result = await pool.query('DELETE FROM carts WHERE cart_id = $1 RETURNING *', [cartId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/cart/{cartId}/checkout:
 *   post:
 *     summary: Checkout a cart
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Checkout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *                   properties:
 *                     order_id:
 *                       type: integer
 *                     cart_id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router.post('/:cartId/checkout', async (req, res) => {
  const { cartId } = req.params;

  try {
    // Validate the cart
    const cartResult = await pool.query('SELECT * FROM carts WHERE cart_id = $1', [cartId]);
    if (cartResult.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Simulate payment processing
    const paymentSuccess = true; // Assume payment succeeds
    if (!paymentSuccess) {
      return res.status(400).json({ message: 'Payment failed' });
    }

    // Create an order
    const orderResult = await pool.query(
      `INSERT INTO orders (cart_id, user_id, created_at) 
       VALUES ($1, $2, NOW()) 
       RETURNING *`,
      [cartId, cartResult.rows[0].user_id]
    );

    // Optionally, clear the cart or mark it as checked out
    await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    res.status(201).json({ message: 'Checkout successful', order: orderResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

