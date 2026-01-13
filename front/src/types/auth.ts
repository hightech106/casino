/**
 * TypeScript type definitions for authentication, user profiles, and login context.
 * Defines user profile structure, active bonus types, and initial login context state.
 * Note: Includes affiliate tracking fields (clickid, username_affiliate) and mission notifications.
 */
import type { INotification, ISupport, INotificationMission } from './api';
import type { IBonus } from './casino';
import type { CurrencyProps } from './payment';

export type UserProfile = {
  _id: string;
  email: string;
  surname: string;
  middlename: string;
  username: string;
  avatar: string;
  birthday: number;
  referral: string;
  cryptoAccount?: string;
  publicAddress?: string;
  oddsformat?: string;
  rReferral?: string;
  kycVerified: boolean,
  gender?: string;
  postal_code?: string;
  state?: string;
  city?: string;
  passport?: string;
  front_id?: string;
  back_id?: string;
  selfie?: string;
  chat: boolean;
  last_bonus: number;
  last_spin?: number;
  betlimit: number;
  betlimit_period: number;
};

export type ActiveBonus = {
  _id: string;
  bonusId: IBonus;
  userId: string;
  paymentsId: string;
  amount: number;
  wager_amount: number;
  isSpend: number;
  isDeposit: number;
  status: "active" | "processing" | "finished" | "expired" | "canceled";
  createdAt: string;
};

export type APIContextType = {
  login: (email: string, password: string, recaptcha: string | null) => Promise<any>;
  register: (email: string, username: string, password: string, recaptcha: string) => Promise<any>;
  logout: () => void;
  checkAddress: (publicAddress: string) => Promise<any>;
  signInAddress: (publicAddress: string, signature: string) => Promise<any>;
  signInSolana: (publicAddress: string, signature: string) => Promise<any>;
  signUpAddress: (publicAddress: string) => Promise<any>;
  forgotPassword: (email: string, recaptcha: string) => Promise<any>;
  changePassword: (data: any) => Promise<any>;
  resetPassword: (email: string) => void;
  updateUserInfo: (user: any) => Promise<any>;
  getReferral: () => Promise<any>;
  getTransactions: () => Promise<any>;
  getBalances: () => Promise<any>;
  uploadFile: (data: FormData) => Promise<any>;
  deleteFile: (uri: string) => Promise<any>;
  getCurrency: () => Promise<any>;
  addCurrency: (currency: string) => Promise<any>;
  // changeCurrency removed - currency management no longer needed (all users use LU)
  deposit: () => Promise<any>;
  depositMetamask: (transaction: any) => Promise<any>;
  depositSolana: (transaction: any) => Promise<any>;
  withdrawal: (address: string, method: number, amount: number) => Promise<any>;
  betSport: (data: any, type: string, stake: number) => Promise<any>;
  getMybets: (status: string) => Promise<any>;
  getCasinoHistory: (type: number, perPage: number) => Promise<any>;
};

export interface InitialLoginContextProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  token?: string | undefined;
  user: UserProfile;
  balance: number;
  bonus: number;
  betsId: string;
  balanceId: string;
  currencyId: string;
  code: string;
  currency: CurrencyProps;
  notification: INotification[];
  missionNotifications: INotificationMission[],
  unreadSupport: number;
  // affiliate
  clickid: string;
  username_affiliate: string;
  activeBonus: ActiveBonus | null;
}
