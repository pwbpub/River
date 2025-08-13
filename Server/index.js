require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

// --- CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://book-wizard.com',
  'https://www.book-wizard.com'
  // 'http://<your-env>.<region>.elasticbeanstalk.com'
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    cb(null, allowedOrigins.includes(origin));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// --- Routes
const bookRoutes = require('./books');  // fixed path
app.use('/api/books', bookRoutes);

// --- Health check for EB
app.get('/health', (_req, res) => res.status(200).send('OK'));

// --- MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// --- Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
