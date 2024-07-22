let currentVideoIndex = 0;
const videos = [
    'videos/video1.mp4',
    'videos/video2.mp4',
    'videos/video3.mp4',
    'videos/video4.mp4'
];

function createVideoElement(src) {
    const wrapper = document.createElement('div');
    wrapper.className = 'video-wrapper';

    const video = document.createElement('video');
    video.src = src;
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    wrapper.appendChild(video);
    return wrapper;
}

function loadVideo(index) {
    const container = document.getElementById('videoContainer');
    container.innerHTML = '';
    const videoElement = createVideoElement(videos[index]);
    container.appendChild(videoElement);
}

function nextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
    loadVideo(currentVideoIndex);
}

function prevVideo() {
    currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
    loadVideo(currentVideoIndex);
}

document.addEventListener('DOMContentLoaded', () => {
    loadVideo(currentVideoIndex);

    let startY;
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
        const endY = e.changedTouches[0].clientY;
        const diff = startY - endY;
        if (Math.abs(diff) > 50) { // минимальное расстояние для свайпа
            if (diff > 0) {
                nextVideo();
            } else {
                prevVideo();
            }
        }
    });

    document.getElementById('likeButton').addEventListener('click', () => {
        console.log('Liked video:', videos[currentVideoIndex]);
        // Здесь будет логика для отправки лайка на сервер
    });

    // Инициализация Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
    }
});