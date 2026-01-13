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
const PageCrash = lazy(() => import('src/pages/home/crash'));
const PageCoinflip = lazy(() => import('src/pages/home/coinflip'));
const PagePlinko = lazy(() => import('src/pages/home/plinko'));
const PageFlowerPoker = lazy(() => import('src/pages/home/flowerpoker'));
const PageMine = lazy(() => import('src/pages/home/mine'));
const PageBlackJack = lazy(() => import('src/pages/home/blackjack'));
const PageWheel = lazy(() => import('src/pages/home/wheel'));
const PageDice = lazy(() => import('src/pages/home/dice'));
const PageDiamonds = lazy(() => import('src/pages/home/diamonds'));
const PageLimbo = lazy(() => import('src/pages/home/limbo'));
const PageKeno = lazy(() => import('src/pages/home/keno'));
const PageHilo = lazy(() => import('src/pages/home/hilo'));
const PageVideoPoker = lazy(() => import('src/pages/home/videopoker'));
const PageSlide = lazy(() => import('src/pages/home/slide'));
const PageBaccaratSingle = lazy(() => import('src/pages/home/baccarat_s'));
const PageBaccaratMulti = lazy(() => import('src/pages/home/baccarat_m'));
const PageGoal = lazy(() => import('src/pages/home/goal'));
const PageRoulette = lazy(() => import('src/pages/home/roulette'));
const PageHiloMulti = lazy(() => import('src/pages/home/hilo_m'));
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
      { path: 'crash', element: <PageCrash /> },
      { path: 'coinflip', element: <PageCoinflip /> },
      { path: 'plinko', element: <PagePlinko /> },
      { path: 'flowerpoker', element: <PageFlowerPoker /> },
      { path: 'mine', element: <PageMine /> },
      { path: 'blackjack', element: <PageBlackJack /> },
      { path: 'wheel', element: <PageWheel /> },
      { path: 'dice', element: <PageDice /> },
      { path: 'diamonds', element: <PageDiamonds /> },
      { path: 'limbo', element: <PageLimbo /> },
      { path: 'keno', element: <PageKeno /> },
      { path: 'hilo', element: <PageHilo /> },
      { path: 'videopoker', element: <PageVideoPoker /> },
      { path: 'slide', element: <PageSlide /> },
      { path: 'baccarat_single', element: <PageBaccaratSingle /> },
      { path: 'baccarat_multi', element: <PageBaccaratMulti /> },
      { path: 'goal', element: <PageGoal /> },
      { path: 'roulette', element: <PageRoulette /> },
      { path: 'hilo_multi', element: <PageHiloMulti /> },
    ],
  },
];
