import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
