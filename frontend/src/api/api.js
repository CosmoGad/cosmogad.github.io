import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

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
