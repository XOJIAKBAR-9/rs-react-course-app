import { getTranslations } from 'next-intl/server';
import { getCharacters, getCharacter } from '../../services/serverApi';
import Search from '../../components/Search';
import CardList from '../../components/CardList';
import Pagination from '../../components/Pagination';
import DetailView from '../../components/DetailView';
import { redirect } from 'next/navigation';

export default async function Page({
  searchParams,
  params
}: {
  searchParams: { search?: string; page?: string; details?: string };
  params: { locale: string };
}) {
  const { locale } = await params;
  const sParams = await searchParams;
  const t = await getTranslations('List');
  
  const initialSearch = sParams.search || '';
  const currentPage = parseInt(sParams.page || '1', 10);
  const detailId = sParams.details;

  let items = [];
  let totalItems = 0;
  let error: string | null = null;
  let detailData = null;
  let detailError = null;

  try {
    const data = await getCharacters(initialSearch, currentPage);
    items = data.results || [];
    totalItems = data.count || 0;
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  if (detailId) {
    try {
      detailData = await getCharacter(detailId);
    } catch (err: unknown) {
      detailError = err instanceof Error ? err.message : 'Unknown error';
    }
  }

  // Server action for handling search form
  async function searchAction(formData: FormData) {
    'use server';
    const searchTerm = formData.get('search')?.toString() || '';
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', '1');
    redirect(`/${locale}?${params.toString()}`);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <form action={searchAction}>
            <Search initialSearchTerm={initialSearch} />
          </form>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', minHeight: '500px' }}>
        {/* Left Side: Results List */}
        <div style={{ flex: '1', border: '2px solid var(--border-color, #333)', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0 }}>{t('results')}</h3>
          
          {error && (
            <div style={{ color: 'red', fontWeight: 'bold' }}>{t('error', { error })}</div>
          )}
          
          {!error && (
            <>
              <div style={{ flex: '1' }}>
                <CardList items={items} />
              </div>
              <Pagination 
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={10} 
              />
            </>
          )}
        </div>

        {/* Right Side: Detail View */}
        <div style={{ width: '350px' }}>
          {detailId && (
            <DetailView character={detailData} error={detailError} />
          )}
        </div>
      </div>
    </div>
  );
}
