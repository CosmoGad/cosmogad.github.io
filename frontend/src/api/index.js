import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

export const login = (userData) => api.post('/api/auth/login', userData);
export const getVideos = (page = 1, limit = 10) => api.get(`/api/videos?page=${page}&limit=${limit}`);
export const addVideo = (videoData) => api.post('/api/videos', videoData);
export const likeVideo = (videoId) => api.post(`/api/videos/${videoId}/like`);
export const addComment = (videoId, text) => api.post(`/api/videos/${videoId}/comment`, { text });

export default api;
