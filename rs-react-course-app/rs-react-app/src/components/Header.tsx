import { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <header style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>Star Wars Explorer</h1>
        <p>A strictly class-based React application.</p>
      </header>
    );
  }
}

export default Header;