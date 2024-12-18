require('dotenv').config(); // Load environment variables from .env file
const { Pool } = require('pg'); // Import the Pool class from the pg package

// Configure the PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres', // Database username
  host: process.env.DB_HOST || 'localhost', // Database host (default: localhost)
  database: process.env.DB_DATABASE || 'ecommerce_db', // Database name
  password: process.env.DB_PASSWORD || 'postgres', // Database password
  port: process.env.DB_PORT || 5432, // Database port (default: 5432 for PostgreSQL)
});

// Export the pool object to use it in other files
module.exports = {
  query: (text, params) => pool.query(text, params), // Query helper for parameterized queries
  pool,
};
