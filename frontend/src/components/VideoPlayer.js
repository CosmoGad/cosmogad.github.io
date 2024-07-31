import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaComment, FaShare, FaCoins, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import '../styles/VideoPlayer.css';

const APP_VERSION = "1.2.5";

function VideoPlayer({ video, onVideoEnd, isActive, onTokenEarned, toggleComments, toggleTokenInfo, isLiked, toggleLike, likesCount, commentsCount }) {
  const [isPaused, setIsPaused] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef(null);

  useEffect(() => {
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

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleTap = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      clearTimeout(tapTimeoutRef.current);
      e.preventDefault();
      if (!isLiked) {
        toggleLike();
        setShowLikeAnimation(true);
        setTimeout(() => setShowLikeAnimation(false), 1000);
      }
    } else {
      tapTimeoutRef.current = setTimeout(() => {
        togglePlay();
      }, DOUBLE_TAP_DELAY);
    }

    lastTapRef.current = now;
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

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleProgressBarClick = (e) => {
    const progressBar = progressBarRef.current;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    if (videoRef.current) {
      videoRef.current.currentTime = clickPosition * videoRef.current.duration;
    }
  };

  const handleProgressBarDragStart = () => {
    setIsDragging(true);
  };

  const handleProgressBarDragEnd = () => {
    setIsDragging(false);
  };

  const handleProgressBarDrag = (e) => {
    if (isDragging) {
      const progressBar = progressBarRef.current;
      const dragPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      setProgress(dragPosition * 100);
      if (videoRef.current) {
        videoRef.current.currentTime = dragPosition * videoRef.current.duration;
      }
    }
  };

  return (
    <div className="video-player" onClick={handleTap}>
      <video
        ref={videoRef}
        src={video.url}
        loop={false}
        playsInline
        muted={isMuted}
      />
      <div className="video-overlay">
        {isPaused && <div className="play-pause-icon"><BsPlayFill /></div>}
        <div className="video-info">
          <div className="username">@user{video._id}</div>
          <div className="video-description">{video.description}</div>
        </div>
        <div className="video-actions">
          <button className="action-button" onClick={(e) => { e.stopPropagation(); toggleLike(); }}>
            <FaHeart color={isLiked ? 'red' : 'white'} />
            <span className="action-count">{likesCount}</span>
          </button>
          <button className="action-button" onClick={(e) => { e.stopPropagation(); toggleComments(); }}>
            <FaComment />
            <span className="action-count">{commentsCount}</span>
          </button>
          <button className="action-button" onClick={(e) => { e.stopPropagation(); /* handle share */ }}>
            <FaShare />
          </button>
          <button className="action-button" onClick={(e) => { e.stopPropagation(); toggleTokenInfo(); }}>
            <FaCoins />
          </button>
          <button className="action-button" onClick={toggleMute}>
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
        {showLikeAnimation && (
          <div className="like-animation">
            <FaHeart color="red" size={100} />
          </div>
        )}
        <div className="app-version">v{APP_VERSION}</div>
      </div>
      <div
        className="progress-bar"
        ref={progressBarRef}
        onClick={handleProgressBarClick}
        onMouseDown={handleProgressBarDragStart}
        onMouseUp={handleProgressBarDragEnd}
        onMouseLeave={handleProgressBarDragEnd}
        onMouseMove={handleProgressBarDrag}
      >
        <div className="progress" style={{width: `${progress}%`}}></div>
      </div>
    </div>
  );
}

export default VideoPlayer;
