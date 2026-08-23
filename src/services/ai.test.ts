import { describe, it, expect, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import { buildCharacterContext } from './ai';
import { type Character } from '../types';

describe('ai service - buildCharacterContext', () => {
  it('allowlists only specific fields and serializes correctly', () => {
    const character: Character & { secret?: string } = {
      name: 'Luke Skywalker',
      birth_year: '19BBY',
      height: '172',
      mass: '77',
      gender: 'male',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      url: 'https://swapi.dev/api/people/1/',
      secret: 'hidden value',
    };

    const contextStr = buildCharacterContext(character);
    const parsed = JSON.parse(contextStr);

    // Should include these
    expect(parsed.name).toBe('Luke Skywalker');
    expect(parsed.birth_year).toBe('19BBY');
    
    // Should exclude `url` and `secret`
    expect(parsed.url).toBeUndefined();
    expect(parsed.secret).toBeUndefined();
    
    // Should have exactly 8 properties (the ones we allowlisted)
    expect(Object.keys(parsed).length).toBe(8);
  });

  it('throws an error if context size is 4KB or larger', () => {
    // Generate a massive string
    const giantString = 'A'.repeat(5000);
    const character: Character = {
      name: giantString,
      birth_year: '19BBY',
      url: 'https://swapi.dev/api/people/1/',
    };

    expect(() => buildCharacterContext(character)).toThrow('CONTEXT_TOO_LARGE');
  });
});
