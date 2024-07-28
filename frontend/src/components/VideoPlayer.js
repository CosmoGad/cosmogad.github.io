import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaComment, FaShare, FaCoins } from 'react-icons/fa';
import { BsPauseFill } from 'react-icons/bs';
import Comments from './Comments';
import TokenInfo from './TokenInfo';
import '../styles/VideoPlayer.css';

const APP_VERSION = "1.1.4"; // Обновляем версию

function VideoPlayer({ video, onVideoEnd, isActive, onTokenEarned, comments, onCommentAdd, tokenBalance }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showTokenInfo, setShowTokenInfo] = useState(false);
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

  const toggleComments = (e) => {
    e.stopPropagation();
    setShowComments(!showComments);
  };

  const toggleTokenInfo = (e) => {
    e.stopPropagation();
    setShowTokenInfo(!showTokenInfo);
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
      {isPaused && <div className="pause-overlay"><BsPauseFill /></div>}
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
        <button className="action-button" onClick={toggleTokenInfo}>
          <FaCoins />
        </button>
      </div>
      <div className="app-version">v{APP_VERSION}</div>
      {showComments && (
        <Comments
          videoId={video._id}
          comments={comments}
          onClose={toggleComments}
          onAddComment={(newComment) => onCommentAdd(video._id, newComment)}
        />
      )}
      {showTokenInfo && (
        <TokenInfo balance={tokenBalance} onClose={toggleTokenInfo} />
      )}
    </div>
  );
}

export default VideoPlayer;
