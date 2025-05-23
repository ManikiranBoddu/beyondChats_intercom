import React, { useState, useRef, useMemo } from 'react';
import debounce from 'lodash/debounce';

const ChatFooter = ({ inputText, setInputText, handleSendMessage }) => {
  const [showRephraseMenu, setShowRephraseMenu] = useState(false);
  const [isRephrasing, setIsRephrasing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const fileInputRef = useRef(null);

  const rephraseOptions = [
    { id: 'tone', name: 'My tone of voice' },
    { id: 'friendly', name: 'More friendly' },
    { id: 'formal', name: 'More formal' },
    { id: 'grammar', name: 'Fix grammar & spelling' },
    { id: 'translate', name: 'Translate...' }
  ];

  // Sanitize user input to prevent XSS
  const sanitizeInput = (text) => {
    return text
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '\\\'')
      .replace(/\//g, '/');
  };

  const handleRephrase = (option) => {
    if (!inputText.trim()) return;
    
    setIsRephrasing(true);
    
    setTimeout(() => {
      let rephrasedText = inputText;
      
      switch (option) {
        case 'friendly':
          rephrasedText = addFriendlyTone(inputText);
          break;
        case 'formal':
          rephrasedText = addFormalTone(inputText);
          break;
        case 'grammar':
          rephrasedText = fixGrammarAndSpelling(inputText);
          break;
        default:
          break;
      }
      
      setInputText(rephrasedText);
      setIsRephrasing(false);
      setShowRephraseMenu(false);
    }, 800);
  };

  const addFriendlyTone = (text) => {
    return text
      .replace(/^(I|We) (need|want|require)/i, "I'd love")
      .replace(/please provide/i, "would you mind sharing")
      .replace(/\./g, "! ")
      .replace(/thanks/i, "thanks so much") + " 😊";
  };

  const addFormalTone = (text) => {
    return text
      .replace(/hi|hey|hello/i, "Greetings,")
      .replace(/thanks/i, "Thank you")
      .replace(/sorry/i, "I apologize")
      .replace(/i need/i, "I would require")
      .replace(/can you/i, "Would you be able to")
      .replace(/^/i, "Dear customer, ");
  };

  const fixGrammarAndSpelling = (text) => {
    return text
      .replace(/i /g, "I ")
      .replace(/dont/g, "don't")
      .replace(/cant/g, "can't")
      .replace(/wont/g, "won't")
      .replace(/ive/g, "I've")
      .replace(/its/g, "it's")
      .replace(/ /g, " ");
  };

  const applyFormatting = (before, after) => {
    const textarea = document.querySelector('.chat-footer-input');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputText.substring(start, end);

    if (selectedText) {
      const newText = inputText.substring(0, start) + before + selectedText + after + inputText.substring(end);
      setInputText(newText);
    } else {
      setInputText(inputText + before + after);
    }
  };

  const handleBold = () => applyFormatting('**', '**');
  const handleItalic = () => applyFormatting('_', '_');

  const handleLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      const textarea = document.querySelector('.chat-footer-input');
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = inputText.substring(start, end) || 'Link';
      const linkMarkdown = `[${selectedText}](${url})`;
      const newText = inputText.substring(0, start) + linkMarkdown + inputText.substring(end);
      setInputText(newText);
    }
  };

  const handleHeading = (level) => {
    const textarea = document.querySelector('.chat-footer-input');
    const start = textarea.selectionStart;
    const textBeforeCursor = inputText.substring(0, start);
    const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n') + 1;
    const lineStart = inputText.substring(lastNewlineIndex, start);
    
    if (!lineStart.startsWith('#')) {
      const prefix = level === 1 ? '# ' : '## ';
      const newText = inputText.substring(0, lastNewlineIndex) + prefix + inputText.substring(lastNewlineIndex);
      setInputText(newText);
    }
  };

  const fetchGeminiSuggestions = (text) => {
    const suggestions = [
      `Here's a more concise version: "${text.slice(0, 50)}..."`,
      `Polished response: "Thank you for your request. ${text}"`,
      `Friendly tone: "${text} Let us know if you need more help! 😊"`
    ];
    return suggestions;
  };

  const handleAiSuggestions = () => {
    if (!inputText.trim()) {
      alert('Please enter or select some text to get AI suggestions.');
      return;
    }

    const suggestions = fetchGeminiSuggestions(inputText);
    setAiSuggestions(suggestions);
    setShowAiSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion) => {
    setInputText(suggestion);
    setShowAiSuggestions(false);
    setAiSuggestions([]);
  };

  const handleQuickAction = () => {
    setInputText(inputText + '\nHere’s a quick response for you!');
  };

  const handleFileAttach = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Add file size limit (e.g., 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size exceeds 5MB limit. Please choose a smaller file.');
        return;
      }
      // Add file type validation (e.g., only allow images, PDFs)
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Unsupported file type. Please upload a JPEG, PNG, or PDF.');
        return;
      }
      console.log('Selected file:', file.name);
      setInputText(inputText + `\n[Attached file: ${file.name}]`);
    }
  };

  const handleEmoji = () => {
    setInputText(inputText + ' 😊');
  };

  const handleCopyText = () => {
    const textarea = document.querySelector('.chat-footer-input');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputText.substring(start, end) || inputText;

    if (selectedText) {
      navigator.clipboard.writeText(selectedText).then(() => {
        alert('Text copied to clipboard!');
      });
    } else {
      alert('No text to copy.');
    }
  };

  const handleSendMessageWrapper = () => {
    const trimmedText = inputText.trim();
    if (trimmedText) {
      const sanitizedText = sanitizeInput(trimmedText);
      handleSendMessage(sanitizedText);
      setInputText('');
    }
  };

  // Memoize the debounced function
  const debouncedSetInputText = useMemo(
    () =>
      debounce((value) => {
        setInputText(value);
      }, 300),
    [setInputText]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    debouncedSetInputText(value);
  };

  return (
    <div className="chat-footer">
      <div className="formatting-tools">
        <div className="format-buttons">
          <button
            className="format-button"
            onClick={handleAiSuggestions}
            data-tooltip="Get AI Suggestions"
            aria-label="Get AI Suggestions"
          >
            <span className="format-icon">✨</span>
          </button>
          {showAiSuggestions && (
            <div className="ai-suggestions-menu">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="ai-suggestion-option"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <button
            className="format-button"
            onClick={handleBold}
            data-tooltip="Bold"
            aria-label="Bold Text"
          >
            <span className="format-icon">B</span>
          </button>
          <button
            className="format-button"
            onClick={handleItalic}
            data-tooltip="Italic"
            aria-label="Italic Text"
          >
            <span className="format-icon">I</span>
          </button>
          <button
            className="format-button"
            onClick={handleLink}
            data-tooltip="Insert Link"
            aria-label="Insert Link"
          >
            <span className="format-icon">🔗</span>
          </button>
          <button
            className="format-button"
            onClick={() => handleHeading(1)}
            data-tooltip="Heading 1"
            aria-label="Insert Heading 1"
          >
            <span className="format-icon">H1</span>
          </button>
          <button
            className="format-button"
            onClick={() => handleHeading(2)}
            data-tooltip="Heading 2"
            aria-label="Insert Heading 2"
          >
            <span className="format-icon">H2</span>
          </button>
        </div>
      </div>
      
      <div className="input-wrapper">
        <textarea
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessageWrapper();
            }
          }}
          placeholder="Type your message..."
          className="chat-footer-input"
        />
        {inputText.trim() !== '' && (
          <>
            <button 
              className="rephrase-btn"
              onClick={() => setShowRephraseMenu(!showRephraseMenu)}
              disabled={isRephrasing}
            >
              {isRephrasing ? "Rephrasing..." : "Rephrase"}
            </button>
            {showRephraseMenu && (
              <div className="rephrase-menu">
                {rephraseOptions.map(option => (
                  <button 
                    key={option.id} 
                    className="rephrase-option"
                    onClick={() => handleRephrase(option.id)}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="composer-actions">
        <button
          className="action-button"
          onClick={handleQuickAction}
          data-tooltip="Insert Quick Response"
          aria-label="Insert Quick Response"
        >
          <span className="action-icon">💬</span>
        </button>
        <button
          className="action-button"
          onClick={handleFileAttach}
          data-tooltip="Attach File"
          aria-label="Attach File"
        >
          <span className="action-icon">📎</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          className="action-button"
          onClick={handleEmoji}
          data-tooltip="Insert Emoji"
          aria-label="Insert Emoji"
        >
          <span className="action-icon">😀</span>
        </button>
        <button
          className="action-button"
          onClick={handleCopyText}
          data-tooltip="Copy Text"
          aria-label="Copy Text"
        >
          <span className="action-icon">📄</span>
        </button>
        {inputText.trim() !== '' && (
          <button className="send-btn" onClick={handleSendMessageWrapper}>Send</button>
        )}
      </div>
    </div>
  );
};

export default ChatFooter;