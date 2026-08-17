import { useTranslations } from 'next-intl';
import { Link } from '../../i18n/routing';

export default function NotFoundPage() {
  const t = useTranslations('NotFound');

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        {t('backHome')}
      </Link>
    </div>
  );
}
