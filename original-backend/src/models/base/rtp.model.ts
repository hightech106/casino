/**
 * Return to Player (RTP) model for storing game RTP configurations.
 * Defines the RTP percentage for each game type to control house edge.
 * Used by game services to ensure games operate at configured return rates.
 */
import { Document, Model, model, models, Schema } from 'mongoose';

export interface IGameRTP extends Document {
    game_type: string;
    rtp: number;
}

const GameRTPSchema = new Schema<IGameRTP, Model<IGameRTP>>({
    game_type: { type: String, required: true, unique: true },
    rtp: { type: Number, required: true },
}, { timestamps: true });

const GameRTPModel = (models.game_rtps as Model<IGameRTP>) || model<IGameRTP>('game_rtps', GameRTPSchema);

export default GameRTPModel; 