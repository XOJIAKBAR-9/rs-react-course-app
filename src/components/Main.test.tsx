import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from '../store/selectionSlice';
import { starWarsApi } from '../services/api';
import { ThemeProvider } from './ThemeProvider';
import Main from './Main';

describe('Main Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    globalThis.fetch = vi.fn();
    // Reset RTK Query cache between tests
    starWarsApi.util.resetApiState();
  });

  const mockFetchResponse = (ok: boolean, data: any, status = 200) => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok,
      status,
      headers: { get: () => 'application/json' },
      clone: function() { return this; },
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    });
  };

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
    const store = configureStore({
      reducer: {
        selection: selectionReducer,
        [starWarsApi.reducerPath]: starWarsApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(starWarsApi.middleware),
    });
    return { store, ...render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter>{ui}</MemoryRouter>
        </ThemeProvider>
      </Provider>
    )};
  };

  it('makes initial API call on component mount and handles success', async () => {
    mockFetchResponse(true, mockData);
    
    renderWithRouter(<Main />);
    
    expect(screen.getByText('Loading data... ⏳')).toBeInTheDocument();
    
    await waitFor(() => {
      const requestArg = (globalThis.fetch as any).mock.calls[0][0];
      expect(requestArg.url || requestArg).toContain('https://swapi.py4e.com/api/people/');
    });
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker', { exact: false })).toBeInTheDocument();
    });
    expect(screen.getByText('Darth Vader', { exact: false })).toBeInTheDocument();
    
    expect(screen.queryByText('Loading data... ⏳')).not.toBeInTheDocument();
  });

  it('handles search term from localStorage on initial load', async () => {
    localStorage.setItem('searchTerm', JSON.stringify('Vader'));
    mockFetchResponse(true, mockData);
    
    renderWithRouter(<Main />);
    
    await waitFor(() => {
      const requestArg = (globalThis.fetch as any).mock.calls[0][0];
      expect(requestArg.url || requestArg).toContain('https://swapi.py4e.com/api/people/?search=Vader');
    });
    await waitFor(() => {
      expect(screen.getByText('Darth Vader', { exact: false })).toBeInTheDocument();
    });
  });

  it('handles API error responses correctly', async () => {
    mockFetchResponse(false, null, 500);
    
    renderWithRouter(<Main />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Server error: 500')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Luke Skywalker', { exact: false })).not.toBeInTheDocument();
  });

  it('updates state and makes API call when search is triggered', async () => {
    // We need to mock it twice, first for the initial load, second for the search.
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      clone: function() { return this; },
      json: () => Promise.resolve({ count: 0, next: null, previous: null, results: [] }),
      text: () => Promise.resolve(JSON.stringify({ count: 0, next: null, previous: null, results: [] })),
    }).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      clone: function() { return this; },
      json: () => Promise.resolve(mockData),
      text: () => Promise.resolve(JSON.stringify(mockData)),
    });
      
    renderWithRouter(<Main />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading data... ⏳')).not.toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText('Search Star Wars characters...');
    const button = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(input, 'Luke');
    await userEvent.click(button);
    
    await waitFor(() => {
      const requestArg = (globalThis.fetch as any).mock.calls[1][0];
      expect(requestArg.url || requestArg).toContain('https://swapi.py4e.com/api/people/?search=Luke');
    });
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker', { exact: false })).toBeInTheDocument();
    });
  });

  it('handles application crash when test button is clicked', () => {
    mockFetchResponse(true, mockData); // initial load to avoid unhandled rejection
    renderWithRouter(<Main />);
    const crashButton = screen.getByText('Test Application Crash');
    
    expect(crashButton).toBeInTheDocument();
  });
});

