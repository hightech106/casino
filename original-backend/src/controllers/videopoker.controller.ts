/**
 * Video Poker game controller for managing poker hand betting games.
 * Handles game creation, card dealing, card holding, draw results, and hand ranking/payouts.
 * Integrates with provably fair randomness and GGR tracking for video poker operations.
 */
import { NextFunction, Request, Response } from 'express';
import { CommonGameModel, GameHistoryModel, UserModel, GameRTPModel } from '@models/index';
import { userService, gameService } from '@services/index';
import { AuthRequest } from '@middlewares/auth';
import { generateSeed, seedHash } from '@utils/random';
import httpStatus from 'http-status';
import { saveGGR } from './ggr.controller';

const GAME_TYPE = 'videopoker';

interface deckType {
    rank: string;
    suit: string;
}
// Utility functions for deck operations
const SUITS = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Function to create a new deck
function createDeck() {
    const deck: deckType[] = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({ rank, suit });
        }
    }
    return deck;
}

// Function to evaluate the player's hand
function evaluateHand(hand: deckType[]) {
    const rankCounts = getRankCounts(hand);
    const isFlush = checkFlush(hand);
    const isStraight = checkStraight(rankCounts);
    const uniqueRanks = Object.keys(rankCounts).length;

    if (isFlush && isStraight && checkRoyalFlush(hand)) {
        return 'royal_flush'; // Ace-high straight and flush
    }
    if (isFlush && isStraight) {
        return 'straight_flush'; // Any other straight flush
    }
    if (Object.values(rankCounts).includes(4)) {
        return '4_of_a_kind'; // Four cards of the same rank
    }
    if (Object.values(rankCounts).includes(3) && Object.values(rankCounts).includes(2)) {
        return 'full_house'; // Three of one rank and two of another
    }
    if (isFlush) {
        return 'flush'; // All cards have the same suit
    }
    if (isStraight) {
        return 'straight'; // Five consecutive ranks
    }
    if (Object.values(rankCounts).includes(3)) {
        return '3_of_a_kind'; // Three cards of the same rank
    }
    if (Object.values(rankCounts).filter((count) => count === 2).length === 2) {
        return '2_pair'; // Two pairs of cards of the same rank
    }
    if (Object.values(rankCounts).includes(2)) {
        const highPairRanks = ['J', 'Q', 'K', 'A'];
        const hasHighPair = hand.some((card) => rankCounts[card.rank] === 2 && highPairRanks.includes(card.rank));
        return hasHighPair ? 'pair' : 'high_card'; // Only return 'pair' if Jacks or Better, otherwise high card
    }
    return 'high_card'; // None of the above
}

// Helper function to check for Royal Flush (A, K, Q, J, 10 of the same suit)
function checkRoyalFlush(hand: deckType[]) {
    const royalRanks = ['A', 'K', 'Q', 'J', '10'];
    const handRanks = hand.map((card) => card.rank);
    return royalRanks.every((rank) => handRanks.includes(rank));
}

// Payout table based on hand rank
export const payoutTable = [
    { id: 'royal_flush', odds: 800, name: 'Royal Flush' },
    { id: 'straight_flush', odds: 60, name: 'Straight Flush' },
    { id: '4_of_a_kind', odds: 22, name: '4 of a Kind' },
    { id: 'full_house', odds: 9, name: 'Full House' },
    { id: 'flush', odds: 6, name: 'Flush' },
    { id: 'straight', odds: 4, name: 'Straight' },
    { id: '3_of_a_kind', odds: 3, name: '3 of a Kind' },
    { id: '2_pair', odds: 2, name: '2 Pair' },
    { id: 'pair', odds: 1, name: 'Pair of JACKS or Better' },
    { id: 'high_card', odds: 0, name: 'High Card' } // No payout for high card
];

// Function to calculate the payout based on the hand and bet
function calculatePayout(hand: deckType[], bet: number) {
    const handRank = evaluateHand(hand);

    // Special case for 'Pair' payout
    if (handRank === 'pair') {
        const rankCounts = getRankCounts(hand);
        const highPair = ['J', 'Q', 'K', 'A'].some((rank) => rankCounts[rank] === 2);
        if (!highPair) {
            return { winAmount: 0, multiplier: 0 }; // Only pay for 'Jacks or Better'
        }
    }

    const winAmount = bet * (payoutTable.find((item) => item.id === handRank)?.odds || 0);
    return { winAmount, multiplier: payoutTable.find((item) => item.id === handRank)?.odds || 0 };
}

// Helper functions for evaluating hands
function getRankCounts(hand: deckType[]) {
    const counts: any = {};
    for (const card of hand) {
        counts[card.rank] = (counts[card.rank] || 0) + 1;
    }
    return counts;
}

// Check if the hand is a flush (all cards have the same suit)
function checkFlush(hand: deckType[]) {
    const firstSuit = hand[0].suit;
    return hand.every((card) => card.suit === firstSuit);
}

// Check if the hand is a straight (all cards are consecutive)
function checkStraight(rankCounts: any) {
    const rankIndexes = RANKS.map((rank) => (rankCounts[rank] ? 1 : 0));

    // Check for standard straights
    for (let i = 0; i <= rankIndexes.length - 5; i++) {
        if (rankIndexes.slice(i, i + 5).every((count) => count === 1)) {
            return true;
        }
    }

    // Special case for Ace-low straight (A, 2, 3, 4, 5)
    const isAceLowStraight =
        rankCounts['A'] && rankCounts['2'] && rankCounts['3'] && rankCounts['4'] && rankCounts['5'];
    return isAceLowStraight;
}

// Function to start a new game
function startNewGame(hash: string): { deck: any; hand: any } {
    const deck: deckType[] = createDeck();
    return dealHand(deck, hash);
}

// Function to deal a hand of 5 cards
function dealHand(deck: deckType[], combinedHash: string, leng = 5) {
    const hand: deckType[] = [];
    const startIndex = parseInt(combinedHash.slice(0, 8), 16) % deck.length;

    for (let i = 0; i < leng; i++) {
        const index = (startIndex + i) % deck.length;
        hand.push(deck.splice(index, 1)[0]);
    }

    return { hand, deck };
}

// Function to handle player's decision to hold cards and draw new ones
function drawCards(_deck: deckType[], hand: deckType[], holdIndexes: number[], hash: string) {
    for (let i = 0; i < hand.length; i++) {
        if (!holdIndexes.includes(i) && hand[i] && _deck.length > 0) {
            // Pop a card from the deck
            const { hand: hand1, deck } = dealHand(_deck, hash, 1);

            if (hand1.length) {
                hand[i] = hand1[0];
            } else {
                // Handle the case where no card is available (deck was empty)
                console.error('No card available to assign to hand.');
            }
        }
    }
    return hand;
}

export const getVideoPoker = async (req: AuthRequest, res: Response) => {
    try {
        // const userId = "";
        const userId = req.user?._id;
        const game = await CommonGameModel.findOne({ userId: userId, status: 'BET', game_type: GAME_TYPE });

        if (game) {
            return res.json({
                hand: game.aBetting.hand
            });
        }
        return res.json({ status: false });
    } catch (error) {
        console.error('Error Get Status VideoPoker Game =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const betVideoPoker = async (req: AuthRequest, res: Response) => {
    try {
        const { amount } = req.body;
        const userId = req.user?._id;

        const me = await UserModel.findById(userId);
        if (!me) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('User not found');
        }

        if (amount > me.balance) {
            return res.status(httpStatus.BAD_REQUEST).send('Your balance is not enough');
        }

        const game = await CommonGameModel.findOne({ status: 'BET', game_type: GAME_TYPE, userId: userId });
        if (game) {
            return res.json({ hand: game.aBetting.hand });
        }

        const serverSeed = generateSeed();
        const clientSeed = generateSeed();
        const hashedServerSeed = seedHash(serverSeed);
        const combinedHash = seedHash(serverSeed + clientSeed);
        const currentGame = startNewGame(combinedHash);

        const query = {
            userId,
            odds: 0,
            game_type: GAME_TYPE,
            profit: 0,
            amount: amount,
            betting: req.body,
            aBetting: {
                privateSeedHash: seedHash(serverSeed),
                publicSeed: clientSeed,
                privateSeed: serverSeed,
                deck: currentGame.deck,
                hand: currentGame.hand
            },
            status: 'BET'
        };
        const newGame = await CommonGameModel.create(query);
        await userService.handleBalance(me._id, amount, 'BET', GAME_TYPE, newGame._id.toString());

        const queryh = {
            gameid: newGame._id,
            user: me._id,
            bet: amount,
            target: 0,
            payout: 0,
            type: GAME_TYPE
        };

        const history: any = await GameHistoryModel.create(queryh);
        history.user = me;

        return res.json({ hand: currentGame.hand, clientSeed, hashedServerSeed, history });
    } catch (error) {
        console.error('Error Get Status VideoPoker Game =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const drawVideoPoker = async (req: AuthRequest, res: Response) => {
    try {
        const { holdIndexes } = req.body;
        const userId = req.user?._id;

        const me = await UserModel.findById(userId);
        if (!me) {
            return res.status(httpStatus.PAYMENT_REQUIRED).send('User not found');
        }

        const game = await CommonGameModel.findOne({ status: 'BET', game_type: GAME_TYPE, userId: userId });
        if (!game) return res.status(httpStatus.PAYMENT_REQUIRED).send('Game not found');

        const combinedHash = seedHash(game.aBetting.privateSeed + game.aBetting.publicSeed);

        game.aBetting.hand = drawCards(game.aBetting.deck, game.aBetting.hand, holdIndexes, combinedHash);
        const result = evaluateHand(game.aBetting.hand);

        const { winAmount, multiplier } = calculatePayout(game.aBetting.hand, game.amount);
        let finalWinAmount = winAmount;
        let finalMultiplier = multiplier;
        let finalStatus = winAmount - game.amount > 0 ? 'WIN' : 'LOST';
        // RTP LOGIC
        const { input, output } = await gameService.getProfit(GAME_TYPE);
        const totalInput = input;
        const totalOutput = output;
        const rtpConfig = await GameRTPModel.findOne({ game_type: GAME_TYPE });
        const targetRTP = rtpConfig?.rtp ?? 96;
        const newTotalOutput = totalOutput + winAmount;
        const newTotalInput = totalInput + game.amount;
        const newRTP = newTotalInput > 0 ? (newTotalOutput / newTotalInput) * 100 : 0;
        if (finalStatus === 'WIN' && newRTP >= targetRTP) {
            finalStatus = 'LOST';
            finalWinAmount = 0;
            finalMultiplier = 0;
        }
        game.profit = finalWinAmount - game.amount;
        game.odds = finalMultiplier;
        game.status = finalStatus;
        await game.save();

        if (finalStatus === 'WIN') await userService.handleBalance(me._id, finalWinAmount, 'WIN', GAME_TYPE, game._id.toString());

        const history = await GameHistoryModel.findOneAndUpdate(
            {
                gameid: game._id
            },
            {
                target: game.odds,
                payout: finalWinAmount
            },
            {
                new: true,
                upsert: true
            }
        );

        // Save GGR data
        await saveGGR(GAME_TYPE, game.amount, finalWinAmount);

        return res.json({
            hand: game.aBetting.hand,
            result,
            payout: finalWinAmount,
            privateSeed: game.aBetting.privateSeed,
            history
        });
    } catch (error) {
        console.error('Error Get Status VideoPoker Game =>', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json('Internal Server Error');
    }
};

export const getVideoPokerHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
