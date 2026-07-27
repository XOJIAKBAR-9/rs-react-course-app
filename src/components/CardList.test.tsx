import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardList from './CardList';
import { type Character } from '../types';

describe('CardList Component', () => {
  const mockItems: Character[] = [
    {
      name: 'Luke Skywalker',
      birth_year: '19BBY',
      url: 'https://swapi.dev/api/people/1/'
    },
    {
      name: 'C-3PO',
      birth_year: '112BBY',
      url: 'https://swapi.dev/api/people/2/'
    }
  ];

  const mockOnItemClick = vi.fn();

  it('renders correct number of items when data is provided', () => {
    render(<CardList items={mockItems} onItemClick={mockOnItemClick} />);
    expect(screen.getByText('Luke Skywalker', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('C-3PO', { exact: false })).toBeInTheDocument();
    const nameLabels = screen.getAllByText('Name:');
    expect(nameLabels).toHaveLength(2);
  });

  it('displays "No results found." message when data array is empty', () => {
    render(<CardList items={[]} onItemClick={mockOnItemClick} />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });
});

