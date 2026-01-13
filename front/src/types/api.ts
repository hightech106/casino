/**
 * TypeScript type definitions for API request/response payloads and the ApiContext interface.
 * Defines types for authentication, sports betting, casino, wallet, missions, and user management.
 * Note: ApiContextType includes all API methods available through the useApi hook.
 */
import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import type { IEventStatus, ISportsBet, ISportsHisotry } from './sports';

export type IRegUser = {
  surname: string;
  middlename: string;
  username: string;
  email: string;
  birthday?: number;
  password: string;
  age?: boolean;
  gender: string;
  currency?: string; // Optional - backend automatically uses LU currency
  currency_temp?: any;
};

export type IUpdateUser = {
  update: boolean;
  userId: string;
  surname: string;
  middlename: string;
  username: string;
  email?: string;
  birthday: number;
  avatar: string;
};

export type IVerifyKYC = {
  token?: string;
  gender: string;
  postal_code: string;
  state: string;
  city: string;
  document: any;
  front_passport: any;
  back_passport: any;
  selfie: any;
};

export type ILogUser = {
  email: string;
  password: string;
  device: string;
  clientip: string;
};

export type IChangePassword = {
  currentPassword: string;
  password: string;
};

export type IPlayGame = {
  provider_code: string;
  game_code: string;
  currency: string;
};

export type IDepositCoin = {
  amount: number;
  currencyId: string;
};

export type IExchangeCoin = {
  amount: number;
  fromCurrencyId: string;
  toCurrencyId: string;
};

export type IPageType = 'sports' | 'casino';

// new
export type IDepositFiatQuikly = {
  customer_name: string;
  customer_email: string;
  currency_code: string;
  amount: string;
};
// new

export type INotification = {
  _id: string;
  title: string;
  description: string;
  auto: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  param?: {
    key: string;
    data: any[];
  };
  isUnRead: boolean;
};

export interface INotificationMission {
  _id: string;
  title: string;
  description: string;
  auto: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  banner_path: string | null;
  isUnRead: boolean;
}

export type ISupportChatUser = {
  _id: string;
  username: string;
  avatar: string;
  rolesId: {
    _id: string;
    title: string;
    type: string;
  };
};

export type ISupport = {
  askAgent: boolean;
  _id: string;
  sender: ISupportChatUser | null;
  receiver: ISupportChatUser | null;
  text: string;
  userColor: string;
  emoji: any;
  status: 'READ' | 'SENT';
  replyTo: any;
  attachment: any;
  isAi: boolean;
  createdAt: string;
  updatedAt: string;
  senderId: string;
  receiverId: string;
};

export type IVerifyEmail = {
  email: string;
  code: string;
};

export type IGetAdd = {
  symbol: string;
  bonusId?: string;
};

export type ISubmitCrypto = {
  id: number; // Currency id (unique identifier) - REQUIRED
  symbol?: string; // Optional for backward compatibility
  amount: number;
  bonusId?: string;
  token_amount?: string;
  fiatSymbol?: string;
};

export type IConfirmSmartContractPayment = {
  id: number; // Currency id (unique identifier) - REQUIRED
  symbol?: string; // Optional for backward compatibility
  amount: number; // Crypto amount (e.g., 0.1 BNB, 100 USDT)
  fiatAmount: number; // LU amount (USD-equivalent, e.g., 10 LU)
  transactionHash: string;
  contractAddress: string;
  from: string;
  bonusId?: string;
};

export type IConfirmTronDeposit = {
  userId: string;
  currencyId: string;
  txn_id: string;
  from?: string;
  bonusId?: string;
};

export type IConfirmSolanaDeposit = {
  userId: string;
  currencyId: string;
  txn_id: string;
  from?: string;
  bonusId?: string;
};

export type IActiveBonus = {
  bonusId: string;
  notificationId: string;
  password: string;
};

export type IWithdraw = {
  bank_name?: string;
  IBAN?: string;
  account_number?: string;
  swift?: string;
  bank_address?: string;
  card_number?: string;
  currency?: number | string; // Currency id (number) - preferred, or string for backward compatibility
  address?: string;
  amount: number;
  type: 'fiat' | 'crypto' | 'card';
  fiatSymbol?: string;
};

export interface ISportsMatchApi {
  SportId: string;
  EventStatus: IEventStatus;
  lang: string;
}

export interface IFilterList {
  page?: number;
  pageSize?: number;
  userId?: string;
  date?: [string | Date, string | Date];
  status?: string;
}


export type IScratchGameCreate = {
  userId: string;
};

export type IScratchGameScratch = {
  gameId: string;
  fieldIndex: number;
};

export type IScratchGameList = {
  userId: string;
  page?: number;
  pageSize?: number;
  status?: 'active' | 'win' | 'lose' | 'expired';
  search?: string;
};

export type IScratchGameGet = {
  gameId: string;
};

export type IScratchGameDelete = {
  gameId: string;
};

export type IScratchGameResponse = {
  gameId: string;
  grid: { index: number; revealed: boolean; photoUrl?: string }[];
  status: string;
  outcome?: { isWin: boolean; winningLine?: number[] };
};

export type IScratchGameListResponse = {
  results: IScratchGameResponse[];
  count: number;
};

export type ApiContextType = {
  initialize: () => Promise<any>;
  getTest: () => Promise<any>;
  register: (data: IRegUser) => Promise<any>;
  login: (data: ILogUser) => Promise<any>;
  send_code_email: (data: string) => Promise<any>;
  send_withdrawal_verification_code: (data: string) => Promise<any>;
  verify_email: (data: IVerifyEmail) => Promise<any>;
  verify_password: (data: string) => Promise<any>;
  signout: () => Promise<any>;

  get_sports_list: (EventStatus: IEventStatus, lang: string) => Promise<any>;
  get_sports_matchs: (data: ISportsMatchApi) => Promise<any>;
  get_sports_predictions: (eventId: string | number) => Promise<any>;
  get_sports_odds: (eventId: number, lang: string) => Promise<any>;
  get_sports_event: (eventId: number) => Promise<any>;
  get_sports_history: (status: ISportsHisotry) => Promise<any>;
  get_sports_markets: () => Promise<any>;
  get_sports_teams: (SportId: string) => Promise<any>;
  get_sports_bet_history: (betsId: string) => Promise<any>;
  get_sports_betting_history: (status: 'Active' | 'Settled') => Promise<any>;
  get_sports_cashout: (betId: string) => Promise<any>;
  get_sports_events: (data: any) => Promise<any>;

  get_casino_provider: () => Promise<any>;
  get_top_games: () => Promise<any>;
  get_fast_games: () => Promise<any>;
  get_casino_url: (data: IPlayGame) => Promise<any>;
  get_casino_demo_url: (game_code: string) => Promise<any>;
  get_casino_history: () => Promise<any>;
  get_casino_game: (game_code: string) => Promise<any>;
  get_tiers: () => Promise<any>;
  get_bonus: () => Promise<any>;
  get_bonuses_for_my_shares: () => Promise<any>;
  get_bonus_detail: (id: string) => Promise<any>;
  active_bonus: (data: IActiveBonus) => Promise<any>;
  activate_bonus_no_deposit: (bonusHistoryId: string) => Promise<any>;
  cancel_bonus: (pwd: string) => Promise<any>;
  getBonusHistoryListApi: (data: IFilterList) => Promise<any>;
  get_purchases: () => Promise<any>;
  activate_purchase: (purchaseHistoryId: string, game_code: string) => Promise<any>;
  get_histories_wheel: () => Promise<any>;
  activate_wheel: (historyId: string, game_code: string) => Promise<any>;
  get_games_by_purchase_id: (
    purchaseId: string,
    search: string
  ) => Promise<any>;
  get_games_by_wheel_history_id: (
    wheelHistoryId: string,
    search: string
  ) => Promise<any>;
  get_tickets: () => Promise<any>;

  upload_file: (data: FormData, config?: any) => Promise<any>;
  delete_file: (uri: string) => Promise<any>;

  update_user: (data: IUpdateUser) => Promise<any>;
  get_notification: () => Promise<any>;
  read_notification: (id: string) => Promise<any>;
  get_referral: () => Promise<any>;
  change_password: (data: IChangePassword) => Promise<any>;
  
  add_sports_bet: (data: ISportsBet) => Promise<any>;
  get_purchases_free_bets: () => Promise<any>;
  
  verify_KYC: (data: IVerifyKYC) => Promise<any>;
  verify_KYC_mobile: (data: IVerifyKYC) => Promise<any>;
  verify_token: (token: string) => Promise<any>;
  get_currencies: () => Promise<any>;
  // add_currencies removed - currency management no longer needed (all users use LU)
  // change_currency removed - currency management no longer needed (all users use LU)
  get_balances: () => Promise<any>;
  get_transactions: () => Promise<any>;
  depositNow: (data: IDepositCoin) => Promise<any>;
  withdrawal: (data: IWithdraw) => Promise<any>;
  exchangeNow: (data: IExchangeCoin) => Promise<any>;
  get_fiatNow: () => Promise<any>;
  depositFiatQuikly: (data: IDepositFiatQuikly) => Promise<any>;
  get_fiat_currencies: () => Promise<any>;
  checkPaymentStatus: (orderId: string, amount: number, currency: string) => Promise<any>;
  createTrioSession: (
    amount: number,
    user: { tax_number: string; phone_number: string; email: string; name: string }
  ) => Promise<any>;
  checkTrioPaymentStatus: (data: any) => Promise<{ data: { status: string } }>;
  calcUsdtToCrypto: (data: ISubmitCrypto) => Promise<any>;
  confirmSmartContractPayment: (data: IConfirmSmartContractPayment) => Promise<any>;
  getSolanaDepositAddress: () => Promise<any>;
  confirmSolanaDeposit: (data: IConfirmSolanaDeposit) => Promise<any>;
  checkSolanaDeposits: () => Promise<any>;
  getTronDepositAddress: () => Promise<any>;
  confirmTronDeposit: (data: IConfirmTronDeposit) => Promise<any>;

  get_banners: () => Promise<any>;

  get_chat_messages: (lang: string, date?: string) => Promise<any>;
  get_support_chat: () => Promise<any>;
  get_unread_supports: () => Promise<any>;
  get_blogs: () => Promise<any>;

  get_freespin_prizes: () => Promise<any>;
  get_daily_freespin_prizes: () => Promise<any>;
  get_daily_freespin_prizes_for_not_login: () => Promise<any>;
  play_freespin: (journey: boolean) => Promise<any>;
  play_freespin_daily: () => Promise<any>;
  check_ip: () => Promise<any>;

  get_scratch_game: () => Promise<any>;
  check_scratch_game: () => Promise<any>;
  check_win_scratch_game: (grid: any) => Promise<any>;
  get_history_wheels: () => Promise<any>;
  activate_wheel_bonus: (historyId: string, game_code: string) => Promise<any>;
  get_wheel_50_prizes: () => Promise<any>;
  play_wheel_50: () => Promise<any>;
  get_wheel_100_prizes: () => Promise<any>;
  play_wheel_100: () => Promise<any>;

  get_user_missions_rank: () => Promise<any>;
  get_levels: () => Promise<any>;
  get_user_missions: () => Promise<any>;
  optInMission: (id: string) => Promise<any>;
  get_user_one_mission: (id: string) => Promise<any>;
  check_mission: (id: string) => Promise<any>;
  claim_mission: (id: string) => Promise<any>;

  get_user_items: () => Promise<any>;
  get_user_one_item: (id: string) => Promise<any>;
  buy_item: (id: string) => Promise<any>;

  get_notification_mission: () => Promise<any>;
  read_notification_mission: (id: string) => Promise<any>;

  get_sumsub_access_token: (token: string) => Promise<any>;
};