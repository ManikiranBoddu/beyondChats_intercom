// client/src/components/Chat.js
import React from 'react';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const Chat = ({
  messages,
  handleDeleteMessage,
  chatBodyRef,
  inputText,
  setInputText,
  handleSendMessage,
  toggleSidebar,
  handleAskFin // New prop
}) => {
  return (
    <div className="chat">
      <ChatHeader toggleSidebar={toggleSidebar} />
      <ChatBody 
        messages={messages} 
        handleDeleteMessage={handleDeleteMessage} 
        chatBodyRef={chatBodyRef}
        handleCopyToComposer={setInputText}
        handleAskFin={handleAskFin} // Pass to ChatBody
      />
      <ChatFooter 
        inputText={inputText} 
        setInputText={setInputText} 
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Chat;