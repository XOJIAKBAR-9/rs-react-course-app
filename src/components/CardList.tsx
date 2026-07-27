import React from 'react';
import Card from './Card';
import { type Character } from '../types';

interface Props {
  items: Character[];
  onItemClick: (id: string) => void;
}

const CardList: React.FC<Props> = ({ items, onItemClick }) => {
  if (items.length === 0) return <p>No results found.</p>;

  return (
    <div>
      {items.map((item) => (
        <Card key={item.url} character={item} onClick={onItemClick} />
      ))}
    </div>
  );
};

export default CardList;