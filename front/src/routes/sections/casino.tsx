import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import CasinoLayout from 'src/layouts/casino';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/casino/home'));
const JackpotPage = lazy(() => import('src/pages/casino/jackpot'));
const MegaWaysPage = lazy(() => import('src/pages/casino/megaways'));
const TournamentPage = lazy(() => import('src/pages/casino/tournament'));
const CategoryPage = lazy(() => import('src/pages/casino/category'));
const VendorPage = lazy(() => import('src/pages/casino/vendor'));
const TopGamesPage = lazy(() => import('src/pages/casino/top_games'));
const FastGamesPage = lazy(() => import('src/pages/casino/fast_games'));
const PlayPage = lazy(() => import('src/pages/casino/play'));
const JourneyPage = lazy(() => import('src/pages/casino/journey'));
const PromotionPage = lazy(() => import('src/pages/casino/promotion'));
const PromotionDetailPage = lazy(() => import('src/pages/casino/promotion_detail'));
const LiveCasinoPage = lazy(() => import('src/pages/casino/live-casino'));
const LiveCasinoAllView = lazy(() => import('src/pages/casino/all_casino_views'));
const LeaderboardPage = lazy(() => import('src/pages/casino/leaderboard'));
const OriginalGamePage = lazy(() => import('src/pages/casino/original'));

const BlogPage = lazy(() => import('src/pages/home/blog'));
const TermsPage = lazy(() => import('src/pages/home/terms'));
const SupportPage = lazy(() => import('src/pages/home/support'));

export const casinoRoutes = [
  {
    path: 'casino',
    element: (
      <CasinoLayout>
        <Suspense fallback={<LoadingScreen sx={{ height: '70vh' }} />}>
          <Outlet />
        </Suspense>
      </CasinoLayout> 
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'signup', element: <IndexPage /> },
      { path: 'signin', element: <IndexPage /> },
      { path: 'spin', element: <IndexPage /> },
      { path: 'journey', element: <JourneyPage /> },
      { path: 'promotion', element: <PromotionPage /> },
      { path: 'promotion/:id', element: <PromotionDetailPage /> },
      { path: 'promotion/daily-wheel', element: <IndexPage /> },
      { path: 'jackpot', element: <JackpotPage /> },
      { path: 'megaways', element: <MegaWaysPage /> },
      { path: 'tournament', element: <TournamentPage /> },
      { path: 'leaderboard', element: <LeaderboardPage /> },
      { path: 'original', element: <OriginalGamePage /> },

      { path: ':type/:provider_code', element: <CategoryPage /> },
      { path: ':vendor', element: <VendorPage /> },
      { path: 'top_games', element: <TopGamesPage /> },
      { path: 'fast_games', element: <FastGamesPage /> },
      { path: 'live-casino', element: <LiveCasinoAllView /> },
      {
        path: ':type/:provider_code/:game_name/:game_code/play',
        element: <PlayPage />,
      },
      { path: ':category', element: <LiveCasinoPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'support', element: <SupportPage /> },
    ],
  },
];
