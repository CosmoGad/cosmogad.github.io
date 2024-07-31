import React, { createContext, useState, useEffect } from 'react';

export const TelegramContext = createContext();

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [webApp, setWebApp] = useState(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    setWebApp(tg);
    if (tg.initDataUnsafe.user) {
      setUser(tg.initDataUnsafe.user);
    }
    tg.ready();
  }, []);

  return (
    <TelegramContext.Provider value={{ user, webApp }}>
      {children}
    </TelegramContext.Provider>
  );
};
