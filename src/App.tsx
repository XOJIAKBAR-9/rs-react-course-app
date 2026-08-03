import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './components/Main';
import DetailView from './components/DetailView';
import About from './pages/About';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import Flyout from './components/Flyout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: 'details/:id',
        element: <DetailView />,
      },
    ],
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: '1' }}>
          <RouterProvider router={router} />
        </div>
        <Flyout />
      </div>
    </ErrorBoundary>
  );
};

export default App;