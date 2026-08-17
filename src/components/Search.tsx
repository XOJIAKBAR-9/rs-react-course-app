'use client';
import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Props {
  initialSearchTerm: string;
}

const Search: React.FC<Props> = ({ initialSearchTerm }) => {
  const [inputValue, setInputValue] = useState(initialSearchTerm);
  const [, setStoredTerm] = useLocalStorage<string>('searchTerm', '');
  const t = useTranslations('Search');

  useEffect(() => {
    setInputValue(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    const trimmedTerm = inputValue.trim();
    setStoredTerm(trimmedTerm);
  };

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '2px solid var(--border-color, #333)', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>Top controls</h3>
      <input
        type="text"
        name="search"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={t('placeholder')}
        style={{ padding: '8px', marginRight: '10px', width: '250px' }}
      />
      <button type="submit" onClick={handleSubmit} style={{ padding: '8px 16px' }}>
        {t('button')}
      </button>
    </div>
  );
};

export default Search;