import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import Search from './Search';
import CardList from './CardList';
import Pagination from './Pagination';
import Header from './Header';
import { fetchCharacters } from '../services/api';
import { type Character } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Main: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [storedTerm] = useLocalStorage<string>('searchTerm', '');
  
  const [items, setItems] = useState<Character[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialSearch = searchParams.get('search') ?? storedTerm;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  const loadData = useCallback(async (searchTerm: string, page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCharacters(searchTerm, page);
      setItems(data.results);
      setTotalItems(data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(initialSearch, currentPage);
  }, [initialSearch, currentPage, loadData]);

  const handleSearch = (searchTerm: string) => {
    // Reset to page 1 on new search
    setSearchParams({ search: searchTerm, page: '1' });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ search: initialSearch, page: page.toString() });
  };

  const handleItemClick = (id: string) => {
    navigate({
      pathname: `/details/${id}`,
      search: searchParams.toString(),
    });
  };

  const handleThrowError = () => {
    throw new Error('Simulated application crash!');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <Header /> 
      
      <Search onSearch={handleSearch} initialSearchTerm={initialSearch} />
      
      <div style={{ display: 'flex', gap: '20px', minHeight: '500px' }}>
        {/* Left Side: Results List */}
        <div style={{ flex: '1', border: '2px solid #333', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0 }}>Results</h3>
          
          {isLoading && <div>Loading data... ⏳</div>}
          
          {!isLoading && error && (
            <div style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</div>
          )}
          
          {!isLoading && !error && (
            <>
              <div style={{ flex: '1' }}>
                <CardList items={items} onItemClick={handleItemClick} />
              </div>
              <Pagination 
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={10} 
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

        {/* Right Side: Detail View (Outlet) */}
        <div style={{ width: '350px' }}>
          <Outlet />
        </div>
      </div>

      <button onClick={handleThrowError} style={{ marginTop: '20px', color: 'red', cursor: 'pointer' }}>
        Test Application Crash
      </button>
    </div>
  );
};

export default Main;