import { Navigate, useRoutes } from 'react-router-dom';
//

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { erroRoutes } from './error';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    ...authRoutes,

    ...mainRoutes,

    ...erroRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
