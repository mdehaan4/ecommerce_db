// Import Express
const express = require('express');

// Create an Express application
const app = express();

// Define a route that responds with a message
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Make the server listen on a specific port
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
