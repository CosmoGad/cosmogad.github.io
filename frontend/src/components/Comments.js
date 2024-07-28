import React, { useState, useEffect } from 'react';
import '../styles/Comments.css';

function Comments({ videoId, comments: initialComments, onClose }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), text: newComment, user: 'Anonymous' }]);
      setNewComment('');
    }
  };

  return (
    <div className="comments-overlay" onClick={onClose}>
      <div className="comments-container" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h3>Comments</h3>
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <strong>{comment.user}</strong>: {comment.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}

export default Comments;
