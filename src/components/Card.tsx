import React from 'react';
import { type Character } from '../types';

interface Props {
  character: Character;
  onClick: (id: string) => void;
}

const Card: React.FC<Props> = ({ character, onClick }) => {
  // Extract ID from SWAPI URL (e.g. "https://swapi.dev/api/people/1/")
  const idMatch = character.url.match(/\/people\/(\d+)\//);
  const id = idMatch ? idMatch[1] : '';

  return (
    <div 
      onClick={() => onClick(id)}
      style={{ border: '1px solid #ddd', margin: '10px 0', padding: '15px', cursor: 'pointer', borderRadius: '4px', transition: 'background-color 0.2s' }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <strong>Name:</strong> {character.name} | <strong>Birth Year:</strong> {character.birth_year}
    </div>
  );
};

export default Card;