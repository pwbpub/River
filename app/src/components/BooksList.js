import React, { useState } from 'react';
import { fetchRecommendations } from '../api';

const BooksList = () => {
    const [bookInputs, setBookInputs] = useState({
        book1: '',
        reason1: '',
        book2: '',
        reason2: '',
        book3: '',
        reason3: ''
    });

    const [recommendations, SetRecommendattions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setBookInputs({...bookInputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        //Fetch recommendations from backend
        const response = await fetchRecommendations(bookInputs);

        if (response.error) {
            setError(response.error);
        } else {
            SetRecommendattions(response);
        }

        setLoading(false);
    };

    return (
        <div className='container'>
            <h2>Find Your Next Book</h2>
            <form onSubmit={handleSubmit}>
                <label>Enter 3 Favorite Books and What You Liked About Them:</label>
                <input type="text" name="book1" placeholder='Book 1' value={bookInputs.book1} onChange={handleChange} required />
                <input type="text" name="reason1" placeholder='Why you liked it(optional)' value={bookInputs.reason1} onChange={handleChange} required />

                <input type="text" name="book2" placeholder='Book 2' value={bookInputs.book2} onChange={handleChange} required />
                <input type="text" name="reason2" placeholder='Why you liked it(optional)' value={bookInputs.reason1} onChange={handleChange} required />

                <input type="text" name="book3" placeholder='Book 3' value={bookInputs.book3} onChange={handleChange} required />
                <input type="text" name="reason3" placeholder='Why you liked it(optional)' value={bookInputs.reason1} onChange={handleChange} required />

                <button type='submit' disabled={loading}>
                    {loading ? 'Loading...' : 'Get Recommendations'}
                </button>
            </form>

            {error && <p className='error'>{error}</p>}

            <div className='recommendations'>
                <h3>Recommended Books:</h3>
                {recommendations.length > 0 ? (
                    <ul>
                        {recommendations.map((book, index) => (
                            <li key={index}>
                                <strong>{book.title}</strong> by {book.author}
                                <p>{book.description}</p>
                                <em>Reason: {book.reason}</em>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recommendation yet. Submit your books above.</p>
                )}
            </div>
        </div>
    );
};

export default BooksList;