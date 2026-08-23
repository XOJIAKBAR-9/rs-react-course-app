'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '../i18n/routing';
import { useSearchParams } from 'next/navigation';
import { type Character } from '../types';
import { explainCharacterAction } from '../actions/explainCharacter';

interface Props {
  character?: Character | null;
  error?: string | null;
}

const DetailView: React.FC<Props> = ({ character, error }) => {
  const t = useTranslations('Details');
  const tAI = useTranslations('AI');
  const locale = useLocale();
  const searchParams = useSearchParams();
  
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);

  // Reset AI state when character or locale changes
  useEffect(() => {
    setExplanation(null);
    setExplainError(null);
    setIsExplaining(false);
  }, [character?.url, locale]);

  const params = new URLSearchParams(searchParams.toString());
  params.delete('details');

  const handleExplain = async () => {
    if (!character || isExplaining) return;
    setIsExplaining(true);
    setExplainError(null);
    
    const result = await explainCharacterAction(character, locale);
    
    if (result.success) {
      setExplanation(result.text);
    } else {
      setExplainError(tAI(result.errorKey));
    }
    
    setIsExplaining(false);
  };

  return (
    <div style={{ padding: '20px', borderLeft: '2px solid var(--border-color, #ccc)', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>{t('title')}</h3>
        <Link 
          href={`?${params.toString()}`} 
          style={{ padding: '5px 10px', cursor: 'pointer', textDecoration: 'none', color: 'inherit', border: '1px solid var(--border-color, #ccc)', borderRadius: '4px' }}
        >
          {t('close')}
        </Link>
      </div>
      
      {error && (
        <div style={{ color: 'red', fontWeight: 'bold' }}>{t('error', { error })}</div>
      )}

      {character && !error && (
        <div>
          <h4>{character.name}</h4>
          <p><strong>{t('birthYear')}:</strong> {character.birth_year}</p>
          <p><strong>{t('gender')}:</strong> {character.gender}</p>
          <p><strong>{t('height')}:</strong> {character.height} cm</p>
          <p><strong>{t('mass')}:</strong> {character.mass} kg</p>
          <p><strong>{t('hairColor')}:</strong> {character.hair_color}</p>
          <p><strong>{t('eyeColor')}:</strong> {character.eye_color}</p>

          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid var(--border-color, #eee)', borderRadius: '8px', backgroundColor: 'var(--bg-secondary, #f9f9f9)' }}>
            {!explanation && !isExplaining && !explainError && (
              <button 
                onClick={handleExplain}
                style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                {tAI('explainButton')}
              </button>
            )}

            {isExplaining && (
              <div style={{ color: '#666', fontStyle: 'italic' }}>
                {tAI('pending')}
              </div>
            )}

            {explainError && !isExplaining && (
              <div>
                <div style={{ color: '#e00', marginBottom: '10px' }}>{explainError}</div>
                <button 
                  onClick={handleExplain}
                  style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#e00', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  {tAI('retry')}
                </button>
              </div>
            )}

            {explanation && !isExplaining && (
              <div>
                <p style={{ lineHeight: '1.5', marginTop: 0 }}>{explanation}</p>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '10px', fontStyle: 'italic' }}>
                  {tAI('notice')}
                </div>
                <button 
                  onClick={handleExplain}
                  style={{ marginTop: '10px', padding: '6px 12px', cursor: 'pointer', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  {tAI('regenerate')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailView;
