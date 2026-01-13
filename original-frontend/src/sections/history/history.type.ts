export interface IHistory {
    _id: string;
    user: {
        _id: string;
        avatar: string;
    };
    gameid: string;
    type: string;
    bet: number;
    target: number;
    payout: number;
    createdAt: string;
}  