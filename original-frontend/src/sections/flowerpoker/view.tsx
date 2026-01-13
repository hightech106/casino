import { useEffect, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import {
  InputBase,
  Stack,
  useMediaQuery,
  useTheme,
  Button,
  Typography,
  Avatar,
  CardContent,
  Card,
  Grid,
  IconButton,
  Box,
  Chip, Paper,
  ToggleButtonGroup,
  styled,
  toggleButtonGroupClasses,
  ToggleButton,
  TextField
} from '@mui/material';

import useApi from 'src/hooks/use-api';
import { useSelector } from 'src/store';

import Timer from 'src/components/custom/Timer';
import {
  Flower1Icon,
  Flower2Icon,
  Flower3Icon,
  Flower4Icon,
  Flower5Icon,
  PlantSeedIcon,
} from 'src/components/svgs';
import Iconify from 'src/components/iconify';
import { handleBetChange, validateBetAmount } from 'src/utils/bet-validation';
import { HistoryProps, TabPanelProps } from 'src/types';

import betaudio from 'src/assets/audio/bet.mp3';
import winaudio from 'src/assets/audio/win.mp3';
import loseaudio from 'src/assets/audio/lose.mp3';

import CombinationView from './combination';
import ResultModal from './modal';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  borderRadius: 50,
  // border: 0,
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .Mui-selected`]: {
    backgroundColor: '#1967DC !important',
  },
}));

// Types
enum Flower {
  RED,
  BLUE,
  PURPLE,
  ORANGE,
  RAINBOW,
}

interface IFlower {
  flower: Flower;
  checked: boolean;
}

interface GameState {
  betAmount: string;
  privateKey: string;
  privateHash: string;
  publicKey: string;
  visibleResult: boolean;
  profit: number;
  hostFlowers: IFlower[];
  playerFlowers: IFlower[];
  isBetting: boolean;
  multiplier: number;
  outcome: string;
  isLoading: boolean;
  isDealing: boolean;
  activeTab: TabPanelProps;
  autoBetCount: number;
  stopProfitA: number;
  stopLossA: number;
  sumProfit: number;
  sumLost: number;
  autoBetting: boolean;
  history: HistoryProps[];
  playCount: number;
}

// Constants
const FLOWER_NAMES = ['BULE', 'RED', 'PURPLE', 'ORANGE', 'RAINBOW'];
const FLOWER_ICONS = [
  <Flower1Icon />,
  <Flower2Icon />,
  <Flower3Icon />,
  <Flower4Icon />,
  <Flower5Icon />,
];
const RANK_COLORS = ['#78CBCF', '#66B5FE', '#9e62f1', '#f449e2', '#ff6f65', '#ff6f65', '#fce035'];

let isSoundEnable = false;

const playAudio = (key: 'bet' | 'win' | 'loss'): void => {
  if (!isSoundEnable) return;
  try {
    const audioMap = {
      bet: betaudio,
      win: winaudio,
      loss: loseaudio,
    };

    const audio = new Audio();
    audio.src = audioMap[key];
    audio.play().catch((error: Error) => {
      console.log('Failed to autoplay audio:', error);
    });
  } catch (error) {
    console.log(error);
  }
};

const FlowerPoker: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { playFlowerPokerApi, betFlowerPokerApi, getFlowerPokerHistoryApi } = useApi();
  const { isLoggedIn, balance, realBalance, baseUrl } = useSelector((store) => store.auth);

  // State management
  const [gameState, setGameState] = useState<GameState>({
    betAmount: '0.00',
    privateKey: '',
    privateHash: '',
    publicKey: '',
    visibleResult: false,
    profit: 0,
    hostFlowers: Array(5).fill({ flower: Flower.BLUE, checked: false }, 0, 5),
    playerFlowers: Array(5).fill({ flower: Flower.BLUE, checked: false }, 0, 5),
    isBetting: false,
    multiplier: 1,
    outcome: '',
    isLoading: false,
    isDealing: false,
    activeTab: "manual",
    autoBetCount: 0,
    stopProfitA: 0,
    stopLossA: 0,
    sumProfit: 0,
    sumLost: 0,
    autoBetting: false,
    history: [],
    playCount: 0,
  });

  // Memoized values
  const isAuto = useMemo(() => gameState.activeTab === "auto", [gameState.activeTab]);
  const disabled = useMemo(
    () => gameState.isBetting || gameState.autoBetting || gameState.isDealing,
    [gameState.isBetting, gameState.autoBetting, gameState.isDealing]
  );

  // Callbacks
  const createGame = useCallback(async (): Promise<void> => {
    try {
      const res = await playFlowerPokerApi();
      if (!res?.data) return;
      if (res.data.status) {
        setGameState(prev => ({
          ...prev,
          privateHash: res.data.privateHash,
          publicKey: res.data.publicKey,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }, [playFlowerPokerApi]);

  const handleBet = useCallback(async (): Promise<void> => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }

    const amount = parseFloat(gameState.betAmount);

    if (gameState.isLoading) return;

    if (!validateBetAmount(amount, balance)) {
      return;
    }

    playAudio('bet');
    setGameState(prev => ({
      ...prev,
      visibleResult: false,
      isLoading: true,
      isBetting: true,
    }));

    try {
      const res = await betFlowerPokerApi(amount);
      if (!res?.data) return;
      const { data } = res;
      if (!data.status) return;

      setGameState(prev => ({
        ...prev,
        playerFlowers: prev.playerFlowers.map((f, index) => ({
          ...f,
          flower: data.playerFlowers[index],
          checked: false,
        })),
        hostFlowers: prev.hostFlowers.map((f, index) => ({
          ...f,
          flower: data.hostFlowers[index],
          checked: false,
        })),
        privateHash: data.privateKey,
        publicKey: data.publicKey,
        outcome: data.outcome,
        profit: data.outcome === 'WIN' || data.outcome === 'DRAW' ? data.profit : 0,
        multiplier: data.multiplier,
        sumProfit: data.outcome === 'WIN' || data.outcome === 'DRAW' ? prev.sumProfit + data.profit : prev.sumProfit,
        sumLost: data.outcome === 'LOSS' ? prev.sumLost + amount : prev.sumLost,
        isLoading: false,
        ...(data.history && {
          history:
            [data.history, ...gameState.history]
        }),
      }));
    } catch (error) {
      console.log(error);
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  }, [betFlowerPokerApi, gameState.betAmount, gameState.isLoading, isLoggedIn, balance]);

  const startAutoBet = () => {
    if (!gameState.autoBetting && !gameState.isDealing && !gameState.isLoading) {
      if (!Number(gameState.autoBetCount)) setGameState(prev => ({ ...prev, autoBetCount: Infinity }));
      if (!Number(gameState.stopProfitA)) setGameState(prev => ({ ...prev, stopProfitA: Infinity }));
      if (!Number(gameState.stopLossA)) setGameState(prev => ({ ...prev, stopLossA: Infinity }));
      setGameState(prev => ({ ...prev, autoBetting: true }));
    }
  };

  const stopAutoBet = () => {
    if (gameState.autoBetting && !gameState.isLoading) {
      setGameState(prev => ({ ...prev, autoBetting: false }));
    }
  };

  const openFlower = (index: number) => {
    setGameState(prev => ({
      ...prev,
      playerFlowers: prev.playerFlowers.map((f, i) => ({ ...f, checked: i === index ? true : f.checked })),
      hostFlowers: prev.hostFlowers.map((f, i) => ({ ...f, checked: i === index ? true : f.checked })),
    }));
    playAudio('bet');
  };

  /* eslint-disable */
  const openAllCells = () => {
    if (gameState.isLoading && !gameState.autoBetting) return;
    let delay = 0;
    setGameState(prev => ({ ...prev, isDealing: true }));
    let c = 0;
    let d = 0;
    for (let i = 0; i < gameState.playerFlowers.length; i++) {
      c++;
      if (!gameState.playerFlowers[i].checked) {
        setTimeout(() => {
          openFlower(i);
          d++;
          if (c === d) {
            setGameState(prev => ({ ...prev, isDealing: false }));
          }
        }, delay);
        delay += 400;
      }
    }
    playAudio('bet');
  };
  /* eslint-enable */

  const getBestCombination = (
    flowers: Flower[]
  ): { rank: number; description: string; color: string } => {
    const counts = flowers.reduce<Record<Flower, number>>(
      (acc, flower) => {
        acc[flower] = (acc[flower] || 0) + 1;
        return acc;
      },
      {
        [Flower.RED]: 0,
        [Flower.BLUE]: 0,
        [Flower.PURPLE]: 0,
        [Flower.ORANGE]: 0,
        [Flower.RAINBOW]: 0,
      }
    );

    const values = Object.values(counts).sort((a, b) => b - a);
    if (values[0] === 5) return { rank: 6, description: '5 Oak', color: RANK_COLORS[6] };
    if (values[0] === 4) return { rank: 5, description: '4 Oak', color: RANK_COLORS[5] };
    if (values[0] === 3 && values[1] === 2)
      return { rank: 4, description: 'Full House', color: RANK_COLORS[4] };
    if (values[0] === 3) return { rank: 3, description: '3 Oak', color: RANK_COLORS[3] };
    if (values[0] === 2 && values[1] === 2)
      return { rank: 2, description: '2 Pair', color: RANK_COLORS[2] };
    if (values[0] === 2) return { rank: 1, description: '1 Pair', color: RANK_COLORS[1] };
    return { rank: 0, description: 'Bust', color: RANK_COLORS[0] };
  };

  useEffect(() => {
    createGame();
    isSoundEnable = true;
  }, [createGame]);

  useEffect(() => {
    if (gameState.playerFlowers.filter((f) => !f.checked).length === 0) {
      createGame();
      setGameState(prev => ({ ...prev, isBetting: false }));
      if (gameState.outcome === 'WIN' || gameState.outcome === 'DRAW') {
        setGameState(prev => ({ ...prev, visibleResult: true, profit: prev.profit, multiplier: prev.multiplier }));
        playAudio('win');
      } else {
        playAudio('loss');
      }
      setTimeout(() => {
        if (gameState.autoBetting) {
          if (gameState.autoBetCount !== Infinity) {
            if (gameState.autoBetCount > 0) {
              setGameState(prev => ({ ...prev, autoBetCount: gameState.autoBetCount - 1 }));
            } else {
              stopAutoBet();
              return;
            }
          }

          console.log(gameState.stopLossA, gameState.stopProfitA);
          if (gameState.stopLossA !== Infinity && gameState.sumLost > gameState.stopLossA) {
            stopAutoBet();
            setGameState(prev => ({ ...prev, sumLost: 0 }));
            return;
          }
          if (gameState.stopProfitA !== Infinity && gameState.sumProfit > gameState.stopProfitA) {
            setGameState(prev => ({ ...prev, sumProfit: 0, autoBetting: false }));
            stopAutoBet();
            return;
          }
          setGameState(prev => ({ ...prev, playCount: prev.playCount + 1 }));
        }
      }, 1500);
    } else if (gameState.playerFlowers.filter((f) => f.checked).length === 0) {
      if (gameState.autoBetting) {
        setTimeout(() => {
          openAllCells();
        }, 800);
      }
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  }, [gameState.playerFlowers]);

  useEffect(() => {
    if (gameState.autoBetting) {
      handleBet();
    }
  }, [gameState.autoBetting]);

  useEffect(() => {
    if (gameState.autoBetting) {
      handleBet();
    }
  }, [gameState.playCount]);

  const playerstatus = getBestCombination(
    gameState.playerFlowers.filter((f) => f.checked).map((f) => f.flower)
  );
  const hoststatus = getBestCombination(gameState.hostFlowers.filter((f) => f.checked).map((f) => f.flower));

  const getHistory = async () => {
    const res = await getFlowerPokerHistoryApi();
    if (!res?.data) return;
    setGameState(prev => ({ ...prev, history: res.data }));
  };

  useEffect(() => {
    getHistory();
  }, []);

  const onBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameState(prev => ({ ...prev, betAmount: e.target.value }));
  };

  const setBetAmount = (value: string) => {
    setGameState(prev => ({ ...prev, betAmount: value }));
  }

  useEffect(() => {
    handleBetChange(gameState.betAmount, realBalance, setBetAmount);
  }, [gameState.betAmount, realBalance]);

  const elementInputBet = (
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
        onClick={() => setGameState(prev => ({ ...prev, betAmount: (parseFloat(prev.betAmount) - 1).toFixed(2) || '0.00' }))}
      >
        <Iconify icon="ic:sharp-minus" width={24} height={24} />
      </Button>
      <InputBase
        value={gameState.betAmount}
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
        onClick={() => setGameState(prev => ({ ...prev, betAmount: (parseFloat(prev.betAmount) + 1).toFixed(2) || '0.00' }))}
      >
        <Iconify icon="ic:sharp-plus" width={24} height={24} />
      </Button>
    </Stack>
  );

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
          Flower Poker Game
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8} sm={8.5}>
          <Paper
            elevation={0}
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
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              px={2}
              py={1}
              sx={{
                borderRadius: '16px 16px 0 0',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <Stack>
                <Typography variant="h6">Flower Poker Game</Typography>
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

            <Stack
              sx={{
                width: 1,
                height: 0.6,
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  minHeight: isMobile ? 280 : 300,
                  position: 'relative',
                  height: 1,
                  width: 1,
                  overflow: 'hidden',
                }}
              >
                <Stack spacing={2} p={{ xs: 2, sm: 4 }} height="100%" justifyContent="space-around">
                  <Box>
                    <Typography variant="h6" color="white" fontWeight="bold">
                      Host
                    </Typography>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      {gameState.hostFlowers.map((f, index) => (
                        <Grid item xs={2.4} key={f.checked ? `${index}_f` : `${index}_s`}>
                          <Button
                            fullWidth
                            disabled
                            sx={{
                              aspectRatio: '1',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontSize: { xs: 'sm', md: 'lg' },
                              color: 'white',
                              borderRadius: 1,
                              bgcolor: '#34545f94',
                              border: '1px solid #a39e8c',
                              p: { xs: 1, md: 2 },
                              position: 'relative',
                            }}
                          >
                            <Box sx={{ width: '80%', height: '80%' }}>
                              <Box className={f.checked ? 'animate-bloomAni scale-0' : 'scale-0'}>
                                {FLOWER_ICONS[f.flower]}
                              </Box>
                              {f.checked && !isMobile && (
                                <Typography>{FLOWER_NAMES[f.flower]}</Typography>
                              )}
                            </Box>
                            <Box
                              sx={{
                                position: 'absolute',
                                width: '65%',
                                height: '65%',
                                transform: 'translate(-50%, -50%)',
                                color: '#ffc588',
                                left: '50%',
                                top: '50%',
                              }}
                            >
                              <Box className={f.checked ? 'animate-downAni' : 'animate-growAni scale-0'}>
                                <PlantSeedIcon />
                              </Box>
                              {!f.checked && !isMobile && (
                                <Typography>SEED</Typography>
                              )}
                            </Box>
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                    <Typography
                      variant="h5"
                      align="center"
                      sx={{ mt: 1, color: hoststatus.color }}
                    >
                      {hoststatus.description}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      my: 2,
                      height: 1,
                      width: '100%',
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      bgcolor: '#aaaaaa73',
                    }}
                  >
                    {!gameState.isBetting && (
                      <Typography
                        variant="h2"
                        sx={{
                          position: 'absolute',
                          transform: 'translateY(-50%)',
                          color: gameState.outcome === 'WIN' ? '#4cd739' : '#d75339',
                        }}
                      >
                        <Box className="animate-zoomIn font-bold">{gameState.outcome}</Box>
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="h6" color="white" fontWeight="bold">
                      You
                    </Typography>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      {gameState.playerFlowers.map((f, index) => (
                        <Grid item xs={2.4} key={f.checked ? `${index}_f` : `${index}_s`}>
                          <Button
                            fullWidth
                            disabled={typeof f.flower === 'undefined' || !gameState.isBetting}
                            onClick={() => openFlower(index)}
                            sx={{
                              aspectRatio: '1',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontSize: { xs: 'sm', md: 'lg' },
                              color: 'white',
                              borderRadius: 1,
                              bgcolor: '#1d3d4994',
                              border: '1px solid #a39e8c',
                              p: { xs: 1, md: 2 },
                              position: 'relative',
                              cursor: 'pointer',
                            }}
                          >
                            <Box sx={{ width: '80%', height: '80%' }}>
                              <Box className={f.checked ? 'animate-bloomAni scale-0' : 'scale-0'}>
                                {FLOWER_ICONS[f.flower]}
                              </Box>
                              {f.checked && !isMobile && (
                                <Typography>{FLOWER_NAMES[f.flower]}</Typography>
                              )}
                            </Box>
                            <Box
                              sx={{
                                position: 'absolute',
                                width: '65%',
                                height: '65%',
                                transform: 'translate(-50%, -50%)',
                                color: '#ffc588',
                                left: '50%',
                                top: '50%',
                              }}
                            >
                              <Box className={f.checked ? 'animate-downAni' : 'animate-growAni scale-0'}>
                                <Box sx={{ transition: 'all 300ms ease-in-out', '&:hover': { transform: 'scale(1.1)' } }}>
                                  <PlantSeedIcon />
                                </Box>
                              </Box>
                              {!f.checked && !isMobile && (
                                <Typography>SEED</Typography>
                              )}
                            </Box>
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                    <Typography
                      variant="h5"
                      align="center"
                      sx={{ mt: 1, color: playerstatus.color }}
                    >
                      {playerstatus.description}
                    </Typography>
                  </Box>
                </Stack>
                <ResultModal
                  visible={gameState.visibleResult}
                  profit={gameState.profit}
                  odds={gameState.multiplier}
                  onClose={() => setGameState(prev => ({ ...prev, visibleResult: false }))}
                />
              </Paper>
            </Stack>

            <Stack p={3} gap={3} bgcolor="#1D3E6B">
              {isMobile && (
                <Stack alignItems="center">
                  {elementInputBet}
                </Stack>
              )}

              <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    py: 1,
                    px: 2.5,
                    borderRadius: 50,
                    fontSize: 16,
                    bgcolor: '#1D3E6B',
                    border: '2px solid #2B4C79',
                  }}
                  onClick={() => setGameState(prev => ({ ...prev, betAmount: '100.00' }))}
                >
                  100
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    py: 1,
                    px: 2.5,
                    borderRadius: 50,
                    fontSize: 16,
                    bgcolor: '#1D3E6B',
                    border: '2px solid #2B4C79',
                  }}
                  onClick={() => setGameState(prev => ({ ...prev, betAmount: '1000.00' }))}
                >
                  1,000
                </Button>

                {!isMobile && elementInputBet}

                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    py: 1,
                    px: 2.5,
                    borderRadius: 50,
                    fontSize: 16,
                    bgcolor: '#1D3E6B',
                    border: '2px solid #2B4C79',
                  }}
                  onClick={() => setGameState(prev => ({ ...prev, betAmount: '10000.00' }))}
                >
                  10,000
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    py: 1,
                    px: 2.5,
                    borderRadius: 50,
                    fontSize: 16,
                    bgcolor: '#1D3E6B',
                    border: '2px solid #2B4C79',
                  }}
                  onClick={() => setGameState(prev => ({ ...prev, betAmount: '50000.00' }))}
                >
                  50,000
                </Button>
              </Stack>

              {isAuto && (
                <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                  <TextField
                    type="number"
                    variant="filled"
                    label="Number of Bets"
                    value={gameState.autoBetCount === Infinity ? 0 : gameState.autoBetCount}
                    disabled={disabled}
                    onChange={(e) => {
                      setGameState(prev => ({ ...prev, autoBetCount: Number(e.target.value) }));
                    }}
                    sx={{
                      '& .MuiInputBase-input': {
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                      },
                    }}
                  />
                  <TextField
                    type="number"
                    variant="filled"
                    label="Stop on Profit"
                    value={gameState.stopProfitA === Infinity ? 0 : gameState.stopProfitA}
                    disabled={disabled}
                    onChange={(e) => {
                      setGameState(prev => ({ ...prev, stopProfitA: Number(e.target.value) }));
                    }}
                    sx={{
                      '& .MuiInputBase-input': {
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                      },
                    }}
                  />
                  <TextField
                    type="number"
                    variant="filled"
                    label="Stop on Loss"
                    value={gameState.stopLossA === Infinity ? 0 : gameState.stopLossA}
                    disabled={disabled}
                    onChange={(e) => {
                      setGameState(prev => ({ ...prev, stopLossA: Number(e.target.value) }));
                    }}
                    sx={{
                      '& .MuiInputBase-input': {
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                      },
                    }}
                  />
                </Stack>
              )}

              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="center" alignItems="center" gap={1}>
                <Stack direction="row" justifyContent="center" alignItems="center" gap={1} width={1}>
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

                  {!isAuto ? (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        py: 1,
                        px: 3,
                        width: 230,
                        borderRadius: 50,
                        fontSize: 18,
                      }}
                      onClick={() => (gameState.isBetting ? openAllCells() : handleBet())}
                      disabled={!isLoggedIn || gameState.isLoading || gameState.isDealing}
                    >
                      {gameState.isBetting ? 'Open All Cells' : 'Place Bet'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color={gameState.autoBetting ? "error" : "primary"}
                      sx={{
                        py: 1,
                        px: { xs: 2, sm: 3 },
                        width: 230,
                        borderRadius: 50,
                        fontSize: { xs: 12, sm: 18 },
                      }}
                      onClick={() => (gameState.autoBetting ? stopAutoBet() : startAutoBet())}
                      disabled={(!gameState.autoBetting && gameState.isDealing) || gameState.isLoading}
                    >
                      {`${gameState.autoBetting ? "Stop" : "Start"} ${isMobile ? "(A)" : "Auto Bet"}`}
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
                    onClick={() => setGameState(prev => ({ ...prev, betAmount: (parseFloat(prev.betAmount) / 2).toFixed(2) }))}
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
                    onClick={() => setGameState(prev => ({ ...prev, betAmount: (parseFloat(prev.betAmount) * 2).toFixed(2) }))}
                  >
                    2X
                  </IconButton>
                </Stack>

                <StyledToggleButtonGroup
                  size="small"
                  value={gameState.activeTab}
                  exclusive
                  onChange={(e, value) => setGameState(prev => ({ ...prev, activeTab: value }))}
                >
                  {['manual', 'auto'].map((btn, index) => (
                    <ToggleButton
                      key={index}
                      value={btn}
                      sx={{
                        py: 1,
                        px: 2,
                        width: 0.5,
                        fontWeight: 500,
                        borderRadius: `50px !important`,
                        whiteSpace: 'nowrap',
                        textTransform: 'uppercase',
                        color: 'text.primary',
                      }}
                    >
                      {btn}
                    </ToggleButton>
                  ))}
                </StyledToggleButtonGroup>

              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} sm={3.5}>
          <Card
            sx={{
              height: 1,
              borderRadius: 2,
              border: '1px solid #2B4C79',
              maxHeight: 780,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ pt: 0, flexShrink: 0 }}>
              <CombinationView />
            </CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              px={3}
              py={1.5}
              sx={{
                borderRadius: '16px 16px 0 0',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(6px)',
                flexShrink: 0,
              }}
            >
              <Typography variant="h6">Histories</Typography>
            </Stack>
            <CardContent sx={{ padding: 0, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
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
                {gameState.history.map((row: HistoryProps, index: number) => {
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
                          src={
                            row.user?.avatar?.includes('http')
                              ? row.user.avatar
                              : `${baseUrl}/${row.user?.avatar || ''}`
                          }
                          sx={{ width: 20, height: 20 }}
                        />
                        <Typography fontSize={10}>{row.user?.username || 'Unknown'}</Typography>
                      </Stack>
                      <Stack width={0.2}>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default FlowerPoker;
