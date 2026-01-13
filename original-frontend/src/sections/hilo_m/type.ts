export type ISuit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type IRank =
  | 'A'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'Joker';

export interface ICard {
  rank: IRank;
  suit: ISuit;
}

export interface IBet {
  userId: string;
  currency: string;
  amount: number;
  status: 'BET' | 'WIN' | 'LOST';
  profit: number;
  betType: IBetType;
  multiplier: number;
}

export type IBetType =
  | 'hi'
  | 'low'
  | 'black'
  | 'red'
  | 'range_2_9'
  | 'range_j_q_k_a'
  | 'range_k_a'
  | 'joker'
  | 'a';
