const express = require('express');
const userRoutes = require('./routes/users');

const app = express();

app.use(express.json());
app.use('/users', userRoutes);

// Optional: Define a root route if needed
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
