/**
 * Socket.IO server setup for real-time communication.
 * Handles user authentication via tokens, manages socket connections, and broadcasts balance updates.
 * Runs a cron job every 2 seconds to push balance updates to all online users.
 */
import { CronJob } from 'cron';
import { sessionService, tokenService, userService } from './services';
import { IUser } from './models/user/user.model';
import { Server } from 'socket.io';

export const UpdateBalance = async (io: any) => {
    const sessions = await sessionService.getOnline();
    if (sessions.length) {
        for (const i in sessions) {
            const userId: any = sessions[i].userId;
            if (userId && sessions[i].socketId) {
                io.to(sessions[i].socketId).emit('balance', {
                    balance: userId.balance.toFixed(2),
                    realBalance: userId.realBalance.toFixed(2)
                });
            }
        }
    }
};

const socketServer = (io: Server) => {
    io.on('connection', async (socket) => {
        console.log('====>Socket Connected!<=====');

        socket.on('auth', async (token) => {
            try {
                const decoded = await sessionService.updateSessionByToken(String(token), { socketId: socket.id });
                if (decoded) {
                    const user = await userService.getUserById(String(decoded.userId));
                    if (!user) {
                        io.to(socket.id).emit('logout');
                        await sessionService.deleteSessionByUserId(String(decoded.userId));
                    }
                } else {
                    io.to(socket.id).emit('logout');
                }
            } catch (err) {
                io.to(socket.id).emit('logout');
            }
        });

        socket.on('disconnect', async () => {
            await sessionService.updateSessionBySocketId(socket.id, { socketId: '' });
        });
    });

    const job = new CronJob('*/2 * * * * *', () => {
        UpdateBalance(io);
    });
    job.start();
};

export default socketServer;
