const express = require('express');
const router  = express.Router();
const Book = require('../models/book');



// Recommendations route
router.post('/recommendations', async (req, res) => {
    try {
        // Extract preferences from the request body
        const { genres, authors, titles } = req.body;

        // Build a query based on the preferences
        const query = {};
        if (genres) query.genre = { $in: genres };
        if (authors) query.author = { $in: authors };
        if (titles) query.title = { $in: titles };

        // Query the database
        const recommendations = await Book.find(query);

        // Respond with the recommendations
        res.json(recommendations);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//Get request for all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
});

console.log('Loading Book model from:', require.resolve('../models/book'));

module.exports = router;