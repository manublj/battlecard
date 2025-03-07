import React from 'react';
import { Button } from 'react-bootstrap';

const FloatingButton = ({ onClick }) => {
  return (
    <Button 
      variant="success" 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}
      onClick={onClick}
    >
      +
    </Button>
  );
};

export default FloatingButton;