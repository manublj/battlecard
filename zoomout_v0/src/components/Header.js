import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <header style={{ 
      backgroundColor: '#ff6600',
      padding: '2px'
    }}>
      <nav style={{ 
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '2px 4px',
        gap: '4px',
        fontSize: '13px',
        fontFamily: 'Verdana, Geneva, sans-serif'
      }}>
        <Link to="/wiki" style={{ color: '#000000', textDecoration: 'none' }}>
          wiki
        </Link>
        <span style={{ color: '#000000' }}>|</span>
        <Link to="/" style={{ color: '#000000', textDecoration: 'none' }}>
          theory
        </Link>
        <span style={{ color: '#000000' }}>|</span>
        <Link to="/reporting" style={{ color: '#000000', textDecoration: 'none' }}>
          wayback-machine
        </Link>
      </nav>
    </header>
  );
};

export default Header;