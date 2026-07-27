import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCharacters, fetchCharacter } from './api';

describe('API Services', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchCharacters', () => {
    it('calls the correct URL when no search term is provided', async () => {
      const mockResponse = { results: [] };
      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const data = await fetchCharacters();
      expect(globalThis.fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/');
      expect(data).toEqual(mockResponse);
    });

    it('calls the correct URL with a search term', async () => {
      const mockResponse = { results: [{ name: 'Luke Skywalker' }] };
      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const data = await fetchCharacters('Luke Skywalker');
      expect(globalThis.fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/?search=Luke+Skywalker');
      expect(data).toEqual(mockResponse);
    });

    it('calls the correct URL with pagination', async () => {
      const mockResponse = { results: [] };
      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await fetchCharacters('', 2);
      expect(globalThis.fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/?page=2');
    });

    it('throws an error if the response is not ok', async () => {
      (globalThis.fetch as any).mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(fetchCharacters()).rejects.toThrow('Server error: 404');
    });
  });

  describe('fetchCharacter', () => {
    it('calls the correct URL to fetch a single character', async () => {
      const mockResponse = { name: 'Luke Skywalker' };
      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const data = await fetchCharacter('1');
      expect(globalThis.fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/1/');
      expect(data).toEqual(mockResponse);
    });
  });
});
