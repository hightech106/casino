import React, { createContext } from 'react';
import axios from 'src/utils/axios';
import { dispatch } from 'src/store';
import { userAction } from 'src/store/reducers/auth';
import {
  ApiContextType,
  IHilo,
  IDice,
  IKeno,
  ILimbo,
  IMineAutoBetParam,
  IMinePlayParam,
  IPlinkoParam,
  IWheel,
  IGoal,
  IRoulette,
} from './type';

const ApiContext = createContext<ApiContextType | null>(null);
/* eslint-disable */
export const ApiProvider = ({ children }: { children: React.ReactElement }) => {
  // auth

  const initialize = async () => {
    const res = await axios.get('auth/me');
    if (!res?.data) return;
    return dispatch(userAction(res.data));
  };

  const loginApi = async (data: string, callback_url: string) => {
    return await axios.post('auth/login', { token: data, callback_url });
  };

  const register = async (data: any) => {
    return await axios.post('auth/register', data);
  };

  // crash
  const getCrashSchemaApi = async () => {
    return await axios.get('game/crash');
  };

  const getUserCrashApi = async () => {
    return await axios.get('game/crash/me');
  };

  // coinflip

  const getCoinFlipApi = async () => {
    return await axios.get('game/coinflip');
  };

  // plinko

  const playPlinkoApi = async (data: IPlinkoParam) => {
    return await axios.post('game/plinko', data);
  };

  const getPlinkoHistoryApi = async () => {
    return await axios.get('game/plinko/history');
  };

  const getUserHisotryApi = async () => {
    return await axios.get('user/history');
  };

  // flower poker

  const playFlowerPokerApi = async () => {
    return await axios.post('game/flower-poker/create');
  };

  const betFlowerPokerApi = async (amount: number) => {
    return await axios.post('game/flower-poker/bet', { amount });
  };

  const getFlowerPokerHistoryApi = async () => {
    return await axios.get('game/flower-poker/history');
  };

  // mine

  const getMineApi = async () => {
    return await axios.get('game/mine/status');
  };

  const playMineApi = async (data: IMinePlayParam) => {
    return await axios.post('game/mine/create', data);
  };

  const betMineApi = async (point: number) => {
    return await axios.post('game/mine/bet', { point });
  };

  const cashoutMineApi = async () => {
    return await axios.post('game/mine/cashout');
  };

  const autoBetMineApi = async (data: IMineAutoBetParam) => {
    return await axios.post('game/mine/autobet', data);
  };

  const getMineHistoryApi = async () => {
    return await axios.get('game/mine/history');
  };

  // blackjack

  const playBlackjackApi = async (amount: number) => {
    return await axios.post('game/blackjack/start', { amount });
  };

  const hitBlackjackApi = async () => {
    return await axios.post('game/blackjack/hit');
  };

  const standBlackjackApi = async () => {
    return await axios.post('game/blackjack/stand');
  };

  const doubleBlackjackApi = async () => {
    return await axios.post('game/blackjack/double');
  };

  const splitBlackjackApi = async (amount: number) => {
    return await axios.post('game/blackjack/split', { amount });
  };

  const insuranceBlackjackApi = async (confirm: boolean) => {
    return await axios.post('game/blackjack/insurance', { confirm });
  };

  const getBlackjackHistoryApi = async () => {
    return await axios.get('game/blackjack/history');
  };
  // Wheel

  const playWheelApi = async (data: IWheel) => {
    return await axios.post('game/wheel/play', data);
  };

  const getWheelHistoryApi = async () => {
    return await axios.get('game/wheel/history');
  };

  // Dice

  const playDiceApi = async (data: IDice) => {
    return await axios.post('game/dice/play', data);
  };

  const getDiceHistoryApi = async () => {
    return await axios.get('game/dice/history');
  };

  // Diamonds

  const playDiamondsApi = async (amount: number) => {
    return await axios.post('game/diamonds/play', { amount });
  };

  const getDiamondsHistoryApi = async () => {
    return await axios.get('game/diamonds/history');
  };

  // Limbo

  const playLimboApi = async (data: ILimbo) => {
    return await axios.post('game/limbo/play', data);
  };

  const getLimboHistoryApi = async () => {
    return await axios.get('game/limbo/history');
  };

  // Keno

  const playKenoApi = async (data: IKeno) => {
    return await axios.post('game/keno/play', data);
  };

  const getKenoHistoryApi = async () => {
    return await axios.get('game/keno/history');
  };

  // Hilo

  const getHiloApi = async () => {
    return await axios.get('game/hilo/game');
  };

  const createHiloApi = async (data: IHilo) => {
    return await axios.post('game/hilo/create', data);
  };

  const betHiloApi = async (type: string) => {
    return await axios.post('game/hilo/bet', { type });
  };

  const cashoutHiloApi = async (data: IHilo) => {
    return await axios.post('game/hilo/cashout', data);
  };

  const getHiloHistoryApi = async () => {
    return await axios.get('game/hilo/history');
  };

  // Videopoker

  const getVPApi = async () => {
    return await axios.get('game/videopoker');
  };

  const betVPApi = async (amount: number) => {
    return await axios.post('game/videopoker/bet', { amount });
  };

  const drawVPApi = async (holdIndexes: number[]) => {
    return await axios.post('game/videopoker/draw', { holdIndexes });
  };

  const getVPHistoryApi = async () => {
    return await axios.get('game/videopoker/history');
  };

  // Baccarat

  const createBaccaratSingleApi = async (clientSeed: string) => {
    return await axios.post('game/baccarat_s', { clientSeed });
  };

  const betBaccaratSingleApi = async (data: any) => {
    return await axios.post('game/baccarat_s/bet', data);
  };

  const getBaccaratHistoryApi = async () => {
    return await axios.get('game/baccarat_s/history');
  };

  // Goal

  const createGoalApi = async (data: IGoal) => {
    return await axios.post('game/goal/create', data);
  };

  const betGoalApi = async (position: number) => {
    return await axios.post('game/goal/bet', { position });
  };

  const cashoutGoalApi = async () => {
    return await axios.post('game/goal/cashout');
  };

  const getGoalHistoryApi = async () => {
    return await axios.get('game/goal/history');
  };

  // Roulette

  const createRouletteApi = async (clientSeed: string) => {
    return await axios.post('game/roulette/create', { clientSeed });
  };

  const betRouletteApi = async (bets: IRoulette[]) => {
    return await axios.post('game/roulette/bet', { bets });
  };

  const getRouletteHistoryApi = async () => {
    return await axios.get('game/roulette/history');
  };

  return (
    <ApiContext.Provider
      value={{
        initialize,
        loginApi,
        register,
        getCrashSchemaApi,
        getUserCrashApi,
        getUserHisotryApi,
        getCoinFlipApi,
        playPlinkoApi,
        getPlinkoHistoryApi,

        playFlowerPokerApi,
        betFlowerPokerApi,
        getFlowerPokerHistoryApi,

        getMineApi,
        playMineApi,
        betMineApi,
        cashoutMineApi,
        autoBetMineApi,
        getMineHistoryApi,

        playBlackjackApi,
        hitBlackjackApi,
        standBlackjackApi,
        doubleBlackjackApi,
        splitBlackjackApi,
        insuranceBlackjackApi,
        getBlackjackHistoryApi,

        playWheelApi,
        getWheelHistoryApi,

        playDiceApi,
        getDiceHistoryApi,

        playDiamondsApi,
        getDiamondsHistoryApi,

        playLimboApi,
        getLimboHistoryApi,

        playKenoApi,
        getKenoHistoryApi,

        getHiloApi,
        createHiloApi,
        betHiloApi,
        cashoutHiloApi,
        getHiloHistoryApi,

        getVPApi,
        betVPApi,
        drawVPApi,
        getVPHistoryApi,

        createBaccaratSingleApi,
        betBaccaratSingleApi,
        getBaccaratHistoryApi,

        createGoalApi,
        betGoalApi,
        cashoutGoalApi,
        getGoalHistoryApi,

        createRouletteApi,
        betRouletteApi,
        getRouletteHistoryApi,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;
