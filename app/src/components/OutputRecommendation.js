//Recommendations output app container

import React from "react";
import './OutputRecommendation.css';


const OutputRecommendation = ({recommendations, error}) => {
    console.log("Received recommendations:", recommendations); // Debugging

    return(
            <div className='book-recommendations-container'>
                <h3 className="recommendations-title">Recommended Books:</h3>

                <ul className='recommendations-list'>
                    {recommendations.map((book, index) => (
                        <li key={index} className="recommendation-item">
                            <strong className='book-title'>{book.title}</strong>
                            <li className='author-title'> by {book.author} </li>
                            <p className="book-description">{book.description}</p>
                            <em className="book-reason">Reason: {book.reason}</em>
                        </li>
                    ))}
                </ul>
            </div>   
        )};

export default OutputRecommendation;