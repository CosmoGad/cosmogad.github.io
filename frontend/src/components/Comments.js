import React, { useState, useRef, useEffect } from 'react';
import '../styles/Comments.css';

function Comments({ videoId, comments: initialComments, onClose }) {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const commentsRef = useRef(null);

    useEffect(() => {
        if (commentsRef.current) {
            commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
        }
    }, [comments]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            setComments([...comments, { id: Date.now(), text: newComment, user: 'Anonymous' }]);
            setNewComment('');
        }
    };

    return (
        <div className="comments-overlay">
            <div className="comments-container">
                <div className="comments-header">
                    <h3>Comments</h3>
                    <button onClick={onClose}>Close</button>
                </div>
                <div className="comments-list" ref={commentsRef}>
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <strong>{comment.user}</strong>: {comment.text}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="comment-form">
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
