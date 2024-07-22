const videos = [
    'videos/video1.mp4',
    'videos/video2.mp4',
    'videos/video3.mp4',
    'videos/video4.mp4'
];
let currentVideoIndex = 0;

function loadVideo(index) {
    document.getElementById('videoPlayer').src = videos[index];
    document.getElementById('videoPlayer').play();
}

function loadNextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
    loadVideo(currentVideoIndex);
}

function loadPreviousVideo() {
    currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
    loadVideo(currentVideoIndex);
}

function likeVideo() {
    // Здесь будет логика для отправки лайка на сервер
    console.log('Liked video:', videos[currentVideoIndex]);
    // Интеграция с Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.sendData(JSON.stringify({
            action: 'like',
            videoId: currentVideoIndex
        }));
    }
}

window.onload = () => {
    loadVideo(currentVideoIndex);
    // Инициализация Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
    }
};