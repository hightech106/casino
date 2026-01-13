/**
 * Common game model for storing generic game bet records across all game types.
 * Tracks user bets, odds, amounts, profits, and game status for unified game history.
 * Used as a base schema for game-specific models to maintain consistent data structure.
 */
import { Schema, model, Model, models } from 'mongoose';

export interface ICommonGame {
    userId: string;
    odds: number;
    amount: number;
    profit: number;
    betting: any;
    aBetting: any;
    game_type: string;
    status: string;
    createdAt: string;
}

const GamesSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            require: true
        },
        odds: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        profit: {
            type: Number,
            default: 0,
            require: true
        },
        betting: {
            type: Object
        },
        aBetting: {
            type: Object
        },
        game_type: {
            type: String,
            require: true
        },
        status: {
            type: String,
            default: 'BET',
            enum: ['BET', 'DRAW', 'LOST', 'WIN'],
        }
    },
    { timestamps: true }
);

const CommonGameModel = (models.common_games as Model<ICommonGame>) || model<ICommonGame>(
    'common_games',
    GamesSchema
);

export default CommonGameModel;