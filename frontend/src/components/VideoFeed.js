import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Mousewheel } from 'swiper';
import 'swiper/swiper.min.css';
import '../styles/App.css';
import { videoUrls } from '../data/videos';

SwiperCore.use([Mousewheel]);

function VideoFeed() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const videoObjects = videoUrls.map((url, index) => ({
            _id: index,
            url,
            description: `This is video number ${index + 1} #fun #crypto`,
        }));
        setVideos(videoObjects);
    }, []);

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
        >
            {videos.map((video) => (
                <SwiperSlide key={video._id}>
                    <VideoPlayer video={video} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default VideoFeed;
