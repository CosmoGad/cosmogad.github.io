import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Mousewheel, Virtual } from 'swiper';
import Comments from './Comments';
import TokenInfo from './TokenInfo';
import 'swiper/swiper.min.css';
import '../styles/VideoFeed.css';
import { videoUrls } from '../data/videos';

SwiperCore.use([Mousewheel, Virtual]);

function VideoFeed() {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(() => {
    const saved = localStorage.getItem('tokenBalance');
    return saved ? parseFloat(saved) : 0;
  });
  const [likes, setLikes] = useState(() => {
    const saved = localStorage.getItem('likes');
    return saved ? JSON.parse(saved) : {};
  });
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('comments');
    return saved ? JSON.parse(saved) : {};
  });
  const [showComments, setShowComments] = useState(false);
  const [showTokenInfo, setShowTokenInfo] = useState(false);

  useEffect(() => {
    try {
      const videoObjects = videoUrls.map((url, index) => ({
        _id: index,
        url,
        description: `This is video number ${index + 1} #fun #crypto`,
      }));
      setVideos(videoObjects);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tokenBalance', tokenBalance.toString());
    } catch (error) {
      console.error('Error saving token balance:', error);
    }
  }, [tokenBalance]);

  useEffect(() => {
    try {
      localStorage.setItem('likes', JSON.stringify(likes));
    } catch (error) {
      console.error('Error saving likes:', error);
    }
  }, [likes]);

  useEffect(() => {
    try {
      localStorage.setItem('comments', JSON.stringify(comments));
    } catch (error) {
      console.error('Error saving comments:', error);
    }
  }, [comments]);

  const handleVideoEnd = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleCommentAdd = (videoId, newComment) => {
    setComments(prev => ({
      ...prev,
      [videoId]: [...(prev[videoId] || []), newComment]
    }));
  };

  const handleTokenEarned = (amount) => {
    setTokenBalance(prev => prev + amount);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleTokenInfo = () => {
    setShowTokenInfo(!showTokenInfo);
  };

  const toggleLike = (videoId) => {
    setLikes(prev => {
      const newLikes = { ...prev };
      if (newLikes[videoId]) {
        newLikes[videoId]--;
        if (newLikes[videoId] === 0) delete newLikes[videoId];
      } else {
        newLikes[videoId] = (newLikes[videoId] || 0) + 1;
      }
      return newLikes;
    });
  };

  return (
    <div className="video-feed-container">
      {videos.length > 0 ? (
        <Swiper
          direction={'vertical'}
          slidesPerView={1}
          spaceBetween={0}
          mousewheel={true}
          virtual
          className="video-feed-swiper"
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        >
          {videos.map((video, index) => (
            <SwiperSlide key={video._id} virtualIndex={index}>
              <VideoPlayer
                video={video}
                onVideoEnd={handleVideoEnd}
                isActive={index === currentIndex}
                onTokenEarned={handleTokenEarned}
                toggleComments={toggleComments}
                toggleTokenInfo={toggleTokenInfo}
                isLiked={!!likes[video._id]}
                toggleLike={() => toggleLike(video._id)}
                likesCount={likes[video._id] || 0}
                commentsCount={(comments[video._id] || []).length}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div>Loading videos...</div>
      )}
      {showComments && (
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
