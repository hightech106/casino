import { Navigate, Outlet, useRoutes } from 'react-router-dom';

// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
import LangLayout from 'src/layouts/global/language';
//
import { mainRoutes } from './main';
import { userRoutes } from './user';
import { sportsRoutes } from './sports';
import { casinoRoutes } from './casino';

import { errorRoutes } from './error';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      index: true,
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },
    {
      path: '/:lang',
      element: (
        <LangLayout>
          <Outlet />
        </LangLayout>
      ),
      children: [
        {
          index: true,
          element: <Navigate to={PATH_AFTER_LOGIN} replace />,
        },
        ...mainRoutes,
        ...userRoutes,
        ...sportsRoutes,
        ...casinoRoutes,
        ...errorRoutes,
      ],
    },

    { path: '*', element: <Navigate to="/en/404" replace /> },
  ]);
}
