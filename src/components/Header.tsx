import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{ borderBottom: '2px solid var(--border-color, #eee)', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ margin: 0 }}>Star Wars Explorer</h1>
        <p style={{ margin: '5px 0 0 0' }}>A React hooks application.</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button 
          onClick={toggleTheme} 
          style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid var(--border-color, #ccc)', background: 'var(--card-bg-hover, #fff)', color: 'var(--text-color, #000)' }}
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
        <nav>
          <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff' }}>Home</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#007bff' }}>About</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;