import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Type-safe interceptor
api.interceptors.response.use(
  (response: any) => response,  // Use axios.AxiosResponse for response
  (error: any) => {  // Use axios.AxiosError for error
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
