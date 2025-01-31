import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust when/if backend URL changes
});

export const fetchRecommendations = async (books) => {
    try {
        const response = await API.post('/books/recommendations', books);
        return response.data;
    }   catch (error) {
            console.error('Error fetching recommendations:', error);
            return{error: 'Failed to fetch recommendations. Please try again later.' };
    }
};
