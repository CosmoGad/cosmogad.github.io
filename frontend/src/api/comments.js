import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://github.com/CosmoGad/cosmogad.github.io/api';

export const getComments = async (videoId) => {
  try {
    const response = await axios.get(`${API_URL}/comments/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const addComment = async (videoId, text) => {
  try {
    const response = await axios.post(`${API_URL}/comments`, { videoId, text });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Добавьте другие функции для работы с комментариями, если они нужны
