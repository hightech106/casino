/**
 * Type definitions for Baccarat game logic and betting.
 * Defines card suits, ranks, chip values, betting positions, and player bet structures.
 * Used by baccarat controllers and models to ensure type-safe game operations.
 */
export type ISuit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type IRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface ICard {
    suit: ISuit;
    rank: IRank;
}

export type IChip = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type IPlace = 'Player' | 'Banker' | 'Tie' | 'PPair' | 'BPair';

export type IBet = {
    place: IPlace;
    chip: IChip;
    third: boolean;
}

export type IPlayer = {
    PlayerID: string,
    currency: string,
    bets: IBet[]
}
