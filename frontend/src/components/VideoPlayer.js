import React, { useState } from 'react';
import './VideoPlayer.css';
import { likeVideo, addComment } from '../api';

function VideoPlayer({ video }) {
    const [likes, setLikes] = useState(video.likes ? video.likes.length : 0);
    const [comments, setComments] = useState(video.comments || []);
    const [newComment, setNewComment] = useState('');

    const handleLike = async () => {
        try {
            const response = await likeVideo(video._id);
            setLikes(response.data.likes);
        } catch (error) {
            console.error('Error liking video:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await addComment(video._id, newComment);
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="video-player">
            <video src={video.url} loop autoPlay muted playsInline />
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
