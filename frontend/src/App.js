import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import VideoFeed from './components/VideoFeed';
import { TelegramProvider } from './contexts/TelegramContext';
import './styles/App.css';

function App() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('App component mounted');
        if (window.Telegram && window.Telegram.WebApp) {
            console.log('Telegram WebApp is available');
            const tg = window.Telegram.WebApp;
            tg.ready();
            const initData = tg.initDataUnsafe;
            console.log('Init data:', initData);
            if (initData && initData.user) {
                console.log('User data:', initData.user);
                setUser({
                    id: initData.user.id,
                    username: initData.user.username,
                    firstName: initData.user.first_name,
                    lastName: initData.user.last_name,
                    photoUrl: initData.user.photo_url
                });
            } else {
                console.error('User data not available from Telegram WebApp');
                setError('User data not available');
            }
        } else {
            console.error('Telegram WebApp is not available');
            setError('Telegram WebApp is not available');
        }
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <TelegramProvider value={{ user }}>
            <div className="App">
                <Routes>
                    <Route path="/" element={<VideoFeed />} />
                    {/* Добавьте здесь другие маршруты, если они есть */}
                </Routes>
            </div>
        </TelegramProvider>
    );
}

export default App;
