import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Search from './Search';

describe('Search Component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    localStorage.clear();
  });

  it('renders search input and button', () => {
    render(<Search onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText('Search Star Wars characters...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('retrieves saved search term from localStorage on mount', () => {
    localStorage.setItem('searchTerm', 'Luke');
    render(<Search onSearch={mockOnSearch} />);
    expect(screen.getByDisplayValue('Luke')).toBeInTheDocument();
  });

  it('shows empty input when no saved term exists', () => {
    render(<Search onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText('Search Star Wars characters...')).toHaveValue('');
  });

  it('updates input value when user types', async () => {
    render(<Search onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search Star Wars characters...');
    await userEvent.type(input, 'Vader');
    expect(input).toHaveValue('Vader');
  });

  it('saves search term to localStorage and calls onSearch when button is clicked', async () => {
    render(<Search onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search Star Wars characters...');
    await userEvent.type(input, 'Leia');
    
    const button = screen.getByRole('button', { name: /search/i });
    await userEvent.click(button);

    expect(localStorage.getItem('searchTerm')).toBe('Leia');
    expect(mockOnSearch).toHaveBeenCalledWith('Leia');
  });

  it('trims whitespace from search input before saving', async () => {
    render(<Search onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search Star Wars characters...');
    await userEvent.type(input, '  Han  ');
    
    const button = screen.getByRole('button', { name: /search/i });
    await userEvent.click(button);

    expect(localStorage.getItem('searchTerm')).toBe('Han');
    expect(mockOnSearch).toHaveBeenCalledWith('Han');
  });

  it('does not trigger onSearch if the trimmed term is the same as the last searched term', async () => {
    localStorage.setItem('searchTerm', 'Yoda');
    render(<Search onSearch={mockOnSearch} />);
    
    const button = screen.getByRole('button', { name: /search/i });
    await userEvent.click(button);

    expect(mockOnSearch).not.toHaveBeenCalled();

    const input = screen.getByPlaceholderText('Search Star Wars characters...');
    await userEvent.type(input, '  ');
    await userEvent.click(button);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});
