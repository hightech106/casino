/**
 * Game history model for storing detailed game play records.
 * Tracks individual game rounds with bet amounts, targets, payouts, and game types.
 * Provides historical data for user game history and analytics.
 */
import { Document, model, Schema, Model, models } from 'mongoose';

export interface IGameHistory extends Document {
    user: Schema.Types.ObjectId;
    gameid: string;
    type: string;
    bet: number;
    target: number;
    payout: number;
    createdAt: string;
}

const gameHistorySchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        gameid: {
            type: String,
            require: true
        },
        type: {
            type: String,
            require: true
        },
        bet: {
            type: Number,
            require: true
        },
        target: {
            type: Number,
            require: true
        },
        payout: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

gameHistorySchema.pre('findOneAndUpdate', function () {
    this.populate('user', ['userId', 'first_name', 'last_name', 'avatar', 'username', 'currency', 'currencyIcon']);
});

gameHistorySchema.pre('findOne', function () {
    this.populate('user', ['userId', 'first_name', 'last_name', 'avatar', 'username', 'currency', 'currencyIcon']);
});

gameHistorySchema.pre('find', function () {
    this.populate('user', ['userId', 'first_name', 'last_name', 'avatar', 'username', 'currency', 'currencyIcon']);
});

gameHistorySchema.pre('save', function () {
    this.populate('user', ['userId', 'first_name', 'last_name', 'avatar', 'username', 'currency', 'currencyIcon']);
});

const GameHistoryModel = (models['game-histories'] as Model<IGameHistory>) || model<IGameHistory>('game-histories', gameHistorySchema);

export default GameHistoryModel;
