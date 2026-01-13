import { lazy } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import CompactLayout from 'src/layouts/compact';

// ----------------------------------------------------------------------

const Page403 = lazy(() => import('src/pages/403'));
const Page404 = lazy(() => import('src/pages/404'));
const Page500 = lazy(() => import('src/pages/500'));

// ----------------------------------------------------------------------

export const erroRoutes = [
    {
        element: (
            <CompactLayout>
                <Outlet />
            </CompactLayout>
        ),
        children: [
            { path: '403', element: <Page403 /> },
            { path: '404', element: <Page404 /> },
            { path: '500', element: <Page500 /> },
        ],
    },
];