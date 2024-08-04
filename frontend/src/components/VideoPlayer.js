import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaComment, FaShare, FaCoins, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import '../styles/VideoPlayer.css';
import { getComments, addComment } from '../api/comments';
import Comments from './Comments';

const APP_VERSION = "1.3.94";

function VideoPlayer({ video, onVideoEnd, currentIndex, onCommentAdd, isActive, onTokenEarned, toggleComments, toggleTokenInfo, isLiked, toggleLike, likesCount, showComments, commentsCount, user }) {
  const [isPaused, setIsPaused] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef(null);
  const [comments, setComments] = useState([]);

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
    alert('Failed to load video. Please check your internet connection and try again.');
  };

  const handleAddComment = async (text) => {
    if (!text.trim()) return;

    try {
      const newComment = await addComment({
        videoId: video._id,
        userId: user?.id,
        username: user?.username || 'Anonymous',
        photoUrl: user?.photoUrl,
        text: text.trim()
      });
      onCommentAdd(newComment);
      setComments(prevComments => [...prevComments, newComment]);
    } catch (error) {
      console.error('Failed to add comment', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const playVideo = async () => {
      if (isActive) {
        try {
          await videoElement.play();
          setIsPaused(false);
        } catch (error) {
          console.error('Autoplay prevented:', error);
          videoElement.muted = true;
          try {
            await videoElement.play();
            setIsPaused(false);
          } catch (mutedError) {
            console.error('Muted autoplay also prevented:', mutedError);
            setIsPaused(true);
          }
        }
      } else {
        videoElement.pause();
        videoElement.currentTime = 0;
        setIsPaused(true);
      }
    };

    playVideo();

    const handleEnded = () => {
      videoElement.currentTime = 0;
      onVideoEnd();
    };

    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [isActive, onVideoEnd]);

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

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.enableClosingConfirmation();
    }
  }, []);

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
    <div
      className="video-player-container"
      onClick={handleTap}
    >
      <video
        ref={videoRef}
        src={video.url}
        loop={false}
        playsInline
        muted={isMuted}
        onError={handleVideoError}
        onTimeUpdate={handleTimeUpdate}
      />
      <div className="video-overlay">
        {isPaused && <div className="play-pause-icon"><BsPlayFill /></div>}
        <div className="video-info">
          <div className="username">@{video.author?.username || 'unknown'}</div>
          <div className="video-description">{video.description}</div>
        </div>
        <div className="video-actions">
          <button
            className="action-button"
            onClick={(e) => { e.stopPropagation(); toggleLike(); }}
            aria-label={isLiked ? "Unlike video" : "Like video"}
          >
            <FaHeart color={isLiked ? 'red' : 'white'} />
            <span className="action-count">{likesCount}</span>
          </button>
          <button
            className="action-button"
            onClick={(e) => { e.stopPropagation(); toggleComments(); }}
            aria-label={`Show comments (${commentsCount})`}
          >
            <FaComment />
            <span className="action-count">{commentsCount}</span>
          </button>
          <button
            className="action-button"
            onClick={(e) => { e.stopPropagation(); /* handle share */ }}
            aria-label="Share video"
          >
            <FaShare />
          </button>
          <button
            className="action-button"
            onClick={(e) => { e.stopPropagation(); toggleTokenInfo(); }}
            aria-label="Show token info"
          >
            <FaCoins />
          </button>
          <button
            className="action-button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
        {showLikeAnimation && (
          <div className="like-animation" aria-hidden="true">
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
        onTouchStart={handleProgressBarDragStart}
        onTouchEnd={handleProgressBarDragEnd}
        onTouchMove={handleProgressBarDrag}
        role="slider"
        aria-label="Video progress"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
      >
        <div className="progress" style={{width: `${progress}%`}}></div>
      </div>
      {showComments && (
        <Comments
          comments={comments}
          onClose={toggleComments}
          onAddComment={(text) => handleAddComment(text)}
        />
      )}
    </div>
  );
}

export default VideoPlayer;
