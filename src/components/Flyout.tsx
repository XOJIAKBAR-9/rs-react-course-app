'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { unselectAll } from '../store/selectionSlice';

const Flyout: React.FC = () => {
  const selectedItems = useAppSelector(state => state.selection.items);
  const dispatch = useAppDispatch();
  const t = useTranslations('Flyout');

  if (selectedItems.length === 0) {
    return null;
  }

  const handleUnselectAll = () => {
    dispatch(unselectAll());
  };

  const ids = selectedItems.map(item => item.id).join(',');

  return (
    <div style={{
      position: 'sticky',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--header-bg, #f0f0f0)',
      padding: '15px 20px',
      borderTop: '2px solid var(--border-color, #ccc)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontWeight: 'bold' }}>
        {t('title')}: {selectedItems.length}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleUnselectAll}
          style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid var(--border-color, #ccc)', background: 'transparent', color: 'var(--text-color, #000)' }}
        >
          {t('unselectAll')}
        </button>
        <form action="/api/csv" method="POST">
          <input type="hidden" name="ids" value={ids} />
          <button 
            type="submit"
            style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: 'none', background: '#007bff', color: 'white', fontWeight: 'bold' }}
          >
            {t('downloadCSV')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Flyout;
