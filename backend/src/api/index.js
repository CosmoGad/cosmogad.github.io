import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

export const login = (userData) => api.post('/api/auth/login', userData);
export const getVideos = () => api.get('/api/videos');
export const addVideo = (videoData) => api.post('/api/videos', videoData);
export const likeVideo = (videoId) => api.post(`/api/videos/${videoId}/like`);

export default api;