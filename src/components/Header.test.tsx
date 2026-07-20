import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
  it('renders the header with correct title', () => {
    render(<Header />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Star Wars Explorer');
  });

  it('renders the description', () => {
    render(<Header />);
    expect(screen.getByText('A strictly class-based React application.')).toBeInTheDocument();
  });
});
