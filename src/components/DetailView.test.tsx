import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { starWarsApi } from '../services/api';
import DetailView from './DetailView';

describe('DetailView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
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

  const renderWithRouter = (ui: React.ReactElement, initialEntry = '/details/1') => {
    const store = configureStore({
      reducer: {
        [starWarsApi.reducerPath]: starWarsApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(starWarsApi.middleware),
    });

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/details/:id" element={ui} />
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders loading state initially and then displays character details', async () => {
    const mockCharacter = {
      name: 'Luke Skywalker',
      birth_year: '19BBY',
      gender: 'male',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      eye_color: 'blue',
      url: 'https://swapi.dev/api/people/1/'
    };
    
    mockFetchResponse(true, mockCharacter);
    
    renderWithRouter(<DetailView />);
    
    expect(screen.getByText('Loading details... ⏳')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });
    
    expect(screen.getByText('19BBY', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('blond', { exact: false })).toBeInTheDocument();
  });

  it('handles API errors', async () => {
    mockFetchResponse(false, null, 500);
    
    renderWithRouter(<DetailView />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Server error: 500')).toBeInTheDocument();
    });
  });

  it('navigates to home when close button is clicked', async () => {
    mockFetchResponse(true, { name: 'Luke', birth_year: '19BBY', url: '' });
    
    renderWithRouter(<DetailView />);
    
    const closeBtn = screen.getByRole('button', { name: 'Close' });
    await userEvent.click(closeBtn);
    
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});

