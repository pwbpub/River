import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Autocomplete, TextField, CircularProgress, useTheme } from '@mui/material';

const MUIBookAutocomplete = ({ name, label, value, onChange, required, sx }) => {
    const theme = useTheme();
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Fetches suggestions from Google Books API
    const fetchSuggestions = async (query) => {
        if (!query || query.trim() === '') {
            setOptions([]);
            return;
        }

        setLoading(true);
        try {
            const titleQuery = `intitle:${encodeURIComponent(query)}`;
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${titleQuery}&maxResults=6`
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
                setOptions(bookSuggestions);
            } else {
                // Fallsback to general search if no title matches
                const fallbackResponse = await axios.get(
                    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=4`
                );
                
                if (fallbackResponse.data.items) {
                    const bookSuggestions = fallbackResponse.data.items.map(item => {
                        const volumeInfo = item.volumeInfo;
                        const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown author';
                        return {
                            id: item.id,
                            title: volumeInfo.title,
                            author: authors,
                            fullTitle: `${volumeInfo.title} by ${authors}`
                        };
                    });
                    setOptions(bookSuggestions);
                } else {
                    setOptions([]);
                }
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSuggestions(inputValue);
        }, 300); 
        
        return () => clearTimeout(timer);
    }, [inputValue]);

    // Finds matching option for current value
    const valueOption = React.useMemo(() => {
        if (!value) return null;
        // Tries to find an exact match in options
        const match = options.find(option => option.fullTitle === value);
        if (match) return match;
        // If no match but have a value, creates a custom option
        return value ? { fullTitle: value, id: 'custom', title: value, author: '' } : null;
    }, [value, options]);

    const handleChange = (event, newValue) => {
        if (newValue) {
            // Call parent onChange with simulated event
            onChange({
                target: {
                    name: name,
                    value: typeof newValue === 'string' ? newValue : newValue.fullTitle
                }
            });
        } else {
            onChange({
                target: {
                    name: name,
                    value: ''
                }
            });
        }
    };

     return (
        <Autocomplete
            id={`${name}-autocomplete`}
            options={options}
            getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return option.fullTitle || '';
            }}
            isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false;
                return option.id === value.id || option.fullTitle === value.fullTitle;
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            value={valueOption}
            onChange={handleChange}
            loading={loading}
            fullWidth
            freeSolo
            filterOptions={(x) => x}
            renderInput={(params) => (
                <TextField 
                    {...params}
                    placeholder={inputValue ? "" : label}
                    required={required}
                    variant="outlined"
                    slotProps={{
                        inputLabel: { shrink: true },
                        input: {
                            ...params.InputProps,
                            style: {
                                color: 'rgba(37,37,37,1)'
                            },
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        },
                        htmlInput: params.inputProps
                    }}
                    sx={{
                        bgcolor: 'white',
                        borderRadius: 1,
                        '& input::placeholder': {
                            color: 'rgba(37,37,37,.7)',
                            opacity: '1',
                        },
                        ...sx
                    }}
                />
            )}
            renderOption={(props, option) => (
                <li {...props} key={option.id || option.fullTitle}>
                    <div style={{ width: '100%' }}>
                        <div style={{ 
                            fontWeight: 'bold',
                            fontFamily: 'Roboto Slab'
                        }}>
                            {option.title}
                        </div>
                        <div style={{ 
                            fontSize: '0.85rem', 
                            color: '#555',
                            fontFamily: 'Roboto'
                        }}>
                            by {option.author}
                        </div>
                    </div>
                </li>
            )}
            noOptionsText="No books found. Try a different search term."
        />
    );
};
export default MUIBookAutocomplete;