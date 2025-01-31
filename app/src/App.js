import './App.css';
import React, { useState } from 'react';

const App = () => {
// State variables
  const [favoriteBooks, setFavoriteBooks] = useState({
    book1: '',
    book2: '',
    book3: '',
  });
  const [recommendations, setRecommendations] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFavoriteBooks((prev) => ({ ...prev, [name]: value }));
  };


// Form submission, send favoriteBooks to back-end
const handleFormSubmit = async (e) => {
    e.preventDefault();
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
    }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

//HTML/JSX
return (
  <div className="input-container">
    <h1>Next Book</h1>
    <h3>Find Your Next Book to Read...</h3>
    <form onSubmit={handleFormSubmit}>
        <label>Enter 3 Favorite Books:</label>
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
        <button type="submit">Get Recommendations</button>
    </form>
    <h2>Recommended Books:</h2>
      <ul>
        {recommendations.length > 0 ? (
          recommendations.map((book, index) => (
            <li key={index}>
              <strong>{book.title}</strong> by {book.author}
              <p>{book.description}</p>
            </li>
          ))
        ) : (
          <p>No recommendations yet.</p>
        )}
      </ul>
    </div>
  );
};

export default App;
