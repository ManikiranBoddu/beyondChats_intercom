// client/src/components/ChatBody.js
import React, { useState, useEffect } from 'react';

const ChatBody = ({ messages, handleDeleteMessage, chatBodyRef, handleCopyToComposer, handleAskFin }) => {
  const [selectedTextInfo, setSelectedTextInfo] = useState(null); // { messageId, text }

  // Handle text selection
  const handleTextSelection = (messageId) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const messageElement = range.startContainer.parentElement.closest('.message-content');
      if (messageElement && messageElement.closest(`[data-message-id="${messageId}"]`)) {
        setSelectedTextInfo({ messageId, text: selectedText });
      } else {
        setSelectedTextInfo(null);
      }
    } else {
      setSelectedTextInfo(null);
    }
  };

  // Add event listener for text selection
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      if (!selectedText) {
        setSelectedTextInfo(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return (
    <div className="chat-body" ref={chatBodyRef}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.isSelf ? 'self' : ''}`}
          data-message-id={message.id}
        >
          <div className="sender">
            {message.sender}
            {message.sender === 'Fin' && <span className="bot-label">(Bot)</span>}
          </div>
          <div
            className="message-content"
            onMouseUp={() => handleTextSelection(message.id)}
            onTouchEnd={() => handleTextSelection(message.id)} // Support mobile
          >
            <p>{message.text}</p>
            {selectedTextInfo?.messageId === message.id && !message.isSelf && (
              <button
                className="ask-fin-btn"
                data-tooltip="Ask Fin about this"
                onClick={() => {
                  handleAskFin(selectedTextInfo.text);
                  setSelectedTextInfo(null);
                  window.getSelection().removeAllRanges(); // Clear selection
                }}
              >
                <span className="ask-fin-icon">🤖</span>
              </button>
            )}
          </div>
          <div className="message-actions">
            <span className="time">{message.timestamp}</span>
            {!message.isSelf && (
              <button
                className="copy-btn"
                data-tooltip="Copy to composer"
                onClick={() => handleCopyToComposer(message.text)}
              >
                <span className="copy-icon">📋</span>
              </button>
            )}
            <button
              className="delete-btn"
              onClick={() => handleDeleteMessage(message.id)}
            >
              <span className="delete-icon">🗑️</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatBody;