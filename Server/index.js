require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log("MONGO_URI:", process.env.MONGO_URI);


const app = express();
app.use(express.json());

// Enables CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


//For Get request restAPI
const bookRoutes = require('./routes/books'); // Path to the books.js file
app.use('/api/books', bookRoutes);

//MongoDB connection
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
mongoose
    .connect(mongoURI)
    .then(() => console.log('Conneccted to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

//Route test
app.get('/', (req, res) =>{
    res.send('Hello World! This server is running. Fuck yeah, America!');
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


