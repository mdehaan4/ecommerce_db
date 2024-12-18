// Import necessary modules
const express = require('express');
const pool = require('../db'); // Import the database connection
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const saltRounds = 10;

  try {
    // Check if the user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const result = await pool.query(
      `INSERT INTO users (username, email, hashed_password, created_at) 
       VALUES ($1, $2, $3, NOW()) 
       RETURNING *`,
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// User login (Authenticate with Passport)
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: 'Login successful', user: { user_id: user.user_id, username: user.username, email: user.email } });
    });
  })(req, res, next);
});

module.exports = router;
