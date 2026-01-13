import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Avatar, Button, CardContent, Card, Chip, Grid, InputBase, Stack, Typography, useMediaQuery, useTheme, IconButton, Box, Select, MenuItem, Container, Paper } from '@mui/material';

import useApi from 'src/hooks/use-api';
import { useSelector } from 'src/store';

import Iconify from 'src/components/iconify';
import Timer from 'src/components/custom/Timer';

import { generateHash } from 'src/utils/custom';
import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';

import ballImg from 'src/assets/images/games/ball.png';
import bombImg from 'src/assets/images/games/bomb.png';
import explosionImg from 'src/assets/images/games/expolition.png';

import { HistoryProps } from 'src/types';


import betaudio from 'src/assets/audio/bet.mp3';
import ballmoveaudio from 'src/assets/audio/goal_ball_move.mp3';
import winaudio from 'src/assets/audio/win.mp3';
import loseaudio from 'src/assets/audio/lose.mp3';
import successaudio from 'src/assets/audio/success.wav';

import ResultModal from './modal';
import { GRIDS, hashToColumnPosition } from './config';

const BET_AMOUNTS = [100, 1000, 10000, 50000];

// Types
interface BetInputProps {
  betAmount: string;
  onBetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setBetAmount: (amount: string | ((prev: string) => string)) => void;
}


interface HistoryListProps {
  history: HistoryProps[];
  baseUrl: string;
}


// Styles
const styles = {
  gameContainer: {
    px: 1,
    gap: 3,
  },
  header: {
    gap: 1,
    bgcolor: 'secondary.main',
    p: '12px 16px',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 0.5,
  },
  gameBox: {
    borderRadius: 2,
    border: '1px solid #2B4C79',
    bgcolor: 'background.paper',
    boxShadow: '0px 0px 2px 0px rgba(0, 0, 0, 0.25)',
    gap: 2,
    px: { xs: 1, md: 2.5 },
    py: 3.5,
    position: 'relative',
    height: 'auto',
    overflow: 'hidden',
    padding: '0px !important',
  },
  gameHeader: {
    borderRadius: '16px 16px 0 0',
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(6px)',
  },
  betButton: {
    py: 1,
    px: 2.5,
    borderRadius: 50,
    fontSize: 16,
    bgcolor: '#1D3E6B',
    border: '2px solid #2B4C79',
  },
  historyCard: {
    height: 1,
    borderRadius: 2,
    border: '1px solid #2B4C79',
    maxHeight: 780,
    display: 'flex',
    flexDirection: 'column',
  }
};

// Components
const BetInput = ({ betAmount, onBetChange, setBetAmount }: BetInputProps) => (
  <Stack direction="row">
    <Button
      variant="contained"
      color="primary"
      sx={{
        height: 50,
        width: 48,
        minWidth: 48,
        borderRadius: '50px 0 0 50px',
        fontSize: 32,
        bgcolor: '#1D3E6B',
        border: '2px solid #2B4C79',
      }}
      onClick={() => setBetAmount((state: string) => (parseFloat(state) - 1).toFixed(2) || '0.00')}
    >
      <Iconify icon="ic:sharp-minus" width={24} height={24} />
    </Button>
    <InputBase
      value={betAmount}
      onChange={onBetChange}
      placeholder="0.00"
      sx={{
        px: 2,
        bgcolor: '#0C1F3A',
        border: '2px solid #2B4C79',
        borderWidth: '2px 0 2px 0',
      }}
      type="number"
      inputProps={{ step: 0.01, min: 0 }}
    />
    <Button
      variant="contained"
      color="primary"
      sx={{
        height: 50,
        width: 48,
        minWidth: 48,
        borderRadius: '0 50px 50px 0',
        fontSize: 32,
        bgcolor: '#1D3E6B',
        border: '2px solid #2B4C79',
      }}
      onClick={() => setBetAmount((state: string) => (parseFloat(state) + 1).toFixed(2) || '0.00')}
    >
      <Iconify icon="ic:sharp-plus" width={24} height={24} />
    </Button>
  </Stack>
);

const GameHeader: React.FC = () => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    px={2}
    py={1}
    sx={styles.gameHeader}
  >
    <Stack>
      <Typography variant="h6">Goal Game</Typography>
      <Timer />
    </Stack>
    <Stack direction="row" gap={1}>
      <Chip
        label="Game Fairness"
        size="small"
        variant="outlined"
        icon={<Iconify icon="si:shield-alert-line" width={16} height={16} />}
        sx={{
          px: 1,
          py: 2,
          borderRadius: 50,
        }}
      />
    </Stack>
  </Stack>
);


const HistoryList = ({ history, baseUrl }: HistoryListProps) => (
  <>
    <Stack px={2} flexShrink={0}>
      <Stack
        direction="row"
        alignItems="center"
        width={1}
        borderTop="1px solid #2B4C79"
        py={1}
      >
        <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.4}>
          Player
        </Typography>
        <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.25}>
          Multiplier
        </Typography>
        <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.2}>
          Payout
        </Typography>
        <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.2}>
          Amount
        </Typography>
      </Stack>
    </Stack>
    <Stack
      px={2}
      sx={{
        overflowY: 'auto',
        flex: 1,
        minHeight: 0,
      }}
    >
      {history.map((row: HistoryProps, index: number) => {
        if (!row.user) return null;
        return (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            width={1}
            borderTop="1px solid #2B4C79"
            py={1}
          >
            <Stack direction="row" alignItems="center" gap={1} width={0.4}>
              <Avatar
                alt={row.user?.avatar || ''}
                src={row.user?.avatar?.includes('http') ? row.user.avatar : `${baseUrl}/${row.user?.avatar || ''}`}
                sx={{ width: 20, height: 20 }}
              />
              <Typography fontSize={10}>{row.user?.username || 'Unknown'}</Typography>
            </Stack>
            <Stack width={0.25}>
              <Typography fontSize={10}>{(row?.target || 0).toFixed(2)}x</Typography>
            </Stack>
            <Stack width={0.2}>
              <Typography
                fontSize={10}
                color={row.payout >= row.bet ? 'success.main' : 'error.main'}
              >
                {(row.payout || 0).toFixed(2)}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} width={0.2}>
              <Typography fontSize={10}>{row.bet}</Typography>
              <Avatar
                alt={row.user?.currency || ''}
                src={row.user?.currencyIcon || ''}
                sx={{ width: 20, height: 16, borderRadius: 0.5 }}
              />
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  </>
);

let isSoundEnable = false;

const playAudio = (key: string) => {
  if (!isSoundEnable) return;
  try {
    if (key === 'bet') {
      if (betaudio) {
        const auido = new Audio();
        auido.src = betaudio;
        auido
          .play()
          .then(() => { })
          .catch((error: any) => {
            console.log('Failed to autoplay audio:', error);
          });
      }
    } else if (key === 'success') {
      if (successaudio) {
        const auido = new Audio();
        auido.src = loseaudio;
        auido.volume = 0.5;
        auido
          .play()
          .then(() => { })
          .catch((error: any) => {
            console.log('Failed to autoplay audio:', error);
          });
      }
    } else if (key === 'move') {
      if (ballmoveaudio) {
        const auido = new Audio();
        auido.src = ballmoveaudio;
        auido
          .play()
          .then(() => { })
          .catch((error: any) => {
            console.log('Failed to autoplay audio:', error);
          });
      }
    } else if (key === 'win') {
      const audio = new Audio();
      audio.src = winaudio;
      audio
        .play()
        .then(() => { })
        .catch((error: any) => {
          console.log('Failed to autoplay audio:', error);
        });
    } else if (key === 'loss') {
      const audio = new Audio();
      audio.src = loseaudio;
      audio
        .play()
        .then(() => { })
        .catch((error: any) => {
          console.log('Failed to autoplay audio:', error);
        });
    }
  } catch (error) {
    console.log(error);
  }
};

const GoalView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { createGoalApi, betGoalApi, cashoutGoalApi, getGoalHistoryApi } = useApi();
  const { balance, isLoggedIn, realBalance, baseUrl } = useSelector((store) => store.auth);

  const [activeLevel, setLevel] = useState<0 | 1 | 2>(0);
  const [betAmount, setBetAmount] = useState<string>('0.00');
  const [gameId, setGameId] = useState('');
  const [privateHash, setPrivateHash] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privatekey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowModal] = useState(false);
  const [profit, setProfit] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const groundRef = useRef<any>(null);
  const startRef = useRef<any>(null);
  const goalRef = useRef<any>(null);

  const [history, setHistory] = useState<HistoryProps[]>([]);

  const [rounds, setRounds] = useState<{ position: number; lossPostion: number }[]>([]);

  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const [bombs, setBombs] = useState<number[]>([]);
  const [isEnd, setEnd] = useState(false);
  const [linePositions, setLinePositions] = useState<
    { x1: number; y1: number; x2: number; y2: number }[]
  >([]);

  const currentGrid = GRIDS[activeLevel];
  const { multipliers } = currentGrid;

  const isLoss =
    rounds.length > 0 &&
    rounds[rounds.length - 1].position === rounds[rounds.length - 1].lossPostion;
  const inPlayDisable = gameId !== '' || loading;

  const changeHistory = (param: HistoryProps) => {
    let status = false;
    const updated = history.map((item) => {
      if (item._id === param._id) {
        status = true;
        return param;
      }
      return item;
    });
    if (!status) {
      setHistory([param, ...history]);
      return;
    }
    setHistory(updated);
  };

  const handleCellClick = async (position: number) => {
    if (!inPlayDisable) {
      toast.error('Please create bet');
      return;
    }

    setLoading(true);

    const res = await betGoalApi(position);
    if (!res?.data) return;

    const { data } = res;
    playAudio('move');

    if (data.status) {
      if (data.result === 'LOST' || data.result === 'WIN') {
        setPrivateKey(data.privateKey);
        setGameId('');
        const _bombs = [];
        for (let i = data.rounds.length; i < currentGrid.h; i += 1) {
          const roundHash = generateHash(data.privateKey + publicKey + i);
          _bombs.push(hashToColumnPosition(roundHash, currentGrid.w));
        }
        setBombs(_bombs);
        setEnd(true);
        if (data.result === 'WIN') {
          setProfit(data.profit);
          setMultiplier(data.multiplier);
          setShowModal(true);
          playAudio('win');
        } else {
          playAudio('loss');
        }
      }
      setRounds(data.rounds);
    }

    if (data.history) {
      changeHistory(data.history);
    }

    setLoading(false);
  };

  const createBet = async () => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }
    const amount = parseFloat(betAmount);

    if (!validateBetAmount(amount, balance)) {
      return;
    }

    setRounds([]);
    setShowModal(false);
    setLoading(true);
    setPrivateKey('');

    const param = {
      amount,
      size: activeLevel,
    };
    const res = await createGoalApi(param);
    if (!res?.data) return;
    const { data } = res;

    playAudio('bet');

    if (data.size !== activeLevel) {
      setLevel(data.size);
    }
    if (data.status) {
      setGameId(data.gameId);
      setBetAmount(data.amount);
      setPrivateHash(data.privateHash);
      setRounds(data.rounds);
      setPublicKey(data.publicKey);
      setEnd(false);
    }

    if (data.history) {
      changeHistory(data.history);
    }

    setLoading(false);
  };

  const cashOut = async () => {
    if (loading) return;

    setLoading(true);

    const res = await cashoutGoalApi();
    if (!res?.data) return;
    const { data } = res;

    const _bombs = [];
    for (let i = data.rounds.length; i < currentGrid.h; i += 1) {
      const roundHash = generateHash(data.privateKey + data.publicKey + i);
      _bombs.push(hashToColumnPosition(roundHash, currentGrid.w));
    }
    playAudio('win');
    setBombs(_bombs);
    setEnd(true);
    setGameId('');
    setLevel(data.size);
    setPrivateKey(data.privateKey);
    setProfit(data.profit);
    setMultiplier(data.multiplier);
    setShowModal(true);
    setLoading(false);

    if (data.history) {
      changeHistory(data.history);
    }
  };

  const buttonStatus = () => {
    if (gameId !== '') {
      return 'Cashout';
    }
    return 'Bet';
  };

  const calculateBallPostion = () => {
    if (groundRef.current) {
      const container = groundRef.current as HTMLDivElement;
      const startPos = startRef.current as HTMLDivElement;
      const goalPos = goalRef.current as HTMLDivElement;
      const w = Math.floor(container.clientWidth / currentGrid.w);
      const h = Math.floor(container.clientHeight / currentGrid.h);
      const rect = container.getBoundingClientRect();
      let x = 0;
      let y = 0;
      let bw = 0;
      if (rounds.length === 0) {
        const react1 = startPos.getBoundingClientRect();
        x = container.clientWidth / 2;
        y = react1.top - rect.top;
        bw = startPos.clientHeight * 0.7;
      } else {
        const lastRound = rounds[rounds.length - 1];
        x = Math.floor(w / 2) + w * lastRound.position;
        y = Math.floor(h / 2) + h * (currentGrid.h - rounds.length);
        bw = h * 0.7;
      }
      setBallPosition({
        x,
        y,
        w: bw,
        h: bw,
      });

      if (rounds.length !== 0 && rounds.length === currentGrid.h && !isLoss) {
        const react1 = goalPos.getBoundingClientRect();
        const y1 = react1.top - rect.top;
        const x1 = container.clientWidth / 2;
        const bw1 = goalPos.clientHeight * 0.7;
        setTimeout(() => {
          setBallPosition({
            x: x1,
            y: y1,
            w: bw1 * 4,
            h: bw1 * 4,
          });
          setTimeout(() => {
            setLinePositions((prev) =>
              prev.length !== rounds.length
                ? [
                  ...prev,
                  {
                    x1: x,
                    y1: y,
                    x2: x1,
                    y2: y1,
                  },
                ]
                : [...prev]
            );
          }, 300);
        }, 500);
      }

      if (rounds.length - 1 !== linePositions.length) {
        calculateLines();
      } else {
        setTimeout(() => {
          calculateLines();
        }, 300);
      }
    }
  };

  const calculateLines = () => {
    const container = groundRef.current as HTMLDivElement;
    const w = Math.floor(container.clientWidth / currentGrid.w);
    const h = Math.floor(container.clientHeight / currentGrid.h);

    const positions: { x1: number; y1: number; x2: number; y2: number }[] = [];

    rounds.forEach((round, index) => {
      if (index < rounds.length - 1) {
        const currentRound = rounds[index];
        const nextRound = rounds[index + 1];

        const x1 = Math.floor(w / 2) + w * currentRound.position;
        const y1 = Math.floor(h / 2) + h * (currentGrid.h - index - 1);

        const x2 = Math.floor(w / 2) + w * nextRound.position;
        const y2 = Math.floor(h / 2) + h * (currentGrid.h - index - 2);

        positions.push({ x1, y1, x2, y2 });
      }
    });

    setLinePositions(positions);
  };

  const handleBetButton = () => {
    if (!inPlayDisable) createBet();
    else cashOut();
  };

  useEffect(() => {
    calculateBallPostion();
    if (!groundRef?.current) {
      return () => { };
    }

    const resize = () => {
      calculateBallPostion();
    };
    window.onresize = resize;

    const container = groundRef.current as HTMLDivElement;
    container.addEventListener('resize', resize);
    return () => {
      container.removeEventListener('resize', resize);
    };
  }, [groundRef.current, rounds]);

  useEffect(() => {
    isSoundEnable = true;
  }, []);

  const getHistory = async () => {
    const res = await getGoalHistoryApi();
    if (!res?.data) return;
    setHistory(res.data);
  };

  useEffect(() => {
    getHistory();
  }, []);

  const onBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  useEffect(() => {
    handleBetChange(betAmount, realBalance, setBetAmount);
  }, [betAmount, realBalance]);


  return (
    <Stack className="game-container" sx={styles.gameContainer}>
      <Stack sx={styles.header}>
        <Link to="/" style={{ textDecoration: 'none', color: '#8199B4', fontSize: 14 }}>
          Home
        </Link>
        <Iconify icon="lsicon:right-filled" sx={{ color: '#8199B4', fontSize: 16 }} />
        <Typography fontSize={14} fontWeight={500} noWrap>
          Goal Game
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8} sm={8.5}>
          <Box sx={styles.gameBox}>
            <GameHeader />

            <Container
              maxWidth={false}
              sx={{
                maxWidth: 1300,
                width: '100%',
                mb: 1,
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    gridColumn: 'span 4',
                    minHeight: 335,
                    position: 'relative',
                    height: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <Stack
                    spacing={2}
                    sx={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      p: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Box
                        ref={goalRef}
                        sx={{
                          width: { xs: 112, md: 144 },
                          aspectRatio: '1/0.1',
                          border: 0,
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 4,
                          borderColor: '#fff',
                          zIndex: 20,
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Stack
                        spacing={1}
                        sx={{
                          height: '100%',
                          justifyContent: 'space-between',
                          py: 3,
                        }}
                      >
                        {multipliers.map((value, index) => (
                          <Typography
                            key={index}
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 'bold',
                              color: 'white',
                              textAlign: 'center',
                              py: 2,
                              px: { xs: 2, md: 4 },
                              borderRadius: 1,
                            }}
                          >
                            {value}x
                          </Typography>
                        ))}
                      </Stack>

                      <Box
                        ref={groundRef}
                        sx={{
                          display: "grid",
                          gap: '1px',
                          minWidth: { xs: 300, md: 430 },
                          width: { md: 500 },
                          position: 'relative',
                          border: 4,
                          borderColor: 'rgba(255, 255, 255, 0.61)',
                          borderRadius: 1,
                        }}
                      >
                        {Array.from({ length: currentGrid.h }).map((_, rowIndex) => {
                          const postion = currentGrid.h - rowIndex - 1;
                          const round = rounds[postion];
                          const allow = postion > rounds.length;
                          let disabled = false;
                          if (round) disabled = true;

                          return (
                            <Stack
                              key={rowIndex}
                              direction="row"
                              spacing="1px"
                              sx={{
                                width: '100%',
                                ...(!disabled && !allow && {}),
                              }}
                            >
                              {Array.from({ length: currentGrid.w }).map((__, colIndex) => {
                                let isBallHere = false;
                                let isLast = false;
                                let isBomb = false;
                                const row = bombs[postion - rounds.length];
                                if (typeof row !== 'undefined' && row === colIndex) {
                                  isBomb = true;
                                }
                                if (round && round.position === colIndex) {
                                  isBallHere = true;
                                  if (postion + 1 === rounds.length) isLast = true;
                                }
                                if (round && round.lossPostion === colIndex) {
                                  isBomb = true;
                                }

                                return (
                                  <Box
                                    key={colIndex}
                                    sx={{
                                      bgcolor: (allow || disabled)
                                        ? '#395985'
                                        : '#4D6D99',
                                      '&:hover': {
                                        bgcolor: !disabled && !allow ? '#1D3E6B' : undefined,
                                      },
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      borderRadius: 0.5,
                                      width: '100%',
                                      borderColor: 'rgba(255, 255, 255, 0.56)',
                                      position: 'relative',
                                    }}
                                  >
                                    <Box sx={{ aspectRatio: '1/0.8', width: '100%' }} />
                                    <Box sx={{ width: `${Math.floor(100 / currentGrid.w)}%` }}>
                                      <Button
                                        onClick={() => {
                                          if (!disabled && !allow) handleCellClick(colIndex);
                                        }}
                                        sx={{
                                          width: '100%',
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          height: '100%',
                                          zIndex: 20,
                                          cursor: (disabled || allow) ? 'not-allowed' : 'pointer',
                                        }}
                                      >
                                        {isBomb && isLoss && isBallHere && (
                                          <Box
                                            sx={{
                                              position: 'absolute',
                                              height: '100%',
                                              display: 'flex',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              animation: 'zoom 0.3s ease-in-out',
                                            }}
                                          >
                                            <Box
                                              component="img"
                                              src={explosionImg}
                                              sx={{ width: 100 }}
                                              alt=""
                                            />
                                          </Box>
                                        )}
                                        {isBomb && isEnd && (
                                          <Box
                                            sx={{
                                              position: 'absolute',
                                              height: '100%',
                                              animation: 'zoom 0.3s ease-in-out',
                                              display: 'flex',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                            }}
                                          >
                                            <Box
                                              component="img"
                                              src={bombImg}
                                              sx={{ width: '70%' }}
                                              alt=""
                                            />
                                          </Box>
                                        )}
                                        {isBallHere && !isBomb && (
                                          <>
                                            {(!isLast || rounds.length === currentGrid.h) && (
                                              <Box
                                                sx={{
                                                  transition: 'transform 1000ms ease-out',
                                                  transform: 'scale(1.1)',
                                                  width: '30%',
                                                  opacity: 0.75,
                                                }}
                                              >
                                                <Box component="img" src={ballImg} alt="ball" />
                                              </Box>
                                            )}
                                          </>
                                        )}
                                      </Button>
                                    </Box>
                                  </Box>
                                );
                              })}
                            </Stack>
                          );
                        })}

                        <Box
                          component="svg"
                          sx={{
                            pointerEvents: 'none',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            zIndex: 0,
                            stroke: 'rgba(194, 194, 194, 0.47)',
                            strokeWidth: 3,
                            fill: 'none',
                          }}
                          viewBox="0 0 290 290"
                        >
                          <circle r="45" cx="145" cy="145" />
                          <line x1={-145} y1={145} x2="140%" y2={145} />
                          <circle r="45" cx="145" cy={`${-(30 - 100 / currentGrid.h)}%`} />
                        </Box>

                        <Box
                          component="svg"
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            zIndex: 0,
                            pointerEvents: 'none',
                          }}
                        >
                          {linePositions.map((line, index) => (
                            <line
                              key={index}
                              x1={line.x1}
                              y1={line.y1}
                              x2={line.x2}
                              y2={line.y2}
                              stroke="white"
                              strokeWidth="1"
                            />
                          ))}
                        </Box>

                        {ballPosition.w !== 0 && (
                          <Box
                            sx={{
                              position: 'absolute',
                              transition: 'all 300ms ease-in-out',
                              zIndex: 30,
                              left: `${ballPosition.x}px`,
                              top: `${ballPosition.y}px`,
                              width: `${ballPosition.w}px`,
                              height: `${ballPosition.h}px`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            <Box
                              sx={{
                                animation: isLoss ? 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' : 'rotating 1s linear infinite',
                                p: isLoss ? 2 : 0,
                              }}
                            >
                              <Box component="img" src={ballImg} alt="ball" />
                            </Box>
                          </Box>
                        )}
                      </Box>

                      <Stack
                        spacing={1}
                        sx={{
                          height: '100%',
                          justifyContent: 'space-between',
                          py: 3,
                        }}
                      >
                        {multipliers.map((value, index) => (
                          <Typography
                            key={index}
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 'bold',
                              color: 'white',
                              textAlign: 'center',
                              py: 2,
                              px: { xs: 2, md: 4 },
                              borderRadius: 1,
                            }}
                          >
                            {value}x
                          </Typography>
                        ))}
                      </Stack>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                      <Box
                        ref={startRef}
                        sx={{
                          position: 'absolute',
                          width: 112,
                          top: 320,
                          height: 112,
                        }}
                      />
                    </Box>
                  </Stack>

                  <ResultModal
                    visible={showResult}
                    profitAmount={profit}
                    multiplier={multiplier}
                    onClose={() => setShowModal(false)}
                    showAnimation
                  />
                </Box>
              </Paper>
            </Container>

            <Card>
              <CardContent
                sx={{
                  mx: 2,
                  mb: 1,
                  p: '15px !important',
                  bgcolor: 'secondary.main',
                  border: '1px solid #2B4C79',
                  borderRadius: 1.5,
                }}
              >
                <Typography>Mode</Typography>
                <Select
                  fullWidth
                  disabled={loading || inPlayDisable}
                  onChange={(e) => {
                    setRounds([]);
                    setLevel(e.target.value as 0 | 1 | 2);
                  }}
                  value={activeLevel}
                  sx={{
                    borderRadius: 50,
                    fontSize: 16,
                    bgcolor: '#0C1F3A',
                    border: '2px solid #2B4C79',
                    '& .MuiSelect-select': {
                      py: 1,
                      px: 1.5,
                      textTransform: 'uppercase',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                      },
                    },
                  }}
                >
                  {['Small', 'Middle', 'Big'].map((item, index) => (
                    <MenuItem
                      key={index}
                      value={index}
                      disabled={loading}
                      sx={{
                        textTransform: 'uppercase',
                      }}
                    >
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </CardContent>
            </Card>

            <Stack p={3} gap={3} bgcolor="#1D3E6B">
              {isMobile && <Stack alignItems="center"><BetInput betAmount={betAmount} onBetChange={onBetChange} setBetAmount={setBetAmount} /></Stack>}

              <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                {BET_AMOUNTS.slice(0, 2).map((amount) => (
                  <Button
                    key={amount}
                    variant="contained"
                    color="primary"
                    sx={styles.betButton}
                    onClick={() => setBetAmount(amount.toFixed(2))}
                  >
                    {amount.toLocaleString()}
                  </Button>
                ))}

                {!isMobile && <BetInput betAmount={betAmount} onBetChange={onBetChange} setBetAmount={setBetAmount} />}

                {BET_AMOUNTS.slice(2).map((amount) => (
                  <Button
                    key={amount}
                    variant="contained"
                    color="primary"
                    sx={styles.betButton}
                    onClick={() => setBetAmount(amount.toFixed(2))}
                  >
                    {amount.toLocaleString()}
                  </Button>
                ))}

              </Stack>

              <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                <IconButton
                  color="inherit"
                  sx={{
                    bgcolor: '#1D3E6B',
                    border: '2px solid #2B4C79',
                  }}
                  disabled
                >
                  <Iconify icon="ic:twotone-bar-chart" width={20} height={20} />
                </IconButton>
                <IconButton
                  color="inherit"
                  sx={{
                    bgcolor: '#1D3E6B',
                    border: '2px solid #2B4C79',
                  }}
                  disabled
                >
                  <Iconify icon="basil:refresh-outline" width={20} height={20} />
                </IconButton>

                {isLoggedIn ? (
                  <Button
                    variant="contained"
                    color={gameId ? "error" : "primary"}
                    sx={{
                      py: 1,
                      px: 3,
                      width: 230,
                      borderRadius: 50,
                      fontSize: { xs: 14, sm: 18 },
                    }}
                    disabled={loading || (gameId !== '' && rounds.length === 0)}
                    onClick={handleBetButton}
                  >
                    {buttonStatus()}
                  </Button>
                ) : (
                  <Button
                    disabled={loading}
                    sx={{
                      py: 1,
                      px: 3,
                      width: 230,
                      borderRadius: 50,
                      fontSize: 18,
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Sign in
                  </Button>
                )}

                <IconButton
                  color="inherit"
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    bgcolor: '#1D3E6B',
                    border: '2px solid #2B4C79',
                  }}
                  onClick={() => setBetAmount((Number(betAmount) / 2).toFixed(2))}
                >
                  1/2
                </IconButton>
                <IconButton
                  color="inherit"
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    bgcolor: '#1D3E6B',
                    border: '2px solid #2B4C79',
                  }}
                  onClick={() => setBetAmount((Number(betAmount) * 2).toFixed(2))}
                >
                  2X
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={4} sm={3.5}>
          <Card sx={styles.historyCard}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              px={3}
              py={1.5}
              sx={{ ...styles.gameHeader, flexShrink: 0 }}
            >
              <Typography variant="h6">Histories</Typography>
            </Stack>
            <CardContent sx={{ padding: 0, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <HistoryList history={history} baseUrl={baseUrl} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default GoalView;
