import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Mousewheel } from 'swiper';
import 'swiper/swiper.min.css';
import '../styles/App.css';
import { videoUrls } from '../data/videos';

SwiperCore.use([Mousewheel]);

function VideoFeed() {
    const [videos, setVideos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
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
            if (deltaY > 0) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    };

    if (videos.length === 0) {
        return <div>Loading videos...</div>;
    }

    return (
        <Swiper
            direction={'vertical'}
            slidesPerView={1}
            spaceBetween={0}
            mousewheel={true}
            className="video-feed-swiper"
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            ref={swiperRef}
        >
            {videos.map((video, index) => (
                <SwiperSlide key={video._id}>
                    <VideoPlayer
                        video={video}
                        onVideoEnd={handleVideoEnd}
                        isActive={index === currentIndex}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default VideoFeed;
