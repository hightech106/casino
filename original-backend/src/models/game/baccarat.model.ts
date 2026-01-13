/**
 * Baccarat game model for storing baccarat game rounds and player bets.
 * Tracks cards, player bets, game results, and provably fair seeds.
 * Manages multi-player baccarat games with various betting positions (Player, Banker, Tie, Pairs).
 */
import { Schema, Document, model, Model, models } from 'mongoose';
import { IBet, ICard } from '@root/types/baccarat.type';

type IPlayer = {
    PlayerID: string,
    bets: IBet[],
    currencyId: string
}

// Mongoose Schema and Model Definitions

const CardSchema = new Schema<ICard>({
    suit: {
        type: String,
        enum: ['Hearts', 'Diamonds', 'Clubs', 'Spades'],
        required: true
    },
    rank: {
        type: String,
        enum: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
        required: true
    },
});

const BetSchema = new Schema<IBet>({
    place: {
        type: String,
        enum: ['Player', 'Banker', 'Tie', 'PPair', 'BPair'],
        required: true
    },
    chip: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6],
        required: true
    },
});

const PlayerSchema = new Schema<IPlayer>({
    PlayerID: {
        type: String,
        required: true
    },
    bets: {
        type: [BetSchema],
        required: true
    },
    currencyId: {
        type: String,
        required: true
    },
});

interface IBaccarat extends Document {
    privateSeed: string;
    publicSeed: string;
    bets: IPlayer[];
    playerHand: ICard[];
    bankerHand: ICard[];
    status: string;
}

const baccaratModelSchema = new Schema<IBaccarat>({
    privateSeed: {
        type: String, required: true
    },
    publicSeed: {
        type: String, required: true
    },
    bets: {
        type: [PlayerSchema],
        default: []
    },
    playerHand: {
        type: [CardSchema],
        default: []
    },
    bankerHand: {
        type: [CardSchema],
        default: []
    },
    status: {
        type: String,
        enum: ['BET', 'END'],
        required: true
    }
},
    { timestamps: true }
);


const BaccaratModel = (models.baccaratgames as Model<IBaccarat>) || model<IBaccarat>(
    'baccaratgames',
    baccaratModelSchema
);

export default BaccaratModel;
