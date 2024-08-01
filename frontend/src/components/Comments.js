import React from 'react';

function Comments({ videoId, comments, onClose, onAddComment }) {
  if (!comments) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="comments-section">
      {comments.map(comment => (
        <div key={comment._id} className="comment">
          <img
            src={comment.user.photoUrl || 'path/to/default-avatar.png'}
            alt={comment.user.username}
            className="user-avatar"
          />
          <div className="comment-content">
            <strong>{comment.user.username}</strong>
            <p>{comment.text}</p>
          </div>
        </div>
      ))}
      {/* Форма добавления комментария */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const text = e.target.comment.value;
        onAddComment({ text });
        e.target.reset();
      }}>
        <input type="text" name="comment" placeholder="Add a comment..." />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default Comments;
