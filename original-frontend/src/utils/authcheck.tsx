// components
import { useEffect, useState } from 'react';
import { SplashScreen } from 'src/components/loading-screen';
import { useDispatch, useSelector } from 'src/store';
import { balanceAction, loginAction, realBalanceAction, setBaseUrl } from 'src/store/reducers/auth';
import useApi from 'src/hooks/use-api';
import { authenticateSockets, sockets } from './socket';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthConsumer({ children }: Props) {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const callback_url = params.get('getUser');
  const baseUrl = params.get('baseUrl');

  const dispatch = useDispatch();
  const { loginApi } = useApi();
  const { balance, realBalance, isLoggedIn } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState<boolean>(false);

  const getAccount = async () => {
    if (!token || !callback_url) return;
    console.log('🚀 ~ getAccount ~ token :', token);

    setLoading(true);
    console.log('🚀 ~ getAccount ~ callback_url:', callback_url, token);
    const res = await loginApi(token, callback_url);
    setLoading(false);
    if (!res?.data) return;
    dispatch(loginAction(res.data));
  };

  useEffect(() => {
    if (!baseUrl) return;
    dispatch(setBaseUrl(baseUrl));
  }, [baseUrl]);

  useEffect(() => {
    if (isLoggedIn) return;
    if (!token || !callback_url) return;

    getAccount();
    if (token) authenticateSockets(token);

    // eslint-disable-next-line
  }, [token, callback_url, isLoggedIn]);

  useEffect(() => {
    sockets.forEach((socket) => {
      socket.on('balance', (data: any) => {
        if (balance !== data.balance) dispatch(balanceAction(data.balance));
        if (realBalance !== data.realBalance) dispatch(realBalanceAction(data.realBalance));
      });
    });

    return () => {
      sockets.forEach((socket) => {
        socket.off('balance');
      });
    };
  }, []);

  if (loading) return <SplashScreen />;
  return children;
}
