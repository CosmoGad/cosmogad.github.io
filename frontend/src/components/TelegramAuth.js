import React, { useEffect, useCallback } from 'react';
import { login } from '../api/api';

function TelegramAuth({ onAuth }) {
  const handleAuth = useCallback(async (user) => {
    try {
      const response = await login(user);
      onAuth(response.data);
    } catch (error) {
      console.error('Authentication failed:', error);
      // Показать пользователю сообщение об ошибке
    }
  }, [onAuth]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?21";
    script.setAttribute('data-telegram-login', process.env.REACT_APP_TELEGRAM_BOT_NAME);
    script.setAttribute('data-size', "large");
    script.setAttribute('data-onauth', "window.onTelegramAuth(user)");
    script.setAttribute('data-request-access', "write");
    document.body.appendChild(script);

    window.onTelegramAuth = handleAuth;

    return () => {
      delete window.onTelegramAuth;
      document.body.removeChild(script);
    };
  }, [handleAuth]);

  return <div id="telegram-login"></div>;
}

export default TelegramAuth;
