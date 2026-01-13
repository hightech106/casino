/**
 * Coinflip game model for storing head-to-head coin flip matches.
 * Tracks creator and joiner players, bet amounts, game results, and match state.
 * Used for matching players and managing coinflip game lifecycle.
 */
import { Document, model, Schema, Model, models } from 'mongoose';
import { IUser } from '../user/user.model';

export interface ICoinFlip extends Document {
    creator: Schema.Types.ObjectId | IUser;
    joiner: Schema.Types.ObjectId | IUser;
    side: boolean;
    amount: number;
    result: string;
    api: object;
    state: string;
    updated: Date;
}

const coinFlipModelSchema: Schema = new Schema(
    {
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        joiner: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        side: {
            type: Boolean,
            default: false
        },
        amount: {
            type: Number,
            default: 0
        },
        result: {
            type: String,
            emum: ['creator', 'joiner'],
            default: ''
        },
        api: {
            type: Object,
            default: {}
        },
        state: {
            type: String,
            emum: ['not', 'end'],
            default: 'not'
        },
        updated: {
            type: Date,
            default: Date.now()
        }
    },
    { timestamps: true }
);

coinFlipModelSchema.pre('find', function () {
    this.populate('creator', [
        'id',
        'username',
        'avatar',
        "first_name",
        "last_name",
        'balance'
    ]);
    this.populate('joiner', [
        'id',
        'username',
        'avatar',
        "first_name",
        "last_name",
        'balance'
    ]);
});

coinFlipModelSchema.pre('findOne', function () {
    this.populate('creator', [
        'id',
        'username',
        'avatar',
        "first_name",
        "last_name",
        'balance'
    ]);
    this.populate('joiner', [
        'id',
        'username',
        'avatar',
        "first_name",
        "last_name",
        'balance'
    ]);
});

coinFlipModelSchema.pre('findOneAndUpdate', function () {
    this.populate('creator', [
        'id',
        'username',
        'avatar',
        "first_name",
        "last_name",
        'balance'
    ]);
    this.populate('joiner', [
        'id',
        'username',
        'avatar',
        "first_name",
        "last_name",
        'balance'
    ]);
});

const CoinflipModel = (models.coinflipgames as Model<ICoinFlip>) || model<ICoinFlip>(
    'coinflipgames',
    coinFlipModelSchema
);

export default CoinflipModel;
