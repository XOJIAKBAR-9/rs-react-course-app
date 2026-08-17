'use client';
import React from 'react';
import Card from './Card';
import { type Character } from '../types';

interface Props {
  items: Character[];
}

const CardList: React.FC<Props> = ({ items }) => {
  if (items.length === 0) return <p>No results found.</p>;

  return (
    <div>
      {items.map((item) => (
        <Card key={item.url} character={item} />
      ))}
    </div>
  );
};

export default CardList;