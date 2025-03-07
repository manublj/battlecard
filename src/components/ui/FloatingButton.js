import React from 'react';
import { Button } from 'react-bootstrap';

const FloatingButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        fontSize: '24px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      variant="primary"
    >
      +
    </Button>
  );
};

export default FloatingButton;