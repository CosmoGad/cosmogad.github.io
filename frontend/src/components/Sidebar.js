import React, { useState } from 'react';
import TokenInfo from './TokenInfo';
import '../styles/Sidebar.css';

function Sidebar({ isOpen, onClose, tokenBalance }) {
  const [activeTab, setActiveTab] = useState('tokens');

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>×</button>
      <div className="sidebar-tabs">
        <button
          className={activeTab === 'tokens' ? 'active' : ''}
          onClick={() => setActiveTab('tokens')}
        >
          Tokens
        </button>
        {/* Добавьте здесь другие вкладки по мере необходимости */}
      </div>
      <div className="sidebar-content">
        {activeTab === 'tokens' && <TokenInfo balance={tokenBalance} />}
        {/* Добавьте здесь контент для других вкладок */}
      </div>
    </div>
  );
}

export default Sidebar;
