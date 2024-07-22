import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
});

export const login = (userData) => api.post('/auth/login', userData);
export const getVideos = (page = 1, limit = 10) => api.get(`/videos?page=${page}&limit=${limit}`);
export const addVideo = (videoData) => api.post('/videos', videoData);
export const likeVideo = (videoId) => api.post(`/videos/${videoId}/like`);
export const addComment = (videoId, text) => api.post(`/videos/${videoId}/comment`, { text });

export default api;
