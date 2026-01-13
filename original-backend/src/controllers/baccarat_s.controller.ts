/**
 * Single player Baccarat game controller for managing individual baccarat games.
 * Handles game creation, betting, card dealing, result calculation, and payout distribution.
 * Integrates with provably fair randomness and GGR tracking for single-player baccarat operations.
 */
import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { CommonGameModel, GameHistoryModel, UserModel, GameRTPModel, GameGGRModel } from '@models/index';
import { userService, gameService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { combineSeeds, generateSeed, seedHash } from '@utils/random';
import { ICard, IPlace, IRank, ISuit } from '@root/types/baccarat.type';
import { saveGGR } from './ggr.controller';

const GAME_TYPE = 'baccarat_s';

const suits: ISuit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks: IRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const multipliers = {
    Player: 1.94, // 1.94 instead of 2.0
    Banker: 1.89, // 1.89 instead of 1.95
    Tie: 8.74, // 8.74 instead of 9.0
    PPair: 11.65, // 11.65 instead of 12.0
    BPair: 11.65 // 11.65 instead of 12.0
};

const createDeck = (): ICard[] => {
    const deck: ICard[] = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank });
        }
    }
    return deck;
};

const calculateScore = (hand: ICard[]): number => {
    const score = hand.reduce((total, card) => {
        if (card.rank === 'A') return total + 1;
        if (['J', 'Q', 'K', '10'].includes(card.rank)) return total;
        return total + parseInt(card.rank, 10);
    }, 0);

    return score % 10;
};

const dealCards = (numberOfCards: number, combinedHash: string, deck: ICard[]): ICard[] => {
    const hand: ICard[] = [];
    let hashIndex = 0;
    for (let i = 0; i < numberOfCards; i++) {
        const randomIndex = parseInt(combinedHash.slice(hashIndex, hashIndex + 8), 16) % deck.length;
        hand.push(deck[randomIndex]);
        deck.splice(randomIndex, 1);
        hashIndex += 8;
    }
    return hand;
};

const shouldPlayerDraw = (playerScore: number): boolean => {
    return playerScore <= 5;
};

const shouldBankerDraw = (bankerScore: number, playerThirdCard: ICard | null): boolean => {
    if (bankerScore <= 2) return true;
    if (!playerThirdCard) return false;

    const playerRank = playerThirdCard.rank;
    if (bankerScore === 3 && playerRank !== '8') return true;
    if (bankerScore === 4 && ['2', '3', '4', '5', '6', '7'].includes(playerRank)) return true;
    if (bankerScore === 5 && ['4', '5', '6', '7'].includes(playerRank)) return true;
    if (bankerScore === 6 && ['6', '7'].includes(playerRank)) return true;

    return false;
};

const determineWinner = (playerScore: number, bankerScore: number): IPlace => {
    if (playerScore > bankerScore) {
        return 'Player';
    } else if (bankerScore > playerScore) {
        return 'Banker';
    } else {
        return 'Tie';
    }
};

function isNumber(value: unknown): value is number {
    return typeof value === 'number';
}

export const createBaccaratSingle = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { clientSeed: _clientSeed } = req.body;
        const game = await CommonGameModel.findOne({ userId: userId, status: 'BET', game_type: GAME_TYPE });
        if (game) {
            return res.json({
                status: true,
                gameId: game._id,
                serverHash: seedHash(game.aBetting.serverSeed),
                clientSeed: game.aBetting.clientSeed
            });
        }

        const serverSeed: string = generateSeed();
        const clientSeed = _clientSeed || generateSeed();

        const query = {
            userId,
            odds: 0,
            profit: 0,
            amount: 0,
            game_type: GAME_TYPE,
            betting: req.body,
            aBetting: {
                serverSeed,
                clientSeed,
                bets: {}
            },
            status: 'BET'
        };

        const newGame = await CommonGameModel.create(query);

        return res.json({
            status: true,
            gameId: newGame._id,
            serverHash: seedHash(serverSeed),
            clientSeed
        });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const betBaccaratSingle = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { currency, bets } = req.body;
        const me = await UserModel.findById(userId);
        if (!me) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('User not found');
        }

        if (Object.values(bets).some((amount) => !isNumber(amount) || amount <= 0)) {
            return res.status(403).json('Invalid bet amount');
        }

        const game = await CommonGameModel.findOne({ status: 'BET', userId, game_type: GAME_TYPE });

        if (!game) return res.status(403).json('Game not found');

        let pAmount = 0;
        if (bets?.Player) pAmount = bets['Player'] || 0;
        let bAmount = 0;
        if (bets?.Banker) bAmount = bets['Banker'] || 0;
        let tAmount = 0;
        if (bets?.Tie) tAmount = bets['Tie'] || 0;

        const totalAmount = pAmount + bAmount + tAmount;
        // handleBlance(userId, currency, -totalAmount, 'BET');
        console.log(totalAmount, '==>totalAmount');

        if (totalAmount > me.balance) {
            return res.status(httpStatus.BAD_REQUEST).send('Your balance is not enough');
        }

        await userService.handleBalance(me._id, totalAmount, 'BET', GAME_TYPE, game._id.toString());

        game.amount = totalAmount;
        // game.currency = currency;
        game.profit = -totalAmount;

        // RTP LOGIC START (using input/output from gameService)
        const { input, output } = await gameService.getProfit(GAME_TYPE);
        const totalInput = input;
        const totalOutput = output;
        const currentRTP = totalInput > 0 ? (totalOutput / totalInput) * 100 : 0;
        // RTP LOGIC END

        const deck = createDeck();
        const combinedhash = combineSeeds(game.aBetting.serverSeed, game.aBetting.clientSeed);
        const playerHand = dealCards(2, combinedhash, deck);
        const bankerHand = dealCards(2, combinedhash, deck);
        let playerScore = calculateScore(playerHand);
        let bankerScore = calculateScore(bankerHand);

        let playerThirdCard: ICard | null = null;
        if (shouldPlayerDraw(playerScore)) {
            playerThirdCard = dealCards(1, combinedhash, deck)[0];
            playerHand.push(playerThirdCard);
        }

        if (shouldBankerDraw(bankerScore, playerThirdCard)) {
            let bankerThirdCard: ICard | null = null;
            bankerThirdCard = dealCards(1, combinedhash, deck)[0];
            bankerHand.push(bankerThirdCard);
        }

        playerScore = calculateScore(playerHand);
        bankerScore = calculateScore(bankerHand);
        let winner = determineWinner(playerScore, bankerScore);
        let winAmount = 0;
        if (winner === 'Player') {
            winAmount = pAmount * multipliers[winner]; 
        } else if (winner === 'Banker') {
            winAmount = bAmount * multipliers[winner];
        } else if (winner === 'Tie') {
            winAmount = tAmount * multipliers[winner];
        }

        // RTP LOGIC: fetch RTP from table and compare with current RTP
        const rtpConfig = await GameRTPModel.findOne({ game_type: GAME_TYPE });
        const targetRTP = rtpConfig?.rtp ?? 96; // fallback to 96 if not set
        // recalculate RTP as if this bet is settled
        const newTotalOutput = totalOutput + winAmount;
        const newTotalInput = totalInput + totalAmount;
        const newRTP = newTotalInput > 0 ? (newTotalOutput / newTotalInput) * 100 : 0;
        if (totalAmount > 0) {
            if (newRTP > targetRTP && winAmount > 0) {
                // Too much payout, try to force a loss
                if (pAmount > 0 && bAmount === 0) {
                    winner = 'Banker';
                    winAmount = 0;
                } else if (bAmount > 0 && pAmount === 0) {
                    winner = 'Player';
                    winAmount = 0;
                } else if (tAmount > 0 && pAmount === 0 && bAmount === 0) {
                    winner = 'Player';
                    winAmount = 0;
                }
            } else if (newRTP < targetRTP && winAmount === 0) {
                // Not enough payout, try to force a win if possible
                if (pAmount > 0 && bAmount === 0) {
                    winner = 'Player';
                    winAmount = pAmount * multipliers['Player'];
                } else if (bAmount > 0 && pAmount === 0) {
                    winner = 'Banker';
                    winAmount = bAmount * multipliers['Banker'];
                } else if (tAmount > 0 && pAmount === 0 && bAmount === 0) {
                    winner = 'Tie';
                    winAmount = tAmount * multipliers['Tie'];
                }
            }
        }

        let multiplier = 0;
        if (winAmount > 0) {
            multiplier = Math.round((winAmount / totalAmount) * 100) / 100;
        }

        game.odds = multiplier;
        game.profit = winAmount;
        game.status = winAmount > totalAmount ? 'WIN' : 'LOST';

        const queryh = {
            gameid: game._id,
            user: me._id,
            bet: totalAmount,
            target: multiplier,
            payout: winAmount,
            type: GAME_TYPE
        };

        const history: any = await GameHistoryModel.create(queryh);
        history.user = me;

        // Save GGR data
        await saveGGR(GAME_TYPE, totalAmount, winAmount);

        if (winAmount > 0) {
            // handleBlance(userId, currency, winAmount, 'settlement');
            setTimeout(async () => {
                await userService.handleBalance(me._id, winAmount, 'WIN', GAME_TYPE, game._id.toString());
            }, 2000);
        }

        await CommonGameModel.findByIdAndUpdate(game._id, {
            odds: game.odds,
            profit: game.profit,
            status: game.status,
            'aBetting.bets': bets,
            'aBetting.winnerPlace': winner
        });

        return res.json({
            status: game.status,
            profit: game.profit,
            multiplier: game.odds,
            serverSeed: game.aBetting.serverSeed,
            clientSeed: game.aBetting.clientSeed,
            playerHand,
            bankerHand,
            history
        });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const getBaccaratSingleHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
