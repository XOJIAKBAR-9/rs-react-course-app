import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { starWarsApi } from './api';

describe('API Services', () => {
  let store: any;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
    store = configureStore({
      reducer: {
        [starWarsApi.reducerPath]: starWarsApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(starWarsApi.middleware),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockFetchResponse = (ok: boolean, data: any, status = 200) => {
    (globalThis.fetch as any).mockResolvedValue({
      ok,
      status,
      headers: { get: () => 'application/json' },
      clone: function() { return this; },
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    });
  };

  describe('getCharacters endpoint', () => {
    it('calls the correct URL when no search term is provided', async () => {
      const mockResponse = { results: [] };
      mockFetchResponse(true, mockResponse);

      const action = await store.dispatch(starWarsApi.endpoints.getCharacters.initiate({}));
      const requestArg = (globalThis.fetch as any).mock.calls[0][0];
      expect(requestArg.url || requestArg).toContain('https://swapi.py4e.com/api/people/');
      expect(action.data).toEqual(mockResponse);
    });

    it('calls the correct URL with a search term', async () => {
      const mockResponse = { results: [{ name: 'Luke Skywalker' }] };
      mockFetchResponse(true, mockResponse);

      const action = await store.dispatch(starWarsApi.endpoints.getCharacters.initiate({ searchTerm: 'Luke Skywalker' }));
      const requestArg = (globalThis.fetch as any).mock.calls[0][0];
      expect(requestArg.url || requestArg).toContain('https://swapi.py4e.com/api/people/?search=Luke+Skywalker');
      expect(action.data).toEqual(mockResponse);
    });

    it('calls the correct URL with pagination', async () => {
      const mockResponse = { results: [] };
      mockFetchResponse(true, mockResponse);

      await store.dispatch(starWarsApi.endpoints.getCharacters.initiate({ page: 2 }));
      const requestArg = (globalThis.fetch as any).mock.calls[0][0];
      expect(requestArg.url || requestArg).toContain('https://swapi.py4e.com/api/people/?page=2');
    });

    it('handles errors correctly', async () => {
      mockFetchResponse(false, null, 404);

      const action = await store.dispatch(starWarsApi.endpoints.getCharacters.initiate({}));
      expect(action.error).toBeDefined();
    });
  });

  describe('getCharacter endpoint', () => {
    it('calls the correct URL to fetch a single character', async () => {
      const mockResponse = { name: 'Luke Skywalker' };
      mockFetchResponse(true, mockResponse);

      const action = await store.dispatch(starWarsApi.endpoints.getCharacter.initiate('1'));
      const requestArg = (globalThis.fetch as any).mock.calls[0][0];
      expect(requestArg.url || requestArg).toContain('https://swapi.py4e.com/api/people/1/');
      expect(action.data).toEqual(mockResponse);
    });
  });
});

