/**
 * Crash game model for storing crash game rounds and player bets.
 * Tracks crash points, provably fair seeds, player positions, and game status.
 * Used for real-time game state management and historical game data storage.
 */
import { AnyObject, Document, Schema, Types, model, Model, models } from 'mongoose';

export interface ICrash extends Document {
    _id: string;
    crashPoint: number;
    players: AnyObject;
    refundedPlayers: string[];
    privateSeed: string;
    privateHash: string;
    publicSeed: string;
    status: number;
    created: Date;
    startedAt: Date;
}

// Setup CrashGame Schema
const crashSchema = new Schema(
    {
        // Basic fields
        crashPoint: Number,
        players: Object,
        refundedPlayers: Array,

        // Provably Fair fields
        privateSeed: String,
        privateHash: String,
        publicSeed: {
            type: String,
            default: null
        },

        // Game status
        status: {
            type: Number,
            default: 1
            /**
             * Status list:
             * 1 = Not Started
             * 2 = Starting
             * 3 = In Progress
             * 4 = Over
             * 5 = Blocking
             * 6 = Refunded
             */
        },

        // When game was created
        created: {
            type: Date,
            default: Date.now
        },

        // When game was started
        startedAt: {
            type: Date
        }
    },
    {
        minimize: false
    }
);

// Create and export the new model
const CrashModel = (models.crashgames as Model<ICrash>) || model<ICrash>('crashgames', crashSchema);

export default CrashModel;
