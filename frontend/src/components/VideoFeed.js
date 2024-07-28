import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Mousewheel } from 'swiper';
import 'swiper/swiper.min.css';
import '../styles/VideoFeed.css';
import { videoUrls } from '../data/videos';

SwiperCore.use([Mousewheel]);

function VideoFeed() {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [comments, setComments] = useState({});

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
        className="video-feed-swiper"
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
      >
        {videos.map((video, index) => (
          <SwiperSlide key={video._id}>
            <VideoPlayer
              video={video}
              onVideoEnd={handleVideoEnd}
              isActive={index === currentIndex}
              onTokenEarned={handleTokenEarned}
              comments={comments[video._id] || []}
              onCommentAdd={handleCommentAdd}
              tokenBalance={tokenBalance}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default VideoFeed;
