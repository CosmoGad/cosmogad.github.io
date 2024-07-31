import React, { useState } from 'react';
import VideoFeed from './components/VideoFeed';
import TelegramAuth from './components/TelegramAuth';

function App() {
  const [user, setUser] = useState(null);

  const handleAuth = (telegramUser) => {
    setUser(telegramUser);
  };

  if (!user) {
    return <TelegramAuth onAuth={handleAuth} />;
  }

  return <VideoFeed currentUser={user} />;
}

export default App;
