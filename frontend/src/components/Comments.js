import React, { useState } from 'react';
import { addComment } from '../api';

function Comments({ videoId, comments }) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addComment(videoId, newComment);
      // Обновите состояние комментариев здесь
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment, index) => (
        <div key={index}>
          <p>{comment.text}</p>
          <small>By: {comment.user}</small>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default Comments;