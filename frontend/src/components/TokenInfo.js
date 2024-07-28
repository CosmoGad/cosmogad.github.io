import React from 'react';
import '../styles/TokenInfo.css';

function TokenInfo({ balance, onClose }) {
  return (
    <div className="token-info-overlay" onClick={onClose}>
      <div className="token-info-container" onClick={e => e.stopPropagation()}>
        <h3>Your Token Balance</h3>
        <p>{balance.toFixed(2)} tokens</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default TokenInfo;
