import { Component } from 'react';
import Search from './Search';
import CardList from './CardList';
import { fetchCharacters } from '../services/api';
import { type Character } from '../types';
import Header from './Header';

interface State {
  items: Character[];
  isLoading: boolean;
  error: string | null;
}

class Main extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      items: [],
      isLoading: true,
      error: null,
    };
  }

  componentDidMount() {
    const savedTerm = localStorage.getItem('searchTerm') || '';
    this.loadData(savedTerm);
  }

  loadData = async (searchTerm: string) => {
    this.setState({ isLoading: true, error: null });
    try {
      const data = await fetchCharacters(searchTerm);
      this.setState({ items: data.results, isLoading: false });
    } catch (err) {
      this.setState({ 
        error: err instanceof Error ? err.message : 'Unknown error', 
        isLoading: false 
      });
    }
  };

  handleThrowError = () => {
    throw new Error('Simulated application crash!');
  };


  render() {
    const { items, isLoading, error } = this.state;

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <Header /> 
        
        <Search onSearch={this.loadData} />
        
        <div style={{ border: '2px solid #333', padding: '20px', borderRadius: '8px', minHeight: '400px' }}>
          <h3 style={{ marginTop: 0 }}>Results</h3>
          
          {isLoading && <div>Loading data... ⏳</div>}
          
          {!isLoading && error && (
            <div style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</div>
          )}
          
          {!isLoading && !error && <CardList items={items} />}
        </div>

        <button onClick={this.handleThrowError} style={{ marginTop: '20px', color: 'red' }}>
          Test Application Crash
        </button>
      </div>
    );
  }
}

export default Main;