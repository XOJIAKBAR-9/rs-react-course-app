'use server';

import { type Character } from '../types';
import { explainCharacter as aiExplainCharacter } from '../services/ai';

export type ExplainResponse = 
  | { success: true; text: string }
  | { success: false; errorKey: 'errorMissingKey' | 'errorQuota' | 'errorBlocked' | 'errorGeneric' };

export async function explainCharacterAction(character: Character | null, locale: string): Promise<ExplainResponse> {
  if (!character) {
    return { success: false, errorKey: 'errorGeneric' };
  }

  try {
    const text = await aiExplainCharacter(character, locale);
    return { success: true, text };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    switch (message) {
      case 'MISSING_API_KEY':
        return { success: false, errorKey: 'errorMissingKey' };
      case 'QUOTA_EXCEEDED':
        return { success: false, errorKey: 'errorQuota' };
      case 'BLOCKED':
        return { success: false, errorKey: 'errorBlocked' };
      default:
        return { success: false, errorKey: 'errorGeneric' };
    }
  }
}
