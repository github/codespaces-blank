import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Update with your backend API base URL
});

// Add token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Remove token from localStorage
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;