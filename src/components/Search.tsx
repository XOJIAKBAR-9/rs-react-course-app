import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Props {
  onSearch: (searchTerm: string) => void;
  initialSearchTerm: string;
}

const Search: React.FC<Props> = ({ onSearch, initialSearchTerm }) => {
  const [inputValue, setInputValue] = useState(initialSearchTerm);
  const [storedTerm, setStoredTerm] = useLocalStorage<string>('searchTerm', '');

  useEffect(() => {
    setInputValue(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    const trimmedTerm = inputValue.trim();
    setStoredTerm(trimmedTerm);
    onSearch(trimmedTerm);
  };

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>Top controls</h3>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search Star Wars characters..."
        style={{ padding: '8px', marginRight: '10px', width: '250px' }}
      />
      <button onClick={handleSearch} style={{ padding: '8px 16px' }}>
        Search
      </button>
    </div>
  );
};

export default Search;