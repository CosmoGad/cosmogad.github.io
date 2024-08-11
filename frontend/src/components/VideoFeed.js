import React, { useState, useEffect, useCallback, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Mousewheel, Virtual } from 'swiper';
import Comments from './Comments';
import TokenInfo from './TokenInfo';
import 'swiper/swiper.min.css';
import '../styles/VideoFeed.css';
import { getVideos, getUserData, updateTokenBalance, likeVideo, addComment } from '../api/api';
import ErrorMessage from './ErrorMessage';

SwiperCore.use([Mousewheel, Virtual]);

function VideoFeed({ user }) {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [showTokenInfo, setShowTokenInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const swiperRef = useRef(null);

  const fetchInitialData = async () => {
    try {
      const [videosResponse, userData] = await Promise.all([
        getVideos(),
        getUserData()
      ]);

      console.log('Videos response:', videosResponse);

      if (Array.isArray(videosResponse.data)) {
        setVideos(videosResponse.data);
      } else {
        console.error('Received non-array videos data:', videosResponse.data);
        setVideos([]);
      }

      setTokenBalance(userData.data.tokenBalance);
      setLikes(userData.data.likes || {});
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load initial data. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleVideoEnd = useCallback(() => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, videos.length]);

  const handleTokenEarned = useCallback(async (amount) => {
    try {
      const response = await updateTokenBalance(amount);
      setTokenBalance(response.data.newBalance);
    } catch (error) {
      console.error('Error updating token balance:', error);
      setError('Failed to update token balance. Please try again.');
    }
  }, []);

  const toggleComments = useCallback(() => {
    setShowComments(prev => !prev);
  }, []);

  const toggleTokenInfo = useCallback(() => {
    setShowTokenInfo(prev => !prev);
  }, []);

  const toggleLike = useCallback(async (videoId) => {
    try {
      await likeVideo(videoId);
      setLikes(prev => {
        const newLikes = { ...prev };
        newLikes[videoId] = !newLikes[videoId];
        return newLikes;
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      setError('Failed to update like. Please try again.');
    }
  }, []);

  const handleCommentAdd = useCallback(async (videoId, newComment) => {
    try {
      const response = await addComment(videoId, newComment);
      setComments(prev => ({
        ...prev,
        [videoId]: [...(prev[videoId] || []), response.data]
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  }, []);

  const handleSlideChange = useCallback((swiper) => {
    setCurrentIndex(swiper.activeIndex);
  }, []);

  if (loading) {
    return <div className="loading-message">Loading videos...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!Array.isArray(videos)) {
    console.error('Videos is not an array:', videos);
    return <div>Error loading videos. Please try again later.</div>;
  }

  if (videos.length === 0) {
    return <div>No videos available</div>;
  }

  return (
    <div className="video-feed-container">
      <Swiper
        ref={swiperRef}
        direction={'vertical'}
        slidesPerView={1}
        spaceBetween={0}
        mousewheel={true}
        virtual
        className="video-feed-swiper"
        onSlideChange={handleSlideChange}
        initialSlide={0}
      >
        {videos.map((video, index) => (
          <SwiperSlide key={video._id} virtualIndex={index}>
            <VideoPlayer
              video={video}
              onVideoEnd={handleVideoEnd}
              isActive={index === currentIndex}
              onTokenEarned={handleTokenEarned}
              showComments={showComments}
              toggleComments={toggleComments}
              toggleTokenInfo={toggleTokenInfo}
              isLiked={!!likes[video._id]}
              toggleLike={() => toggleLike(video._id)}
              likesCount={video.likesCount}
              commentsCount={(comments[video._id] || []).length}
              currentIndex={currentIndex}
              onCommentAdd={(newComment) => handleCommentAdd(video._id, newComment)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {showComments && videos[currentIndex] && (
        <Comments
          videoId={videos[currentIndex]._id}
          comments={comments[videos[currentIndex]._id] || []}
          onClose={toggleComments}
          onAddComment={(newComment) => handleCommentAdd(videos[currentIndex]._id, newComment)}
        />
      )}
      {showTokenInfo && (
        <TokenInfo balance={tokenBalance} onClose={toggleTokenInfo} />
      )}
    </div>
  );
}

export default VideoFeed;
