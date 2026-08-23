import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DetailView from './DetailView';
import { explainCharacterAction } from '../actions/explainCharacter';

// Mock the action
vi.mock('../actions/explainCharacter', () => ({
  explainCharacterAction: vi.fn(),
}));

// Mock next-intl and next/navigation
vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string, values?: Record<string, unknown>) => {
    if (values) return `${namespace}.${key} ${JSON.stringify(values)}`;
    return `${namespace}.${key}`;
  },
  useLocale: () => 'en',
}));

vi.mock('../i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a>,
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('?details=1'),
}));

const mockCharacter = {
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  eye_color: 'blue',
  url: 'https://swapi.dev/api/people/1/',
};

describe('DetailView AI Explanation', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the Explain with AI button', () => {
    render(<DetailView character={mockCharacter} />);
    expect(screen.getByText('AI.explainButton')).toBeInTheDocument();
  });

  it('shows pending state when request starts, and success state when done', async () => {
    vi.mocked(explainCharacterAction).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true, text: 'A famous Jedi.' }), 100))
    );

    render(<DetailView character={mockCharacter} />);
    
    const explainBtn = screen.getByText('AI.explainButton');
    fireEvent.click(explainBtn);

    // Should show pending
    expect(screen.getByText('AI.pending')).toBeInTheDocument();
    
    // Original button should disappear
    expect(screen.queryByText('AI.explainButton')).not.toBeInTheDocument();

    // Wait for resolution
    await waitFor(() => {
      expect(screen.getByText('A famous Jedi.')).toBeInTheDocument();
    });

    // Should show the AI notice
    expect(screen.getByText('AI.notice')).toBeInTheDocument();
    
    // Should show the regenerate button
    expect(screen.getByText('AI.regenerate')).toBeInTheDocument();
  });

  it('shows recoverable error state on failure', async () => {
    vi.mocked(explainCharacterAction).mockResolvedValue({ success: false, errorKey: 'errorQuota' });

    render(<DetailView character={mockCharacter} />);
    
    fireEvent.click(screen.getByText('AI.explainButton'));

    await waitFor(() => {
      // Shows translated error key
      expect(screen.getByText('AI.errorQuota')).toBeInTheDocument();
    });

    // Should show retry button
    expect(screen.getByText('AI.retry')).toBeInTheDocument();
  });
});
