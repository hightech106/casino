import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import SportsLayout from 'src/layouts/sports';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/sports/home'));
const MatchDetailPage = lazy(() => import('src/pages/sports/match-detail'));
const LivePage = lazy(() => import('src/pages/sports/live'));
const DetailPage = lazy(() => import('src/pages/sports/detail'));
const LeaguePage = lazy(() => import('src/pages/sports/league'));

export const sportsRoutes = [
  {
    path: 'sports',
    element: (
      <SportsLayout>
        <Suspense fallback={<LoadingScreen  sx={{ height: "70vh" }} />}>
          <Outlet />
        </Suspense>
      </SportsLayout>
    ),
    children: [
      { element: <IndexPage />, index: true },
      // { path: 'live', element: <LivePage /> },
      { path: 'match/:id', element: <MatchDetailPage /> },
      // { path: ':sportsId/detail/:eventId', element: <DetailPage /> },
      // { path: ':sportsId', element: <LeaguePage /> },
    ],
  },
];
