import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7100';

// Создаем axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor для добавления токена
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('greenzone_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Токен недействителен или отсутствует
      localStorage.removeItem('greenzone_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
