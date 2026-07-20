import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCharacters } from './api';

describe('fetchCharacters', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('calls the correct URL with no search term', async () => {
    const mockResponse = { results: [] };
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const data = await fetchCharacters();
    expect(globalThis.fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/');
    expect(data).toEqual(mockResponse);
  });

  it('calls the correct URL with a search term', async () => {
    const mockResponse = { results: [] };
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const data = await fetchCharacters('Luke Skywalker');
    expect(globalThis.fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/?search=Luke%20Skywalker');
    expect(data).toEqual(mockResponse);
  });

  it('throws an error when response is not ok', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await expect(fetchCharacters()).rejects.toThrow('Server error: 404');
  });
});
