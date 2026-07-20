import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the Main component so we don't trigger its lifecycle methods
vi.mock('./components/Main', () => ({
  default: () => <div data-testid="mock-main">Main Component</div>
}));

describe('App Component', () => {
  it('renders the Main component', () => {
    render(<App />);
    expect(screen.getByTestId('mock-main')).toBeInTheDocument();
  });
});
