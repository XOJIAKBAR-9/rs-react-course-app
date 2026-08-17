'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '../i18n/routing';
import { useSearchParams } from 'next/navigation';
import { type Character } from '../types';

interface Props {
  character?: Character | null;
  error?: string | null;
}

const DetailView: React.FC<Props> = ({ character, error }) => {
  const t = useTranslations('Details');
  const searchParams = useSearchParams();
  
  const params = new URLSearchParams(searchParams.toString());
  params.delete('details');

  return (
    <div style={{ padding: '20px', borderLeft: '2px solid var(--border-color, #ccc)', height: '100%' }}>
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
        </div>
      )}
    </div>
  );
};

export default DetailView;
