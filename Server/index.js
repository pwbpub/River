const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());

//MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/River';
mongoose
    .connect(mongoURI,)
    .then(() => console.log('Conneccted to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

//Route
app.get('/', (req, res) =>{
    res.send('Hello World! This server is running. Fuck yeah, America!');
});

//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
