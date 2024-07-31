import React, { useContext, useState } from 'react';
import { TelegramContext } from '../contexts/TelegramContext';
import '../styles/Comments.css';

function Comments({ videoId, comments, onAddComment, onClose }) {
    const { user } = useContext(TelegramContext);
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment({
                id: Date.now(),
                text: newComment,
                user: {
                    username: user.username,
                    photoUrl: user.photoUrl
                }
            });
            setNewComment('');
        }
    };

    return (
        <div className="comments-modal" onClick={onClose}>
            <div className="comments-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                <h3>Comments</h3>
                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment.id} className="comment">
                            <img
                                src={comment.user.photoUrl || 'default-avatar.png'}
                                alt={comment.user.username}
                                className="user-avatar"
                            />
                            <div className="comment-content">
                                <strong>{comment.user.username}: </strong>
                                {comment.text}
                            </div>
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
