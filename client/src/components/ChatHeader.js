// client/src/components/ChatHeader.js
import React from 'react';

const ChatHeader = ({ toggleSidebar }) => {
  return (
    <div className="chat-header">
      <button className="menu-icon" onClick={toggleSidebar}>☰</button>
      <h2>Chat with Luis</h2>
      <div className="actions">
        <button>Assign</button>
        <button>Close</button>
        <span className="fin-note">Fin (Bot) may assist with common queries.</span>
      </div>
    </div>
  );
};

export default ChatHeader;