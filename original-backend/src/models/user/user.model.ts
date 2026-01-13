/**
 * User model schema and interface definitions.
 * Defines user account structure including balance, betting statistics, profile data, and authentication fields.
 * Includes static method for checking username availability and integrates with toJSON plugin.
 */
import { Document, Model, model, models, Schema } from 'mongoose';
import { toJSON } from '../plugins';
import { USER_STATUS_OPTION } from '../../config/static';

export interface IUser extends Document {
    _id: string;
    userId: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    status: string;
    balance: number;
    realBalance: number;
    bet: number;
    won: number;
    avatar: string;
    currency: string;
    currencyIcon: string;
    callback_url: string;
    role: string;
}

export interface IUserModel extends Model<IUser> {
    isUsernameTaken: (username: string, excludeUserId?: string) => Promise<boolean>;
}

const ModelSchema = new Schema<IUser, IUserModel>(
    {
        userId: {
            type: String,
            required: true
        },
        username: {
            type: String,
            default: ''
        },
        first_name: {
            type: String,
            default: ''
        },
        last_name: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        },
        balance: {
            type: Number,
            default: 0
        },
        realBalance: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: ''
        },
        currencyIcon: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: ''
        },
        callback_url: {
            type: String,
            default: ''
        },
        bet: {
            type: Number,
            default: 0
        },
        won: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: USER_STATUS_OPTION,
            default: USER_STATUS_OPTION[0]
        },
        role: {
            type: String,
            enum: ['admin', 'player'],
            default: 'player',
        },
    },
    {
        timestamps: true
    }
);

// add plugin that converts mongoose to json
ModelSchema.plugin(toJSON);
ModelSchema.index({ userId: 1, username: 1, email: 1 });

ModelSchema.statics.isUsernameTaken = async function (name: string, excludeUserId?: string) {
    const user = await this.findOne({ name, _id: { $ne: excludeUserId } });
    return !!user;
};

const UserModel: IUserModel =
    (models.users as unknown as IUserModel) || model<IUser, IUserModel>('users', ModelSchema);

export default UserModel;
