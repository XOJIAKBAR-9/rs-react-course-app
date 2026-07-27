import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Main from './Main';
import * as api from '../services/api';

vi.mock('../services/api', () => ({
  fetchCharacters: vi.fn(),
}));

describe('Main Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const mockData = {
    count: 2,
    next: null,
    previous: null,
    results: [
      {
        name: 'Luke Skywalker',
        birth_year: '19BBY',
        url: 'https://swapi.dev/api/characters/1/'
      },
      {
        name: 'Darth Vader',
        birth_year: '41.9BBY',
        url: 'https://swapi.dev/api/characters/4/'
      }
    ]
  };

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it('makes initial API call on component mount and handles success', async () => {
    vi.mocked(api.fetchCharacters).mockResolvedValueOnce(mockData);
    
    renderWithRouter(<Main />);
    
    expect(screen.getByText('Loading data... ⏳')).toBeInTheDocument();
    
    expect(api.fetchCharacters).toHaveBeenCalledWith('', 1);
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker', { exact: false })).toBeInTheDocument();
    });
    expect(screen.getByText('Darth Vader', { exact: false })).toBeInTheDocument();
    
    expect(screen.queryByText('Loading data... ⏳')).not.toBeInTheDocument();
  });

  it('handles search term from localStorage on initial load', async () => {
    localStorage.setItem('searchTerm', JSON.stringify('Vader'));
    vi.mocked(api.fetchCharacters).mockResolvedValueOnce(mockData);
    
    renderWithRouter(<Main />);
    
    expect(api.fetchCharacters).toHaveBeenCalledWith('Vader', 1);
    await waitFor(() => {
      expect(screen.getByText('Darth Vader', { exact: false })).toBeInTheDocument();
    });
  });

  it('handles API error responses correctly', async () => {
    vi.mocked(api.fetchCharacters).mockRejectedValueOnce(new Error('Server error: 500'));
    
    renderWithRouter(<Main />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Server error: 500')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Luke Skywalker', { exact: false })).not.toBeInTheDocument();
  });

  it('updates state and makes API call when search is triggered', async () => {
    vi.mocked(api.fetchCharacters)
      .mockResolvedValueOnce({ count: 0, next: null, previous: null, results: [] }) // initial load
      .mockResolvedValueOnce(mockData); // search load
      
    renderWithRouter(<Main />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading data... ⏳')).not.toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText('Search Star Wars characters...');
    const button = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(input, 'Luke');
    await userEvent.click(button);
    
    expect(api.fetchCharacters).toHaveBeenCalledWith('Luke', 1);
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker', { exact: false })).toBeInTheDocument();
    });
  });

  it('handles application crash when test button is clicked', () => {
    renderWithRouter(<Main />);
    const crashButton = screen.getByText('Test Application Crash');
    
    expect(crashButton).toBeInTheDocument();
  });
});

