import React, { useState, useEffect, useRef } from 'react';
import '../styles/Comments.css';

function Comments({ videoId, comments, onClose, onAddComment }) {
  const [newComment, setNewComment] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment({ id: Date.now(), text: newComment, user: 'Anonymous' });
      setNewComment('');
      if (formRef.current) {
        formRef.current.blur();
      }
    }
  };

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
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
        <form onSubmit={handleSubmit} ref={formRef}>
          <input
            type="text"
            value={newComment}
            onChange={handleInputChange}
            placeholder="Add a comment..."
          />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}

export default Comments;
