export type ISuit = "Hearts" | "Diamonds" | "Clubs" | "Spades";
export type ICard =
    | {
        rank: string;
        suit: "Hearts" | "Diamonds" | "Clubs" | "Spades" | string;
    }
    | undefined;

