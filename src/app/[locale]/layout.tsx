import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import StoreProvider from '../../store/StoreProvider';
import Header from '../../components/Header';
import Flyout from '../../components/Flyout';
import ErrorBoundary from '../../components/ErrorBoundary';
import { ThemeProvider } from '../../components/ThemeProvider';
import '../../index.css'; // global css

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as string)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
            <ThemeProvider>
              <ErrorBoundary>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <div style={{ flex: '1' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
                      <Header />
                      {children}
                    </div>
                  </div>
                  <Flyout />
                </div>
              </ErrorBoundary>
            </ThemeProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
