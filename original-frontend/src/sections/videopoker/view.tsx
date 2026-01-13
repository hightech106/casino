import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { Stack, useMediaQuery, useTheme, Button, Typography, Grid, Box } from '@mui/material';

import useApi from 'src/hooks/use-api';
import { useSelector } from 'src/store';

// import Button from 'src/components/custom/Button';
import Iconify from 'src/components/iconify';
import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';
import { HistoryProps } from 'src/types';

import ResultModal from './modal';
import { ICard } from './types';
import { PAYOUTS, playAudio } from './config';
import PayoutTable from './payout';
import VideoPokerGameScreen from './game';

import { GameHeader } from './components/GameHeader';
import { BetControls } from './components/BetControls';
import GameHistory from './components/GameHistory';

interface GameState {
  betAmount: string;
  dealing: boolean;
  cards: ICard[];
  holds: number[];
  gamestart: boolean;
  loading: boolean;
  history: HistoryProps[];
  privateHash: string;
  privateSeed: string;
  publicSeed: string;
}

const initialGameState: GameState = {
  betAmount: '0.00',
  dealing: false,
  cards: Array(5).fill(undefined),
  holds: [],
  gamestart: false,
  loading: false,
  history: [],
  privateHash: '',
  privateSeed: '',
  publicSeed: '',
};

const VideoPoker: React.FC = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { getVPApi, betVPApi, drawVPApi, getVPHistoryApi } = useApi();

  const { balance, isLoggedIn, baseUrl, realBalance } = useSelector((store) => store.auth);

  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  }, []);

  const changeHistory = (param: HistoryProps) => {
    let ss = false;
    const updated = gameState.history.map((item) => {
      if (item._id === param._id) {
        ss = true;
        return param;
      }
      return item;
    });
    if (!ss) {
      return [param, ...gameState.history];
    }
    return updated;
  };

  const handleBet = useCallback(async () => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }

    const betAmountNum = parseFloat(gameState.betAmount);

    if (!validateBetAmount(betAmountNum, balance)) {
      return;
    }

    updateGameState({ loading: true });
    playAudio('bet');

    if (!gameState.dealing) {
      const res = await betVPApi(betAmountNum);

      if (!res?.data) return;

      const { data } = res;

      updateGameState({
        loading: false,
        gamestart: true,
        holds: [],
        cards: Array(5).fill(undefined),
        privateHash: data.privateSeedHash,
        publicSeed: data.publicSeed,
        ...(data.history && {
          history: changeHistory(data.history)
        })
      });

      setTimeout(() => {
        if (data?.hand) {
          updateGameState({ cards: data.hand });
        }
        updateGameState({ loading: false });
        playAudio('dealing');
      }, 400);
    } else {
      const res = await drawVPApi(gameState.holds);

      if (!res?.data) {
        updateGameState({
          loading: false,
          holds: [],
          gamestart: false,
        });
        return;
      }

      const { data } = res;
      updateGameState({
        loading: false,
        privateSeed: data.privateSeed,
        ...(data.history && {
          history: changeHistory(data.history)
        })
      });

      let c = 0;
      for (let i = 0; i < data.hand.length + 1; i++) {
        setTimeout(() => {
          updateGameState({
            cards: data.hand.map((card: ICard, index: number) => {
              if (index < i || gameState.holds.includes(index)) {
                return card;
              }
              return undefined;
            }),
          });

          if (i === data.hand.length) {
            updateGameState({
              holds: [],
              gamestart: false,
              loading: false,
            });
          }
          playAudio('dealing');
        }, 300 * c);
        if (!gameState.holds.includes(i)) {
          c += 1;
        }
      }
    }

    updateGameState({ dealing: !gameState.dealing });
  }, [gameState, isLoggedIn, balance, betVPApi, drawVPApi, updateGameState]);

  const handleHolder = useCallback((index: number) => {
    const num = gameState.holds.findIndex((i) => i === index);
    if (num === -1) {
      updateGameState({ holds: [...gameState.holds, index] });
    } else {
      updateGameState({ holds: gameState.holds.filter((h) => h !== index) });
    }
  }, [gameState.holds, updateGameState]);

  const getGame = useCallback(async () => {
    updateGameState({ loading: true });
    const res = await getVPApi();
    if (!res?.data) return;

    updateGameState({
      gamestart: true,
      holds: [],
      cards: Array(5).fill(undefined),
    });

    setTimeout(() => {
      if (res.data?.hand) {
        updateGameState({ cards: res.data.hand });
      }
      updateGameState({ loading: false });
    }, 400);
  }, [getVPApi, updateGameState]);

  useEffect(() => {
    getGame();
  }, [getGame]);

  const getHistory = async () => {
    const res = await getVPHistoryApi();
    if (!res?.data) return;
    updateGameState({ history: res.data });
  };

  useEffect(() => {
    getHistory();
  }, []);

  const { ranking, winningCards } = evaluateHand(gameState.cards);
  const currentpayout = PAYOUTS.find((payout) => !gameState.dealing && payout.id === ranking);
  const disabled = gameState.dealing || gameState.loading;

  const onBetChange = (value: string) => {
    updateGameState({ betAmount: value });
  };

  useEffect(() => {
    handleBetChange(gameState.betAmount, realBalance, onBetChange);
  }, [gameState.betAmount, realBalance]);

  return (
    <Stack
      className="game-container"
      sx={{
        px: 1,
        gap: 3,
      }}
    >
      <Stack
        sx={{
          gap: 1,
          bgcolor: 'secondary.main',
          p: '12px 16px',
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 0.5,
        }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: '#8199B4', fontSize: 14 }}>
          Home
        </Link>
        <Iconify icon="lsicon:right-filled" sx={{ color: '#8199B4', fontSize: 16 }} />
        <Typography fontSize={14} fontWeight={500} noWrap>
          VideoPoker Game
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8} sm={8.5}>
          <Box
            sx={{
              borderRadius: 2,
              border: '1px solid #2B4C79',
              bgcolor: 'background.paper',
              boxShadow: `0px 0px 2px 0px rgba(0, 0, 0, 0.25)`,
              gap: 2,
              px: { xs: 1, md: 2.5 },
              py: 3.5,
              position: 'relative',
              height: 'auto',
              overflow: 'hidden',
              padding: '0px !important',
            }}
          >
            <GameHeader title="VideoPoker Game" />

            <Stack
              sx={{
                width: 1,
                height: 0.6,
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div className="flex w-full justify-center items-center">
                <div
                  className={`-4 rounded-md overflow-hidden w-full ${isMobile ? 'm-2' : ''} shadow-md`}
                >
                  <div
                    className={`p-4 md:p-6 gap-2 ${isMobile ? 'min-h-[350px]' : 'min-h-[300px]'} relative h-full overflow-hidden`}
                  >
                    <div className="flex-col md:px-10">
                      <PayoutTable
                        ranking={ranking}
                        betAmount={parseFloat(gameState.betAmount)}
                        dealing={gameState.dealing}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleBet}
                        disabled={gameState.loading}
                        className="text-white py-3 px-6 rounded-md w-30  transition duration-200 font-bold"
                        sx={{ mt: 2 }}
                      >
                        {gameState.dealing ? "Deal" : "Bet Again"}
                      </Button>
                      <VideoPokerGameScreen
                        cards={gameState.cards}
                        holds={gameState.holds}
                        onSelect={handleHolder}
                        dealing={gameState.dealing}
                        gamestart={gameState.gamestart}
                        winningCards={winningCards}
                      />
                    </div>
                    <ResultModal
                      visible={!gameState.gamestart && winningCards.length > 0 && ranking !== ''}
                      odds={currentpayout?.multiplier || 0}
                      profit={(currentpayout?.multiplier || 0) * parseFloat(gameState.betAmount)}
                      onClose={() => { }}
                    />
                  </div>
                </div>
              </div>
            </Stack>

            <BetControls
              betAmount={gameState.betAmount}
              onBetChange={onBetChange}
              onBet={handleBet}
              disabled={disabled}
              isLoggedIn={isLoggedIn}
              isMobile={isMobile}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4} sm={3.5}>
          <GameHistory history={gameState.history} baseUrl={baseUrl} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default VideoPoker;

function evaluateHand(_hand: ICard[]) {
  const hand: ICard[] = _hand.filter((h) => h); // Filter out any null/undefined values
  const rankCounts = getRankCounts(hand);
  const suitCounts = getSuitCounts(hand);

  let ranking = '';
  let winningCards: any[] = [];

  // Check for flush
  const isFlush = Object.values(suitCounts).some((count) => count === 5);

  // Check for straight using updated straight detection logic
  const isStraight = checkStraight(rankCounts);

  // Check for pairs, three of a kind, four of a kind, full house
  const pairs: any[] = [];
  let threeOfAKind: any = null;
  let fourOfAKind: any = null;

  Object.entries(rankCounts).forEach(([rank, count]) => {
    if (count === 2) {
      pairs.push(rank);
    } else if (count === 3) {
      threeOfAKind = rank;
    } else if (count === 4) {
      fourOfAKind = rank;
    }
  });

  // Royal Flush check (Ace, King, Queen, Jack, 10 of the same suit)
  const hasRoyalFlushRanks = ['10', 'J', 'Q', 'K', 'A'].every((rank) => rankCounts[rank]);
  if (isFlush && hasRoyalFlushRanks) {
    ranking = 'royal_flush';
    winningCards = hand;
  } else if (isFlush && isStraight) {
    ranking = 'straight_flush';
    winningCards = hand;
  } else if (fourOfAKind) {
    ranking = '4_of_a_kind';
    winningCards = hand.filter((card: ICard) => card && card.rank === fourOfAKind);
  } else if (threeOfAKind && pairs.length > 0) {
    ranking = 'full_house';
    winningCards = hand.filter(
      (card: ICard) => (card && card.rank === threeOfAKind) || (card && card.rank === pairs[0])
    );
  } else if (isFlush) {
    ranking = 'flush';
    winningCards = hand;
  } else if (isStraight) {
    ranking = 'straight';
    winningCards = hand;
  } else if (threeOfAKind) {
    ranking = '3_of_a_kind';
    winningCards = hand.filter((card: ICard) => card && card.rank === threeOfAKind);
  } else if (pairs.length === 2) {
    ranking = '2_pair';
    winningCards = hand.filter(
      (card: ICard) => (card && card.rank === pairs[0]) || (card && card.rank === pairs[1])
    );
  } else if (pairs.length === 1) {
    const pairRank = rankOrder(pairs[0]);
    if (pairRank >= rankOrder('J')) {
      ranking = 'pair'; // This is "Pair of Jacks or Better"
      winningCards = hand.filter((card: ICard) => card && card.rank === pairs[0]);
    }
  } else {
    ranking = ''; // No winning hand
  }

  return { ranking, winningCards };
}

// Updated function to check if the hand is a straight (all cards are consecutive)
function checkStraight(rankCounts: any) {
  // Extract ranks and sort them
  const sortedRanks = Object.keys(rankCounts)
    .map((rank) => rankOrder(rank))
    .sort((a, b) => a - b);

  // Check if we have 5 unique ranks
  if (sortedRanks.length !== 5) return false;

  // Check for regular straight (consecutive numbers)
  const isRegularStraight =
    sortedRanks[4] - sortedRanks[0] === 4 &&
    sortedRanks.every((rank, index) => {
      if (index === 0) return true; // Skip first element comparison
      return rank === sortedRanks[index - 1] + 1;
    });

  // Special case: Check for Ace-to-Five straight (Ace is low: A, 2, 3, 4, 5)
  const isAceLowStraight =
    sortedRanks[4] === 14 &&
    sortedRanks[0] === 2 &&
    sortedRanks[1] === 3 &&
    sortedRanks[2] === 4 &&
    sortedRanks[3] === 5;

  // Return true if either a regular straight or an Ace-low straight
  return isRegularStraight || isAceLowStraight;
}

// Helper function to count ranks
function getRankCounts(hand: ICard[]) {
  const counts: { [key: string]: number } = {};
  hand.forEach((card) => {
    if (card) {
      counts[card.rank] = (counts[card.rank] || 0) + 1;
    }
  });
  return counts;
}

// Helper function to count suits
function getSuitCounts(hand: ICard[]) {
  const counts: { [key: string]: number } = {};
  hand.forEach((card) => {
    if (card) {
      counts[card.suit] = (counts[card.suit] || 0) + 1;
    }
  });
  return counts;
}

// Helper function to determine the order of ranks
function rankOrder(rank: string) {
  const order: { [key: string]: number } = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
  };
  return order[rank] || 2;
}
