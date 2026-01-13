export type IChip = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type IPlace = 'Player' | 'Banker' | 'Tie' | 'PPair' | 'BPair';

export type IBet = {
    place: IPlace;
    chip: IChip;
}

export type IPlayer = {
    PlayerID: string,
    bets: IBet[],
    currencyId: string
}

export type ISuit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type IRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface ICard {
    suit: ISuit;
    rank: IRank;
}
