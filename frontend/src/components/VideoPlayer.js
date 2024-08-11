import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaHeart, FaComment, FaShare, FaCoins, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { BsPlayFill } from 'react-icons/bs';
import '../styles/VideoPlayer.css';
import { getComments, addComment } from '../api/api';
import Comments from './Comments';
import ErrorMessage from './ErrorMessage';

const APP_VERSION = "1.3.99903";

function VideoPlayer({ video, onVideoEnd, currentIndex, onCommentAdd, isActive, onTokenEarned, toggleComments, toggleTokenInfo, isLiked, toggleLike, likesCount, showComments, commentsCount, user }) {
  const [isPaused, setIsPaused] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef(null);
  const [comments, setComments] = useState([]);

  const handleCanPlay = useCallback(() => {
    setIsVideoReady(true);
    setError(null);
  }, []);

  useEffect(() => {
    if (isActive) {
      loadComments();
    }
  }, [isActive, video._id, currentIndex]);

  const loadComments = async () => {
    try {
      const fetchedComments = await getComments(video._id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Failed to load comments', error);
      setComments([]);
    }
  };

  const handleVideoError = (error) => {
    console.error('Error loading video:', error);
    setError('Failed to load video. Please check your internet connection and try again.');
  };

  const handleAddComment = async (text) => {
    if (!text.trim()) return;

    try {
      const newComment = await addComment(video._id, text.trim());
      onCommentAdd(newComment);
      setComments(prevComments => [...prevComments, newComment]);
    } catch (error) {
      console.error('Failed to add comment', error);
      setError('Failed to add comment. Please try again.');
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const playVideo = async () => {
      if (isActive && isVideoReady) {
        try {
          await videoElement.play();
          setIsPaused(false);
        } catch (error) {
          console.error('Autoplay prevented:', error);
          setIsPaused(true);
        }
      } else {
        videoElement.pause();
        setIsPaused(true);
      }
    };

    playVideo();

    return () => {
      videoElement.pause();
    };
  }, [isActive, isVideoReady]);

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  useEffect(() => {
    const checkNetwork = () => {
      if (!navigator.onLine) {
        setError('You are offline. Please check your internet connection.');
      } else {
        setError(null);
      }
    };

    window.addEventListener('online', checkNetwork);
    window.addEventListener('offline', checkNetwork);

    return () => {
      window.removeEventListener('online', checkNetwork);
      window.removeEventListener('offline', checkNetwork);
    };
  }, []);

  const handleTap = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      clearTimeout(tapTimeoutRef.current);
      e.preventDefault();
      toggleLike();
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1000);
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
    <div className="video-player-container" onClick={handleTap}>
      {error && <ErrorMessage message={error} />}
      <video
        ref={videoRef}
        src={video.url}
        loop={false}
        playsInline
        webkit-playsinline="true"
        x-webkit-airplay="allow"
        preload="auto"
        muted={isMuted}
        onCanPlay={handleCanPlay}
        onError={handleVideoError}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onVideoEnd}
        poster={video.thumbnailUrl}
        aria-label={`Video by ${video.author?.username || 'unknown'}`}
      >
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay">
        {isPaused && <div className="play-pause-icon" aria-label="Play video"><BsPlayFill /></div>}
        <div className="video-info">
          <div className="username" aria-label="Video author">@{video.author?.username || 'unknown'}</div>
          <div className="video-description" aria-label="Video description">{video.description}</div>
        </div>
        <div className="video-actions">
          <button className="action-button" onClick={toggleLike} aria-label={`Like video. Current likes: ${likesCount}`}>
            <FaHeart color={isLiked ? 'red' : 'white'} />
            <span className="action-count">{likesCount}</span>
          </button>
          <button className="action-button" onClick={toggleComments} aria-label={`Show comments. Current comments: ${commentsCount}`}>
            <FaComment />
            <span className="action-count">{commentsCount}</span>
          </button>
          <button className="action-button" aria-label="Share video">
            <FaShare />
          </button>
          <button className="action-button" onClick={toggleTokenInfo} aria-label="Show token info">
            <FaCoins />
          </button>
          <button className="action-button" onClick={toggleMute} aria-label={isMuted ? "Unmute video" : "Mute video"}>
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
      </div>
      {showLikeAnimation && <div className="like-animation" aria-hidden="true">❤️</div>}
      <div
        className="progress-bar"
        ref={progressBarRef}
        onClick={handleProgressBarClick}
        onMouseDown={handleProgressBarDragStart}
        onMouseUp={handleProgressBarDragEnd}
        onMouseLeave={handleProgressBarDragEnd}
        onMouseMove={handleProgressBarDrag}
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
      >
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="app-version" aria-label={`App version ${APP_VERSION}`}>v{APP_VERSION}</div>
    </div>
  );
}

export default VideoPlayer;
