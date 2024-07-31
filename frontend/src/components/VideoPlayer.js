import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaComment, FaShare, FaCoins } from 'react-icons/fa';
import { BsPauseFill } from 'react-icons/bs';
import '../styles/VideoPlayer.css';

const APP_VERSION = "1.2.2"; // Обновляем версию

function VideoPlayer({ video, onVideoEnd, isActive, onTokenEarned, toggleComments, toggleTokenInfo }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const videoRef = useRef(null);
  const touchStartRef = useRef(null);
  const currentTimeRef = useRef(0);
  const lastTapRef = useRef(0);

  useEffect(() => {
    setShowInfo(isActive);
    if (isActive) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(error => console.log('Autoplay prevented:', error));
        setIsPaused(false);
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsPaused(false);
    }
  }, [isActive]);

  useEffect(() => {
    const videoElement = videoRef.current;
    videoElement.addEventListener('ended', onVideoEnd);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      videoElement.removeEventListener('ended', onVideoEnd);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      currentTimeRef.current = videoRef.current.currentTime;
    }
  };

  const calculateEarnedTokens = (watchedSeconds) => {
    return (watchedSeconds / 60) * 0.1;
  };

  const handleDoubleTap = (e) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      e.preventDefault();
      if (!isLiked) {
        setIsLiked(true);
        setShowLikeAnimation(true);
        setTimeout(() => setShowLikeAnimation(false), 1000);
      }
    }
    lastTapRef.current = now;
  };

  const toggleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (!isLiked) {
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1000);
    }
  };

  const togglePlay = (e) => {
    if (!e.target.closest('.comments-modal')) {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play().catch(error => console.log('Play prevented:', error));
          setIsPaused(false);
        } else {
          videoRef.current.pause();
          setIsPaused(true);
        }
      }
    }
  };

  const shareVideo = (e) => {
    e.stopPropagation();
    console.log('Sharing video:', video.url);
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!touchStartRef.current) return;
    const touchEnd = e.touches[0].clientY;
    const diff = touchStartRef.current - touchEnd;

    if (diff < -50 && video._id === 0) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  return (
    <div
      className="video-player"
      onClick={togglePlay}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleTap}
    >
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
      {showLikeAnimation && (
        <div className="like-animation">
          <FaHeart color="red" size={100} />
        </div>
      )}
      <div className="app-version">v{APP_VERSION}</div>
    </div>
  );
}

export default VideoPlayer;
