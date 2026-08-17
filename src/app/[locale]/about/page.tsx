import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>{t('title')}</h1>
      
      <div style={{ margin: '30px 0' }}>
        <Image 
          src="/star_wars_about_logo.svg" 
          alt="App Logo" 
          width={300} 
          height={300} 
          style={{ borderRadius: '10px', objectFit: 'cover' }}
          priority
        />
      </div>

      <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>{t('content')}</p>
    </div>
  );
}
