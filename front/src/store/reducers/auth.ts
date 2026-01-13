/**
 * Redux slice for authentication state management including user data, balance, and session.
 * Handles login, logout, balance updates, notifications, and affiliate tracking.
 * Note: Logout triggers page reload for blackjack/roulette routes, and balance values are formatted to 2 decimals.
 */
import type { InitialLoginContextProps, INotificationMission } from 'src/types';
import { createSlice } from '@reduxjs/toolkit';
import { fShortNumber } from 'src/utils/format-number';
import { REACT_APP_CURRENCY, REACT_APP_CURRENCY_ICON } from 'src/config-global';

const initialCurrency = {
  _id: '',
  icon: REACT_APP_CURRENCY_ICON,
  symbol: REACT_APP_CURRENCY,
  minBet: 1000,
  maxBet: 100000,
  price: 0.1,
  isFiat: false,
};

const initialUser = {
  _id: '',
  email: '',
  surname: '',
  middlename: '',
  username: '',
  birthday: 0,
  referral: '',
  avatar: '',
  gender: '',
  postal_code: '',
  state: '',
  city: '',
  document: '',
  front_passport: '',
  back_passport: '',
  selfie: '',
  last_bonus: 0,
  last_spin: undefined,
  kycVerified: false,
  chat: true,
  betlimit: 0,
  betlimit_period: 0,
};

const initialState: InitialLoginContextProps = {
  isInitialized: true,
  isLoggedIn: false,
  code: '',
  betsId: '',
  token: '',
  balance: 0,
  bonus: 0,
  balanceId: '',
  notification: [],
  missionNotifications: [],
  
  unreadSupport: 0,
  currencyId: '',
  user: initialUser,
  currency: initialCurrency,
  activeBonus: null,
  // affiliate
  clickid: '',
  username_affiliate: '',
  
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    Login(state, action: any) {
      const { balance, user, session, activeBonus } = action.payload!;
      state.user = user;
      state.token = session.accessToken;
      state.balance = balance.balance;
      state.bonus = balance.bonus;
      state.activeBonus = activeBonus;
      state.balanceId = balance._id;
      state.currency = balance.currency;
      state.currencyId = balance.currency._id;
      state.isLoggedIn = true;
      state.isInitialized = true;
    },

    UpdateInfo(state, action: any) {
      state.user = action.payload;
    },

    UpdateBalance(state, action: { payload: number }) {
      state.balance = action.payload;
    },

    UpdateBonus(state, action: { payload: number }) {
      state.bonus = action.payload;
    },

    UpdateNotification(state, action: any) {
      state.notification = action.payload;
    },

    UpdateMissionNotification(state, action: any) {
      state.missionNotifications = action.payload;
    },

    UpdateUnreadSupport(state, action: any) {
      state.unreadSupport = action.payload;
    },

    UpdateBalanceInfo(state, action: any) {
      const balance = action.payload!;
      state.balance = fShortNumber(balance.balance, 2);
      state.bonus = fShortNumber(balance.bonus, 2);
      state.balanceId = balance._id;
      state.currency = balance.currency;
      state.currencyId = balance.currency._id;
      state = { ...state };
    },

    UpdateActiveBonus(state, action: any) {
      const activeBonus = action.payload!;
      state.activeBonus = activeBonus;
    },

    setBonusDate(state, action: any) {
      state.user.last_bonus = action.payload;
    },

    setLastSpin(state, action: { payload: number }) {
      state.user.last_spin = action.payload;
    },

    SetCode(state, action: any) {
      state.code = action.payload;
    },

    SetBetsId(state, action: any) {
      state.betsId = action.payload;
    },

    Logout(state) {
      state.token = '';
      state.balance = 0;
      state.bonus = 0;
      state.balanceId = '';
      state.currencyId = '';
      state.notification = [];
      state.missionNotifications = [];
      state.user = initialUser;
      state.currency = initialCurrency;
      state.isLoggedIn = false;
      state.isInitialized = true;
      state = { ...state };
      if (
        window.location.pathname.toString().indexOf('blackjack') !== -1 ||
        window.location.pathname.toString().indexOf('roulette') !== -1
      ) {
        window.location.reload();
      }
    },

    SetClickId(state, action: any) {
      state.clickid = action.payload;
    },

    SetUsernameAffiliate(state, action: any) {
      state.username_affiliate = action.payload;
    },
  },
});

export default auth.reducer;

export const {
  Login,
  Logout,
  UpdateInfo,
  UpdateBalanceInfo,
  UpdateActiveBonus,
  UpdateNotification,
  UpdateMissionNotification,
  UpdateUnreadSupport,
  UpdateBalance,
  UpdateBonus,
  setBonusDate,
  setLastSpin,
  SetCode,
  SetClickId,
  SetUsernameAffiliate,
  SetBetsId,
} = auth.actions;