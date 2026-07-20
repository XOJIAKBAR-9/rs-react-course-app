import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from './Card';
import { type Character } from '../types';

describe('Card Component', () => {
  const mockCharacter: Character = {
    name: 'Luke Skywalker',
    birth_year: '19BBY',
    url: 'https://swapi.dev/api/characters/1/'
  };

  it('renders character name and birth year', () => {
    render(<Card character={mockCharacter} />);
    expect(screen.getByText('Luke Skywalker', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('19BBY', { exact: false })).toBeInTheDocument();
    
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('Birth Year:')).toBeInTheDocument();
  });
});
