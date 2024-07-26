import React, { useState, useRef, useEffect } from 'react';
import '../styles/App.css';

function VideoPlayer({ video }) {
    const [isLiked, setIsLiked] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    }, [video]);

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    if (!video) {
        return <div>Loading...</div>;
    }

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
                <div className="username">@user{video._id}</div>
                <div className="video-description">{video.description}</div>
            </div>
            <div className="video-actions">
                <button className="action-button" onClick={toggleLike}>
                    {isLiked ? '❤️' : '🤍'}
                </button>
                <button className="action-button">💬</button>
                <button className="action-button">↪️</button>
            </div>
        </div>
    );
}

export default VideoPlayer;
