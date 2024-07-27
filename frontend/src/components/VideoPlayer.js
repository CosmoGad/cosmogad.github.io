import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';
import Comments from './Comments';
import '../styles/VideoPlayer.css';

const APP_VERSION = "1.1.0"; // Обновляем версию

function VideoPlayer({ video, onVideoEnd, isActive, onTokenEarned }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setShowInfo(isActive);
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current && isActive) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => console.log('Autoplay prevented:', error));
    }
  }, [video, isActive]);

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

  useEffect(() => {
    let interval;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        // Начисляем токены каждые 5 секунд просмотра
        const earnedTokens = calculateEarnedTokens(5);
        onTokenEarned(earnedTokens);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, onTokenEarned]);

  const calculateEarnedTokens = (watchedSeconds) => {
    // Здесь реализуйте вашу формулу начисления токенов
    // Это упрощенный пример
    return (watchedSeconds / 60) * 0.1;
  };

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

  const shareVideo = () => {
    console.log('Sharing video:', video.url);
  };

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={video.url}
        loop={false}
        playsInline
        muted
        onClick={togglePlay}
      />
      {isPaused && <div className="pause-overlay">⏸</div>}
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
        <button className="action-button" onClick={toggleComments}>
          <FaComment />
        </button>
        <button className="action-button" onClick={shareVideo}>
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
        <Comments
          videoId={video._id}
          comments={video.comments || []}
          onClose={toggleComments}
        />
      )}
    </div>
  );
}

export default VideoPlayer;
