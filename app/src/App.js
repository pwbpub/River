import './App.css';
import BookInput from './components/BookInput';
import OutputRecommendation from './components/OutputRecommendation';
import React, { useState } from 'react';


const App = () => {
  const [recommendations, setRecommendations] = useState([]);

  console.log("App State - Recommendations:", recommendations); // Debugging

  return (
    <div className="app-container">
      <BookInput setRecommendations={setRecommendations}  />
      <OutputRecommendation recommendations={recommendations}/>
    </div>
  );
};

export default App;

//HTML/JSX
// return (
//   <div className="app-container">
//   <div className="input-container">
//   <h3> <i>Find Your Next </i></h3>
//     <h1> Favorite Book</h1>
    
//     <form onSubmit={handleFormSubmit}>
//         <label>Enter 3 Books You Love:</label>
//         <input
//             type="text"
//             name="book1"
//             placeholder="Book 1" 
//             required
//             value={favoriteBooks.book1}         
//             onChange={handleInputChange}
//          />
//          <input
//             type="text"
//             name="book2"
//             placeholder="Book 2"
//             value={favoriteBooks.book2}
//             onChange={handleInputChange}
//         />
//         <input
//             type="text"
//             name="book3"
//             placeholder="Book 3"
//             value={favoriteBooks.book3}         
//             onChange={handleInputChange}
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Fetching...' : 'Get Recommendations'}
//         </button>
//       </form>
//     </div>
    
//     {error && <p className="error-message"></p>}

//     <BooksList recommendations={recommendations} /> {/* Using BooksList Component */}
//   </div>
//   );
// };
