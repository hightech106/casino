/**
 * Type definitions for Crash game state, history, and player betting.
 * Defines game rounds, player bets, crash points, and provably fair seed structures.
 * Includes formatted types for displaying game state and player information in real-time.
 */
export type IGameHistoryType = {
    _id: string;
    privateHash: string;
    privateSeed: string;
    publicSeed: string;
    crashPoint: number;
    createdAt: Date;
};

export type IPlayerBetProps = {
    playerID: string;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string;
    currency: string;
    currencyIcon: string;
    betAmount: number;
    autoCashOut: number;
    forcedCashout: boolean;
    status: number;
    createdAt: Date;
    stoppedAt?: number;
    winningAmount?: number;
};

export type IFormattedType = {
    playerID: string;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string;
    autoCashOut: number;
    currency: string;
    currencyIcon: string;
    betAmount: number;
    status: number;
    stoppedAt?: number;
    winningAmount?: number;
};

export type IGameStateType = {
    _id: string | null;
    duration: number;
    crashPoint: number;
    pendingCount: number;
    privateSeed: string;
    privateHash: string;
    publicSeed: string;
    players: { [key: string]: IPlayerBetProps };
    pending: {
        [key: string]: {
            betAmount: number;
            autoCashOut: number;
            username: string;
        };
    };
    pendingBets: IFormattedType[];
    startedAt: Date | null;
    status: number;
};

export type IGameType = {
    _id: string;
    status: number;
    startedAt: Date;
    elapsed: number;
    players: IFormattedType[];
    privateHash: string;
    publicSeed: string;
    crashPoint?: number;
};
