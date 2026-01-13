import { ICard } from 'src/sections/hilo/types';

export interface IPlinkoParam {
  amount: number;
  difficulty: string;
  pins: number;
}

export interface IMinePlayParam {
  mines: number;
  amount: number;
}

export interface IMineAutoBetParam {
  points: number[];
  mines: number;
  amount: number;
}

export interface IWheel {
  amount: number;
  color: string;
  mode: boolean;
}

export interface IDice {
  amount: number;
  mode: boolean;
  multiplier: number;
  target: number;
}

export interface ILimbo {
  amount: number | string;
  multiplier: number | string;
}

export interface IKeno {
  amount: number | string;
  selected: number[];
}

export interface IHilo {
  amount: number;
  startCard: ICard;
}

export interface IGoal {
  amount: number;
  size: number;
}

export interface IRoulette {
  placeId: string | number;
  amount: number;
}

export type ApiContextType = {
  initialize: () => Promise<any>;
  register: (data: any) => Promise<any>;
  loginApi: (data: string, callback_url: string) => Promise<any>;
  getCrashSchemaApi: () => Promise<any>;
  getUserCrashApi: () => Promise<any>;
  getUserHisotryApi: () => Promise<any>;
  getCoinFlipApi: () => Promise<any>;
  playPlinkoApi: (data: IPlinkoParam) => Promise<any>;
  getPlinkoHistoryApi: () => Promise<any>;

  playFlowerPokerApi: () => Promise<any>;
  betFlowerPokerApi: (amount: number) => Promise<any>;
  getFlowerPokerHistoryApi: () => Promise<any>;

  getMineApi: () => Promise<any>;
  playMineApi: (data: IMinePlayParam) => Promise<any>;
  betMineApi: (point: number) => Promise<any>;
  getMineHistoryApi: () => Promise<any>;

  cashoutMineApi: () => Promise<any>;
  autoBetMineApi: (data: IMineAutoBetParam) => Promise<any>;
  playBlackjackApi: (data: number) => Promise<any>;
  hitBlackjackApi: () => Promise<any>;
  standBlackjackApi: () => Promise<any>;
  doubleBlackjackApi: () => Promise<any>;
  splitBlackjackApi: (data: number) => Promise<any>;
  insuranceBlackjackApi: (data: boolean) => Promise<any>;
  getBlackjackHistoryApi: () => Promise<any>;

  playWheelApi: (data: IWheel) => Promise<any>;
  getWheelHistoryApi: () => Promise<any>;

  playDiceApi: (data: IDice) => Promise<any>;
  getDiceHistoryApi: () => Promise<any>;

  playDiamondsApi: (amount: number) => Promise<any>;
  getDiamondsHistoryApi: () => Promise<any>;

  playLimboApi: (data: ILimbo) => Promise<any>;
  getLimboHistoryApi: () => Promise<any>;

  playKenoApi: (data: IKeno) => Promise<any>;
  getKenoHistoryApi: () => Promise<any>;

  getHiloApi: () => Promise<any>;
  createHiloApi: (data: IHilo) => Promise<any>;
  betHiloApi: (type: string) => Promise<any>;
  cashoutHiloApi: (data: IHilo) => Promise<any>;
  getHiloHistoryApi: () => Promise<any>;

  getVPApi: () => Promise<any>;
  betVPApi: (data: number) => Promise<any>;
  drawVPApi: (data: number[]) => Promise<any>;
  getVPHistoryApi: () => Promise<any>;

  createBaccaratSingleApi: (data: string) => Promise<any>;
  betBaccaratSingleApi: (data: any) => Promise<any>;
  getBaccaratHistoryApi: () => Promise<any>;

  createGoalApi: (data: IGoal) => Promise<any>;
  betGoalApi: (data: number) => Promise<any>;
  cashoutGoalApi: () => Promise<any>;
  getGoalHistoryApi: () => Promise<any>;

  createRouletteApi: (data: string) => Promise<any>;
  betRouletteApi: (data: IRoulette[]) => Promise<any>;
  getRouletteHistoryApi: () => Promise<any>;
};
