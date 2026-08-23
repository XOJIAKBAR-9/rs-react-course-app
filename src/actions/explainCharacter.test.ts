import { describe, it, expect, vi, beforeEach } from 'vitest';
import { explainCharacterAction } from './explainCharacter';
import * as aiService from '../services/ai';
import { type Character } from '../types';

vi.mock('../services/ai', () => ({
  explainCharacter: vi.fn(),
}));

describe('explainCharacterAction', () => {
  const mockCharacter: Character = {
    name: 'Luke',
    birth_year: '19BBY',
    url: 'https://swapi.dev/api/people/1/',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns success and text when service succeeds', async () => {
    vi.mocked(aiService.explainCharacter).mockResolvedValue('A famous Jedi.');

    const result = await explainCharacterAction(mockCharacter, 'en');
    
    expect(result).toEqual({ success: true, text: 'A famous Jedi.' });
    expect(aiService.explainCharacter).toHaveBeenCalledWith(mockCharacter, 'en');
  });

  it('handles MISSING_API_KEY error from service', async () => {
    vi.mocked(aiService.explainCharacter).mockRejectedValue(new Error('MISSING_API_KEY'));

    const result = await explainCharacterAction(mockCharacter, 'en');
    
    expect(result).toEqual({ success: false, errorKey: 'errorMissingKey' });
  });

  it('handles QUOTA_EXCEEDED error from service', async () => {
    vi.mocked(aiService.explainCharacter).mockRejectedValue(new Error('QUOTA_EXCEEDED'));

    const result = await explainCharacterAction(mockCharacter, 'en');
    
    expect(result).toEqual({ success: false, errorKey: 'errorQuota' });
  });

  it('handles BLOCKED error from service', async () => {
    vi.mocked(aiService.explainCharacter).mockRejectedValue(new Error('BLOCKED'));

    const result = await explainCharacterAction(mockCharacter, 'en');
    
    expect(result).toEqual({ success: false, errorKey: 'errorBlocked' });
  });

  it('handles generic unknown errors', async () => {
    vi.mocked(aiService.explainCharacter).mockRejectedValue(new Error('SOMETHING_ELSE'));

    const result = await explainCharacterAction(mockCharacter, 'en');
    
    expect(result).toEqual({ success: false, errorKey: 'errorGeneric' });
  });
  
  it('returns generic error if character is null', async () => {
    const result = await explainCharacterAction(null, 'en');
    
    expect(result).toEqual({ success: false, errorKey: 'errorGeneric' });
    expect(aiService.explainCharacter).not.toHaveBeenCalled();
  });
});
