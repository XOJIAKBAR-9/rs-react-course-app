import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DetailView from './DetailView';
import * as api from '../services/api';

vi.mock('../services/api', () => ({
  fetchCharacter: vi.fn(),
}));

describe('DetailView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (ui: React.ReactElement, initialEntry = '/details/1') => {
    return render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/details/:id" element={ui} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
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
    
    vi.mocked(api.fetchCharacter).mockResolvedValueOnce(mockCharacter);
    
    renderWithRouter(<DetailView />);
    
    expect(screen.getByText('Loading details... ⏳')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });
    
    expect(screen.getByText('19BBY', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('blond', { exact: false })).toBeInTheDocument();
  });

  it('handles API errors', async () => {
    vi.mocked(api.fetchCharacter).mockRejectedValueOnce(new Error('Failed to fetch'));
    
    renderWithRouter(<DetailView />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
    });
  });

  it('navigates to home when close button is clicked', async () => {
    vi.mocked(api.fetchCharacter).mockResolvedValueOnce({ name: 'Luke', birth_year: '19BBY', url: '' } as import('../types').Character);
    
    renderWithRouter(<DetailView />);
    
    const closeBtn = screen.getByRole('button', { name: 'Close' });
    await userEvent.click(closeBtn);
    
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});
