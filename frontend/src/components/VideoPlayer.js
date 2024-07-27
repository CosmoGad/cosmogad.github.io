import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';
import '../styles/App.css';

const APP_VERSION = "1.0.5";

function VideoPlayer({ video, onVideoEnd }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(error => console.log('Autoplay prevented:', error));
        }
    }, [video]);

    useEffect(() => {
        const updateProgress = () => {
            if (videoRef.current) {
                const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
                setProgress(progress);
            }
        };

        const videoElement = videoRef.current;
        videoElement.addEventListener('timeupdate', updateProgress);
        videoElement.addEventListener('ended', onVideoEnd);

        return () => {
            videoElement.removeEventListener('timeupdate', updateProgress);
            videoElement.removeEventListener('ended', onVideoEnd);
        };
    }, [onVideoEnd]);

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play().catch(error => console.log('Play prevented:', error));
                setIsPaused(false);
            } else {
                videoRef.current.pause();
                setIsPaused(true);
            }
        }
    };

    const handleSeek = (e) => {
        const seekPosition = e.target.value;
        if (videoRef.current) {
            videoRef.current.currentTime = (seekPosition / 100) * videoRef.current.duration;
        }
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const addComment = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            setComments([...comments, { id: Date.now(), text: newComment, likes: 0 }]);
            setNewComment('');
        }
    };

    const deleteComment = (id) => {
        setComments(comments.filter(comment => comment.id !== id));
    };

    const likeComment = (id) => {
        setComments(comments.map(comment =>
            comment.id === id ? {...comment, likes: comment.likes + 1} : comment
        ));
    };

    const shareVideo = () => {
        // Здесь будет логика для шаринга видео
        console.log('Sharing video:', video.url);
    };

    return (
        <div className="video-player" onClick={togglePlay}>
            <video
                ref={videoRef}
                src={video.url}
                loop={false}
                playsInline
                muted
            />
            {isPaused && <div className="pause-overlay">⏸</div>}
            <div className="video-info">
                <div className="username">@user{video._id}</div>
                <div className="video-description">{video.description}</div>
            </div>
            <div className="video-actions">
                <button className="action-button" onClick={(e) => { e.stopPropagation(); toggleLike(); }}>
                    <FaHeart color={isLiked ? 'red' : 'white'} />
                </button>
                <button className="action-button" onClick={(e) => { e.stopPropagation(); toggleComments(); }}>
                    <FaComment />
                </button>
                <button className="action-button" onClick={(e) => { e.stopPropagation(); shareVideo(); }}>
                    <FaShare />
                </button>
            </div>
            <div className="app-version">v{APP_VERSION}</div>
            <div className={`video-progress ${isPaused ? 'visible' : ''}`}>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
            {showComments && (
                <div className="comments-section" onClick={(e) => e.stopPropagation()}>
                    <h3>Comments</h3>
                    <form onSubmit={addComment}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment"
                        />
                        <button type="submit">Post</button>
                    </form>
                    {comments.map(comment => (
                        <div key={comment.id} className="comment">
                            <p>{comment.text}</p>
                            <button onClick={() => likeComment(comment.id)}>Like ({comment.likes})</button>
                            <button onClick={() => deleteComment(comment.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default VideoPlayer;
