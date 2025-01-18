import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust when/if backend URL changes
});

export const fetchBooks = () => API.get('/books');
export const fetchRecommendations = (preferences) => API.post('/books/recommendations', preferences);
