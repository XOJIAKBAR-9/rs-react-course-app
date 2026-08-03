import React from 'react';
import { type Character } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSelection } from '../store/selectionSlice';

interface Props {
  character: Character;
  onClick: (id: string) => void;
}

const Card: React.FC<Props> = ({ character, onClick }) => {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector(state => state.selection.items);
  
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

  return (
    <div 
      onClick={() => onClick(id)}
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
        <strong>Name:</strong> {character.name} | <strong>Birth Year:</strong> {character.birth_year}
      </div>
    </div>
  );
};

export default Card;