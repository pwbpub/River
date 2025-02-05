import './App.css';
import BooksList from './components/BooksList';
import React, { useState } from 'react';

const App = () => {
// State variables
  const [favoriteBooks, setFavoriteBooks] = useState({
    book1: '',
    book2: '',
    book3: '',
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFavoriteBooks((prev) => ({ ...prev, [name]: value }));
  };


// Form submission, send favoriteBooks to back-end
const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('')

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favoriteBooks),
      });
    
      if (response.ok)  {
        const data = await response.json();
        setRecommendations(data); // Update reccomendations state(for backend)
      } else {
        console.error('Error fetching recommendations:', response.statusText);
        setError('Failed to get recommendations. Please try again');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('An error occured. Please try again.');
    } finally {
      setLoading(false);
    }
  };

//HTML/JSX
return (
  <div className="app-container">
  <div className="input-container">
  <h3> <i>Find Your Next </i></h3>
    <h1> Favorite Book</h1>
    
    <form onSubmit={handleFormSubmit}>
        <label>Enter 3 Books You Love:</label>
        <input
            type="text"
            name="book1"
            placeholder="Book 1" 
            required
            value={favoriteBooks.book1}         
            onChange={handleInputChange}
         />
         <input
            type="text"
            name="book2"
            placeholder="Book 2"
            value={favoriteBooks.book2}
            onChange={handleInputChange}
        />
        <input
            type="text"
            name="book3"
            placeholder="Book 3"
            value={favoriteBooks.book3}         
            onChange={handleInputChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Fetching...' : 'Get Recommendations'}
        </button>
      </form>
    </div>
    
    {error && <p className="error-message"></p>}

    <BooksList recommendations={recommendations} /> {/* Using BooksList Component */}
  </div>
  );
};

export default App;
