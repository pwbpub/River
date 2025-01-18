const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Book = require('.server/models/book');

const seedBooks = [
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        description: 'A young wizard begins his journey.',
    },
    {
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Science Fiction',
        description: 'A story of politics, religion, and survival on a desert planet.',
    },
    {
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        description: 'A chilling depiction of a totalitarian regime.',
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/River', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB.');

        await Book.deleteMany(); // Clear the collection
        console.log('Cleared existing book data.');

        await Book.insertMany(seedBooks);
        console.log('Seeded database with books.');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();