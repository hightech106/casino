
export type ISuit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type IRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type ICard = {
    rank: string;
    suit: 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades' | string;
} | undefined;
