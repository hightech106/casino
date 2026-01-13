export type RowProps = {
  id: string;
  username: string;
  odds: number;
  amount: number;
  avatarUrl: string;
};

export type PlayerType = {
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  status: number;
  playerID: string;
  betAmount: number;
  autoCashOut?: number;
  createdAt?: string;
  forcedCashout?: number;
  stoppedAt?: number;
  currency?: string;
  currencyIcon?: string;
  winningAmount?: number;
};

export type BetType = {
  status: number;
  playerID: string;
  stoppedAt: number;
  winningAmount: number;
};

export type GameEndType = {
  _id: string;
  crashPoint: number;
  publicSeed: string;
  privateHash: string;
  privateSeed: string;
};
