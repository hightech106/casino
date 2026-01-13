export enum GAME_STATUS {
    READY,
    LIVE,
}

export enum MINE_OBJECT {
    HIDDEN = 0,
    GEM = 1,
    BOMB = 2,
}

export type MineArea = {
    point: number;
    mine: MINE_OBJECT | null;
    mined: boolean;
};