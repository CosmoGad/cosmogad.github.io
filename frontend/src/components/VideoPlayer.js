import React, { useState, useRef, useEffect } from 'react';
import '../styles/App.css';

const APP_VERSION = "1.0.2"; // Добавьте актуальную версию

function VideoPlayer({ video }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => console.log('Autoplay prevented:', error));
        }
    }, [video]);

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

    if (!video) {
        return <div>Loading...</div>;
    }

    return (
        <div className="video-player" onClick={togglePlay}>
            <video
                ref={videoRef}
                src={video.url}
                loop
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
                    {isLiked ? '❤️' : '🤍'}
                </button>
                <button className="action-button" onClick={(e) => e.stopPropagation()}>💬</button>
                <button className="action-button" onClick={(e) => e.stopPropagation()}>↪️</button>
            </div>
            <div className="app-version">v{APP_VERSION}</div>
            <input
                type="range"
                min="0"
                max="100"
                className="video-progress"
                onChange={handleSeek}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}

export default VideoPlayer;
