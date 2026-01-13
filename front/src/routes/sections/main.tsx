/**
 * Main route configuration for public pages (FAQ, About Us, Privacy Policy, etc.).
 * Uses lazy loading for code splitting and wraps routes in GlobalLayout with Suspense.
 * Note: All routes are children of the root path and use the global layout wrapper.
 */
import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import GlobalLayout from 'src/layouts/global';
import { LoadingScreen } from 'src/components/loading-screen';

const FAQPage = lazy(() => import('src/pages/home/faq'));
const AboutUs = lazy(() => import('src/pages/home/aboutus'));
const PrivacyPolicy = lazy(() => import('src/pages/home/privacypolice'));
const Cookies = lazy(() => import('src/pages/home/cookies'));
const KycUpload = lazy(() => import('src/pages/home/kycUpload'));
const TermsPage = lazy(() => import('src/pages/home/terms'));

export const mainRoutes = [
  {
    path: '',
    element: (
      <GlobalLayout>
        <Suspense fallback={<LoadingScreen sx={{ height: "70vh" }} />}>
          <Outlet />
        </Suspense>
      </GlobalLayout>
    ),
    children: [
      { path: 'faq', element: <FAQPage /> },
      { path: 'aboutus', element: <AboutUs /> },
      { path: 'privacypolicy', element: <PrivacyPolicy /> },
      { path: 'cookies', element: <Cookies /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'kyc/upload', element: <KycUpload /> },
    ],
  },
];