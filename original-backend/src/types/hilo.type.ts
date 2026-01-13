/**
 * Type definitions for Hi-Lo game betting and card logic.
 * Defines bet types (high/low, color, range, joker), card suits/ranks, and game result types.
 * Used for type-safe Hi-Lo game operations and bet validation.
 */
export type IBetType =
    'hi' | 'low' | 'black' | 'red' |
    'range_2_9' | 'range_j_q_k_a' | 'range_k_a' | 'joker' | 'a';

export type ISuit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type IRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'Joker';

export interface ICard {
    rank: IRank;
    suit: ISuit;
}

export type IGameResult = 'WIN' | 'LOST';