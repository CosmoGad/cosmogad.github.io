import React, { useState, useEffect, useCallback } from 'react';
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

  const [videoInfo, setVideoInfo] = useState({});

  useEffect(() => {
    if (videos[currentIndex]) {
      setVideoInfo({
        username: videos[currentIndex].author?.username || 'unknown',
        description: videos[currentIndex].description
      });
    }
  }, [currentIndex, videos]);


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
        video.onerror = () => console.error('Error preloading video:', videos[index + 1].url);
      }
    };

    preloadNextVideo(currentIndex);
  }, [currentIndex, videos]);
  const handleVideoEnd = useCallback(() => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, videos.length]);

  const handleTokenEarned = useCallback((amount) => {
    setTokenBalance(prev => {
      const newBalance = prev + amount;
      localStorage.setItem('tokenBalance', newBalance.toString());
      return newBalance;
    });
  }, []);

  const toggleComments = useCallback(() => {
    setShowComments(prev => !prev);
  }, []);

  const toggleTokenInfo = useCallback(() => {
    setShowTokenInfo(prev => !prev);
  }, []);

  const toggleLike = useCallback((videoId) => {
    setLikes(prev => {
      const newLikes = { ...prev };
      if (newLikes[videoId]) {
        newLikes[videoId]--;
        if (newLikes[videoId] === 0) delete newLikes[videoId];
      } else {
        newLikes[videoId] = (newLikes[videoId] || 0) + 1;
      }
      localStorage.setItem('likes', JSON.stringify(newLikes));
      return newLikes;
    });
  }, []);

  const handleCommentAdd = useCallback((videoId, newComment) => {
    setComments(prev => {
      const newComments = {
        ...prev,
        [videoId]: [...(prev[videoId] || []), newComment]
      };
      localStorage.setItem('comments', JSON.stringify(newComments));
      return newComments;
    });
  }, []);

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
              videoInfo={videoInfo}
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
