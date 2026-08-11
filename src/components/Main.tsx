import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Search from './Search';
import CardList from './CardList';
import Pagination from './Pagination';
import Header from './Header';
import { useGetCharactersQuery, starWarsApi } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Main: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [storedTerm] = useLocalStorage<string>('searchTerm', '');

  const initialSearch = searchParams.get('search') ?? storedTerm;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const { data, error: apiError, isFetching: isLoading } = useGetCharactersQuery({
    searchTerm: initialSearch,
    page: currentPage,
  });

  const items = data?.results || [];
  const totalItems = data?.count || 0;
  
  // Format the error message
  let error: string | null = null;
  if (apiError) {
    if ('status' in apiError) {
      error = `Server error: ${apiError.status}`;
    } else {
      error = apiError.message || 'Unknown error';
    }
  }

  const handleSearch = (searchTerm: string) => {
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

  const handleRefresh = () => {
    dispatch(starWarsApi.util.invalidateTags(['Character']));
  };

  const handleThrowError = () => {
    throw new Error('Simulated application crash!');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <Header /> 
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <Search onSearch={handleSearch} initialSearchTerm={initialSearch} />
        </div>
        <button 
          onClick={handleRefresh} 
          style={{ padding: '10px 15px', cursor: 'pointer', height: 'fit-content' }}
        >
          Refresh Data
        </button>
      </div>
      
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