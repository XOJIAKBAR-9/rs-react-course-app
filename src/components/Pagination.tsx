'use client';
import React from 'react';
import { Link } from '../i18n/routing';
import { useSearchParams } from 'next/navigation';

interface Props {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<Props> = ({ currentPage, totalItems, itemsPerPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `?${params.toString()}`;
  };

  return (
    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
      {currentPage > 1 && (
        <Link 
          href={createPageUrl(currentPage - 1)}
          style={{ padding: '8px 12px', border: '1px solid var(--border-color, #ccc)', borderRadius: '4px', textDecoration: 'none', color: 'inherit' }}
        >
          Previous
        </Link>
      )}
      
      <span style={{ padding: '8px 12px' }}>
        Page {currentPage} of {totalPages}
      </span>
      
      {currentPage < totalPages && (
        <Link 
          href={createPageUrl(currentPage + 1)}
          style={{ padding: '8px 12px', border: '1px solid var(--border-color, #ccc)', borderRadius: '4px', textDecoration: 'none', color: 'inherit' }}
        >
          Next
        </Link>
      )}
    </div>
  );
};

export default Pagination;
