import React, {useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AutocompleteInput.css';

const AutocompleteInput = ({name, placeholder, value, onChange, required}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);


    // Handle clicks outside the component to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                inputRef.current !== event.target
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch suggestions from Google Books API
    const fetchSuggestions = async (query) => {
        if (!query || query.trim() === '') {
            setSuggestions([]);
            return;
        }

        setLoading(true)
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=4`
            );

            if (response.data.items) {
                const bookSuggestions = response.data.items.map(item => {
                    const volumeInfo = item.volumeInfo;
                    const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown author';
                    return {
                        id: item.id,
                        title: volumeInfo.title,
                        author: authors,
                        fullTitle: `${volumeInfo.title} by ${authors}`
                    };
                });
                setSuggestions(bookSuggestions);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error('error fetching suggestions:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSuggestions(inputValue);
        }, 500); //waits 500ms after typing stops
        
        return () => clearTimeout(timer);
    }, [inputValue]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setShowSuggestions(true);

        // Call parent onChange with simulated event
        const simulatedEvent = {
            target: {
                name: name,
                value: value
            }
        };
        onChange(simulatedEvent);
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion.fullTitle);
        setShowSuggestions(false);

        const simulatedEvent = {
            target: {
                name: name,
                value: suggestion.fullTitle
            }
        };
        onChange(simulatedEvent);
    };

    return(
        <div className='autocomplete-container'>
            <input
                ref={inputRef}
                type="text"
                name={name}
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                required={required}
                className='autocomplete-input'
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul ref={suggestionsRef} className="suggestions-list">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.id || `${suggestion.title}-${suggestion.author}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className='suggestion-item'
                        >
                            <span className='suggestion-title'>{suggestion.title} </span>
                            <span className='suggestion-author'>by {suggestion.author} </span>
                            </li>            
                    ))}
                </ul>
            )}
            {loading && <div className='suggestions-loading'>Loading...</div>}
        </div>
    );
};

export default AutocompleteInput;