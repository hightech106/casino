import { ReactElement, useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useSelector, useDispatch } from 'src/store';

type GuardProps = {
  children: ReactElement | null;
};

const AuthGuard = ({ children }: GuardProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(paths.auth.login);
    }
  }, [isLoggedIn, dispatch, router]);

  return children;
};

export default AuthGuard;
