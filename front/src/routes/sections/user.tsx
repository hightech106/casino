import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// auth
import AuthGuard from 'src/utils/authguard';
// layouts
import UserLayout from 'src/layouts/user';
// components
import { LoadingScreen } from 'src/components/loading-screen'; 
// ----------------------------------------------------------------------

const AccountPage = lazy(() => import('src/pages/user/account'));
const MissionModalPage = lazy(() => import('src/pages/user/missions'));
const WalletPage = lazy(() => import('src/pages/user/wallet'));
const MySharesPage = lazy(() => import('src/pages/user/my-shares'));
const ReferralPage = lazy(() => import('src/pages/user/referral'));
const NotificationPage = lazy(() => import('src/pages/user/notification'));
const PasswordPage = lazy(() => import('src/pages/user/password'));
const SupportPage = lazy(() => import('src/pages/user/support'));
const MyBetsSportsPage = lazy(() => import('src/pages/user/my-bets/sports'));
const MyBetsCasinoPage = lazy(() => import('src/pages/user/my-bets/casino'));
const TicketPage = lazy(() => import('src/pages/user/ticket'));


export const userRoutes = [
  // Все пользовательские страницы с UserLayout и профильным сайдбаром
  {
    path: 'user',
    element: (
      <UserLayout>
        <AuthGuard>
          <Suspense fallback={<LoadingScreen sx={{ height: "70vh" }} />}>
            <Outlet />
          </Suspense>
        </AuthGuard>
      </UserLayout>
    ),
    children: [
      { path: 'account', element: <AccountPage /> },
      { path: 'missions',element: <MissionModalPage/> },
      { path: 'wallet', element: <WalletPage /> },
      { path: 'my-shares', element: <MySharesPage /> },
      // { path: 'wallet/bonus', element: <BonusViewPage /> },
      { path: 'notification', element: <NotificationPage /> },
      { path: 'referral', element: <ReferralPage /> },
      { path: 'password', element: <PasswordPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'ticket', element: <TicketPage /> },
      { path: 'my-bets/sports', element: <MyBetsSportsPage /> },
      { path: 'my-bets/casino', element: <MyBetsCasinoPage /> },
    ],
  },
];