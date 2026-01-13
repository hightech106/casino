/**
 * Authentication consumer component that initializes user data on app load.
 * Fetches user info, balance, active bonuses, and sports history when logged in.
 * Note: Shows splash screen during initialization and adds a 500ms delay before rendering children.
 */
// components
import { useEffect, useState } from 'react';
import { SplashScreen } from 'src/components/loading-screen';
import useApi from 'src/hooks/use-api';
import { useSelector, useDispatch } from 'src/store';
import { UpdateActiveBonus, UpdateBalanceInfo, UpdateInfo } from 'src/store/reducers/auth';
import { updateHistory } from 'src/store/reducers/sports';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthConsumer({ children }: Props) {
  const dispatch = useDispatch();
  const { initialize, get_sports_history } = useApi();
  const { isLoggedIn } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState<boolean>(true);

  const getMe = async () => {
    if (isLoggedIn) {
      const res = await initialize();
      if (!res?.data) return;
      dispatch(UpdateInfo(res.data.user));
      dispatch(UpdateBalanceInfo(res.data.balance));
      dispatch(UpdateActiveBonus(res.data.activeBonus));
      const history = await get_sports_history('Active');
      if (!history?.data) return;
      dispatch(updateHistory(history?.data));
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
  };

  useEffect(() => {
    getMe();
    // eslint-disable-next-line
  }, []);
  if (loading) return <SplashScreen />;
  return children;
}
