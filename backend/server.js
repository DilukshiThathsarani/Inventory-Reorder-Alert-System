require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

mongoose.set('strictQuery', false);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cors());

// Example route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start server
let PORT = process.env.PORT || 5001;

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on port ${server.address().port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} in use, trying next port...`);
    PORT += 1;
    server.listen(PORT, '127.0.0.1');
  } else {
    console.error(err);
  }
});
