/**
 * Slide game model for storing slide game rounds and player bets.
 * Tracks player bets, target multipliers, game status, and player information.
 * Used for managing slide game state and player betting positions.
 */
import mongoose, { Schema, Document, Model, models } from 'mongoose';

export type IPlayer = {
    playerID: string;
    betAmount: number;
    avatar?: string;
    target: number;
    username: string;
    first_name: string;
    last_name: string;
    currency: string;
    currencyIcon: string;
    status: string;
};

export interface ISlide extends Document {
    privateSeed: string;
    privateHash: string;
    publicSeed: string;
    players: IPlayer[];
    crashPoint: number;
    status: string;
    startedAt: Date;
}

const PlayerSchema = new Schema<IPlayer>({
    playerID: { type: String },
    betAmount: { type: Number },
    target: { type: Number },
    username: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    avatar: { type: String },
    currency: { type: String },
    currencyIcon: { type: String },
    status: { type: String }
});

const slideSchema: Schema = new Schema(
    {
        privateSeed: { type: String },
        privateHash: { type: String },
        publicSeed: {
            type: String,
            default: null
        },
        players: [PlayerSchema],
        crashPoint: { type: Number, default: 1 },
        status: { type: String },
        startedAt: { type: Date }
    },
    { timestamps: true }
);

const SlideModel = (models.slidegames as Model<ISlide>) || mongoose.model<ISlide>('slidegames', slideSchema);

export default SlideModel;
