import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import '../styles/Comments.css';

function Comments({ videoId, comments, onClose, onAddComment, onEditComment, onDeleteComment }) {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment({ id: Date.now(), text: newComment, user: 'Anonymous' });
      setNewComment('');
    }
  };

  const renderComment = (comment) => {
    const handlers = useSwipeable({
      onSwipedLeft: () => onDeleteComment(comment.id),
      onSwipedRight: () => setEditingComment(comment),
    });

    return (
      <div {...handlers} key={comment.id} className="comment">
        <p>{comment.text}</p>
      </div>
    );
  };

  return (
    <div className="comments-modal">
      <div className="comments-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>Comments</h3>
        <div className="comments-list">
          {comments.map(renderComment)}
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
