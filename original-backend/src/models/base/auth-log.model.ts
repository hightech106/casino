/**
 * Authentication log model for tracking user login/logout events and security auditing.
 * Records IP addresses, user agents, device types, and session lifecycle events.
 * Used for security monitoring and user activity analysis.
 */
import mongoose, { Model, models, Schema } from 'mongoose';
import { toJSON } from '../plugins';

export interface IAuthLog extends Document {
    _id: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    ip: string;
    userAgent: string;
    device: string;
    isLive: boolean;
    endReason: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const ModelSchema = new mongoose.Schema<IAuthLog>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        ip: {
            type: String,
            default: ''
        },
        userAgent: {
            type: String,
            required: true
        },
        device: {
            type: String,
            enum: {
                values: ['desktop', 'mobile', ''],
                message: '{VALUE} status is not supported.'
            },
            required: true
        },
        isLive: { type: Boolean, default: true },
        endReason: { type: String, default: '' }
    },
    { timestamps: true }
);

ModelSchema.index({ userId: 1, ip: 1 });
ModelSchema.plugin(toJSON);

const AuthLogModel = (models['auth-logs'] as Model<IAuthLog>) || mongoose.model<IAuthLog>('auth-logs', ModelSchema);

export default AuthLogModel;
