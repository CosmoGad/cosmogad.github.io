import React, { useEffect } from 'react';

function TelegramAuth({ onAuth }) {
  useEffect(() => {
    window.TelegramLoginWidget = {
      dataOnauth: (user) => onAuth(user)
    };

    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?5";
    script.setAttribute('data-telegram-login', "YOUR_BOT_NAME");
    script.setAttribute('data-size', "large");
    script.setAttribute('data-onauth', "TelegramLoginWidget.dataOnauth(user)");
    script.setAttribute('data-request-access', "write");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onAuth]);

  return <div id="telegram-login"></div>;
}

export default TelegramAuth;
