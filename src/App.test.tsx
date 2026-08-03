import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from './store/selectionSlice';
import { ThemeProvider } from './components/ThemeProvider';
import App from './App';

// Mock the Main component so we don't trigger its lifecycle methods
vi.mock('./components/Main', () => ({
  default: () => <div data-testid="mock-main">Main Component</div>
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      selection: selectionReducer,
    },
  });
  return render(
    <Provider store={store}>
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    </Provider>
  );
};

describe('App Component', () => {
  it('renders the Main component', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('mock-main')).toBeInTheDocument();
  });
});
