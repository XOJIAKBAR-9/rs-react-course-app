import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import Header from './Header';

describe('Header Component', () => {
  it('renders the header with correct title', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </MemoryRouter>
    );
    const titleElement = screen.getByText('Star Wars Explorer');
    expect(titleElement).toBeInTheDocument();
    
    // Links should be present
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </MemoryRouter>
    );
    const descElement = screen.getByText(/A React hooks application/i);
    expect(descElement).toBeInTheDocument();
  });
});
