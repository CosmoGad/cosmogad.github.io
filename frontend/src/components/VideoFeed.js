import React, { useState, useEffect, useRef } from 'react';
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
  const [tokenBalance, setTokenBalance] = useState(0);
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [showTokenInfo, setShowTokenInfo] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    const videoObjects = videoUrls.map((url, index) => ({
      _id: index,
      url,
      description: `This is video number ${index + 1} #fun #crypto`,
    }));
    setVideos(videoObjects);
  }, []);

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

  const handleTouchStart = (e) => {
    if (currentIndex === 0) {
      const touch = e.touches[0];
      swiperRef.current.touchStartY = touch.clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (currentIndex === 0) {
      const touch = e.touches[0];
      const deltaY = touch.clientY - swiperRef.current.touchStartY;
      if (deltaY > 50) {
        e.preventDefault();
      }
    }
  };

  if (videos.length === 0) {
    return <div>Loading videos...</div>;
  }

  return (
    <div className="video-feed-container">
      <Swiper
        direction={'vertical'}
        slidesPerView={1}
        spaceBetween={0}
        mousewheel={true}
        virtual
        className="video-feed-swiper"
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {videos.map((video, index) => (
          <SwiperSlide key={video._id} virtualIndex={index}>
            <VideoPlayer
              video={video}
              onVideoEnd={handleVideoEnd}
              isActive={index === currentIndex}
              onTokenEarned={handleTokenEarned}
              comments={comments[video._id] || []}
              onCommentAdd={handleCommentAdd}
              tokenBalance={tokenBalance}
              toggleComments={toggleComments}
              toggleTokenInfo={toggleTokenInfo}
            />
          </SwiperSlide>
        ))}
      </Swiper>
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
