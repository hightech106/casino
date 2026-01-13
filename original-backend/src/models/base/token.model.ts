/**
 * Token model for storing JWT tokens and device tokens.
 * Manages token lifecycle including blacklisting, expiration, and device associations.
 * Supports multiple token types (access, refresh, reset password, email verification).
 */
import { models, Document, model, Schema, Model } from 'mongoose';
import { toJSON } from '../plugins';
import { SOCKET_STATUS_OPTIONS } from '../../config/static';

interface IToken extends Document {
    token: string;
    user: Schema.Types.ObjectId;
    type: string;
    socketId: string;
    expires?: Date;
    blacklisted: boolean;
    status: string;
    receiverId: string;
    deviceToken: string;
}

const tokenSchema = new Schema<IToken>(
    {
        token: {
            type: String,
            required: true,
            index: true
        },
        socketId: {
            type: String,
            default: ''
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        expires: {
            type: Date,
            required: false
        },
        blacklisted: {
            type: Boolean,
            default: false
        },
        receiverId: {
            type: String,
            default: null
        },
        deviceToken: {
            type: String,
            default: null
        },
        status: {
            type: String,
            default: SOCKET_STATUS_OPTIONS[0],
            enum: SOCKET_STATUS_OPTIONS
        }
    },
    {
        timestamps: true
    }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);
tokenSchema.index({ token: 1, socketId: 1, user: 1 });

const TokenModel = (models.token as Model<IToken>) || model<IToken>('token', tokenSchema);

export default TokenModel;
