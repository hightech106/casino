import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import AuthGuard from 'src/utils/authguard';
// layouts
import GlobalLayout from 'src/layouts/global';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/home'));
const PageKeno = lazy(() => import('src/pages/home/keno'));
const PageHistory = lazy(() => import('src/pages/home/history'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    path: '/',
    element: (
      <GlobalLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </GlobalLayout>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'history', element: <PageHistory /> },
      { path: 'keno', element: <PageKeno /> },
    ],
  },
];
