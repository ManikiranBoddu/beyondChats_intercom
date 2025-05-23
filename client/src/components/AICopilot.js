// client/src/components/AICopilot.js
import React, { useState, useEffect } from 'react';

const AICopilot = ({ messages, onSuggestionSelect, finResponse }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (messages.length === 0) return;
    
    const latestMessage = messages[messages.length - 1];
    if (latestMessage.sender !== 'You') {
      generateSuggestions(latestMessage.text);
    }
  }, [messages]);

  const generateSuggestions = (messageText) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const lowerText = messageText.toLowerCase();
      
      if (lowerText.includes('refund')) {
        setSuggestions([
          { id: 1, text: 'How do I get a refund?' },
          { id: 2, text: 'What\'s the refund policy?' },
          { id: 3, text: 'How long does a refund take?' }
        ]);
      } else if (lowerText.includes('github') || lowerText.includes('repository')) {
        setSuggestions([
          { id: 1, text: 'How do I access my repository?' },
          { id: 2, text: 'Can you help with GitHub permissions?' },
          { id: 3, text: 'How do I connect my account to GitHub?' }
        ]);
      } else if (lowerText.includes('payment') || lowerText.includes('card')) {
        setSuggestions([
          { id: 1, text: 'My payment was declined' },
          { id: 2, text: 'How do I update my payment method?' },
          { id: 3, text: 'Is there a payment plan available?' }
        ]);
      } else {
        setSuggestions([
          { id: 1, text: 'I need help with my account' },
          { id: 2, text: 'How do I contact support?' },
          { id: 3, text: 'What are your business hours?' }
        ]);
      }
      
      setIsLoading(false);
    }, 500);
  };

  const handleAskCopilot = (message) => {
    setSelectedMessage(message);
  };

  return (
    <div className="ai-copilot">
      <div className="ai-copilot-header">
        <div className="ai-icon">🤖</div>
        <div className="ai-title">AI Copilot</div>
      </div>
      
      <div className="ai-copilot-content">
        {!selectedMessage ? (
          <>
            <p className="ai-intro">Hi, I'm Fin AI Copilot</p>
            <p className="ai-subtext">Ask me anything about this conversation.</p>
          </>
        ) : (
          <div className="ai-analyzing">
            <p>Analyzing: "{selectedMessage}"</p>
            <div className="ai-loader"></div>
          </div>
        )}
      </div>
      
      <div className="ai-suggestions">
        {isLoading ? (
          <div className="loading-suggestions">Generating suggestions...</div>
        ) : (
          suggestions.map(suggestion => (
            <div 
              key={suggestion.id} 
              className="suggestion-item"
              onClick={() => onSuggestionSelect(suggestion.text)}
            >
              <span className="suggestion-label">Suggested:</span> {suggestion.text}
            </div>
          ))
        )}
      </div>
      
      {/* New section for Fin response */}
      {finResponse && (
        <div className="fin-response">
          <p className="ai-intro">Fin Response</p>
          <div className="suggestion-item">
            <span className="suggestion-label">Fin:</span>
            <span>{finResponse.text}</span>
            <span className="time">{finResponse.timestamp}</span>
          </div>
        </div>
      )}
      
      <div className="ask-copilot-container">
        {messages.length > 0 && (
          <button 
            className="ask-copilot-button"
            onClick={() => handleAskCopilot(messages[messages.length - 1].text)}
          >
            Ask Fin Copilot
          </button>
        )}
      </div>
      
      <div className="ai-input">
        <input 
          type="text" 
          placeholder="Ask a follow up question..." 
          className="ai-question-input"
        />
        <button className="ai-submit-button">↑</button>
      </div>
    </div>
  );
};

export default AICopilot;