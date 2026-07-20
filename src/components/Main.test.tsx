import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

  it('makes initial API call on component mount and handles success', async () => {
    vi.mocked(api.fetchCharacters).mockResolvedValueOnce(mockData);
    
    render(<Main />);
    
    expect(screen.getByText('Loading data... ⏳')).toBeInTheDocument();
    
    expect(api.fetchCharacters).toHaveBeenCalledWith('');
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker', { exact: false })).toBeInTheDocument();
    });
    expect(screen.getByText('Darth Vader', { exact: false })).toBeInTheDocument();
    
    expect(screen.queryByText('Loading data... ⏳')).not.toBeInTheDocument();
  });

  it('handles search term from localStorage on initial load', async () => {
    localStorage.setItem('searchTerm', 'Vader');
    vi.mocked(api.fetchCharacters).mockResolvedValueOnce(mockData);
    
    render(<Main />);
    
    expect(api.fetchCharacters).toHaveBeenCalledWith('Vader');
    await waitFor(() => {
      expect(screen.getByText('Darth Vader', { exact: false })).toBeInTheDocument();
    });
  });

  it('handles API error responses correctly', async () => {
    vi.mocked(api.fetchCharacters).mockRejectedValueOnce(new Error('Server error: 500'));
    
    render(<Main />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Server error: 500')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Luke Skywalker', { exact: false })).not.toBeInTheDocument();
  });

  it('updates state and makes API call when search is triggered', async () => {
    vi.mocked(api.fetchCharacters)
      .mockResolvedValueOnce({ count: 0, next: null, previous: null, results: [] }) // initial load
      .mockResolvedValueOnce(mockData); // search load
      
    render(<Main />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading data... ⏳')).not.toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText('Search Star Wars characters...');
    const button = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(input, 'Luke');
    await userEvent.click(button);
    
    expect(api.fetchCharacters).toHaveBeenCalledWith('Luke');
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker', { exact: false })).toBeInTheDocument();
    });
  });

  it('handles application crash when test button is clicked', () => {
    render(<Main />);
    const crashButton = screen.getByText('Test Application Crash');
    
    expect(crashButton).toBeInTheDocument();
  });
});
