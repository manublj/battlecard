import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

const CardView = ({ card, relatedArticles }) => {
  // Helper to get color based on spectrum
  const getSpectrumColor = (spectrum) => {
    switch(spectrum) {
      case 'LEFT': return 'danger';
      case 'CENTRE': return 'secondary';
      case 'RIGHT': return 'primary';
      default: return 'light';
    }
  };

  // Helper to get icon based on WHO_TYPE
  const getEntityTypeLabel = (type) => {
    switch(type) {
      case 'Character': return 'Character';
      case 'Political Party': return 'Party';
      case 'Movement': return 'Movement';
      default: return type;
    }
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Badge bg={getSpectrumColor(card.SPECTRUM)}>
          {card.SPECTRUM || 'Unspecified'}
        </Badge>
        <Badge bg="info">
          {getEntityTypeLabel(card.WHO_TYPE)}
        </Badge>
      </Card.Header>
      <Card.Body>
        <Card.Title>{card.WHO}</Card.Title>
        
        <div className="mt-3">
          <h6>Related Articles</h6>
          {relatedArticles.theory.length === 0 && relatedArticles.reporting.length === 0 ? (
            <p className="text-muted">No related articles found.</p>
          ) : (
            <ListGroup variant="flush">
              {relatedArticles.theory.length > 0 && (
                <>
                  <ListGroup.Item className="bg-light">
                    <strong>Theory</strong>
                  </ListGroup.Item>
                  {relatedArticles.theory.map((article, index) => (
                    <ListGroup.Item key={`theory-${index}`} action>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{article.HEADLINE}</strong>
                          {article.AUTHOR && (
                            <div><small>By {article.AUTHOR}</small></div>
                          )}
                        </div>
                        {article.SRC_TYPE && (
                          <Badge bg="secondary" pill>
                            {article.SRC_TYPE}
                          </Badge>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </>
              )}
              
              {relatedArticles.reporting.length > 0 && (
                <>
                  <ListGroup.Item className="bg-light">
                    <strong>Reporting</strong>
                  </ListGroup.Item>
                  {relatedArticles.reporting.map((article, index) => (
                    <ListGroup.Item key={`reporting-${index}`} action>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{article.HEADLINE}</strong>
                          {article.REGION && (
                            <div><small>Region: {article.REGION}</small></div>
                          )}
                        </div>
                        {article.DOMAIN && (
                          <Badge bg="info" pill>
                            {article.DOMAIN}
                          </Badge>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </>
              )}
            </ListGroup>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CardView;