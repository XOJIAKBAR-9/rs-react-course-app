import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ margin: 0 }}>Star Wars Explorer</h1>
        <p style={{ margin: '5px 0 0 0' }}>A React hooks application.</p>
      </div>
      <nav>
        <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff' }}>Home</Link>
        <Link to="/about" style={{ textDecoration: 'none', color: '#007bff' }}>About</Link>
      </nav>
    </header>
  );
};

export default Header;