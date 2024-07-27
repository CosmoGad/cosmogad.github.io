import React from 'react';
import '../styles/TokenInfo.css';

function TokenInfo({ balance }) {
  return (
    <div className="token-info">
      <h3>Your Token Balance</h3>
      <p>{balance.toFixed(2)} tokens</p>
    </div>
  );
}

export default TokenInfo;
