import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import AICopilot from './components/AICopilot';
import KnowledgeBase from './components/KnowledgeBase';
import ArticlePreview from './components/ArticlePreview';
import './styles.css';

const App = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Luis',
      text: 'I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they have something very similar already. I was hoping you\'d be able to refund me, as it is un-opened.',
      timestamp: '5 min ago',
      isSelf: false,
      category: 'open'
    },
    {
      id: 2,
      sender: 'Fin',
      text: 'Hi I am Fin (Bot), may assist with common queries.',
      timestamp: 'Seen · 1min',
      isSelf: true,
      category: 'open'
    },
    {
      id: 3,
      sender: 'Fin',
      text: 'Our refund policy allows returns for unopened items within 30 days of purchase. Since your purchase was in November, it may not be eligible due to the time frame. However, I can escalate this to a manager for an exception if needed. Would you like to proceed with that, or do you have your order ID handy so I can check the exact purchase date?',
      timestamp: 'Just now',
      isSelf: true,
      category: 'open'
    }
  ]);
  const [problemAcknowledged, setProblemAcknowledged] = useState(false);
  const [inputText, setInputText] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('open');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [finResponse, setFinResponse] = useState(null); // New state for Fin response
  const chatBodyRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'Fin (Bot)',
      text: inputText,
      timestamp: 'Just now',
      isSelf: true,
      category: selectedCategory
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    setFinResponse(null); // Clear Fin response when sending a new message

    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  const handleDeleteMessage = (id) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  const handleSavedReplySelect = (reply) => {
    setInputText(reply.content);
  };

  const handleSuggestionSelect = (suggestionText) => {
    setInputText(suggestionText);
  };

  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
  };

  const handleAddToComposer = (content) => {
    setInputText(content);
    setSelectedArticle(null);
  };

  // New handler for "Ask Fin" action
  const handleAskFin = (selectedText) => {
    // Mock a response from Fin based on the selected text
    setTimeout(() => {
      let responseText = 'I can help with that. ';
      if (selectedText.toLowerCase().includes('refund')) {
        responseText += 'It looks like you’re asking about a refund. Our policy allows returns for unopened items within 30 days. Can you provide your order ID?';
      } else if (selectedText.toLowerCase().includes('product')) {
        responseText += 'It seems you’re inquiring about a product. Could you share more details or the order ID?';
      } else {
        responseText += `You selected: "${selectedText}". Can you provide more context so I can assist you better?`;
      }

      setFinResponse({
        text: responseText,
        timestamp: 'Just now'
      });
    }, 1000); // Simulate a delay for the response
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isSelf) {
      const text = lastMessage.text.toLowerCase();
      if (text.includes('refund') || text.includes('money back') || text.includes('return') || text.includes('payment') || text.includes('charge')) {
        const simulateResponse = (clientMessage) => {
          setTimeout(() => {
            let aiResponse;
            const clientText = clientMessage.text.toLowerCase();

            if (clientText.includes('refund') || clientText.includes('money back') || clientText.includes('return')) {
              setProblemAcknowledged(true);
              aiResponse = {
                id: messages.length + 1,
                sender: 'Fin',
                text: 'Our refund policy allows returns for unopened items within 30 days of purchase. Please provide your order ID to initiate the refund process.',
                timestamp: 'Just now',
                isSelf: true,
                category: 'open'
              };
            } else if (clientText.includes('payment') || clientText.includes('charge')) {
              setProblemAcknowledged(true);
              aiResponse = {
                id: messages.length + 1,
                sender: 'Fin',
                text: 'I can assist with payment issues. Please share your order ID or email for verification.',
                timestamp: 'Just now',
                isSelf: true,
                category: 'open'
              };
            } else {
              if (problemAcknowledged) {
                aiResponse = {
                  id: messages.length + 1,
                  sender: 'Fin',
                  text: 'Please provide additional details like your order ID to proceed.',
                  timestamp: 'Just now',
                  isSelf: true,
                  category: 'open'
                };
              } else {
                aiResponse = {
                  id: messages.length + 1,
                  sender: 'Fin',
                  text: 'Could you clarify your issue? I’m here to help!',
                  timestamp: 'Just now',
                  isSelf: true,
                  category: 'open'
                };
              }
            }

            setMessages(prevMessages => [...prevMessages, aiResponse]);
            setSearchQuery(clientText.includes('refund') || clientText.includes('money back') || clientText.includes('return') ? 'refund' : clientText.includes('payment') || clientText.includes('charge') ? 'payment' : '');
          }, 1500);
        };

        simulateResponse(lastMessage);
      } else if (!problemAcknowledged) {
        const simulateResponse = (clientMessage) => {
          setTimeout(() => {
            const aiResponse = {
              id: messages.length + 1,
              sender: 'Fin',
              text: 'Could you clarify your issue? I’m here to help!',
              timestamp: 'Just now',
              isSelf: true,
              category: 'open'
            };
            setMessages(prevMessages => [...prevMessages, aiResponse]);
          }, 1500);
        };

        simulateResponse(lastMessage);
      }
    }
  }, [messages, problemAcknowledged]);

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      const text = latestMessage.text.toLowerCase();
      if (text.includes('refund') || text.includes('money back')) {
        setSearchQuery('refund');
      } else if (text.includes('github') || text.includes('repository')) {
        setSearchQuery('github');
      } else if (text.includes('payment') || text.includes('charge')) {
        setSearchQuery('payment');
      }
    }
  }, [messages]);

  const filteredMessages = selectedCategory
    ? messages.filter(message => message.category === selectedCategory)
    : messages;

  return (
    <div className="app">
      <div className="main-content">
      <div className={`sidebar-container ${sidebarVisible ? 'open' : ''}`}>
        <Sidebar 
          onCategorySelect={setSelectedCategory} 
          onSavedReplySelect={handleSavedReplySelect}
        />
      </div>
      
      
        <Chat 
          messages={filteredMessages}
          handleDeleteMessage={handleDeleteMessage}
          chatBodyRef={chatBodyRef}
          inputText={inputText}
          setInputText={setInputText}
          handleSendMessage={handleSendMessage}
          toggleSidebar={toggleSidebar}
          handleAskFin={handleAskFin} // Pass the handler to Chat
        />
        
        <div className="right-panel">
          <AICopilot 
            messages={messages}
            onSuggestionSelect={handleSuggestionSelect}
            finResponse={finResponse} // Pass Fin response to AICopilot
          />
          <KnowledgeBase 
            query={searchQuery} 
            onArticleSelect={handleArticleSelect}
          />
          {selectedArticle && (
            <ArticlePreview 
              article={selectedArticle}
              onClose={() => setSelectedArticle(null)}
              onAddToComposer={handleAddToComposer}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
