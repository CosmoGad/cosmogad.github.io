import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaComment, FaShare, FaCoins } from 'react-icons/fa';
import { BsPauseFill } from 'react-icons/bs';
import '../styles/VideoPlayer.css';

const APP_VERSION = "1.1.6"; // Обновляем версию

function VideoPlayer({ video, onVideoEnd, isActive, onTokenEarned, toggleComments, toggleTokenInfo }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setShowInfo(isActive);
    if (isActive) {
      setIsPaused(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(error => console.log('Autoplay prevented:', error));
      }
    }
  }, [isActive]);

  useEffect(() => {
    const videoElement = videoRef.current;
    videoElement.addEventListener('ended', onVideoEnd);

    return () => {
      videoElement.removeEventListener('ended', onVideoEnd);
    };
  }, [onVideoEnd]);

  useEffect(() => {
    let interval;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        const earnedTokens = calculateEarnedTokens(5);
        onTokenEarned(earnedTokens);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, onTokenEarned]);

  const calculateEarnedTokens = (watchedSeconds) => {
    return (watchedSeconds / 60) * 0.1;
  };

  const toggleLike = (e) => {
    e.stopPropagation();
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

  const shareVideo = (e) => {
    e.stopPropagation();
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
      {isPaused && isActive && <div className="pause-overlay"><BsPauseFill /></div>}
      {showInfo && (
        <div className="video-info">
          <div className="username">@user{video._id}</div>
          <div className="video-description">{video.description}</div>
        </div>
      )}
      <div className="video-actions">
        <button className="action-button" onClick={toggleLike}>
          <FaHeart color={isLiked ? 'red' : 'white'} />
        </button>
        <button className="action-button" onClick={(e) => { e.stopPropagation(); toggleComments(); }}>
          <FaComment />
        </button>
        <button className="action-button" onClick={shareVideo}>
          <FaShare />
        </button>
        <button className="action-button" onClick={(e) => { e.stopPropagation(); toggleTokenInfo(); }}>
          <FaCoins />
        </button>
      </div>
      <div className="app-version">v{APP_VERSION}</div>
    </div>
  );
}

export default VideoPlayer;
