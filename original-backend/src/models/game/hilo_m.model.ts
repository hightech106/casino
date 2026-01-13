/**
 * Hi-Lo multiplayer game model for storing Hi-Lo game rounds and player bets.
 * Tracks cards, player bets, bet types (high/low/color/range), and game results.
 * Manages multi-player Hi-Lo games with various betting options and card sequences.
 */
import { Schema, Document, model, Model, models } from 'mongoose';
import { IBetType, ICard } from '@root/types/hilo.type';

interface IBet {
    userId: string;
    avatar: string;
    currency: string;
    amount: number;
    status: "BET" | "WIN" | "LOST";
    profit: number;
    multiplier: number;
    betType: IBetType,
}

const BetSchema = new Schema<IBet>({
    userId: {
        type: String,
        required: true
    },
    betType: {
        type: String,
        enum: ["hi", "low", "black", "red", "range_2_9", "range_j_q_k_a", "range_k_a", "joker", "a"],
        required: true
    },
    currency: { type: String },
    avatar: {
        type: String,
        default: ""
    },
    multiplier: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["BET", "WIN", "LOST"], required: true
    },
    profit: { type: Number, default: 0 },
});

const CardSchema = new Schema<ICard>({
    rank: { type: String, required: true },
    suit: { type: String, enum: ["Hearts", "Diamonds", "Clubs", "Spades"] }
})

interface IGame extends Document {
    privateSeed: string;
    publicSeed: string;
    bets: IBet[];
    startCard: ICard,
    status: string;
}

const HiloMGameSchema = new Schema<IGame>({
    privateSeed: {
        type: String,
        required: true
    },
    publicSeed: {
        type: String,
        required: true
    },
    bets: {
        type: [BetSchema],
        default: []
    },
    startCard: {
        type: CardSchema,
        required: true
    },
    status: {
        type: String,
        enum: ['BET', 'END'], required: true
    }
}, { timestamps: true });

const HiloMModel = (models.hilo_m_games as Model<IGame>) || model<IGame>('hilo_m_games', HiloMGameSchema);

export default HiloMModel;
