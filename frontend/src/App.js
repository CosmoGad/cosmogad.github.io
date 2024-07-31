import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import VideoFeed from './components/VideoFeed';
import { TelegramProvider } from './contexts/TelegramContext';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initTelegramApp = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        const initData = tg.initDataUnsafe;
        if (initData && initData.user) {
          setUser(initData.user);
        } else {
          setError('User data not available. Please open this app from Telegram.');
        }
      } else {
        setError('Telegram Web App is not available. Please open this app from Telegram.');
      }
    };

    // Попытка инициализации с задержкой
    setTimeout(initTelegramApp, 1000);
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <TelegramProvider value={{ user }}>
      <div className="App">
        <Routes>
          <Route path="/" element={<VideoFeed />} />
        </Routes>
      </div>
    </TelegramProvider>
  );
}

export default App;
