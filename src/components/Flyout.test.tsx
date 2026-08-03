import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from '../store/selectionSlice';
import type { RootState } from '../store';
import Flyout from './Flyout';
import * as csv from '../utils/csv';

vi.mock('../utils/csv', () => ({
  generateCSV: vi.fn(),
}));

const mockItems = [
  { id: '1', name: 'Luke', birth_year: '19BBY', url: 'http://swapi.dev/api/people/1/' },
  { id: '2', name: 'Vader', birth_year: '41BBY', url: 'http://swapi.dev/api/people/4/' },
];

const renderWithProvider = (preloadedState?: RootState) => {
  const store = configureStore({
    reducer: {
      selection: selectionReducer,
    },
    preloadedState,
  });
  return { store, ...render(<Provider store={store}><Flyout /></Provider>) };
};

describe('Flyout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when no items are selected', () => {
    const { container } = renderWithProvider({ selection: { items: [] } });
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when items are selected', () => {
    renderWithProvider({ selection: { items: mockItems } });
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unselect all' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
  });

  it('handles "Unselect all" button click', async () => {
    const { store } = renderWithProvider({ selection: { items: mockItems } });
    const unselectButton = screen.getByRole('button', { name: 'Unselect all' });
    
    await userEvent.click(unselectButton);
    
    const state = store.getState();
    expect(state.selection.items).toHaveLength(0);
  });

  it('handles "Download" button click', async () => {
    renderWithProvider({ selection: { items: mockItems } });
    const downloadButton = screen.getByRole('button', { name: 'Download' });
    
    await userEvent.click(downloadButton);
    
    expect(csv.generateCSV).toHaveBeenCalledWith(
      [
        { ID: '1', Name: 'Luke', 'Birth Year': '19BBY', 'Details URL': 'http://swapi.dev/api/people/1/' },
        { ID: '2', Name: 'Vader', 'Birth Year': '41BBY', 'Details URL': 'http://swapi.dev/api/people/4/' }
      ],
      '2_items.csv'
    );
  });
});
