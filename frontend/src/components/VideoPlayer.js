import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaComment, FaShare, FaCoins } from 'react-icons/fa';
import { BsPauseFill } from 'react-icons/bs';
import '../styles/VideoPlayer.css';

const APP_VERSION = "1.2.4";

function VideoPlayer({ video, onVideoEnd, isActive, onTokenEarned, toggleComments, toggleTokenInfo, isLiked, toggleLike, likesCount }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const videoRef = useRef(null);
  const touchStartRef = useRef(null);
  const currentTimeRef = useRef(0);
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef(null);

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

  const shareVideo = (e) => {
    e.stopPropagation();
    console.log('Sharing video:', video.url);
  };

  return (
     <div
       className="video-player"
       onClick={handleTap}
     >
       <video
         ref={videoRef}
         src={video.url}
         loop={false}
         playsInline
         muted
       />
       {isPaused && isActive && <div className="pause-overlay"><BsPauseFill /></div>}
       <div className="video-info">
         <div className="username">@user{video._id}</div>
         <div className="video-description">{video.description}</div>
       </div>
       <div className="video-actions">
         <button className="action-button" onClick={(e) => { e.stopPropagation(); toggleLike(); }}>
           <FaHeart color={isLiked ? 'red' : 'white'} />
           <span className="likes-count">{likesCount}</span>
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
