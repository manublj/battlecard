import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaNewspaper, FaBook, FaFilePdf } from 'react-icons/fa';

const ArticleCard = ({ article, onClick }) => {
  // Helper to get the appropriate icon for source type
  const getSourceIcon = () => {
    if (article.SRC_TYPE === 'post') {
      switch(article.POST) {
        case 'IG': return <FaInstagram />;
        case 'FB': return <FaFacebook />;
        case 'X': return <FaTwitter />;
        case 'YT': return <FaYoutube />;
        default: return null;
      }
    } else {
      switch(article.SRC_TYPE) {
        case 'article': return <FaNewspaper />;
        case 'book': return <FaBook />;
        case 'pdf': return <FaFilePdf />;
        default: return null;
      }
    }
  };

  // Format date if it exists
  const formattedDate = article.DATE_PUBLISHED ? 
    new Date(article.DATE_PUBLISHED).toLocaleDateString() : '';

  return (
    <Card 
      className="h-100 shadow-sm" 
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">
            {article.HEADLINE || (article.POST_CONTENT && article.POST_CONTENT.substring(0, 50) + '...')}
          </Card.Title>
          <span className="ms-2">{getSourceIcon()}</span>
        </div>
        
        {article.AUTHOR && (
          <Card.Subtitle className="mb-2 text-muted">
            By {article.AUTHOR}
          </Card.Subtitle>
        )}
        
        <div className="d-flex flex-wrap mb-2">
          {article.DOMAIN && (
            <Badge bg="secondary" className="me-1 mb-1">{article.DOMAIN}</Badge>
          )}
          {article.WHO && (
            <Badge bg="info" className="me-1 mb-1">{article.WHO}</Badge>
          )}
          {article.KEYWORDS && article.KEYWORDS.split(',').map((keyword, idx) => (
            <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
              {keyword.trim()}
            </Badge>
          ))}
        </div>
        
        {article.HIGHLIGHTS ? (
          <Card.Text className="text-truncate">
            {article.HIGHLIGHTS}
          </Card.Text>
        ) : article.POST_CONTENT ? (
          <Card.Text className="text-truncate">
            {article.POST_CONTENT}
          </Card.Text>
        ) : null}
        
        <div className="d-flex justify-content-between align-items-end mt-2">
          <div className="progress w-50" style={{ height: '6px' }}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: '30%' }} 
              aria-valuenow="30" 
              aria-valuemin="0" 
              aria-valuemax="100"
            />
          </div>
          
          <div className="d-flex">
            <small className="text-muted">
              {formattedDate}
            </small>
            <Badge 
              bg={article.CATEGORY === 'THEORY' ? 'primary' : 'success'} 
              className="ms-2"
            >
              {article.CATEGORY}
            </Badge>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArticleCard;