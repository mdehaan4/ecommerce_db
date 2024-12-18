// Required packages
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config(); // Load environment variables
const initializePassport = require('./passport-config'); // Import Passport configuration
initializePassport(passport); // Call the initialize function

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger'); // Import Swagger configuration

// Import the route files
const userRouter = require('./routes/users'); // User routes
const productRouter = require('./routes/products'); // Product routes
const orderRouter = require('./routes/orders'); // Order routes
const cartRouter = require('./routes/cart'); // Cart routes

// Initialize the Express app
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json()); 

// Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key', // Use secure secret
  resave: false,
  saveUninitialized: false, // Don't save empty sessions
}));

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Set up the routes
app.use('/api/users', userRouter); // Users routes
app.use('/api/products', productRouter); // Products routes
app.use('/api/orders', orderRouter); // Orders routes
app.use('/api/cart', cartRouter); // Cart routes

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Test route to check if the server is running
app.get('/', (req, res) => {
  res.send('E-commerce API is running');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
