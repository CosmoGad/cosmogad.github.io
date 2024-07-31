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
    const videoObjects = videoUrls.map((url, index) => ({
      _id: index,
      url,
      description: `This is video number ${index + 1} #fun #crypto`,
    }));
    setVideos(videoObjects);
  }, []);

  useEffect(() => {
    localStorage.setItem('tokenBalance', tokenBalance.toString());
  }, [tokenBalance]);

  useEffect(() => {
    localStorage.setItem('likes', JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
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
        delete newLikes[videoId];
      } else {
        newLikes[videoId] = true;
      }
      return newLikes;
    });
  };

    return (
      <div className="video-feed-container">
        <Swiper
          direction={'vertical'}
          slidesPerView={1}  // Изменено с 3 на 1
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
                likesCount={Object.keys(likes).length}
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
