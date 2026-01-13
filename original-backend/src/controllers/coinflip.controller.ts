/**
 * Coinflip game controller for head-to-head coin flip betting.
 * Manages game creation, joining, result determination, and GGR tracking.
 * Handles matching players and distributing winnings based on coin flip outcomes.
 */
import { Server, Socket } from 'socket.io';
import { UserModel, CoinflipModel, GameHistoryModel, GameGGRModel } from '@models/index';

import { IUser } from '@models/user/user.model';
import { sessionService, userService, gameService } from '@services/index';
import { saveGGR } from './ggr.controller';
// import GameRTPModel from '@models/base/config.model';

import { Response, Request, NextFunction } from '../types/config.type';
import { ICreateGame } from '../types/coinflip.type';

const GAME_TYPE = 'coinflip';

const checkWinLose = (random: boolean, comparison: boolean): 'creator' | 'joiner' => {
    return random === comparison ? 'creator' : 'joiner';
};

function getRandomNumber() {
    return Math.round(Math.random()) === 0;
}

export const getCoinflip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const query = {
            $or: [
                { state: 'not' },
                {
                    state: 'end',
                    updatedAt: {
                        $gte: new Date().getTime() - 1000 * 60 * 10
                    }
                }
            ]
        };
        const data = await CoinflipModel.find(query);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const coinflipSocket = (io: Server): void => {
    io.of('/coinflip').on('connection', (socket: Socket) => {
        console.log('---------Coinflip connected---------');

        let loggedIn = false;
        let user: IUser | null = null;

        const authenticate = async (token: string) => {
            if (!token) {
                loggedIn = false;
                user = null;
                return socket.emit('error', 'No authentication token provided, authorization declined');
            }

            try {
                const session = await sessionService.getSession(token);
                if (!session) {
                    return socket.emit('error', 'No authentication token provided, authorization declined');
                }
                user = await UserModel.findOne({ _id: session.userId });
                if (user) {
                    loggedIn = true;
                    socket.join(String(user._id));
                }
            } catch (error) {
                loggedIn = false;
                user = null;
                return socket.emit('notify-error', 'Authentication token is not valid');
            }
        };

        const create = async (param: ICreateGame) => {
            if (!loggedIn) return socket.emit('error', 'No authentication token provided, authorization declined');
            const { amount, side } = param;
            const me = await UserModel.findById(user._id);
            if (!me || amount > user.balance) {
                return socket.emit('error', 'Your balance not enough');
            }
            const newRoom = await CoinflipModel.create({
                amount,
                side,
                creator: me._id
            });

            const query = {
                gameid: newRoom._id,
                user: me._id,
                bet: amount,
                target: 2,
                type: `${GAME_TYPE}:create`
            };

            await GameHistoryModel.create(query);

            const updated = await userService.handleBalance(me._id, amount, 'BET', GAME_TYPE, newRoom._id.toString());

            const result = {
                ...newRoom.toObject(),
                creator: {
                    _id: updated._id,
                    id: updated.id,
                    username: updated.username,
                    avatar: updated.avatar,
                    first_name: updated.first_name,
                    last_name: updated.last_name,
                    balance: updated.balance
                }
            };

            io.of('/coinflip').emit('update-game', result);
        };

        const join = async (gameId: string) => {
            if (!loggedIn) return socket.emit('error', 'No authentication token provided, authorization declined');
            try {
                const room = await CoinflipModel.findById(gameId);
                if (!room) return socket.emit('error', 'Game not found!');
                if (room.state === 'end') return socket.emit('error', 'Game already ended!');

                const me = await UserModel.findById(user._id);
                if (!me || room.amount > user.balance) {
                    return socket.emit('error', 'Your balance not enough');
                }

                const random = getRandomNumber();
                console.log('🚀 ~ random:', random);

                const result: 'creator' | 'joiner' = checkWinLose(
                    random,
                    // random.result.random.data[0],
                    room.side
                );

                const hisQurey = {
                    gameid: room._id,
                    user: me._id,
                    bet: room.amount,
                    target: 2,
                    type: 'confilp:join',
                    payout: 0
                };

                const win_amount = room.amount + Number((room.amount * 0.98).toFixed(2));
                if (result === 'creator') {
                    await userService.handleBalance(String(room.creator), win_amount, 'WIN', GAME_TYPE, room._id.toString());
                    await userService.handleBalance(user._id, room.amount, 'BET', GAME_TYPE, room._id.toString());

                    // await UserModel.findByIdAndUpdate(
                    //     room.creator,
                    //     {
                    //         $inc: {
                    //             balance: win_amount,
                    //             profit: win_amount, won: 1,
                    //         }
                    //     },
                    // );

                    await GameHistoryModel.findOneAndUpdate(
                        {
                            gameid: room._id,
                            user: room.creator
                        },
                        {
                            payout: win_amount
                        }
                    );
                } else {
                    hisQurey.payout = win_amount;
                    const amt = win_amount - room.amount;
                    await userService.handleBalance(user._id, amt, 'WIN', GAME_TYPE, room._id.toString());
                }

                await GameHistoryModel.create(hisQurey);

                // Save GGR data
                const totalBets = room.amount * 2; // Both creator and joiner bet the same amount
                const totalWins = result === 'creator' ? win_amount : (win_amount - room.amount);
                await saveGGR(GAME_TYPE, totalBets, totalWins);

                const updated = await CoinflipModel.findByIdAndUpdate(
                    room._id,
                    { joiner: user._id, result, api: 'random', state: 'end', updated: Date.now() },
                    { new: true, upsert: true }
                );

                return io.of('/coinflip').emit('update-game', updated);
            } catch (error) {
                console.log(error, '==>joing');
                return socket.emit('error', 'Interanal server error!');
            }
        };

        socket.on('auth', authenticate);
        socket.on('create-game', create);
        socket.on('join-game', join);
    });
};
