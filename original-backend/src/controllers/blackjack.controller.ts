/**
 * Blackjack game controller for managing blackjack game logic, betting, and card dealing.
 * Handles game creation, hits, stands, splits, doubles, insurance, and payout calculations.
 * Integrates with provably fair randomness and GGR tracking for blackjack operations.
 */
import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import * as crypto from 'crypto';
import { generateSeed, seedHash } from '@utils/random';
import { CommonGameModel, GameHistoryModel, UserModel, GameRTPModel, GameGGRModel } from '@models/index';
import { userService, gameService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { saveGGR } from './ggr.controller';

type Card = { suit: string; rank: string };
type Hand = Card[];
type Deck = Card[];

const GAME_TYPE = 'blackjack';

const STATUS = {
    win: 'Player wins! Dealer busts.',
    lose: 'Dealer wins! Player busts.',
    draw: "It's a tie!",
    continue: 'Player continues.',
    insuance: 'Dealer has blackjack! Insurance paid 2:1.',
    notInsurance: 'No blackjack. Insurance bet lost.'
};
const suits: string[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const values: { [key: string]: number } = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    J: 10,
    Q: 10,
    K: 10,
    A: 11 // Aces can be worth 1 or 11
};

function createDeck(): Deck {
    return suits.flatMap((suit) => ranks.map((rank) => ({ suit, rank })));
}

// PRNG using combined seeds (client + server)
function generateCardIndex(seed: string, cardPosition: number, deckSize: number): number {
    const combinedSeed = seed + cardPosition; // Combine seed with the card position
    const hash = seedHash(combinedSeed);
    const numericValue = parseInt(hash.slice(0, 8), 16); // Convert part of the hash to a number
    return numericValue % deckSize; // Use modulo to fit within the desired range
}

// Function to deal a unique card using dynamic deck and seeds
function getUniqueCard(deck: Deck, clientSeed: string, serverSeed: string, cardPosition: number): Card {
    const seed = clientSeed + serverSeed; // Combine seeds
    const cardIndex = generateCardIndex(seed, cardPosition, deck.length); // Get card index based on seed
    const card = deck[cardIndex]; // Fetch card at this position
    deck.splice(cardIndex, 1); // Remove the card from the deck to avoid duplicates
    return card; // Return the card
}

function calculateHandValue(hand: Hand): number {
    let total = 0;
    let aces = 0;

    hand.forEach((card) => {
        if (card.rank === 'A') {
            aces += 1;
            total += 11; // Initially count Ace as 11
        } else {
            total += values[card.rank];
        }
    });

    while (total > 21 && aces > 0) {
        total -= 10; // Count Ace as 1 instead of 11
        aces--;
    }

    return total;
}

function checkForBlackjack(hand: Hand): boolean {
    return calculateHandValue(hand) === 21;
}

function determineWinner(playerHand: Hand, dealerHand: Hand): { result: string; multiplier: number } {
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);
    let result = STATUS.draw;
    if (playerValue > 21) result = STATUS.lose;
    else if (dealerValue > 21) result = STATUS.win;
    else if (playerValue > dealerValue) result = STATUS.win;
    else if (dealerValue > playerValue) result = STATUS.lose;
    return {
        result: result,
        multiplier: result === STATUS.win ? (playerValue === 21 ? 2.5 : 2) : result === STATUS.draw ? 1 : 0
    };
}

export const hitBlackjack = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;

        const game = await CommonGameModel.findOne({
            userId: user?._id,
            game_type: GAME_TYPE,
            status: 'BET'
        });
        if (!game) return res.status(httpStatus.PAYMENT_REQUIRED).json('Create new game');

        const { playerHand, dealerHand, playerHand2 } = game.aBetting;

        const deck = createDeck();

        const filterUsedCards = (deck: Card[], cards: Hand) => {
            return deck.filter((card) => {
                return !cards.some((handCard) => handCard.rank === card.rank && handCard.suit === card.suit);
            });
        };

        const filteredDeck = filterUsedCards(deck, [...playerHand, ...dealerHand, ...playerHand2]);

        playerHand.push({
            ...getUniqueCard(
                filteredDeck,
                game.aBetting.clientSeed,
                game.aBetting.serverSeed,
                playerHand.length + dealerHand.length + playerHand2.length
            ),
            type: 'hit'
        });

        const handValue = calculateHandValue(playerHand);

        if (handValue > 21) {
            if (playerHand2.length) {
                await CommonGameModel.findOneAndUpdate(
                    { _id: game._id }, // Find the document by gameId
                    {
                        $set: {
                            'aBetting.playerHand': playerHand2,
                            'aBetting.playerHand2': []
                        }
                    } // Update the playerHand
                );
                return res.json({
                    result: STATUS.continue,
                    playerHand: playerHand,
                    handValue: handValue,
                    switched: true // Assuming splitting isn't allowed after hitting
                });
            } else {
                await CommonGameModel.findOneAndUpdate(
                    { _id: game._id }, // Find the document by gameId
                    { $set: { 'aBetting.playerHand': playerHand, status: 'LOST', profit: -game.amount } } // Update the playerHand
                );

                const history: any = await GameHistoryModel.findOneAndUpdate(
                    {
                        user: user?._id,
                        gameid: game._id
                    },
                    {
                        target: game.odds,
                        payout: 0
                    },
                    {
                        upsert: true
                    }
                );

                history.user = user;

                return res.json({
                    result: STATUS.lose,
                    playerHand,
                    handValue,
                    dealerHand,
                    profit: -game.profit,
                    dealerValue: calculateHandValue(dealerHand),
                    clientSeed: game.aBetting.clientSeed,
                    serverSeed: game.aBetting.serverSeed,
                    history
                });
            }
        }
        await CommonGameModel.findOneAndUpdate(
            { _id: game._id }, // Find the document by gameId
            { $set: { 'aBetting.playerHand': playerHand } } // Update the playerHand
        );
        return res.json({
            result: STATUS.continue,
            playerHand,
            handValue,
            canSplit: false // Assuming splitting isn't allowed after hitting
        });
    } catch (err) {
        console.error('blackjack hitbet error', err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const standBlackjack = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;

        let user = await UserModel.findById(userId);
        if (!user) return res.status(httpStatus.PAYMENT_REQUIRED).json('User not found!');

        const game = await CommonGameModel.findOne({
            userId,
            game_type: GAME_TYPE,
            status: 'BET'
        });
        if (!game) return res.status(httpStatus.PAYMENT_REQUIRED).json('Create new game');

        const { playerHand, dealerHand } = game.aBetting;
        const deck = createDeck();

        const filterUsedCards = (deck: Card[], playerHand: Hand, dealerHand: Hand) => {
            return deck.filter((card) => {
                return ![...playerHand, ...dealerHand].some(
                    (handCard) => handCard.rank === card.rank && handCard.suit === card.suit
                );
            });
        };

        let dealerValue = calculateHandValue(dealerHand);
        while (dealerValue < 17) {
            const filteredDeck = filterUsedCards(deck, playerHand, dealerHand);
            dealerHand.push(
                getUniqueCard(
                    filteredDeck,
                    game.aBetting.clientSeed,
                    game.aBetting.serverSeed,
                    playerHand.length + dealerHand.length
                )
            );
            dealerValue = calculateHandValue(dealerHand);
        }

        const { result, multiplier } = determineWinner(playerHand, dealerHand);
        let winAmount = 0;
        let profit = 0;
        switch (result) {
            case STATUS.win:
                winAmount = game.amount * multiplier;
                // profit = winAmount - game.amount;
                user = await userService.handleBalance(userId, winAmount, 'DRAW', GAME_TYPE, game._id.toString());
                await CommonGameModel.findOneAndUpdate(
                    { _id: game._id }, // Find the document by gameId
                    {
                        $set: {
                            'aBetting.dealerHand': dealerHand,
                            profit,
                            odds: multiplier,
                            status: 'WIN'
                        }
                    } // Update the playerHand
                );

                break;
            case STATUS.lose:
                profit = -game.amount;
                await CommonGameModel.findOneAndUpdate(
                    { _id: game._id }, // Find the document by gameId
                    {
                        $set: {
                            'aBetting.dealerHand': dealerHand,
                            status: 'LOST',
                            profit
                        }
                    } // Update the playerHand
                );
                break;
            case STATUS.draw:
                profit = 0;
                user = await userService.handleBalance(userId, game.amount, 'DRAW', GAME_TYPE, game._id.toString());
                await CommonGameModel.findOneAndUpdate(
                    { _id: game._id }, // Find the document by gameId
                    {
                        $set: {
                            'aBetting.dealerHand': dealerHand,
                            odds: 1,
                            status: 'DRAW',
                            profit: 0
                        }
                    } // Update the playerHand
                );
                // handleBalance(game.userId, game.currency, game.amount, "DRAW");
                break;
        }

        const history: any = await GameHistoryModel.findOneAndUpdate(
            {
                user: userId,
                gameid: game._id
            },
            {
                target: multiplier,
                payout: winAmount
            },
            {
                upsert: true
            }
        );

        history.user = user;

        return res.json({
            result,
            dealerHand,
            dealerValue,
            multiplier,
            profit,
            clientSeed: game.aBetting.clientSeed,
            serverSeed: game.aBetting.serverSeed,
            history
        });
    } catch (err) {
        console.error('Blackjack standbet error', err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const doubleBlackjack = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;

        let user = await UserModel.findById(userId);
        if (!user) return res.status(httpStatus.PAYMENT_REQUIRED).json('User not found!');

        const game = await CommonGameModel.findOne({
            userId,
            game_type: GAME_TYPE,
            status: 'BET'
        });

        if (!game) return res.status(httpStatus.PAYMENT_REQUIRED).json('Create new game');

        if (user.balance < game.amount)
            return res.status(httpStatus.PAYMENT_REQUIRED).json('Your Balance is not enough!');

        const { playerHand, dealerHand } = game.aBetting;
        const deck = createDeck();

        const filterUsedCards = (deck: Card[], playerHand: Hand, dealerHand: Hand) => {
            return deck.filter((card) => {
                return ![...playerHand, ...dealerHand].some(
                    (handCard) => handCard.rank === card.rank && handCard.suit === card.suit
                );
            });
        };
        const filteredDeck = filterUsedCards(deck, playerHand, dealerHand);

        playerHand.push({
            ...getUniqueCard(
                filteredDeck,
                game.aBetting.clientSeed,
                game.aBetting.serverSeed,
                playerHand.length + dealerHand.length
            ),
            type: 'double'
        });

        const handValue = calculateHandValue(playerHand);
        // if (!handleBalance(game.userId, game.currency, -game.amount, "BET")) {
        //   return res.json({ result: "The amount is insufficient." });
        // }

        user = await userService.handleBalance(userId, game.amount, 'BET', GAME_TYPE, game._id.toString());

        const hisquery = {
            bet: game.amount * 2
        };

        if (handValue > 21) {
            game.status = 'LOST';
            await CommonGameModel.findOneAndUpdate(
                { _id: game._id }, // Find the document by gameId
                {
                    $set: {
                        'aBetting.playerHand': playerHand,
                        amount: game.amount * 2,
                        status: 'LOST',
                        profit: -game.amount * 2
                    }
                } // Update the playerHand
            );

            const history: any = await GameHistoryModel.findOneAndUpdate(
                {
                    user: userId,
                    gameid: game._id
                },
                {
                    ...hisquery,
                    target: game.odds,
                    payout: 0
                },
                {
                    upsert: true
                }
            );

            history.user = user;

            return res.json({
                result: STATUS.lose,
                playerHand,
                handValue,
                profit: game.profit,
                clientSeed: game.aBetting.clientSeed,
                serverSeed: game.aBetting.serverSeed,
                history
            });
        }

        const history: any = await GameHistoryModel.findOneAndUpdate(
            {
                user: userId,
                gameid: game._id
            },
            hisquery
        );

        history.user = user;

        await CommonGameModel.findOneAndUpdate(
            { _id: game._id }, // Find the document by gameId
            {
                $set: {
                    'aBetting.playerHand': playerHand,
                    amount: game.amount * 2
                }
            } // Update the playerHand
        );
        return res.json({
            result: 'Player stands after double down.',
            playerHand,
            handValue,
            history
        });
    } catch (err) {
        console.log('Blackjack doublebet error', err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const splitBlackjack = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const game = await CommonGameModel.findOne({
            userId,
            game_type: GAME_TYPE,
            status: 'BET'
        });

        if (!game) return res.status(httpStatus.PAYMENT_REQUIRED).json('Create new game');

        let playerHand = game.aBetting.playerHand;
        const dealerHand = game.aBetting.dealerHand;

        const deck = createDeck();

        if (playerHand[0].rank !== playerHand[1].rank)
            return res
                .status(httpStatus.PAYMENT_REQUIRED)
                .json('You can only split if you have two cards of the same rank.');

        const filterUsedCards = (deck: Card[], playerHand: Hand, dealerHand: Hand) => {
            return deck.filter((card) => {
                return ![...playerHand, ...dealerHand].some(
                    (handCard) => handCard.rank === card.rank && handCard.suit === card.suit
                );
            });
        };

        let filteredDeck = filterUsedCards(deck, playerHand, dealerHand);

        playerHand = [
            game.aBetting.playerHand[0],
            {
                ...getUniqueCard(
                    filteredDeck,
                    game.aBetting.clientSeed,
                    game.aBetting.serverSeed,
                    playerHand.length + dealerHand.length
                ),
                type: 'split'
            }
        ];

        filteredDeck = filterUsedCards(deck, playerHand, dealerHand);
        const playerHand2 = [
            game.aBetting.playerHand[1],
            {
                ...getUniqueCard(
                    filteredDeck,
                    game.aBetting.clientSeed,
                    game.aBetting.serverSeed,
                    playerHand.length + dealerHand.length
                ),
                type: 'split'
            }
        ];

        await CommonGameModel.findOneAndUpdate(
            { _id: game._id }, // Find the document by gameId
            {
                $set: {
                    'aBetting.playerHand': playerHand,
                    'aBetting.playerHand2': playerHand2
                }
            } // Update the playerHand
        );

        const hand1Value = calculateHandValue(playerHand);
        const hand2Value = calculateHandValue(playerHand2);

        return res.json({
            hand1: { cards: playerHand, value: hand1Value },
            hand2: { cards: playerHand2, value: hand2Value }
        });
    } catch (err) {
        console.error('Blackjack splitbet error', err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const playBlackjack = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { amount, clientSeed: _clientSeed } = req.body;

        const me = await UserModel.findById(userId);
        if (!me) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('User not found');
        }

        if (amount > me.balance) {
            return res.status(httpStatus.BAD_REQUEST).send('Your balance is not enough');
        }

        // Helper function to handle blackjack scenarios and game result updates
        const handleBlackjackOutcome = async (game: any, playerHand: Hand, playerHand2: Hand, dealerHand: Hand) => {
            let user = null;

            const { result, multiplier } = determineWinner(playerHand, dealerHand);
            game.odds = multiplier;

            let winAmount = 0;
            // RTP LOGIC: declare variables outside switch
            let totalInput = 0, totalOutput = 0, targetRTP = 96, newTotalOutput = 0, newTotalInput = 0, newRTP = 0;
            switch (result) {
                case STATUS.win:
                    winAmount = game.amount * multiplier;
                    // RTP LOGIC
                    {
                        const profitData = await gameService.getProfit(GAME_TYPE);
                        totalInput = profitData.input;
                        totalOutput = profitData.output;
                        const rtpConfig = await GameRTPModel.findOne({ game_type: GAME_TYPE });
                        targetRTP = rtpConfig?.rtp ?? 96;
                        newTotalOutput = totalOutput + winAmount;
                        newTotalInput = totalInput + game.amount;
                        newRTP = newTotalInput > 0 ? (newTotalOutput / newTotalInput) * 100 : 0;
                        if (newRTP > targetRTP && winAmount > 0) {
                            winAmount = 0;
                            game.status = 'LOST';
                            game.profit = -game.amount;
                        } else {
                            game.profit = winAmount - game.amount;
                            game.status = 'WIN';
                            user = await userService.handleBalance(userId, winAmount, 'WIN', GAME_TYPE, game._id.toString());
                        }
                    }
                    break;
                case STATUS.lose:
                    game.status = 'LOST';
                    game.profit -= game.amount;
                    break;
                case STATUS.draw:
                    game.status = 'DRAW';
                    game.profit = 0;
                    winAmount = game.amount;
                    user = await userService.handleBalance(userId, winAmount, 'DRAW', GAME_TYPE, game._id.toString());
                    break;
            }

            await CommonGameModel.updateOne({ _id: game._id }, game);

            const history: any = await GameHistoryModel.findOneAndUpdate(
                {
                    user: me._id,
                    gameid: game._id
                },
                {
                    target: multiplier,
                    payout: winAmount
                },
                {
                    upsert: true
                }
            );

            history.user = user;

            // Save GGR data
            await saveGGR(GAME_TYPE, game.amount, winAmount);

            const data = {
                result,
                multiplier,
                playerHand,
                dealerHand,
                profit: game.profit,
                playerValue: calculateHandValue(playerHand),
                playerValue2: calculateHandValue(playerHand2),
                dealerValue: calculateHandValue(dealerHand),
                clientSeed: game.aBetting.clientSeed,
                serverSeed: game.aBetting.serverSeed,
                history
            };

            return res.json(data);
        };

        // Check if there's an existing game for this user
        const game = await CommonGameModel.findOne({
            userId: me._id,
            game_type: GAME_TYPE,
            status: 'BET'
        });

        const previouseGame = await CommonGameModel.findOne({
            userId: me._id,
            game_type: GAME_TYPE,
            status: { $ne: 'BET' }
        }).sort({ _id: -1 });

        if (game) {
            await userService.handleBalance(userId, amount, 'BET', GAME_TYPE, game._id.toString());
            const { playerHand, dealerHand, playerHand2 } = game.aBetting;
            const playerHasBlackjack = checkForBlackjack(playerHand);
            const dealerHasBlackjack = checkForBlackjack(dealerHand);

            // Handle blackjack outcome if either player or dealer has blackjack
            if (playerHasBlackjack || (dealerHasBlackjack && dealerHand[0].rank !== 'A')) {
                return handleBlackjackOutcome(game, playerHand, playerHand2, dealerHand);
            }

            const result = {
                result: STATUS.continue,
                amount: game.amount,
                playerHand,
                dealerHand: [dealerHand[0], { suit: '', rank: '' }],
                canDouble: true,
                canSplit: playerHand[0].rank === playerHand[1].rank && playerHand.length === 2,
                clientSeed: game.aBetting.clientSeed,
                serverSeedHash: crypto.createHash('sha256').update(game.aBetting.serverSeed).digest('hex'),
                previouseServerSeed: previouseGame?.aBetting?.serverSeed,
                previouseClientSeed: previouseGame?.aBetting?.clientSeed,
                playerValue: calculateHandValue(playerHand),
                playerValue2: calculateHandValue(playerHand2),
                dealerValue: calculateHandValue([dealerHand[0]])
            };

            return res.json(result);
        }

        // No existing game, create a new one
        const serverSeed = generateSeed();
        const clientSeed = _clientSeed || generateSeed();
        const deck = createDeck();
        let cardPosition = 0;

        const dealerHand: Hand = [
            getUniqueCard(deck, clientSeed, serverSeed, cardPosition++),
            getUniqueCard(deck, clientSeed, serverSeed, cardPosition++)
        ];

        const playerHand: Hand = [
            getUniqueCard(deck, clientSeed, serverSeed, cardPosition++),
            getUniqueCard(deck, clientSeed, serverSeed, cardPosition++)
        ];

        const param = {
            userId: me._id,
            odds: 0,
            amount,
            profit: 0,
            game_type: GAME_TYPE,
            aBetting: {
                serverSeed,
                clientSeed,
                playerHand,
                dealerHand,
                playerHand2: []
            },
            status: 'BET'
        };

        // Create new game object
        const newGame = await CommonGameModel.create(param);
        
        const user = await userService.handleBalance(userId, amount, 'BET', GAME_TYPE, newGame._id.toString());

        const query = {
            gameid: newGame._id,
            user: userId,
            bet: amount,
            target: 0,
            payout: 0,
            type: GAME_TYPE
        };

        const history: any = await GameHistoryModel.create(query);

        history.user = user;

        const playerHasBlackjack = checkForBlackjack(playerHand);
        const dealerHasBlackjack = checkForBlackjack(dealerHand);

        // Handle blackjack outcome if either player or dealer has blackjack in the new game
        if (playerHasBlackjack || (dealerHasBlackjack && dealerHand[0].rank !== 'A')) {
            return handleBlackjackOutcome(newGame, playerHand, [], dealerHand);
        }

        const result = {
            result: STATUS.continue,
            amount,
            playerHand,
            dealerHand: [dealerHand[0], { suit: '', rank: '' }],
            clientSeed,
            serverSeedHash: crypto.createHash('sha256').update(serverSeed).digest('hex'),
            previouseServerSeed: previouseGame?.aBetting?.serverSeed,
            previouseClientSeed: previouseGame?.aBetting?.clientSeed,
            canDouble: true, // Double down is allowed
            canSplit: playerHand[0].rank === playerHand[1].rank, // Split allowed if first two cards are the same
            playerValue: calculateHandValue(playerHand),
            playerValue2: calculateHandValue([]),
            dealerValue: calculateHandValue([dealerHand[0]]),
            history
        };

        // Respond with new game status
        return res.json(result);
    } catch (err) {
        console.log('Blackjack createbet error', err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

// Insurance logic for when dealer shows an Ace
export const insuranceBlackjack = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        let user = await UserModel.findById(userId);
        if (!user) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('User not found');
        }

        const { confirm } = req.body;
        const game = await CommonGameModel.findOne({
            userId,
            game_type: GAME_TYPE,
            status: 'BET'
        });

        if (!game) return res.status(httpStatus.PAYMENT_REQUIRED).json('Create new game');

        const dealerHand = game.aBetting.dealerHand;

        if (dealerHand[0].rank !== 'A')
            return res
                .status(httpStatus.PAYMENT_REQUIRED)
                .json('Insurance is only available when dealer shows an Ace.');

        const dealerValue = calculateHandValue(dealerHand);

        if (confirm) game.amount /= 2;

        if (dealerValue === 21) {
            game.profit = confirm ? game.amount : 0;
            game.odds = confirm ? 0.5 : 0;
            game.status = confirm ? 'WIN' : 'LOST';
            await game.save();

            if (game.profit > 0)
                user = await userService.handleBalance(userId, game.profit, 'WIN', GAME_TYPE, game._id.toString());

            const history: any = await GameHistoryModel.findOneAndUpdate(
                {
                    user: userId,
                    gameid: game._id
                },
                {
                    target: game.odds,
                    payout: game.profit
                },
                {
                    upsert: true
                }
            );

            history.user = user;

            return res.json({
                result: STATUS.insuance,
                dealerHand,
                dealerValue,
                profit: game.profit,
                clientSeed: game.aBetting.clientSeed,
                serverSeed: game.aBetting.serverSeed,
                history
            });
        }
        await game.save();
        return res.json({ result: STATUS.notInsurance, dealerHand, dealerValue });
    } catch (err) {
        console.error('Insurance error', err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
        return;
    }
};

export const getBlackjackHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
