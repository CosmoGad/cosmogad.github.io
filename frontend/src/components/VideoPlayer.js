import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { BsPauseFill } from 'react-icons/bs';
import Comments from './Comments';
import '../styles/VideoPlayer.css';

const APP_VERSION = "1.1.2"; // Обновляем версию

function VideoPlayer({ video, onVideoEnd, isActive, onTokenEarned }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const videoRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchStartTimeRef = useRef(null);

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

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const shareVideo = () => {
    console.log('Sharing video:', video.url);
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchMove = (e) => {
    if (!touchStartRef.current) return;

    const touchDuration = Date.now() - touchStartTimeRef.current;
    if (touchDuration < 1500) return; // Меньше 1.5 секунд

    const touchEnd = e.touches[0].clientX;
    const diff = touchStartRef.current - touchEnd;

    if (Math.abs(diff) < 50) return; // Минимальное расстояние для свайпа

    const videoDuration = videoRef.current.duration;
    const seekAmount = (diff / window.innerWidth) * videoDuration * 0.1; // 10% от длительности видео
    videoRef.current.currentTime += seekAmount;

    touchStartRef.current = touchEnd;
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    touchStartTimeRef.current = null;
  };

  return (
    <div className="video-player"
         onClick={togglePlay}
         onTouchStart={handleTouchStart}
         onTouchMove={handleTouchMove}
         onTouchEnd={handleTouchEnd}>
      <video
        ref={videoRef}
        src={video.url}
        loop={false}
        playsInline
        muted
      />
      {isPaused && <div className="pause-overlay"><BsPauseFill /></div>}
      {showInfo && (
        <div className="video-info">
          <div className="username">@user{video._id}</div>
          <div className="video-description">{video.description}</div>
        </div>
      )}
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
