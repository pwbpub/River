import React, { useEffect, useState } from 'react';
import { fetchBooks } from '../api';

const BooksList = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const getBooks = async () => {
            try {
                const { data } = await fetchBooks();
                setBooks(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        getBooks();
    }, []);

    return (
        <div>
            <h2>Books List</h2>
            <ul>
                {books.map((book) => (
                    <li key={book._id}>
                        <strong>{book.title}</strong> by {book.author}
                        <p>{book.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BooksList;