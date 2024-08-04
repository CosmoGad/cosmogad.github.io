import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import VideoFeed from './components/VideoFeed';
import { TelegramProvider } from './contexts/TelegramContext';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initApp = () => {
      console.log("Initializing app...");
      const tg = window.Telegram?.WebApp;
      if (tg && isMounted) {
        console.log("Telegram WebApp found");
        tg.ready();
        console.log("Telegram WebApp ready");
        console.log("Init Data:", tg.initData);
        console.log("User Data:", tg.initDataUnsafe.user);

        if (tg.initDataUnsafe.user) {
          console.log("User data available:", tg.initDataUnsafe.user);
          setUser(tg.initDataUnsafe.user);
        } else {
          console.log("User data not available");
          setError('User data not available. Please open this app from Telegram.');
        }
      } else if (isMounted) {
        console.log("Telegram WebApp not found");
        setError('Telegram WebApp is not available. Please open this app from Telegram.');
      }
    };

    const timeoutId = setTimeout(initApp, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
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
          <Route path="/" element={<VideoFeed user={user} />} />
        </Routes>
      </div>
    </TelegramProvider>
  );
}

export default App;
