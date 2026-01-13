/**
 * Session model for tracking user authentication sessions and socket connections.
 * Stores JWT tokens, IP addresses, socket IDs, and session expiration times.
 * Used by authentication middleware to validate and manage user sessions.
 */
import mongoose, { Schema, Model, models } from 'mongoose';
import { toJSON } from '../plugins';

export interface ISession extends Document {
    _id: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    token: string;
    ip: string;
    socketId: string;
    expiredTime: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ModelSchema = new mongoose.Schema<ISession>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        ip: {
            type: String,
        },
        token: {
            type: String,
            required: true
        },
        socketId: {
            type: String,
            default: ""
        },
        expiredTime: {
            type: Date,
            default: Date.now,
            required: true
        }
    },
    { timestamps: true }
);

// add plugin that converts mongoose to json
ModelSchema.plugin(toJSON);
ModelSchema.index({ userId: 1, token: 1 });

const SessionModel = (models.sessions as Model<ISession>) || mongoose.model<ISession>('sessions', ModelSchema);

export default SessionModel;
