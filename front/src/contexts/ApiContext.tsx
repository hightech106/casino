/**
 * Central API context provider that wraps all API methods for authentication, sports, casino, wallet, and missions.
 * Automatically includes user ID, currency, and affiliate tracking in requests from Redux store.
 * Note: Login attempts automatically fetch client IP if not provided, and registration includes referral codes.
 */
import React, { createContext } from 'react';
import axios from 'src/utils/axios';
import { useSelector } from 'src/store';
import { API_PATH, GAME_API_URL } from 'src/config-global';
import { UAParser } from 'ua-parser-js';
import type {
  ApiContextType,
  IRegUser,
  IEventStatus,
  ILogUser,
  IUpdateUser,
  IChangePassword,
  ISportsBet,
  ISportsHisotry,
  IVerifyKYC,
  IPlayGame,
  IDepositCoin,
  IExchangeCoin,
  IDepositFiatQuikly,
  IVerifyEmail,
  IActiveBonus,
  IWithdraw,
  ISportsMatchApi,
  ISubmitCrypto,
  IConfirmSmartContractPayment,
  IConfirmSolanaDeposit,
  IConfirmTronDeposit,
  IGetAdd,
  IFilterList,
} from 'src/types';

const ApiContext = createContext<ApiContextType | null>(null);
/* eslint-disable */
export const ApiProvider = ({ children }: { children: React.ReactElement }) => {
  const { code, user, currencyId, clickid, username_affiliate } = useSelector((store: any) => store.auth);

  const initialize = async () => {
    return await axios.post(API_PATH.AUTH_GET_ME);
  };

  // auth
  const getTest = async () => {
    return await axios.post(API_PATH.GETTEST);
  };

  const login = async (data: ILogUser) => {
    // Try to get client IP if not provided
    let loginData = { ...data };
    if (!loginData.clientip || loginData.clientip === 'Unknown') {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        loginData.clientip = ipData.ip || 'Unknown';
      } catch (ipError) {
        console.warn('Could not fetch client IP for login:', ipError);
        loginData.clientip = 'Unknown';
      }
    }

    console.log('Login attempt with data:', loginData);
    try {
      const response = await axios.post(API_PATH.LOGIN, loginData);
      console.log('Login response:', response);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: IRegUser) => {
  const payload = { ...data, rReferral: code, clickid, username_affiliate };
  console.log('Registration payload:', payload);
  return await axios.post(API_PATH.REGISTER, payload);
};

  const send_code_email = async (email: string) => {
    return await axios.post(API_PATH.SEND_EMAIL, { email });
  };

  const send_withdrawal_verification_code = async (email: string) => {
    return await axios.post(API_PATH.SEND_WITHDRAWAL_VERIFICATION, { email });
  };

  const verify_email = async (data: IVerifyEmail) => {
    return await axios.post(API_PATH.VERIFY_EMAIL, data);
  };

  const verify_password = async (password: string) => {
    return await axios.post(API_PATH.VERIFY_PASSWORD, { password });
  };

  const signout = async () => {
    return await axios.post(API_PATH.SIGNOUT, { userId: user._id });
  };

  // sports

  const get_sports_list = async (EventStatus: IEventStatus, lang: string) => {
    return await axios.post(API_PATH.SPORTS_LIST, { EventStatus, lang });
  };

  const get_sports_matchs = async (data: ISportsMatchApi) => {
    return await axios.post(API_PATH.SPORTS_MATCHS, data);
  };

  const get_sports_odds = async (eventId: number, lang: string) => {
    return await axios.post(API_PATH.SPORTS_ODDS, { id: eventId, lang });
  };

  const get_sports_event = async (eventId: number) => {
    return await axios.post(API_PATH.SPORTS_EVENT, { eventId });
  };

  const get_sports_predictions = async (eventId: string | number) => {
    return await axios.get(`${API_PATH.SPORTS_PREDICTIONS}/${eventId}`);
  };

  const add_sports_bet = async (data: ISportsBet) => {
    return await axios.post(API_PATH.SPORTS_BET, {
      ...data,
      userId: user._id,
      currency: currencyId,
    });
  };

  const get_purchases_free_bets = async () => {
    return await axios.post(API_PATH.GET_FREE_BETS);
  };

  const get_sports_history = async (status: ISportsHisotry) => {
    return await axios.post(API_PATH.SPORTS_BETTING_HISTORY, { userId: user._id, status });
  };

  const get_sports_markets = async () => {
    return await axios.post(API_PATH.SPORTS_MARKETS);
  };

  const get_sports_teams = async (SportId: string) => {
    return await axios.post(API_PATH.SPORTS_TEAMS, { SportId });
  };

  const get_sports_bet_history = async (betsId: string) => {
    return await axios.post(API_PATH.SPORTS_BET_HISTORY, { betsId });
  };

  const get_sports_betting_history = async (status: 'Active' | 'Settled') => {
    return await axios.post(API_PATH.SPORTS_BETTING_HISTORY, { 
      userId: user._id, 
      status 
    });
  };

  const get_sports_cashout = async (betId: string) => {
    return await axios.post(API_PATH.SPORTS_CASHOUT, { betId });
  };

  const get_sports_events = async (data: any) => {
    return await axios.post(API_PATH.SPORTS_EVENTS, data);
  };

  // casino
  const get_casino_provider = async () => {
    return await axios.post(API_PATH.CASINO_PROVIDER);
  };

  const get_top_games = async () => {
    return await axios.get(API_PATH.TOP_GAMES);
  };

  const get_original_games = async () => {
    return await axios.get(`${GAME_API_URL}/${API_PATH.TOP_GAMES}`);
  };

  const get_fast_games = async () => {
    return await axios.get(API_PATH.FAST_GAMES);
  };

  const get_casino_url = async (data: IPlayGame) => {
    return await axios.post(API_PATH.CASINO_PLAY, { userId: user._id, ...data });
  };

  const get_casino_demo_url = async (game_code: string) => {
    return await axios.post(API_PATH.CASINO_DEMO_PLAY, { game_code });
  };

  const get_casino_history = async () => {
    return await axios.post(API_PATH.CASINO_HISTORY);
  };

  const get_casino_game = async (game_code: string) => {
    return await axios.post(API_PATH.CASINO_GAME, { game_code });
  };

  const get_tiers = async () => {
    return await axios.get(API_PATH.TIERS);
  };

  // bonus

  const get_bonus = async () => {
    console.log("Calling get bonus");
    return await axios.post(API_PATH.BONUS, { userId: user?._id || null });
  };

  const get_bonuses_for_my_shares = async () => {
    return await axios.post(API_PATH.GET_BONUSES_FOR_MY_SHARES, { userId: user?._id || null });
  };


  const get_bonus_detail = async (id: string) => {
    return await axios.post(`${API_PATH.BONUS_DETAIL}/${id}`, { userId: user?._id || null });
  };

  const active_bonus = async (data: IActiveBonus) => {
    return await axios.post(API_PATH.ACTIVE_BONUS, data);
  };

  const activate_bonus_no_deposit = async (bonusHistoryId: string) => {
    return await axios.post(API_PATH.ACTIVE_BONUS_NO_DEPOSIT, { userId: user?._id || null, bonusHistoryId: bonusHistoryId });
  };

  const cancel_bonus = async (pwd: string) => {
    return await axios.post(API_PATH.CANCEL_BONUS, { password: pwd });
  };

  const getBonusHistoryListApi = async (data: IFilterList) => {
    return await axios.post(API_PATH.BONUS_HISTORY, data);
  };

  //purchase
  const get_purchases = async () => {
    return await axios.post(API_PATH.GET_PURCHASES, { userId: user?._id || null });
  };

  const activate_purchase = async (purchaseHistoryId: string, game_code: string) => {
    return await axios.post(API_PATH.ACTIVATE_PURCHASE, { userId: user?._id || null, purchaseHistoryId: purchaseHistoryId, game_code: game_code });
  };

  const get_games_by_purchase_id = async (purchaseId: string, search: string = '') => {
    const response = await axios.post(API_PATH.GET_GAMES_BY_VENDOR, { userId: user?._id || null, purchaseId: purchaseId, search: search });
    return response.data;
  };




  // wheel bonuses

  const get_histories_wheel = async () => {
    return await axios.post(API_PATH.GET_HISTORIES_WHEEL, { userId: user?._id || null });
  };

  const activate_wheel = async (historyId: string, game_code: string) => {
    return await axios.post(API_PATH.ACTIVATE_WHEEL, { userId: user?._id || null, historyId: historyId, game_code: game_code });
  };

  const get_games_by_wheel_history_id = async (wheelHistoryId: string, search: string = '') => {
  const response = await axios.post(API_PATH.GET_GAMES_BY_WHEEL, { userId: user?._id || null, wheelHistoryId: wheelHistoryId, search: search });
  return response.data;
};


  // file
  const upload_file = async (data: FormData, config: any) => {
    return await axios.post(API_PATH.UPLOAD_FILE, data, config);
  };

  const delete_file = async (uri: string) => {
    return await axios.post(API_PATH.DELETE_FILE, { uri });
  };

  // user
  const update_user = async (data: IUpdateUser) => {
    return await axios.post(API_PATH.UPDATE_USER, data);
  };

  const get_notification = async () => {
    return await axios.post(API_PATH.NOTIFICATION);
  };

  const read_notification = async (id: string) => {
    return await axios.post(API_PATH.READ_NOTIFICATION, { id });
  };

  const get_referral = async () => {
    return await axios.post(API_PATH.REFERRAL, { userId: user._id });
  };

  const get_tickets = async () => {
    return await axios.post(API_PATH.TICKET);
  };

  const change_password = async (data: IChangePassword) => {
    return await axios.post(API_PATH.CHANGE_PASSWORD, { ...data, userId: user._id });
  };

  const verify_KYC = async (data: IVerifyKYC) => {
    return await axios.post(API_PATH.VERIFY_KYC, data);
  };

  const verify_token = async (token: string) => {
    return await axios.post(API_PATH.VERIFY_TOKEN, { token });
  };

  const verify_KYC_mobile = async (data: IVerifyKYC) => {
    return await axios.post(API_PATH.VERIFY_KYC_MOBILE, data);
  };

  // wallet

  const get_currencies = async () => {
    return await axios.post(API_PATH.GET_CURRENCY);
  };

  // add_currencies removed - currency management no longer needed (all users use LU)
  // const add_currencies = async (currency: string) => {
  //   return await axios.post(API_PATH.ADD_CURRENCY, { currency, userId: user._id });
  // };

  // change_currency removed - currency management no longer needed (all users use LU)
  // const change_currency = async (currency: string) => {
  //   return await axios.post(API_PATH.CHANGE_CURRENCY, { currency, userId: user._id });
  // };

  const get_balances = async () => {
    return await axios.post(API_PATH.GET_BALANCES, { userId: user._id });
  };

  const get_transactions = async () => {
    return await axios.post(API_PATH.GET_TRANSACTIONS, { userId: user._id });
  };

  const depositNow = async (data: IDepositCoin) => {
    return await axios.post(API_PATH.DEPOSIT_NOW, { ...data, userId: user._id });
  };

  const withdrawal = async (data: IWithdraw) => {
    return await axios.post(API_PATH.WITHDRAWAL, data);
  };

  const exchangeNow = async (data: IExchangeCoin) => {
    return await axios.post(API_PATH.EXCHANGE_NOW, { ...data, userId: user._id });
  };

  const get_fiatNow = async () => {
    return await axios.post(API_PATH.FIAT_NOW);
  };

  const depositFiatQuikly = async (data: IDepositFiatQuikly) => {
    try {
      const response = await axios.post(API_PATH.DEPOSIT_FIAT_QUIKLY, data);
      return response.data;
    } catch (error) {
      if (error.response) {
      } else if (error.request) {
      } else {
      }
      return null;
    }
  };

  const checkPaymentStatus = async (orderId: string, amount: number, currency: string) => {
    try {
      const response = await axios.get(API_PATH.STATUS_QUIKLY, {
        params: {
          order_id: orderId,
          userId: user._id,
          amount: amount.toString(),
          currency: currency,
        },
      });
      console.log('Polling response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error;
    }
  };

  const get_fiat_currencies = async () => {
    return await axios.post(API_PATH.GET_FIAT_CURRENCY);
  };

  const createTrioSession = async (
    amount: number,
    user: { tax_number: string; phone_number: string; email: string; name: string }
  ): Promise<any> => {
    try {
      const response = await axios.post(API_PATH.CREATE_TRIO_SESSION, { amount, user });

      if (response && response.data) {
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating Trio session:', error);
      throw error;
    }
  };

  const checkTrioPaymentStatus = async (paymentData: any) => {
    try {
      console.log('Sending payment data:', { paymentData, userId: user._id });
      const response = await axios.post(API_PATH.CHECK_TRIO_PAYMENT_STATUS, {
        paymentData,
        userId: user._id,
      });

      console.log('Response from checkTrioPaymentStatus:', response);
      return response.data;
    } catch (error) {
      console.error('Error checking Trio payment status:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      throw error;
    }
  };

  const calcUsdtToCrypto = async (data: ISubmitCrypto) => {
    return await axios.post(API_PATH.CALC_USDT_CRYPTO, data);
  };

  const confirmSmartContractPayment = async (data: IConfirmSmartContractPayment) => {
    return await axios.post(API_PATH.CONFIRM_SMART_CONTRACT_PAYMENT, data);
  };

  const getSolanaDepositAddress = async () => {
    return await axios.post(API_PATH.SOLANA_DEPOSIT_ADDRESS);
  };

  const confirmSolanaDeposit = async (data: IConfirmSolanaDeposit) => {
    return await axios.post(API_PATH.SOLANA_DEPOSIT_CONFIRM, data);
  };

  const checkSolanaDeposits = async () => {
    return await axios.post(API_PATH.SOLANA_CHECK_DEPOSITS);
  };

  const getTronDepositAddress = async () => {
    return await axios.get(API_PATH.TRON_DEPOSIT_ADDRESS);
  };

  const confirmTronDeposit = async (data: IConfirmTronDeposit) => {
    return await axios.post(API_PATH.TRON_DEPOSIT_CONFIRM, data);
  };

  // banners
  const get_banners = async () => {
    return await axios.post(API_PATH.GET_BANNERS);
  };

  // chat
  const get_chat_messages = (lang: string, date?: string) => {
    const formattedDate = date
      ? new Date(date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    return axios.post(`${API_PATH.CHAT}/messages`, { lang, date: formattedDate });
  };

  const get_support_chat = async () => {
    return await axios.post(`${API_PATH.CHAT}/supports`);
  };

  const get_unread_supports = async () => {
    return await axios.post(`${API_PATH.CHAT}/unread-supports`);
  };

  const get_blogs = async () => {
    return await axios.post(API_PATH.GET_BLOG);
  };

  // freespin & daily_wheel

  const get_freespin_prizes = async () => {
    return await axios.post(API_PATH.GET_SPINWHEEL);
  };

  const get_daily_freespin_prizes = async () => {
    return await axios.get(API_PATH.GET_DAILY_SPINWHEEL_PRIZES);
  };

  const get_daily_freespin_prizes_for_not_login = async () => {
    return await axios.get(API_PATH.GET_DAILY_SPINWHEEL_PRIZES_NOT_LOGIN);
  };

  const play_freespin = async (journey: boolean) => {
    return await axios.post(API_PATH.PLAY_SPINWHEEL, { journey });
  };

  const play_freespin_daily = async () => {
    return await axios.post(API_PATH.PLAY_SPINWHEEL_DAILY);
  };

  const check_ip = async () => {
    // Completely disabled ipinfo.io to avoid 429 errors in console
    // Always return fallback data
    return { data: { country: 'US' } };
  };

  // scratch game

  const get_scratch_game = async () => {
    return await axios.post(API_PATH.GET_SCRATCH, { userId: user._id });
  };

  const check_scratch_game = async () => {
    return await axios.post(API_PATH.CHECK_SCRATCH_GAME, { userId: user._id });
  };

  const check_win_scratch_game = async (grid: any) => {
    const response = await axios.post(API_PATH.CHECK_WIN_SCRATCH_GAME, { userId: user._id, grid });
    return response.data;
  };

  // wheel_50
  const get_history_wheels = async () => {
    return await axios.post(API_PATH.GET_WHEEL_HISTORY, { userId: user._id });
  };

  const activate_wheel_bonus = async (historyId: string, game_code: string) => {
    return await axios.post(API_PATH.BONUS_WHEEL_ACTIVATE, { userId: user._id, historyId: historyId, game_code: game_code });
  };

  const get_wheel_50_prizes = async () => {
    return await axios.post(API_PATH.GET_WHEEL_50, { userId: user._id });
  };

  const play_wheel_50 = async () => {
    return await axios.post(API_PATH.PLAY_WHEEL_50, { userId: user._id });
  };

  // wheel_100
  const get_wheel_100_prizes = async () => {
    return await axios.post(API_PATH.GET_WHEEL_100, { userId: user._id });
  };

  const play_wheel_100 = async () => {
    return await axios.post(API_PATH.PLAY_WHEEL_100, { userId: user._id });
  };

  //missions

  const get_user_missions_rank = async () => {
    return await axios.post(API_PATH.GET_USER_MISSIONS_RANK, { userId: user._id });
  };

  const get_levels = async () => {
    return await axios.post(API_PATH.GET_USER_MISSIONS_RANK, { userId: user._id });
  };

  const optInMission = async (id: string) => {
    return await axios.post(API_PATH.OPT_IN_MISSION, { userId: user._id, id: id });
  };

  const get_user_missions = async () => {
    return await axios.post(API_PATH.GET_USER_MISSIONS, { userId: user._id });
  };

  const get_user_one_mission = async (id: string) => {
    const idmis = id;
    return await axios.post(`${API_PATH.GET_USER_MISSIONS_ONE}/${idmis}`, { userId: user._id, id: idmis });
  };

  const check_mission = async (id: string) => {
    const idmis = id;
    return await axios.post(API_PATH.CHECK_USER_MISSION, { userId: user._id, id: idmis });
  };

  const claim_mission = async (id: string) => {
    const idmis = id;
    return await axios.post(API_PATH.CLAIM_USER_MISSION, { userId: user._id, id: idmis });
  };

  //shops
  const get_user_items = async () => {
    return await axios.post(API_PATH.GET_USER_ITEMS, { userId: user._id });
  };

  const get_user_one_item = async (id: string) => {
    const idmis = id;
    return await axios.post(`${API_PATH.GET_USER_ITEM}/${idmis}`, { userId: user._id, id: idmis });
  };

  const buy_item = async (id: string) => {
    const idmis = id;
    return await axios.post(API_PATH.BUY_USER_ITEMS, { userId: user._id, id: idmis });
  };


  //INBOX
  const get_notification_mission = async () => {
    return await axios.post(API_PATH.NOTIFICATION_MISSION);
  };

  const read_notification_mission = async (id: string) => {
    return await axios.post(API_PATH.READ_NOTIFICATION_MISSION, { id });
  };

  // sumsub
  const get_sumsub_access_token = async (token: string) => {
    return await axios.post(API_PATH.GET_SUMSUB_ACCESS_TOKEN, { token });
  };



  return (
    <ApiContext.Provider
      value={{
        initialize,
        getTest,
        login,
        register,
        send_code_email,
        send_withdrawal_verification_code,
        verify_email,
        verify_password,
        signout,
        get_sports_list,
        get_sports_matchs,
        get_sports_odds,
        get_sports_event,
        get_sports_history,
        get_sports_markets,
        get_sports_predictions,
        get_sports_teams,
        get_sports_bet_history,
        get_sports_betting_history,
        get_sports_cashout,
        get_sports_events,
        get_casino_provider,
        get_top_games,
        get_fast_games,
        get_casino_url,
        get_casino_demo_url,
        get_casino_history,
        get_casino_game,
        get_tiers,
        get_tickets,
        upload_file,
        update_user,
        delete_file,
        get_notification,
        get_bonus,
        get_bonuses_for_my_shares,
        get_games_by_wheel_history_id,
        get_bonus_detail,
        active_bonus,
        activate_bonus_no_deposit,
        cancel_bonus,
        getBonusHistoryListApi,
        get_purchases,
        activate_purchase,
        get_histories_wheel,
        activate_wheel,
        get_games_by_purchase_id,
        read_notification,
        get_referral,
        change_password,
        add_sports_bet,
        get_purchases_free_bets,
        verify_KYC,
        verify_token,
        verify_KYC_mobile,
        get_currencies,
        // add_currencies removed
        // change_currency removed
        get_balances,
        get_transactions,
        depositNow,
        withdrawal,
        exchangeNow,
        get_fiatNow,
        checkPaymentStatus,
        depositFiatQuikly,
        get_fiat_currencies,
        createTrioSession,
        checkTrioPaymentStatus,
        calcUsdtToCrypto,
        confirmSmartContractPayment,
        getSolanaDepositAddress,
        confirmSolanaDeposit,
        checkSolanaDeposits,
        getTronDepositAddress,
        confirmTronDeposit,
        get_banners,
        get_chat_messages,
        get_support_chat,
        get_unread_supports,
        get_blogs,
        get_freespin_prizes,
        get_daily_freespin_prizes,
        get_daily_freespin_prizes_for_not_login,
        play_freespin,
        play_freespin_daily,
        check_ip,
        get_scratch_game,
        check_scratch_game,
        check_win_scratch_game,
        get_history_wheels,
        activate_wheel_bonus,
        get_wheel_50_prizes,
        play_wheel_50,
        get_wheel_100_prizes,
        play_wheel_100,

        get_user_missions_rank,
        get_levels,
        get_user_missions,
        optInMission,
        get_user_one_mission,
        check_mission,
        claim_mission,

        get_user_items,
        get_user_one_item,
        buy_item,

        get_notification_mission,
        read_notification_mission,
        get_sumsub_access_token
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;