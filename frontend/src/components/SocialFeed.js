import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/SocialFeed.css';

const SocialFeed = ({ data = [] }) => {
  const { t } = useTranslation();

  // Sort by timestamp (newest first)
  const sortedData = [...data].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  const getSentimentIcon = (sentiment) => {
    switch(sentiment) {
      case 'positive': return '✅';
      case 'negative': return '⚠️';
      case 'neutral': return '🔵';
      default: return '🔵';
    }
  };

  const getSourceIcon = (source) => {
    switch(source) {
      case 'twitter': return '🐦';
      case 'facebook': return '📘';
      case 'instagram': return '📸';
      default: return '💬';
    }
  };

  return (
    <div className="social-feed">
      <div className="feed-header">
        <h3>{t('socialFeed.title')}</h3>
        <div className="feed-legend">
          <span className="legend-item">
            <span className="sentiment-icon positive">✅</span> {t('socialFeed.positive')}
          </span>
          <span className="legend-item">
            <span className="sentiment-icon neutral">🔵</span> {t('socialFeed.neutral')}
          </span>
          <span className="legend-item">
            <span className="sentiment-icon negative">⚠️</span> {t('socialFeed.negative')}
          </span>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <div className="no-data">{t('socialFeed.noData')}</div>
      ) : (
        <div className="feed-items">
          {sortedData.map((item) => (
            <div key={item.id} className={`feed-item ${item.sentiment}`}>
              <div className="feed-item-header">
                <span className="source-icon">{getSourceIcon(item.source)}</span>
                <span className="sentiment-icon">{getSentimentIcon(item.sentiment)}</span>
                <span className="timestamp">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="feed-item-content">
                <p>{item.text}</p>
                <div className="keywords">
                  <span className="keyword">#{item.keyword}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialFeed;