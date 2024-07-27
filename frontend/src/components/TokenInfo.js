import React from 'react';

function TokenInfo({ balance }) {
  return (
    <div className="token-info">
      <h3>Your Token Balance</h3>
      <p>{balance} tokens</p>
    </div>
  );
}

export default TokenInfo;
