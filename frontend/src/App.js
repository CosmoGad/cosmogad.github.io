import React from 'react';
import { Route, Routes } from 'react-router-dom';
import VideoFeed from './components/VideoFeed';
import './styles/App.css';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<VideoFeed />} />
                {/* Добавьте здесь другие маршруты, если они есть */}
            </Routes>
        </div>
    );
}

export default App;
