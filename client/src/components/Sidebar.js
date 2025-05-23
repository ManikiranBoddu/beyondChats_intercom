// client/src/components/Sidebar.js
import React from 'react';

const Sidebar = ({ onCategorySelect, onSavedReplySelect }) => {
  const categories = [
    { id: 'open', name: 'Open', count: 3 },
    { id: 'closed', name: 'Closed', count: 12 },
    { id: 'awaiting', name: 'Awaiting reply', count: 2 }
  ];
  
  const savedReplies = [
    { id: 1, name: 'Luis - GitHub...', content: 'Thanks for reaching out about your GitHub issue. To help you better, could you please provide the repository name and the specific error message you\'re encountering?' },
    { id: 2, name: 'Emma - Payment...', content: 'I understand you\'re having trouble with your payment. To assist you further, could you please confirm the date of the transaction and the last four digits of the card used?' },
    { id: 3, name: 'Mark - Refund...', content: 'I\'m sorry to hear you\'re looking for a refund. We can process this for you if the order was placed within the last 60 days. Could you please provide your order ID and the reason for your refund request?' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Inbox</h2>
      </div>
      
      <div className="sidebar-categories">
        {categories.map(category => (
          <div 
            key={category.id} 
            className="sidebar-category"
            onClick={() => onCategorySelect(category.id)}
          >
            {category.name} ({category.count})
          </div>
        ))}
      </div>
      
      <div className="sidebar-section">
        <h3>Saved replies</h3>
        <div className="saved-replies-list">
          {savedReplies.map(reply => (
            <div 
              key={reply.id} 
              className="saved-reply-item"
              onClick={() => onSavedReplySelect(reply)}
            >
              {reply.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;