import './App.css';
import BookInput from './components/BookInput';
import OutputRecommendation from './components/OutputRecommendation';
import React, { useState } from 'react';


const App = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  console.log("App State - Recommendations:", recommendations); // Debugging

  return (
    <div className="app-container">
      {error && <div className='error-message'>{error}</div>} {/*displays error message*/}
      <BookInput setRecommendations={setRecommendations} setError={setError} />
      <OutputRecommendation recommendations={recommendations}/>
    </div>
  );
};

export default App;