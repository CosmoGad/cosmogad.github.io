import React from 'react';
import '../styles/Comments.css';

function Comments({ comments, onClose, onAddComment }) {
  return (
    <div className="comments-modal">
      <div className="comments-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>Comments</h3>
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <img
                src={comment.user?.photoUrl || '/default-avatar.png'}
                alt={comment.user?.username || 'Anonymous'}
                className="user-avatar"
              />
              <div className="comment-content">
                <strong>{comment.user?.username || 'Anonymous'}</strong>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          onAddComment(e.target.comment.value);
          e.target.comment.value = '';
        }}>
          <input type="text" name="comment" placeholder="Add a comment..." />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}

export default Comments;
