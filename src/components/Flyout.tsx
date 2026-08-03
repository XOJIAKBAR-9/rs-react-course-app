import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { unselectAll } from '../store/selectionSlice';
import { generateCSV } from '../utils/csv';

const Flyout: React.FC = () => {
  const selectedItems = useAppSelector(state => state.selection.items);
  const dispatch = useAppDispatch();

  if (selectedItems.length === 0) {
    return null;
  }

  const handleDownload = () => {
    // Format data for CSV
    const csvData = selectedItems.map(item => ({
      ID: item.id,
      Name: item.name,
      'Birth Year': item.birth_year,
      'Details URL': item.url
    }));
    generateCSV(csvData, `${selectedItems.length}_items.csv`);
  };

  const handleUnselectAll = () => {
    dispatch(unselectAll());
  };

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
        {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
      </div>
      <div>
        <button 
          onClick={handleUnselectAll}
          style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid var(--border-color, #ccc)', background: 'transparent', color: 'var(--text-color, #000)' }}
        >
          Unselect all
        </button>
        <button 
          onClick={handleDownload}
          style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: 'none', background: '#007bff', color: 'white', fontWeight: 'bold' }}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default Flyout;
