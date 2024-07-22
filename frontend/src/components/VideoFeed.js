import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Mousewheel } from 'swiper';
import 'swiper/swiper.min.css';
import './VideoFeed.css';
import { videoUrls } from '../data/videos';

SwiperCore.use([Mousewheel]);

function VideoFeed() {
    const [videos] = useState(videoUrls.map((url, index) => ({
        _id: index,
        url,
        title: `Video ${index + 1}`,
        description: `This is video number ${index + 1}`,
        likes: 0,
        comments: []
    })));

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
