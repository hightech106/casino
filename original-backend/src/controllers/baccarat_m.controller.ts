/**
 * Multiplayer Baccarat game controller for managing real-time baccarat games.
 * Handles game rounds, player bets, card dealing, provably fair randomness, and Socket.IO communication.
 * Integrates with RTP configuration and GGR tracking for multiplayer baccarat operations.
 */
import { Server, Socket } from 'socket.io';
import { GameHistoryModel, BaccaratModel, UserModel, GameRTPModel, GameGGRModel } from '@models/index';
import { IUser } from '@models/user/user.model';
import { sessionService, userService, gameService } from '@services/index';
import { generateSeed, seedHash } from '@utils/random';
import { ISuit, IRank, IPlayer, ICard, IChip, IPlace } from '@root/types/baccarat.type';
import { getRTPByGame } from './rtp.controller';
import { saveGGR } from './ggr.controller';

const GAME_TYPE = 'baccarat_multi';

const CHIP_VALUES = [1, 10, 100, 1000, 10000, 100000, 1000000];
const RATIO = 1;

// House Edge: Adjusted multipliers
const MULTIPLIERS = {
    Player: 1.94, // 1.94 instead of 2.0
    Banker: 1.89, // 1.89 instead of 1.95
    Tie: 8.74, // 8.74 instead of 9.0
    PPair: 11.65, // 11.65 instead of 12.0
    BPair: 11.65 // 11.65 instead of 12.0
};

const SUITS: ISuit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const RANKS: IRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

enum GAME_STATUS {
    WAITING,
    STARTING,
    BETTING,
    THIRD_CARD_BETTING, // New state for third card betting
    PLAYING,
    SETTLEMENT
}

class GameEngine {
    bets = new Map<string, IPlayer>();

    playerHand: ICard[] = [];
    bankerHand: ICard[] = [];
    io: Server;
    status: GAME_STATUS = GAME_STATUS.WAITING;
    deck: ICard[] = [];
    THIRD_CARD_DELAY = 1000;
    RESTART_DELAY = 1000;
    BETTING_DELAY = 9000;
    SETTLEMENT_DELAY = 9000;

    DT: number;

    serverSeed: string;
    combinedHash: string;
    hashedServerSeed: string;
    clientSeed: string;
    gameId: any;
    constructor(io: any) {
        this.io = io;
        this.handleStatus(GAME_STATUS.STARTING);
        this.DT = Date.now();
    }

    private handleStatus(status: GAME_STATUS) {
        this.status = status;
        this.DT = Date.now();
        this.io.emit('game-status', { status: this.status, dt: this.DT });
        switch (status) {
            case GAME_STATUS.WAITING:
                break;
            case GAME_STATUS.STARTING:
                this.startNewRound();
                break;
            case GAME_STATUS.THIRD_CARD_BETTING:
            case GAME_STATUS.BETTING:
                this.delayStatus();
                break;
            case GAME_STATUS.PLAYING:
                this.playGame();
                break;
            case GAME_STATUS.SETTLEMENT:
                this.delayStatus();
                break;
            default:
                this.handleStatus(GAME_STATUS.WAITING);
                break;
        }
    }

    private delayStatus() {
        switch (this.status) {
            case GAME_STATUS.WAITING:
                break;
            case GAME_STATUS.STARTING:
                setTimeout(() => {
                    this.handleStatus(GAME_STATUS.BETTING);
                }, this.RESTART_DELAY);
                break;
            case GAME_STATUS.BETTING:
            case GAME_STATUS.THIRD_CARD_BETTING:
                setTimeout(() => {
                    this.handleStatus(GAME_STATUS.PLAYING);
                }, this.BETTING_DELAY);
                break;
            case GAME_STATUS.PLAYING:
                break;
            case GAME_STATUS.SETTLEMENT:
                setTimeout(() => {
                    this.handleStatus(GAME_STATUS.STARTING);
                }, this.SETTLEMENT_DELAY);
                break;
            default:
                this.handleStatus(GAME_STATUS.WAITING);
                break;
        }
    }

    private async startNewRound() {
        this.deck = [];
        this.playerHand = [];
        this.bankerHand = [];
        this.gameId = undefined;
        this.bets.clear();
        this.delayStatus();

        this.serverSeed = generateSeed();
        this.clientSeed = generateSeed();
        this.hashedServerSeed = seedHash(this.serverSeed);
        this.combinedHash = seedHash(this.serverSeed + this.clientSeed);
        const newGame = new BaccaratModel({
            privateSeed: this.serverSeed,
            publicSeed: this.clientSeed,
            playerHand: [],
            bankerHand: [],
            bets: [],
            status: 'BET'
        });

        this.gameId = newGame._id;
        await newGame.save();

        // Send the hashed seed to all players
        this.io.emit('round-start', { hashedServerSeed: this.hashedServerSeed, clientSeed: this.clientSeed });
    }

    private playGame() {
        if (!this.playerHand.length || !this.bankerHand.length) {
            this.createDeck();
            this.playerHand = this.dealCards(2);
            this.bankerHand = this.dealCards(2);
            const playerScore = this.calculateScore(this.playerHand);
            const bankerScore = this.calculateScore(this.bankerHand);

            if (this.shouldPlayerDraw(playerScore)) {
                this.drawCardForPlayer();
            } else if (this.shouldBankerDraw(bankerScore, null)) {
                this.drawCardForBanker();
            } else {
                this.settlement();
            }
        } else if (this.playerHand.length == 2) {
            this.drawCardForPlayer();
        } else if (this.playerHand.length == 3 && this.bankerHand.length == 2) {
            this.drawCardForBanker();
        }
    }

    private createDeck() {
        this.deck = [];
        for (const suit of SUITS) {
            for (const rank of RANKS) {
                this.deck.push({ suit, rank });
            }
        }
    }

    private dealCards(numberOfCards: number): ICard[] {
        const hand: ICard[] = [];
        let hashIndex = 0;
        for (let i = 0; i < numberOfCards; i++) {
            const randomIndex = parseInt(this.combinedHash.slice(hashIndex, hashIndex + 8), 16) % this.deck.length;
            hand.push(this.deck[randomIndex]);
            this.deck.splice(randomIndex, 1);
            hashIndex += 8;
        }
        return hand;
    }

    private calculateScore(hand: ICard[]): number {
        const score = hand.reduce((total, card) => {
            if (card.rank === 'A') return total + 1;
            if (['J', 'Q', 'K', '10'].includes(card.rank)) return total;
            return total + parseInt(card.rank, 10);
        }, 0);

        return score % 10;
    }

    private shouldPlayerDraw(playerScore: number): boolean {
        return playerScore <= 5;
    }

    private shouldBankerDraw(bankerScore: number, playerThirdCard: ICard | null): boolean {
        if (bankerScore <= 2) return true;
        if (!playerThirdCard) return false;

        const playerRank = playerThirdCard.rank;
        if (bankerScore === 3 && playerRank !== '8') return true;
        if (bankerScore === 4 && ['2', '3', '4', '5', '6', '7'].includes(playerRank)) return true;
        if (bankerScore === 5 && ['4', '5', '6', '7'].includes(playerRank)) return true;
        if (bankerScore === 6 && ['6', '7'].includes(playerRank)) return true;

        return false;
    }

    private drawCardForPlayer() {
        let playerThirdCard: ICard | null = null;
        playerThirdCard = this.dealCards(1)[0];
        this.playerHand.push(playerThirdCard);
        const bankerScore = this.calculateScore(this.bankerHand);
        if (this.shouldBankerDraw(bankerScore, playerThirdCard)) {
            this.drawCardForBanker();
        } else {
            this.settlement();
        }
    }

    private drawCardForBanker() {
        let bankerThirdCard: ICard | null = null;
        bankerThirdCard = this.dealCards(1)[0];
        this.bankerHand.push(bankerThirdCard);
        this.settlement();
    }

    private isPair(hand: ICard[]): boolean {
        return hand.length === 2 && hand[0].rank === hand[1].rank;
    }

    private determineWinner(playerScore: number, bankerScore: number): IPlace {
        if (playerScore > bankerScore) {
            return 'Player';
        } else if (bankerScore > playerScore) {
            return 'Banker';
        } else {
            return 'Tie';
        }
    }

    private verifyBet(player: IPlayer, chip: IChip): boolean {
        // Check if player has enough balance
        const chipValue = CHIP_VALUES[chip];
        return true;
    }

    async onBet(playerId: string, chip: IChip, place: IPlace, currencyId: string, socket: Socket) {
        if (!playerId) return;
        if (this.status === GAME_STATUS.BETTING || this.status === GAME_STATUS.THIRD_CARD_BETTING) {
            let player: any = this.bets.get(playerId);
            if (!player || !this.verifyBet(player, chip)) {
                this.bets.set(playerId, {
                    PlayerID: place,
                    currency: currencyId,
                    bets: []
                });
                player = this.bets.get(playerId);
                // return socket.emit("bet-res", { status: false, msg: "Insufficient balance or verification failed" });
            }

            const me = await UserModel.findById(playerId);
            if (!me) {
                return socket.emit('bet-res', { status: false, msg: 'User not found' });
            }

            const amount = CHIP_VALUES[chip] / RATIO;

            if (amount > me.balance) {
                return socket.emit('bet-res', { status: false, msg: 'Balance not enough' });
            }

            await userService.handleBalance(playerId, amount, 'BET', GAME_TYPE, this.gameId);

            const queryh = {
                gameid: this.gameId,
                user: playerId,
                bet: amount,
                target: 0,
                payout: 0,
                type: GAME_TYPE
            };

            await GameHistoryModel.create(queryh);

            player.bets.push({
                place,
                chip,
                third: this.status === GAME_STATUS.THIRD_CARD_BETTING
            });

            this.updateBalance(playerId, -CHIP_VALUES[chip] / RATIO, currencyId, 'BET');

            socket.emit('bet-res', { status: true, msg: 'Bet placed successfully' });
            return this.io.emit('bet', { playerId, chip, place, currencyId });
        }
        return socket.emit('bet-res', { status: false, msg: 'Betting phase is over' });
    }

    checkBalance(playerId: string, currency: string, amount: number) {
        return true;
    }

    async onCacenlBet(playerId: string, socket: Socket) {
        if (this.status !== GAME_STATUS.BETTING && this.status !== GAME_STATUS.THIRD_CARD_BETTING)
            return socket.emit('cancelbet-res', { status: false, msg: 'game status error' });
        const player = this.bets.get(playerId);

        if (!player) return socket.emit('cancelbet-res', { status: false, msg: 'verification failed' });
        if (this.status === GAME_STATUS.THIRD_CARD_BETTING) {
            if (player.bets.length && player.bets[player.bets.length - 1].third) {
                const amount = CHIP_VALUES[player.bets[player.bets.length - 1].chip] / RATIO;
                await userService.handleBalance(playerId, amount, 'CANCEL', GAME_TYPE, this.gameId);

                this.updateBalance(playerId, amount, player.currency, 'CANCEL');
                player.bets.pop();
                if (!player.bets.length) {
                    this.bets.delete(playerId);
                }
            } else {
                return socket.emit('cancelbet-res', { status: false, msg: 'status error' });
            }
        } else if (this.status === GAME_STATUS.BETTING) {
            if (player.bets.length) {
                const amount = CHIP_VALUES[player.bets[player.bets.length - 1].chip] / RATIO;
                await userService.handleBalance(playerId, amount, 'CANCEL', GAME_TYPE, this.gameId);

                this.updateBalance(playerId, amount, player.currency, 'CANCEL');
                player.bets.pop();
                if (!player.bets.length) {
                    this.bets.delete(playerId);
                }
            } else {
                return socket.emit('cancelbet-res', { status: false, msg: 'status error' });
            }
        }
        this.io.emit('cancelbet', { status: true, player: { playerId } });
    }

    async onClearBet(playerId: string, socket: Socket) {
        if (this.status !== GAME_STATUS.BETTING)
            return socket.emit('cancelbet-res', { status: false, msg: 'game status error' });
        const player = this.bets.get(playerId);

        if (!player) return socket.emit('clearbet-res', { status: false, msg: 'verification failed' });

        for (let i = 0; i < player.bets.length; i++) {
            const amount = CHIP_VALUES[player.bets[i].chip] / RATIO;
            await userService.handleBalance(playerId, amount, 'CANCEL', GAME_TYPE, this.gameId);

            this.updateBalance(playerId, amount, player.currency, 'CANCEL');
        }
        this.bets.delete(playerId);
        return this.io.emit('clearbet', { status: true, player: { playerId } });
    }

    private async settlement() {
        const RTP = await getRTPByGame(GAME_TYPE);
        this.io.emit('deal-card', { player: this.playerHand, banker: this.bankerHand });
        const playerScore = this.calculateScore(this.playerHand);
        const bankerScore = this.calculateScore(this.bankerHand);
        const winner = this.determineWinner(playerScore, bankerScore);
        const isPlayerPair = this.isPair(this.playerHand);
        const isBankerPair = this.isPair(this.bankerHand);

        // Get total input and output for RTP calculation
        const { input, output } = await gameService.getProfit(GAME_TYPE);
        let totalInput = input;
        let totalOutput = output;
        let gameTotalBets = 0;
        let gameTotalWins = 0;
        const playerCount = this.bets.size;

        for (const [playerId, player] of this.bets) {
            let payout = 0;
            let totalBet = 0;

            for (const bet of player.bets) {
                const chipValue = CHIP_VALUES[bet.chip] / RATIO;
                totalBet += chipValue;

                if (bet.place === winner) {
                    payout += chipValue * MULTIPLIERS[winner];
                    if ((bet.place === 'PPair' && isPlayerPair) || (bet.place === 'BPair' && isBankerPair)) {
                        payout += chipValue * MULTIPLIERS[bet.place];
                    }
                }
            }

            gameTotalBets += totalBet;
            gameTotalWins += payout;

            // Check if payout would exceed RTP
            if (payout > 0) {
                const newTotalOutput = totalOutput + payout;
                const newTotalInput = totalInput + totalBet;
                const currentRTP = (newTotalOutput / newTotalInput) * 100;

                if (currentRTP <= RTP) {
                    await userService.handleBalance(playerId, payout, 'WIN', GAME_TYPE, this.gameId);
                    await GameHistoryModel.updateOne(
                        { gameid: this.gameId, user: playerId },
                        { target: MULTIPLIERS[winner], payout }
                    );
                    this.updateBalance(playerId, payout, player.currency, 'WIN');
                    totalOutput = newTotalOutput;
                } else {
                    // If RTP would be exceeded, reduce payout to maintain RTP
                    const adjustedPayout = totalInput * (RTP / 100) - totalOutput;
                    if (adjustedPayout > 0) {
                        await userService.handleBalance(playerId, adjustedPayout, 'WIN', GAME_TYPE, this.gameId);
                        await GameHistoryModel.updateOne(
                            { gameid: this.gameId, user: playerId },
                            { target: MULTIPLIERS[winner], payout: adjustedPayout }
                        );
                        this.updateBalance(playerId, adjustedPayout, player.currency, 'WIN');
                        // Update game total wins with adjusted payout
                        gameTotalWins = gameTotalWins - payout + adjustedPayout;
                    }
                }
            }
            totalInput += totalBet;
        }

        // Save GGR data for this game
        if (gameTotalBets > 0) {
            await saveGGR(GAME_TYPE, gameTotalBets, gameTotalWins);
        }

        const bets: IPlayer[] = [];
        for (const [id, bet] of this.bets) {
            bets.push(bet);
        }

        await BaccaratModel.findByIdAndUpdate(this.gameId, {
            playerHand: this.playerHand,
            bankerHand: this.bankerHand,
            bets: bets,
            status: 'END'
        });

        setTimeout(() => {
            this.io.emit('result', {
                winner,
                ppair: isPlayerPair,
                bpair: isBankerPair,
                serverSeed: this.serverSeed
            });
            this.handleStatus(GAME_STATUS.SETTLEMENT);
        }, this.THIRD_CARD_DELAY);
    }

    private updateBalance(playerId: string, amount: number, currencyId: string, type: string) {
        // Update the player's balance in the database or in memory
        // Additional logic to update database records for the transaction can go here
    }
}

export const baccaratSocket = (io: Server) => {
    const so = io.of('/baccarat_m');
    const gameEngline = new GameEngine(so);

    so.on('connection', (socket: Socket) => {
        console.log('---------baccarat connected---------');
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

        const bet = (data: { chip: IChip; place: IPlace; currencyId: string }) => {
            if (!loggedIn) return socket.emit('error', 'No authentication token provided, authorization declined');
            gameEngline.onBet(user._id, data.chip, data.place, data.currencyId, socket);
        };

        const cancel = () => {
            if (!loggedIn) return socket.emit('error', 'No authentication token provided, authorization declined');
            gameEngline.onCacenlBet(user._id, socket);
        };

        const clear = () => {
            if (!loggedIn) return socket.emit('error', 'No authentication token provided, authorization declined');
            gameEngline.onClearBet(user._id, socket);
        };

        const init = () => {
            socket.emit('game-data', {
                playerId: user?._id,
                bets: gameEngline.bets.values(),
                playerHand: gameEngline.playerHand,
                bankerHand: gameEngline.bankerHand,
                status: gameEngline.status,
                THIRD_CARD_DELAY: gameEngline.THIRD_CARD_DELAY,
                RESTART_DELAY: gameEngline.RESTART_DELAY,
                BETTING_DELAY: gameEngline.BETTING_DELAY,
                SETTLEMENT_DELAY: gameEngline.SETTLEMENT_DELAY,
                elapsed: Date.now() - gameEngline.DT,
                hashedServerSeed: gameEngline.hashedServerSeed,
                clientSeed: gameEngline.clientSeed,
                gameId: gameEngline.gameId
            });
        };

        socket.on('auth', authenticate);
        socket.on('bet', bet);
        socket.on('cancel', cancel);
        socket.on('clear', clear);
        socket.on('init', init);
    });
};
