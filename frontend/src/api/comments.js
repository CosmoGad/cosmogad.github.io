import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getComments = async (videoId) => {
  const response = await axios.get(`${API_URL}/comments/${videoId}`);
  return response.data;
};

export const addComment = async (commentData) => {
  const response = await axios.post(`${API_URL}/comments`, commentData);
  return response.data;
};
