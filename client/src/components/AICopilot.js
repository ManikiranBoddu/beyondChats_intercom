import React, { useState, useEffect } from 'react';

const AICopilot = ({ messages, onSuggestionSelect, finResponse }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);

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
          { id: 2, text: "What's the refund policy?" },
          { id: 3, text: 'How long does a refund take?' },
        ]);
      } else if (lowerText.includes('github') || lowerText.includes('repository')) {
        setSuggestions([
          { id: 1, text: 'How do I access my repository?' },
          { id: 2, text: 'Can you help with GitHub permissions?' },
          { id: 3, text: 'How do I connect my account to GitHub?' },
        ]);
      } else if (lowerText.includes('payment') || lowerText.includes('card')) {
        setSuggestions([
          { id: 1, text: 'My payment was declined' },
          { id: 2, text: 'How do I update my payment method?' },
          { id: 3, text: 'Is there a payment plan available?' },
        ]);
      } else {
        setSuggestions([
          { id: 1, text: 'I need help with my account' },
          { id: 2, text: 'How do I contact support?' },
          { id: 3, text: 'What are your business hours?' },
        ]);
      }

      setIsLoading(false);
    }, 500);
  };

  const handleAskCopilot = async (message) => {
    setSelectedMessage(message);
    setIsLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      // Fix 1: Use the correct endpoint URL
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const apiUrl = `${backendUrl}/api/ask-fin`;
      
      console.log('Making request to:', apiUrl); // Debug log
      console.log('Request payload:', { text: message }); // Debug log

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
      });

      console.log('Response status:', response.status); // Debug log

      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response from Fin');
      }

      setApiResponse({ text: data.text, timestamp: data.timestamp });
    } catch (err) {
      console.error('Error fetching from backend:', err);
      setError(`Failed to get a response from Fin: ${err.message}`);
    } finally {
      setIsLoading(false);
      setSelectedMessage(null);
    }
  };

  // Fix 2: Add input handling for the text input
  const [inputValue, setInputValue] = useState('');

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      handleAskCopilot(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  // Format response text into bullet points
  const formatResponseAsPoints = (text) => {
    if (!text) return null;
    
    // Split text into sentences and create bullet points
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    
    return (
      <ul style={{ 
        margin: 0, 
        paddingLeft: '20px',
        listStyleType: 'disc'
      }}>
        {sentences.map((sentence, index) => (
          <li key={index} style={{ 
            marginBottom: '8px',
            lineHeight: '1.5'
          }}>
            {sentence.trim()}
          </li>
        ))}
      </ul>
    );
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
        {isLoading && !selectedMessage ? (
          <div className="loading-suggestions">Generating suggestions...</div>
        ) : (
          suggestions.map((suggestion) => (
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

      {(finResponse || apiResponse) && (
        <div className="fin-response" style={{
          backgroundColor: '#e8f5e8',
          border: '2px solid #4caf50',
          borderRadius: '8px',
          padding: '16px',
          margin: '10px 0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p className="ai-intro" style={{ 
            color: '#2e7d32', 
            fontWeight: 'bold',
            marginBottom: '12px',
            fontSize: '16px'
          }}>
            🤖 Fin AI Response
          </p>
          <div style={{
            backgroundColor: '#f1f8e9',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #c8e6c9'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ 
                color: '#1b5e20', 
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                Fin Analysis:
              </span>
            </div>
            <div style={{ 
              color: '#2e7d32',
              lineHeight: '1.6',
              fontSize: '14px'
            }}>
              {formatResponseAsPoints((apiResponse || finResponse).text)}
            </div>
            <div style={{ 
              textAlign: 'right', 
              marginTop: '10px',
              fontSize: '12px',
              color: '#666'
            }}>
              <span className="time">⏰ {(apiResponse || finResponse).timestamp}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="ask-copilot-container">
        {messages.length > 0 && (
          <button
            className="ask-copilot-button"
            onClick={() => handleAskCopilot(messages[messages.length - 1].text)}
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Ask Fin Copilot'}
          </button>
        )}
      </div>

      <div className="ai-input">
        <input
          type="text"
          placeholder="Ask a follow up question..."
          className="ai-question-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button 
          className="ai-submit-button"
          onClick={handleInputSubmit}
          disabled={isLoading || !inputValue.trim()}
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default AICopilot;
