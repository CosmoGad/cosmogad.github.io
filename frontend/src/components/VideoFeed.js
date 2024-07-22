import React, { useState, useEffect, useCallback } from 'react';
import VideoPlayer from './VideoPlayer';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Mousewheel } from 'swiper';
import 'swiper/swiper.min.css';
import './VideoFeed.css';
import { getVideos } from '../api';
import ErrorMessage from './ErrorMessage';

SwiperCore.use([Mousewheel]);

function VideoFeed() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchVideos = useCallback(async () => {
        if (!hasMore || loading) return;
        try {
            setLoading(true);
            const response = await getVideos(page);
            const newVideos = response.data.videos;
            if (newVideos.length === 0) {
                setHasMore(false);
            } else {
                setVideos(prevVideos => [...prevVideos, ...newVideos]);
                setPage(prevPage => prevPage + 1);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching videos:', err);
            setError('Failed to load videos. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    if (error) return <ErrorMessage message={error} />;

    return (
        <Swiper
            direction={'vertical'}
            slidesPerView={1}
            spaceBetween={0}
            mousewheel={true}
            className="video-feed-swiper"
            onReachEnd={fetchVideos}
        >
            {videos.map((video) => (
                <SwiperSlide key={video._id}>
                    <VideoPlayer video={video} />
                </SwiperSlide>
            ))}
            {loading && <div>Loading...</div>}
            {!hasMore && <div>No more videos to load</div>}
        </Swiper>
    );
}

export default VideoFeed;
