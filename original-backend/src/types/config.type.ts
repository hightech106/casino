/**
 * Type definitions for Express, Socket.IO, and Telegram bot contexts.
 * Defines extended request/response types, socket payloads, and bot session data structures.
 * Provides type safety for cross-cutting concerns like authentication and session management.
 */
import {
    Request as ExpressRequest,
    Response as ExpressResponse,
    NextFunction as ExpressNextFunction
} from 'express';
import { Context as BaseContext, SessionFlavor } from "grammy";
import { I18nFlavor } from "@grammyjs/i18n";
import { ConversationFlavor } from "@grammyjs/conversations";

import { Socket as SocketRequest } from 'socket.io';
import { Schema } from 'mongoose';

export type NetworkType = {
    name: string;
    icon: string;
};

export type Payload = { userId: Schema.Types.ObjectId } & any;
export type SocketPayload = {
    markedForDisconnect: boolean;
    lastAccess: number;
};
export type Request = ExpressRequest & Payload;
export type Response = ExpressResponse;
export type NextFunction = ExpressNextFunction;
export type Socket = SocketRequest & Payload & SocketPayload;

interface SessionData {
    writeMode: null;
    payout: null;
    task: null;
    address: string;
}

export type BotContext = BaseContext &
    SessionFlavor<SessionData> &
    ConversationFlavor &
    I18nFlavor;
