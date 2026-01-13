import { createSlice } from '@reduxjs/toolkit';
import { InitialAuthContextProps } from '../type';

const initialUser = {
  _id: '',
  userId: '',
  email: '',
  username: '',
  balance: 0,
  first_name: '',
  last_name: '',
  currency: '',
  currencyIcon: '',
  avatar: '',
  callback_url: '',
  status: '',
  createdAt: '',
};

const initialState: InitialAuthContextProps = {
  isInitialized: true,
  isLoggedIn: false,
  token: '',
  balance: 0,
  realBalance: 0,
  user: initialUser,
  baseUrl: '',
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAction(state, action: { payload: any }) {
      const { user, accessToken } = action.payload!;
      state.user = user;
      state.token = accessToken;
      state.balance = user.balance;
      state.realBalance = user.realBalance;
      state.isLoggedIn = true;
      state.isInitialized = true;
    },

    userAction(state, action: any) {
      state.user = action.payload;
      state.balance = action.payload.balance;
    },

    balanceAction(state, action: { payload: number }) {
      state.balance = action.payload;
    },

    realBalanceAction(state, action: { payload: number }) {
      state.realBalance = action.payload;
    },

    setBaseUrl(state, action: { payload: string }) {
      state.baseUrl = action.payload;
    },

    logoutAction(state) {
      state.token = '';
      state.balance = 0;
      state.user = initialUser;
      state.isLoggedIn = false;
      state.isInitialized = true;
      state = { ...state };
      if (window.location.pathname.toString().indexOf('blackjack') !== -1) {
        window.location.reload();
      }
    },
  },
});

export default auth.reducer;

export const { loginAction, logoutAction, userAction, balanceAction, realBalanceAction, setBaseUrl } = auth.actions;
