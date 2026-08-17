'use client';
import React from 'react';
import { type Character } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSelection } from '../store/selectionSlice';
import { Link } from '../i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface Props {
  character: Character;
}

const Card: React.FC<Props> = ({ character }) => {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector(state => state.selection.items);
  const searchParams = useSearchParams();
  const t = useTranslations('Card');
  
  // Extract ID from SWAPI URL (e.g. "https://swapi.dev/api/people/1/")
  const idMatch = character.url.match(/\/people\/(\d+)\//);
  const id = idMatch ? idMatch[1] : '';

  const isSelected = selectedItems.some(item => item.id === id);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch(toggleSelection({
      id,
      name: character.name,
      birth_year: character.birth_year,
      url: character.url,
    }));
  };

  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const params = new URLSearchParams(searchParams.toString());
  params.set('details', id);

  return (
    <Link 
      href={`?${params.toString()}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div 
        style={{ border: '1px solid var(--border-color, #ddd)', margin: '10px 0', padding: '15px', cursor: 'pointer', borderRadius: '4px', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center' }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--card-bg-hover, #f9f9f9)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <input 
          type="checkbox" 
          checked={isSelected} 
          onChange={handleCheckboxChange} 
          onClick={handleCheckboxClick}
          style={{ marginRight: '15px', transform: 'scale(1.5)' }} 
        />
        <div>
          <strong>{t('name')}:</strong> {character.name} | <strong>{t('birthYear')}:</strong> {character.birth_year}
        </div>
      </div>
    </Link>
  );
};

export default Card;