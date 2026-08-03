import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from '../store/selectionSlice';
import Card from './Card';
import { type Character } from '../types';

const renderWithProvider = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      selection: selectionReducer,
    },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('Card Component', () => {
  const mockCharacter: Character = {
    name: 'Luke Skywalker',
    birth_year: '19BBY',
    url: 'https://swapi.dev/api/people/1/'
  };

  const mockOnClick = vi.fn();

  it('renders character name and birth year', () => {
    renderWithProvider(<Card character={mockCharacter} onClick={mockOnClick} />);
    expect(screen.getByText('Luke Skywalker', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('19BBY', { exact: false })).toBeInTheDocument();
    
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('Birth Year:')).toBeInTheDocument();
  });

  it('calls onClick with the correct ID when clicked', async () => {
    renderWithProvider(<Card character={mockCharacter} onClick={mockOnClick} />);
    const cardElement = screen.getByText('Luke Skywalker', { exact: false }).closest('div');
    if (cardElement) {
      await userEvent.click(cardElement);
    }
    expect(mockOnClick).toHaveBeenCalledWith('1');
  });
});
