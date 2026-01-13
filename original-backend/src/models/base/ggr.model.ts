/**
 * Gross Gaming Revenue (GGR) model for tracking financial metrics per game type.
 * Stores aggregated bet totals, win totals, and currency for revenue calculations.
 * Indexed for efficient time-based queries and financial reporting.
 */
import { Document, Model, model, models, Schema } from 'mongoose';

export interface IGameGGR extends Document {
    game_type: string;
    total_bets: number;
    total_wins: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}

const GameGGRSchema = new Schema<IGameGGR, Model<IGameGGR>>({
    game_type: { type: String, required: true },
    total_bets: { type: Number, default: 0 },
    total_wins: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
}, { timestamps: true });

// Create compound index for efficient queries
GameGGRSchema.index({ game_type: 1, createdAt: 1 });

const GameGGRModel = (models.game_ggrs as Model<IGameGGR>) || model<IGameGGR>('game_ggrs', GameGGRSchema);

export default GameGGRModel; 