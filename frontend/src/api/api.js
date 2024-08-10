import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  console.error('REACT_APP_API_URL is not set in the environment');
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Интерцептор для обработки OPTIONS запросов
api.interceptors.request.use(config => {
    if (config.method === 'options') {
        config.headers['Access-Control-Request-Method'] = config.method;
    }
    return config;
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
        return Promise.reject(error);
    }
);

export const login = (userData) => api.post('/auth/login', userData);
export const getVideos = () => api.get('/videos');
export const addVideo = (videoData) => api.post('/videos', videoData);
export const likeVideo = (videoId) => api.post(`/videos/${videoId}/like`);
export const getComments = (videoId) => api.get(`/comments/${videoId}`);
export const addComment = (videoId, text) => api.post(`/comments`, { videoId, text });

export const getUserData = () => api.get('/users/me');
export const updateUserData = (userData) => api.put('/users/me', userData);

export const getTokenBalance = () => api.get('/users/me/tokens');
export const updateTokenBalance = (amount) => api.post('/users/me/tokens', { amount });

export default api;
