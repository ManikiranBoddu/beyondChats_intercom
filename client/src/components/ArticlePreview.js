// client/src/components/ArticlePreview.js
import React from 'react';

const ArticlePreview = ({ article, onClose, onAddToComposer }) => {
  return (
    <>
      <div className="article-preview-backdrop" onClick={onClose}></div>
      <div className="article-preview">
        <div className="article-preview-header">
          <h3>{article.title}</h3>
          <button className="close-preview" onClick={onClose}>✖</button>
        </div>
        <div className="article-preview-meta">
          Last updated: {article.lastUpdated}
        </div>
        <div className="article-preview-content">
          <p>{article.content}</p>
        </div>
        <button
          className="add-to-composer-button"
          onClick={() => onAddToComposer(article.content)}
        >
          Add to Composer
        </button>
      </div>
    </>
  );
};

export default ArticlePreview;