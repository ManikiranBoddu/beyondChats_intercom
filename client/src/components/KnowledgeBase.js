// client/src/components/KnowledgeBase.js
import React from 'react';

const KnowledgeBase = ({ query, onArticleSelect }) => {
  const findRelevantArticles = (searchQuery) => {
    const allArticles = [
      { id: 1, title: 'Getting a refund', author: 'Amy Adams', date: '1d ago', 
        content: 'We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund. This guide outlines the simple steps to help you navigate the refund process and ensure a smooth resolution to your concern.' },
      { id: 2, title: 'Refund for an order placed by mistake', author: 'Michael Chen', date: '3d ago',
        content: 'Accidentally placed an order? No problem. We offer refunds for orders placed by mistake if reported within 24 hours of purchase.' },
      { id: 3, title: 'Refund for an unwanted gift', author: 'Sarah Johnson', date: '1w ago',
        content: 'Received a gift that doesn\'t quite suit you? Learn how to request a refund or store credit for unwanted gifts.' },
      { id: 4, title: 'Troubleshooting GitHub access issues', author: 'Dev Team', date: '2d ago',
        content: 'Common solutions for GitHub access problems, repository visibility issues, and authentication errors.' },
      { id: 5, title: 'Payment declined troubleshooting', author: 'Finance Team', date: '12h ago',
        content: 'Steps to resolve payment declined issues, including checking card details, available funds, and contacting your bank.' }
    ];
    
    if (!searchQuery) return [];
    
    const lowerQuery = searchQuery.toLowerCase();
    return allArticles.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) || 
      article.content.toLowerCase().includes(lowerQuery)
    );
  };
  
  const relevantArticles = findRelevantArticles(query);
  
  return (
    <div className="knowledge-base">
      {relevantArticles.length > 0 && (
        <>
          <div className="sources-count">{relevantArticles.length} relevant sources found</div>
          <div className="articles-list">
            {relevantArticles.map(article => (
              <div key={article.id} className="article-item" onClick={() => onArticleSelect(article)}>
                <div className="article-icon">📄</div>
                <div className="article-info">
                  <div className="article-title">{article.title}</div>
                  <div className="article-meta">
                    Public article • {article.author} • {article.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default KnowledgeBase;