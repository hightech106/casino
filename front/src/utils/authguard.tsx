/**
 * Route guard component that protects authenticated routes.
 * Redirects to login page if user is not logged in, using browser back navigation.
 * Note: Changes menu state to 'login' when redirecting unauthenticated users.
 */
import { useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
import { useSelector, useDispatch } from 'src/store';
import { ChangePage } from 'src/store/reducers/menu';
import type { GuardProps } from 'src/types';

const AuthGuard = ({ children }: GuardProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoggedIn) {
      router.back();
      dispatch(ChangePage('login'));
    }
  }, [isLoggedIn, dispatch, router]);

  return children;
};

export default AuthGuard;
