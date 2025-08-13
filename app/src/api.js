import axios from 'axios';

const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  'http://book-wizard-back-env.eba-cddhi2zn.us-east-1.elasticbeanstalk.com';

const API = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchRecommendations = async (booksPayload) => {
  try {
    const { data } = await API.post('/books/recommendations', booksPayload);
    return data;
  } catch (err) {
    console.error('Error fetching recommendations:', err?.response?.data || err.message);
    return { error: 'Failed to fetch recommendations. Please try again later.' };
  }
};
