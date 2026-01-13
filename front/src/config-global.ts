/**
 * Global configuration constants for API endpoints, environment variables, and application settings.
 * Centralizes all API paths, currency settings, and market name mappings used throughout the app.
 * Note: API paths are versioned (v1/v2/v3), and special country handling exists for DE, AT, CH.
 */
// routes
import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------
export const TIME_INTERVAL = 5000;

export const APP_NAME = import.meta.env.VITE_NAME;
export const HOST_API = import.meta.env.VITE_HOST_API;
export const ASSETS_API = import.meta.env.VITE_ASSETS_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = `/en${paths.casino.root}` as string;

export const API_URL = import.meta.env.VITE_API_URL;
export const GAME_API_URL = import.meta.env.VITE_GAME_API_URL as string;
export const REACT_APP_CURRENCY = import.meta.env.VITE_CURRENCY as string;
export const REACT_APP_CURRENCY_ICON = import.meta.env.VITE_CURRENCY_ICON as string;

export const SUMSUB_URL = "https://in.sumsub.com/websdk/p/wIRCii0zMUz7HZmM";

export const API_PATH = {
  // track_time_page
  TRACK_TIME_SPENT: '/api/v2/users/track_time_spent',
  TRACK_VISIT_PAGE: '/api/v2/users/track_current_page',

  GETTEST: '/api/v2/missions/users-shops/get-test',
  // auth
  LOGIN: '/api/v2/users/signin',
  REGISTER: '/api/v2/users/signup',
  SEND_EMAIL: '/api/v2/users/send-email',
  SEND_WITHDRAWAL_VERIFICATION: '/api/v2/users/send-withdrawal-verification',
  VERIFY_EMAIL: '/api/v2/users/verify-email',
  VERIFY_PASSWORD: '/api/v2/users/verify-password',
  SIGNOUT: '/api/v2/users/signout',
  AUTH_GET_ME: '/api/v2/users/me',
  // sports
  SPORTS_LIST: '/api/v1/sports/lists',
  SPORTS_ALL_LIST: '/api/v1/sports/all_lists',
  SPORTS_MATCHS: '/api/v1/sports/matchs',
  SPORTS_ODDS: '/api/v1/sports/odds',
  SPORTS_PREDICTIONS: '/api/v1/sports/predictions',
  SPORTS_EVENT: '/api/v2/sports/events',
  SPORTS_BET: '/api/v2/sports/bet',
  SPORTS_BET_HISTORY: '/api/v2/sports/bet-history',
  SPORTS_BETTING_HISTORY: '/api/v2/sports/history',
  SPORTS_CASHOUT: '/api/v2/sports/cashout',
  SPORTS_MARKETS: '/api/v2/sports/markets',
  SPORTS_TEAMS: '/api/v1/sports/teams',
  SPORTS_EVENTS: '/api/v2/sports/events',
  // casino
  CASINO_PROVIDER: '/api/v2/games/provders',
  TOP_GAMES: '/api/v2/games/top_games',
  ORIGINAL_GAMES: '',
  FAST_GAMES: '/api/v2/games/fast_games',
  CASINO_PLAY: '/api/v2/games/play',
  CASINO_DEMO_PLAY: '/api/v2/games/demo-play',
  CASINO_HISTORY: '/api/v2/games/myhistory',
  CASINO_GAME: '/api/v2/games/game',
  TIERS: '/api/v3/bonus/tier',
  BONUS: '/api/v2/bonus/common/get',
  GET_BONUSES_FOR_MY_SHARES: '/api/v2/bonus/common/get_bonuses_for_my_shares',
  ACTIVE_BONUS: '/api/v2/bonus/common/active',
  ACTIVE_BONUS_NO_DEPOSIT: '/api/v2/bonus/common/activate',
  ACTIVATE_PURCHASE: '/api/v2/missions/users-shops/activate',
  GET_GAMES_BY_VENDOR: '/api/v2/missions/users-shops/get-games-by-purchase',
  GET_GAMES_BY_WHEEL: '/api/v2/missions/users_common_minigames/users_wheel_50/get-games-by-wheel',
  GET_PURCHASES: '/api/v2/missions/users-shops/get-purchases',
  CANCEL_BONUS: '/api/v2/bonus/common/cancel',
  BONUS_DETAIL: '/api/v2/bonus/common',
  BONUS_HISTORY: '/api/v2/bonus/common/history',
  GET_GAME_USER: '/api/v2/users/get-user',
  // file
  UPLOAD_FILE: '/api/v2/files',
  DELETE_FILE: '/api/v2/files/delete',
  // user
  UPDATE_USER: '/api/v2/users/info',
  REFERRAL: '/api/v2/users/referral',
  TICKET: '/api/v2/users/ticket',
  CHANGE_PASSWORD: '/api/v2/users/c-password',
  VERIFY_KYC: '/api/v2/users/verify-kyc',
  VERIFY_KYC_MOBILE: '/api/v2/users/verify-kyc-mobile',
  VERIFY_TOKEN: '/api/v2/users/verify-token',
  // wallet
  GET_CURRENCY: '/api/v2/payments/get-currency',
  // ADD_CURRENCY removed - currency management no longer needed (all users use LU)
  // CHANGE_CURRENCY removed - currency management no longer needed (all users use LU)
  GET_BALANCES: '/api/v2/payments/get-balance',
  GET_TRANSACTIONS: '/api/v2/payments/get-transaction',
  DEPOSIT_NOW: '/api/v2/payments/deposit-now',
  WITHDRAWAL: '/api/v2/payments/withdrawal',
  EXCHANGE_NOW: '/api/v2/payments/exchange-now',
  //  FIAT
  FIAT_NOW: '/api/v2/payments/fiat-now',
  GET_FIAT_CURRENCY: '/api/v2/payments/get-currency-fiat',
  DEPOSIT_FIAT_QUIKLY: '/api/v2/payments/deposit-fiat-quikly',
  CREATE_TRIO_SESSION: '/api/v2/payments/trio-session-create',
  CHECK_TRIO_PAYMENT_STATUS: '/api/v2/payments/trio-status',
  STATUS_QUIKLY: '/api/v2/payments/status-quikly',
  CALC_USDT_CRYPTO: '/api/v2/payments/calc-usdt-crypto',
  CONFIRM_SMART_CONTRACT_PAYMENT: '/api/v2/payments/confirm-smart-contract',
  SOLANA_DEPOSIT_ADDRESS: '/api/v2/payments/solana/deposit-address',
  SOLANA_DEPOSIT_CONFIRM: '/api/v2/payments/s-deposit',
  SOLANA_CHECK_DEPOSITS: '/api/v2/payments/solana/check-deposits',
  TRON_DEPOSIT_ADDRESS: '/api/v2/payments/tron/deposit-address',
  TRON_DEPOSIT_CONFIRM: '/api/v2/payments/t-deposit',

  // goalserve
  SPORTS_LIST_G: '/api/v1/sports/goalserve/lists',
  SPORTS_LEAGUES_G: '/api/v1/sports/goalserve/leagues',
  SPORTS_MATCHES_G: '/api/v1/sports/goalserve/matches',
  // Banner
  GET_BANNERS: '/api/v2/settings/banners/get',
  // Chat
  CHAT: '/api/v2/chat',
  // settings
  GET_SPINWHEEL: '/api/v2/settings/spinwheel/get',
  GET_DAILY_SPINWHEEL_PRIZES: '/api/v2/settings/dailywheel/get-daily',
  GET_DAILY_SPINWHEEL_PRIZES_NOT_LOGIN: '/api/v2/settings/dailywheel/get-daily-not-login',
  PLAY_SPINWHEEL: '/api/v2/settings/spinwheel/play',
  PLAY_SPINWHEEL_DAILY: '/api/v2/settings/dailywheel/play-daily',
  NOTIFICATION: '/api/v2/settings/notifications/get',
  READ_NOTIFICATION: '/api/v2/settings/notifications/read',
  GET_BLOG: '/api/v2/settings/blogs/get',
  OPEN_SMS: '/api/v3/journey/tracking/sms',

  GET_SCRATCH: '/api/v2/missions/users_common_minigames/users_scratch/get',
  CHECK_SCRATCH_GAME: '/api/v2/missions/users_common_minigames/users_scratch/check',
  CHECK_WIN_SCRATCH_GAME: '/api/v2/missions/users_common_minigames/users_scratch/check_win',

  GET_WHEEL_HISTORY: '/api/v2/missions/users_common_minigames/users_wheel_50/get-history',
  BONUS_WHEEL_ACTIVATE: '/api/v2/missions/users_common_minigames/users_wheel_50/activate-bonus',
  GET_WHEEL_50: '/api/v2/missions/users_common_minigames/users_wheel_50/get',
  PLAY_WHEEL_50: '/api/v2/missions/users_common_minigames/users_wheel_50/play',

  GET_HISTORIES_WHEEL: '/api/v2/missions/users_common_minigames/users_wheel_50/get-history',
  ACTIVATE_WHEEL: '/api/v2/missions/users_common_minigames/users_wheel_50/activate-wheel',

  GET_WHEEL_100: '/api/v2/missions/users_common_minigames/users_wheel_100/get',
  PLAY_WHEEL_100: '/api/v2/missions/users_common_minigames/users_wheel_100/play',

  GET_USER_MISSIONS_RANK: '/api/v2/missions/users-missions/get-user-rank',
  GET_LEVELS: '/api/v2/missions/users-missions/get-levels',
  GET_USER_MISSIONS: '/api/v2/missions/users-missions/get-users-missions',
  OPT_IN_MISSION: '/api/v2/missions/users-missions/opt-in',
  GET_USER_MISSIONS_ONE: '/api/v2/missions/users-missions/',
  CHECK_USER_MISSION: '/api/v2/missions/users-missions/check',
  CLAIM_USER_MISSION: '/api/v2/missions/users-missions/claim',

  GET_USER_ITEMS: '/api/v2/missions/users-shops/get-user-items',
  GET_USER_ITEM: '/api/v2/missions/users-shops/',
  BUY_USER_ITEMS: '/api/v2/missions/users-shops/buy',
  GET_FREE_BETS: '/api/v2/missions/users-shops/get-purchases-free-bets',

  NOTIFICATION_MISSION: '/api/v2/missions/users-notifications/get',
  READ_NOTIFICATION_MISSION: '/api/v2/missions/users-notifications/read',

  GET_SUMSUB_ACCESS_TOKEN: '/api/v2/users/get-sumsub-access-token',
};

export const MARKET_NAMES = {
  '1_1': '1 x 2',
  '1_2': 'Asian Handicap',
  '1_3': 'O / U',
  '1_4': 'Asian Corners',
  '1_5': '1st Half Handicap',
  '1_6': '1st Half Goal Line',
  '1_7': '1st Half Asian Corners',
  '1_8': 'Half Time Result',
  '18_1': 'Money Line',
  '18_2': 'Spread',
  '18_3': 'Total Points',
  '18_4': 'Money Line',
  '18_5': 'Spread',
  '18_6': 'Total Points',
  '18_7': 'Quarter - Winner(2 - Way)',
  '18_8': 'Quarter - Handicap',
  '18_9': 'Quarter - Total(2 - Way)',
  '16_1': 'Money Line',
  '16_2': 'Run Line',
  '16_3': 'Game Total',
  '3_4': 'Draw No Bet',
  '13_4': 'Set Winner',
  '17_1': '1 x 2',
  _1: 'Winner',
  _2: 'Handicap',
  _3: 'Over/Under',
} as any;

export const NOT_TRANSLATE = [
  'Home/Away',
  'Match Corners',
  'Asian Corners',
  'Corners European Handicap',
  'Corners 1x2',
  'Corners Over Under',
  'Corners Asian Handicap',
  'Home Corners Over/Under',
  'Away Corners Over/Under',
  'Total Corners',
  'Total Corners (3 way)',
];

export const SPECIAL_COUNTRY = ['DE', 'AT', 'CH'];
