import React, { useState } from 'react';
import 'src/styles/Comments.css';

function Comments({ comments, onClose, onAddComment }) {
  const [newCommentText, setNewCommentText] = useState('');

  const handleAddComment = () => {
    if (newCommentText.trim() !== '') {
      onAddComment(newCommentText);
      setNewCommentText('');
    }
  };

  return (
    <div className="comments-section" id="commentsSection">
      <button className="close-button" onClick={onClose} aria-label="Close comments">×</button>
      {comments.map((comment, index) => (
        <div key={index} className="comment">
          <div className="user">{comment.user?.username || 'Новый пользователь'}</div>
          <div className="text">{comment.text}</div>
          <div className="actions">
            <span className="date">{comment.createdAt || 'Только что'}</span>
            <span className="reply">Ответить</span>
            <span className="like">
              0 <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9l-2 2-4-4L4 11l-2-2"/></svg>
            </span>
          </div>
        </div>
      ))}
      <div className="add-comment">
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Добавьте комментарий..."
        />
        <button onClick={handleAddComment}>Отправить</button>
      </div>
    </div>
  );
}

export default Comments;
