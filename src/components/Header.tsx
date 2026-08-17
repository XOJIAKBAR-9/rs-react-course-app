'use client';
import React, { useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link, usePathname, useRouter } from '../i18n/routing';
import { useTheme } from '../hooks/useTheme';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <header style={{ borderBottom: '2px solid var(--border-color, #eee)', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Image src="/star_wars_about_logo.svg" alt="Logo" width={50} height={50} priority />
        <div>
          <h1 style={{ margin: 0 }}>Star Wars Explorer</h1>
          <p style={{ margin: '5px 0 0 0' }}>Next.js App Router</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <select 
          value={locale} 
          onChange={handleLocaleChange}
          disabled={isPending}
          style={{ padding: '5px', borderRadius: '4px' }}
        >
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </select>
        <button 
          onClick={toggleTheme} 
          style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid var(--border-color, #ccc)', background: 'var(--card-bg-hover, #fff)', color: 'var(--text-color, #000)' }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <nav>
          <Link href="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#007bff' }}>{t('home')}</Link>
          <Link href="/about" style={{ textDecoration: 'none', color: '#007bff' }}>{t('about')}</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;