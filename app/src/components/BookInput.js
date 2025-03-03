// Container where user enters books and reasoning. Contains logic and sends data to "OutputRecommendations".

import React, { useState } from 'react';
import './BookInput.css';
import { fetchRecommendations } from '../api';

const BookInput = ({ setRecommendations, setError }) => {
    const [bookInputs, setBookInputs] = useState({
        book1: '', reason1: '',
        book2: '', reason2: '',
        book3: '', reason3: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setBookInputs({ ...bookInputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (typeof setError === 'function') {
            setError('');
        }

        console.log("Sending to backend:", bookInputs); //debug

        try {
        const data = await fetchRecommendations(bookInputs);
        if (data.error) {
            console.error(data.error);
            if (typeof setError ==='function'){
                setError(data.error);
            }
        } else {
            setRecommendations(data);
        }
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        if (typeof setError ==='function') {
            setError("Sorry, we couldn't get your recommendations. Please try again.");
        }
    } finally {
        setLoading(false);
    }
};
        

    //See BookInput.css for formatting/visuals

     return (
    
        <div className='book-input-container'>
            <h2 className="find-book-title">Find Your Next Book</h2>
            <form onSubmit={handleSubmit}>
                <p className="find-book-subtitle"> Enter a book you like, and why!</p>

                <input type="text" name="book1" placeholder='Book 1' value={bookInputs.book1} onChange={handleChange} required />
                <input type="text" name="reason1" placeholder='Why you liked it (optional)' value={bookInputs.reason1} onChange={handleChange} />

                <input type="text" name="book2" placeholder='Book 2 (optional)' value={bookInputs.book2} onChange={handleChange}  />
                <input type="text" name="reason2" placeholder='Why you liked it (optional)' value={bookInputs.reason2} onChange={handleChange} />

                <input type="text" name="book3" placeholder='Book 3 (optional)' value={bookInputs.book3} onChange={handleChange}  />
                <input type="text" name="reason3" placeholder='Why you liked it (optional)' value={bookInputs.reason3} onChange={handleChange} />

                <button type='submit' disabled={loading}>
                    {loading ? 'Loading Recommendations...' : 'Get Recommendations'}
                </button>
            </form>
        </div>
    );
};

export default BookInput;