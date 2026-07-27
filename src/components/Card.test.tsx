import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Card from './Card';
import { type Character } from '../types';

describe('Card Component', () => {
  const mockCharacter: Character = {
    name: 'Luke Skywalker',
    birth_year: '19BBY',
    url: 'https://swapi.dev/api/people/1/'
  };

  const mockOnClick = vi.fn();

  it('renders character name and birth year', () => {
    render(<Card character={mockCharacter} onClick={mockOnClick} />);
    expect(screen.getByText('Luke Skywalker', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('19BBY', { exact: false })).toBeInTheDocument();
    
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('Birth Year:')).toBeInTheDocument();
  });

  it('calls onClick with the correct ID when clicked', async () => {
    render(<Card character={mockCharacter} onClick={mockOnClick} />);
    const cardElement = screen.getByText('Luke Skywalker', { exact: false }).closest('div');
    if (cardElement) {
      await userEvent.click(cardElement);
    }
    expect(mockOnClick).toHaveBeenCalledWith('1');
  });
});

