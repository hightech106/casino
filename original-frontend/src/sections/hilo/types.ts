
export type ISuit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type IRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type IBetType = "Start" | "Skip" | "Lower" | "Higher" | "LOST";

export interface ICard {
    suit: ISuit;
    rank: IRank;
}

export interface ICardData {
    newCard: ICard | null,
    currentCard: ICard | null,
    rounds: {
        card: ICard;
        type: IBetType;
        multiplier: number
    }[]
}


export type IMULTIPLIER = {
    [key in IRank]: { [key in 'Lower' | 'Higher']: number }
}
