import React from 'react';
import VideoFeed from './components/VideoFeed';
import UploadVideo from './components/UploadVideo';
import './styles/App.css';
import packageInfo from '../package.json';

function App() {
    return (
        <div className="App">
            <h1>CryptoClips</h1>
            <UploadVideo />
            <VideoFeed />
            <div className="version-info">
                Version: {packageInfo.version}
            </div>
        </div>
    );
}

export default App;
