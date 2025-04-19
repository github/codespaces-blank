import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Add token to every request if available
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;