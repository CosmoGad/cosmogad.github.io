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

function VideoFeed({ user }) {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Замените этот код на реальный запрос к API, когда он будет готов
        const fetchedVideos = videoUrls.map((url, index) => ({
          _id: index,
          url,
          description: `This is video number ${index + 1} #fun #crypto`,
        }));
        setVideos(fetchedVideos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos. Please try again later.');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const preloadNextVideo = (index) => {
      if (videos[index + 1]) {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.src = videos[index + 1].url;
      }
    };

    preloadNextVideo(currentIndex);
  }, [currentIndex, videos]);

  // ... остальной код компонента

  if (loading) {
    return <div className="loading-message">Loading videos...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (videos.length === 0) {
    return <div className="no-videos">No videos available</div>;
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
              likesCount={likes[video._id] || 0}
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
