import React, { useState, useRef } from 'react';
import './VideoPlayer.css';

function VideoPlayer({ video }) {
    const [likes, setLikes] = useState(video.likes);
    const [comments, setComments] = useState(video.comments);
    const [newComment, setNewComment] = useState('');
    const videoRef = useRef(null);

    const handleLike = () => {
        setLikes(likes + 1);
    };

    const handleComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setComments([...comments, { text: newComment, user: { username: 'Anonymous' } }]);
        setNewComment('');
    };

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    return (
        <div className="video-player">
            <video
                ref={videoRef}
                src={video.url}
                loop
                onClick={togglePlay}
                playsInline
            />
            <div className="video-info">
                <h2>{video.title}</h2>
                <p>{video.description}</p>
                <button onClick={handleLike}>Like ({likes})</button>
                <div className="comments-section">
                    <h3>Comments</h3>
                    {comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p>{comment.text}</p>
                            <small>By: {comment.user.username}</small>
                        </div>
                    ))}
                    <form onSubmit={handleComment}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment"
                        />
                        <button type="submit">Post</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;
