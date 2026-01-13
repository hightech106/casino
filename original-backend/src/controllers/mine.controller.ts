/**
 * Mine game controller for managing minefield betting games.
 * Handles game creation, mine placement, gem selection, cashout logic, and auto-betting.
 * Integrates with GGR tracking and user balance management for mine game operations.
 */
import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { CommonGameModel, GameHistoryModel, UserModel, GameGGRModel } from '@models/index';
import { userService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { saveGGR } from './ggr.controller';

enum MINE_OBJECT {
    HIDDEN = 0,
    GEM = 1,
    BOMB = 2
}

interface IGame {
    mines: number;
    amount: number;
    grid: any[];
}

const GAME_TYPE = 'mine';

export const getMineStatus = async (req: AuthRequest, res: Response) => {
    // const userId = "";
    const userId = req.user?._id;
    try {
        const game = await CommonGameModel.findOne({ status: 'BET', game_type: GAME_TYPE, userId: userId });
        if (game) {
            return res.json({
                success: true,
                datas: game.aBetting.grid.filter((m: any) => m.mined),
                amount: game.amount,
                mines: game.aBetting.mines
            });
        }
        return res.json({
            success: false
        });
    } catch (error) {
        console.error('Error Get Status Mine Game =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const playMineGame = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { mines, amount, currency } = req.body;
        if (mines < 1) return res.status(httpStatus.PAYMENT_REQUIRED).json('Mines must be greater than 1');

        const me = await UserModel.findById(userId);
        if (!me) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('User not found');
        }

        if (amount > me.balance) {
            return res.status(httpStatus.BAD_REQUEST).send('Your balance is not enough');
        }

        const game = await CommonGameModel.findOne({ status: 'BET', game_type: GAME_TYPE, userId: userId });
        if (game) {
            return res.json({ status: 'END' });
        }

        const minesArray = initializeMines(25, mines);

        const param = {
            userId: me._id,
            amount,
            betting: req.body,
            game_type: GAME_TYPE,
            profit: 0,
            odds: 0,
            aBetting: {
                count: 0,
                mines,
                grid: minesArray
            }
        };

        const newGame = await CommonGameModel.create(param);

        await userService.handleBalance(me._id, amount, 'BET', GAME_TYPE, newGame._id.toString());

        const query = {
            gameid: newGame._id,
            user: me._id,
            bet: amount,
            target: 0,
            payout: 0,
            type: GAME_TYPE
        };

        const history: any = await GameHistoryModel.create(query);

        history.user = me;

        return res.json({ status: 'BET', history });
    } catch (error) {
        console.error('Error Play Mine Game =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const betMine = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { point } = req.body;
        const game = await CommonGameModel.findOne({ status: 'BET', game_type: GAME_TYPE, userId });
        if (!game) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('Game not found');
        }

        const betcount = game.aBetting.count + 1;
        game.aBetting.count += 1;
        const index = game.aBetting.grid.findIndex((m: any) => m.point === point);
        if (index === -1) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('Grid not found');
        }

        game.aBetting.grid[index].mined = true;
        if (game.aBetting.grid[index].mine === MINE_OBJECT.GEM) {
            if (game.aBetting.grid.findIndex((m: any) => !m.mined) == -1) {
                const profitAndOdds = calculateMinesGame(game.aBetting.mines, betcount, game.amount);

                const user = await userService.handleBalance(
                    userId,
                    profitAndOdds.roundedWinAmount,
                    'WIN',
                    GAME_TYPE,
                    game._id.toString()
                );

                await CommonGameModel.updateOne(
                    {
                        _id: game._id
                    },
                    {
                        status: 'WIN',
                        odds: profitAndOdds.probability,
                        profit: profitAndOdds.roundedWinAmount - game.amount,
                        'aBetting.count': betcount,
                        'aBetting.grid': game.aBetting.grid
                    }
                );

                const history: any = await GameHistoryModel.findOneAndUpdate(
                    {
                        gameid: game._id
                    },
                    {
                        target: profitAndOdds.probability,
                        payout: profitAndOdds.roundedWinAmount
                    },
                    {
                        upsert: true,
                        new: true
                    }
                );

                history.user = user;

                // Save GGR data
                await saveGGR(GAME_TYPE, game.amount, profitAndOdds.roundedWinAmount);

                return res.json({ status: 'END', datas: game.aBetting.grid, history });
            } else {
                await CommonGameModel.findByIdAndUpdate(game._id, {
                    'aBetting.count': betcount,
                    'aBetting.grid': game.aBetting.grid
                });
                return res.json({ status: 'BET' });
            }
        } else if (game.aBetting.grid[index].mine === MINE_OBJECT.BOMB) {
            await CommonGameModel.findByIdAndUpdate(game._id, {
                'aBetting.count': betcount,
                'aBetting.grid': game.aBetting.grid,
                status: 'LOST'
            });
            await saveGGR(GAME_TYPE, game.amount, 0);
            return res.json({ status: 'END', datas: game.aBetting.grid }); // Respond with the updated grid
        }
        return res.json({ status: '' });
    } catch (error) {
        console.error('Error Bet Mine Game =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const autoBetMine = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { points, mines, amount, currency } = req.body;

        if (mines < 1) return res.status(httpStatus.PAYMENT_REQUIRED).json('Mines must be greater than 1');

        const me = await UserModel.findById(userId);
        if (!me) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('User not found');
        }

        if (amount > me.balance) {
            return res.status(httpStatus.BAD_REQUEST).send('Your balance is not enough');
        }

        const minesArray = initializeMines(25, mines);
        const newGame: IGame = {
            mines,
            amount,
            grid: minesArray
        };
        let betResult = 'WIN';
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const index = newGame.grid.findIndex((m: any) => m.point === point);
            if (index !== -1) {
                newGame.grid[index].mined = true;
                if (newGame.grid[index].mine == MINE_OBJECT.BOMB) {
                    betResult = 'LOST';
                }
            }
        }

        const profitAndOdds = calculateMinesGame(mines, points.length, amount);

        const param = {
            userId: me._id,
            amount,
            betting: req.body,
            game_type: GAME_TYPE,
            profit: profitAndOdds.roundedWinAmount - amount,
            odds: profitAndOdds.probability,
            aBetting: newGame,
            status: betResult
        };
        const game = await CommonGameModel.create(param);
        console.log(betResult, '==>betResult');

        await userService.handleBalance(me._id, amount, 'BET', GAME_TYPE, game._id.toString());
        // handleBalance(userId, currency, -amount, 'BET', game._id.toString());

        const hisquery = {
            gameid: '',
            user: me._id,
            bet: amount,
            target: profitAndOdds.odds,
            payout: 0,
            type: GAME_TYPE
        };

        if (betResult === 'WIN') {
            hisquery.target = profitAndOdds.odds;
            hisquery.payout = profitAndOdds.roundedWinAmount;

            await userService.handleBalance(
                me._id,
                profitAndOdds.roundedWinAmount,
                'WIN',
                GAME_TYPE,
                game._id.toString()
            );
        }
        // if (betResult === "LOST") {
        //     user = await UserModel.findByIdAndUpdate(userId,
        //         {
        //             $inc: {
        //                 lost: 1,
        //             }
        //         },
        //         {
        //             upsert: true, new: true,
        //         }
        //     );
        // }

        hisquery.gameid = String(game._id);
        const history: any = await GameHistoryModel.create(hisquery);
        history.user = me;

        // Save GGR data
        const winAmount = betResult === 'WIN' ? profitAndOdds.roundedWinAmount : 0;
        await saveGGR(GAME_TYPE, amount, winAmount);

        return res.json({ status: 'END', datas: newGame.grid, history });
    } catch (error) {
        console.log('Error Auto Bet Mine =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const cashOutMine = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const game = await CommonGameModel.findOne({ status: 'BET', userId, game_type: GAME_TYPE });
        if (!game) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('Game not found');
        }
        const betcount = game.aBetting.count;
        const profitAndOdds = calculateMinesGame(game.aBetting.mines, betcount, game.amount);

        const user = await userService.handleBalance(
            userId,
            profitAndOdds.roundedWinAmount,
            'WIN',
            GAME_TYPE,
            game._id.toString()
        );

        await CommonGameModel.updateOne(
            {
                _id: game._id
            },
            {
                status: 'WIN',
                profit: profitAndOdds.roundedWinAmount - game.amount
            }
        );

        const history: any = await GameHistoryModel.findOneAndUpdate(
            {
                gameid: game._id
            },
            {
                target: profitAndOdds.probability,
                payout: profitAndOdds.roundedWinAmount
            },
            {
                upsert: true,
                new: true
            }
        );

        history.user = user;

        // Save GGR data
        await saveGGR(GAME_TYPE, game.amount, profitAndOdds.roundedWinAmount);

        return res.json({ status: 'END', datas: game.aBetting.grid, history });
    } catch (error) {
        console.log('Error Cashout Mine =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

// Function to create an array of mines with random bombs
function initializeMines(totalMines: number, bombCount: number): { point: number; mine: MINE_OBJECT }[] {
    // Create an array with default values (hidden)
    const minesArray: { point: number; mine: MINE_OBJECT }[] = Array.from({ length: totalMines }, (_, index) => ({
        point: index,
        mine: MINE_OBJECT.GEM,
        mined: false
    }));

    // Randomly select positions for bombs
    const bombPositions = new Set<number>();
    while (bombPositions.size < bombCount) {
        const randomPosition = Math.floor(Math.random() * totalMines);
        bombPositions.add(randomPosition);
    }

    // Place bombs in the selected positions
    bombPositions.forEach((pos) => {
        minesArray[pos].mine = MINE_OBJECT.BOMB;
    });

    return minesArray;
}

function calculateMinesGame(mines: number, picks: number, bet: number): any {
    const totalSlots = 25; // Total number of slots
    const safeSlots = totalSlots - mines; // Slots without mines

    // Function to calculate factorial
    function factorial(n: number): number {
        let value = 1;
        for (let i = 2; i <= n; i++) {
            value *= i;
        }
        return value;
    }

    // Function to calculate combinations
    function combination(n: number, k: number): number {
        if (k > n) return 0;
        return factorial(n) / (factorial(k) * factorial(n - k));
    }

    // Calculate total combinations and safe combinations
    const totalCombinations = combination(totalSlots, picks);
    const safeCombinations = combination(safeSlots, picks);

    // Calculate probability and other metrics
    let probability = 0.99 * (totalCombinations / safeCombinations);
    probability = Math.round(probability * 100) / 100;

    const winAmount = bet * probability;
    const roundedWinAmount = Math.round(winAmount * 100000000) / 100000000;

    const lossAmount = 100 / (probability - 1);
    const roundedLossAmount = Math.round(lossAmount * 100) / 100;

    const chance = 99 / probability;
    const roundedChance = Math.round(chance * 100000) / 100000;

    // Log results if conditions are met
    if (mines + picks <= totalSlots && picks > 0 && mines > 0) {
        if (mines && picks) {
            return {
                probability,
                roundedLossAmount,
                roundedChance,
                roundedWinAmount
            };
            // console.log("Probability:", probability);
            // console.log("Loss:", roundedLossAmount);
            // console.log("Chance:", roundedChance);
            // if (bet > 0.00000000999) console.log("Win:", roundedWinAmount);
        }
    }
    return {
        probability: 0,
        roundedLossAmount: 0,
        roundedChance: 0,
        roundedWinAmount: 0
    };
}

export const getMineHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const query = {
            type: GAME_TYPE
        };
        const history = await GameHistoryModel.find(query)
            .populate('user', ['userId', 'first_name', 'last_name', 'avatar', 'username', 'currency', 'currencyIcon'])
            .sort({ createdAt: -1 })
            .limit(30);
        // Filter out records where user is null (deleted users)
        const filteredHistory = history.filter((h: any) => h.user !== null && h.user !== undefined);
        return res.json(filteredHistory);
    } catch (error) {
        next(error);
    }
};
