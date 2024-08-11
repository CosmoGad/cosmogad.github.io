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
    'ngrok-skip-browser-warning': 'true'
  }
});

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

export const login = (userData) => api.post('/api/auth/login', userData);
export const getVideos = () => api.get('/api/videos');
export const addVideo = (videoData) => api.post('/api/videos', videoData);
export const likeVideo = (videoId) => api.post(`/api/videos/${videoId}/like`);
export const getComments = (videoId) => api.get(`/api/comments/${videoId}`);
export const addComment = (videoId, text) => api.post(`/api/comments`, { videoId, text });

export const getUserData = () => api.get('/api/users/me');
export const updateUserData = (userData) => api.put('/api/users/me', userData);

export const getTokenBalance = () => api.get('/api/users/me/tokens');
export const updateTokenBalance = (amount) => api.post('/api/users/me/tokens', { amount });

export default api;
