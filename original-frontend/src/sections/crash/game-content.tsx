import { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputBase,
  Stack,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  toggleButtonGroupClasses,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import gsap from 'gsap';
import _ from 'lodash';
import toast from 'react-hot-toast';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import { useSelector } from 'src/store';
import Iconify from 'src/components/iconify';
import useApi from 'src/hooks/use-api';
import Timer from 'src/components/custom/Timer';
import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';

import placebet from 'src/assets/crash/placebet.wav';
import error from 'src/assets/crash/error.wav';
import success from 'src/assets/crash/success.wav';
import crash from 'src/assets/crash/crash.wav';

import { TabPanelProps } from 'src/types';
import { GameEndType, BetType, PlayerType } from './types';
// ----------------------------------------------------------------------
import { crashSocket } from './socket';
import GameCanvas from './game-canvas';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  borderRadius: 50,
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

const errorAudio = new Audio(error);
const placebetAudio = new Audio(placebet);
const successAudio = new Audio(success);
const crashAudio = new Audio(crash);

const playSound = (audioFile: any) => {
};

gsap.registerPlugin(MotionPathPlugin);

export const GAME_STATES = {
  NotStarted: 1,
  Starting: 2,
  InProgress: 3,
  Over: 4,
  Blocking: 5,
  Refunded: 6,
};

const BET_STATES = {
  Playing: 1,
  CashedOut: 2,
};

interface GameContentProps {
  histories: GameEndType[];
  setHistories: (histories: any) => void;
}

export default function GameContent({ histories, setHistories }: GameContentProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { isLoggedIn, user, balance, realBalance, baseUrl } = useSelector((state) => state.auth);
  const { getCrashSchemaApi, getUserCrashApi } = useApi();

  const [crashed, setCrashed] = useState<boolean>(false);

  const [rockets, setRockets] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);

  const [betTab, setBetTab] = useState<TabPanelProps>('manual');

  const [gameState, setGameState] = useState(1);
  const [gameId, setGameId] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [joining, setJoining] = useState<boolean>(false);
  const [betting, setBetting] = useState<boolean>(false);
  const [plannedBet, setPlannedBet] = useState<boolean>(false);
  const [ownBet, setOwnBet] = useState<any>(null);
  const autoCashoutEnabled = true;
  const [autoBetEnabled, setAutoBetEnabled] = useState<boolean>(false);
  const [cashedOut, setCashedOut] = useState<boolean>(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<any>(null);
  const [payout, setPayout] = useState<number>(1);
  const [betAmount, setBetAmount] = useState('0.00');
  const [target, setTarget] = useState('2');

  const addNewPlayer = (player: any) => {
    setPlayers((state) => [...state, player]);
  };

  const startBet = () => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }

    if (parseFloat(betAmount) <= 0) {
      toast.error('Bet amount must be greater than 0');
      return;
    }

    const betValue = Number(betAmount);
    if (!validateBetAmount(betValue, balance)) {
      return;
    }

    if (gameState === GAME_STATES.Starting) {
      setJoining(true);

      crashSocket.emit(
        'join-game',
        autoCashoutEnabled ? parseFloat(target) * 100 : null,
        parseFloat(betAmount)
      );
    } else {
      if (plannedBet) {
        setPlannedBet(false);
      } else if (!autoBetEnabled) {
        setPlannedBet(true);
      }
    }
  };

  const clickCashout = () => {
    crashSocket.emit('bet-cashout');
  };

  const onBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  const onTargetChange = (e: any) => {
    setTarget(e.target.value);
  };

  const addGameToHistory = (game: GameEndType) => {
    setHistories([game, ...histories]);
  };

  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: TabPanelProps) => {
    setBetTab(newValue);
  };

  useEffect(() => {
    setAutoBetEnabled(betTab === 'auto' ? true : false);
  }, [betTab]);

  useEffect(() => {
    handleBetChange(betAmount, realBalance, setBetAmount);
  }, [betAmount, realBalance]);

  useEffect(() => {
    const joinError = (msg: any) => {
      setJoining(false);
      toast.error(msg);
      playSound(errorAudio);
    };

    const joinSuccess = (bet: any) => {
      setJoining(false);
      setOwnBet(bet);
      setBetting(true);
      toast.success('Successfully joined the game!');
      playSound(placebetAudio);
    };

    const cashoutError = (msg: any) => {
      toast.error(msg);
      playSound(errorAudio);
    };

    const cashoutSuccess = () => {
      toast.success('Successfully cashed out!');
      playSound(successAudio);

      setTimeout(() => {
        setBetting(false);
      }, 1500);
    };

    const gameStarting = (data: any) => {
      setGameId(data._id);
      setStartTime(new Date(Date.now() + new Date(data.timeUntilStart).valueOf()));
      setGameState(GAME_STATES.Starting);

      setPayout(1);
      setPlayers([]);
      setOwnBet(null);

      if (autoBetEnabled || plannedBet) {
        setJoining(true);

        crashSocket.emit(
          'join-game',
          autoCashoutEnabled ? parseFloat(target) * 100 : null,
          parseFloat(betAmount)
        );

        if (plannedBet) setPlannedBet(false);
      }
      setCrashed(false);
      rockets.restart();
      charts.restart();
      setTimeout(() => {
        rockets.pause();
        charts.pause();
      }, 100);
    };

    const gameStart = (data: any) => {
      setStartTime(Date.now());
      setGameState(GAME_STATES.InProgress);
      if (rockets) {
        rockets.restart();
      }
      if (charts) {
        charts.restart();
      }
      setCrashed(false);
    };

    const gameEnd = ({ game }: { game: GameEndType }) => {
      setGameState(GAME_STATES.Over);
      setCrashed(true);
      if (rockets) {
        rockets.pause();
      }
      if (charts) {
        charts.pause();
      }
      playSound(crashAudio);
      setPayout(game.crashPoint);
      addGameToHistory(game);
      setBetting(false);
      setCashedOut(false);
    };

    const gameBets = (bets: any) => {

      _.forEach(bets, (bet: any) => addNewPlayer(bet));
    };

    const betCashout = (bet: BetType) => {
      if (bet.playerID === user._id) {
        setCashedOut(true);
        if (ownBet) setOwnBet(Object.assign(ownBet, bet));

        setTimeout(() => {
          setBetting(false);
        }, 1500);
      }

      setPlayers((state) =>
        state.map((player) =>
          player.playerID === bet.playerID ? Object.assign(player, bet) : player
        )
      );
    };

    const gameTick = (payoutData: any) => {
      if (gameState !== GAME_STATES.InProgress) return;
      setPayout(payoutData);
    };

    crashSocket.on('game-starting', gameStarting);
    crashSocket.on('game-start', gameStart);
    crashSocket.on('game-end', gameEnd);
    crashSocket.on('game-tick', gameTick);
    crashSocket.on('game-bets', gameBets);
    crashSocket.on('bet-cashout', betCashout);
    crashSocket.on('game-join-error', joinError);
    crashSocket.on('game-join-success', joinSuccess);
    crashSocket.on('bet-cashout-error', cashoutError);
    crashSocket.on('bet-cashout-success', cashoutSuccess);

    return () => {
      crashSocket.off('game-starting', gameStarting);
      crashSocket.off('game-start', gameStart);
      crashSocket.off('game-end', gameEnd);
      crashSocket.off('game-tick', gameTick);
      crashSocket.off('game-bets', gameBets);
      crashSocket.off('bet-cashout', betCashout);
      crashSocket.off('game-join-error', joinError);
      crashSocket.off('game-join-success', joinSuccess);
      crashSocket.off('bet-cashout-error', cashoutError);
      crashSocket.off('bet-cashout-success', cashoutSuccess);
    };
  }, [
    gameState,
    startTime,
    plannedBet,
    autoBetEnabled,
    autoCashoutEnabled,
    betAmount,
    target,
    ownBet,
    user,
    rockets,
    charts,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getCrashSchemaApi();
        if (!res?.data) return;
        const schema = res.data;

        const betted = schema.current.players.some((row: PlayerType) => row.playerID === user._id);

        if (betted) setBetting(true);
        setGameId(schema.current._id);
        setPlayers(schema.current.players);
        setGameState(schema.current.status);
        setHistories(schema.history.slice(0, 10));
        setStartTime(new Date(Date.now() - new Date(schema.current.elapsed).valueOf()));

        setLoading(false);
      } catch (error1) {
        console.log('There was an error while loading crash schema:', error1);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserCrashApi();

        if (data.bet && data.bet.status === BET_STATES.Playing) {
          setBetting(true);
          setOwnBet(data.bet);
        }
      } catch (error2) {
        console.log('There was an error while loading crash schema:', error2);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    gsap.set(['.rocket', '.rocket--self'], {
      xPercent: -50,
      yPercent: -50,
      transformOrigin: '50% 50%',
    });

    const rocket = gsap.to('.rocket', {
      motionPath: {
        path: '#path',
        align: '#path',
        autoRotate: true,
      },
      duration: 20,
      ease: 'power1.in',
    });
    const chart = gsap.to('.crash-game-chart-inner', {
      duration: 19.5,
      width: 600,
      ease: 'power1.in',
    });
    setRockets(rocket);
    setCharts(chart);
    const time = setTimeout(() => {
      rocket.pause();
      chart.pause();
    }, 100);
    return () => {
      clearInterval(time);
    };
  }, []);

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
        onClick={() => setBetAmount((state) => (parseFloat(state) - 1).toFixed(2) || '0.00')}
      >
        <Iconify icon="ic:sharp-minus" width={24} height={24} />
      </Button>
      <InputBase
        placeholder="0.00"
        sx={{
          px: 2,
          bgcolor: '#0C1F3A',
          border: '2px solid #2B4C79',
          borderWidth: '2px 0 2px 0',
        }}
        value={betAmount}
        onChange={onBetChange}
        type="number"
        error={parseFloat(betAmount) <= 0 || true}
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
        onClick={() => setBetAmount((state) => (parseFloat(state) + 1).toFixed(2) || '0.00')}
      >
        <Iconify icon="ic:sharp-plus" width={24} height={24} />
      </Button>
    </Stack>
  );

  return (
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
            height: 1,
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
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Stack>
              <Typography variant="h6">Crash Game</Typography>
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

          <GameCanvas status={gameState} payout={payout} startTime={startTime} />

          <Stack p={3} gap={3}>
            {isMobile && <Stack alignItems="center"> {elementInputBet}</Stack>}

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
                onClick={() => setBetAmount('100.00')}
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
                onClick={() => setBetAmount('1000.00')}
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
                onClick={() => setBetAmount('10000.00')}
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
                onClick={() => setBetAmount('50000.00')}
              >
                50,000
              </Button>
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

              {!betting ? (
                <Button
                  variant="contained"
                  color={plannedBet ? 'error' : 'primary'}
                  sx={{
                    py: 1,
                    px: 3,
                    width: 230,
                    borderRadius: 50,
                    fontSize: 18,
                  }}
                  disabled={joining || autoBetEnabled}
                  onClick={startBet}
                >
                  {(joining && 'BETTING...') || plannedBet ? 'CANCEL BET' : 'Play Now'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="warning"
                  sx={{
                    py: 1,
                    px: 3,
                    width: 230,
                    borderRadius: 50,
                    fontSize: 18,
                  }}
                  disabled={gameState !== GAME_STATES.InProgress || cashedOut}
                  onClick={clickCashout}
                >
                  {cashedOut ? 'CASHED OUT' : 'CASHOUT'}
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
                onClick={() =>
                  setBetAmount((state) => (parseFloat(state) / 2).toFixed(2) || '0.00')
                }
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
                onClick={() =>
                  setBetAmount((state) => (parseFloat(state) * 2).toFixed(2) || '0.00')
                }
              >
                2X
              </IconButton>
            </Stack>

            <Stack direction="row" gap={0.4} alignItems="flex-end" justifyContent="space-between">
              <Stack width={0.6}>
                <Typography sx={{ fontSize: 11 }}>Cashout At</Typography>
                <Stack direction="row" width={1}>
                  <InputBase
                    value={target}
                    onChange={onTargetChange}
                    placeholder="0.00"
                    type="number"
                    error={parseFloat(target) <= 1 || true}
                    inputProps={{ step: 0.01, min: 0 }}
                    sx={{
                      width: 1,
                      px: 1.25,
                      py: 0.1,
                      borderRadius: 50,
                      height: 40,
                      bgcolor: '#0f212e',
                      border: '2px solid #2f4553',
                    }}
                  />

                  <Stack sx={{ flexDirection: 'row', gap: 0.1 }}>
                    <IconButton
                      color="inherit"
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        bgcolor: '#1D3E6B',
                        border: '2px solid #2B4C79',
                      }}
                      onClick={() => {
                        if (parseFloat(target) > 1)
                          setTarget((state) => (parseFloat(state) / 2).toFixed(2) || '0');
                      }}
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
                      onClick={() =>
                        setTarget((state) => (parseFloat(state) * 2).toFixed(2) || '0')
                      }
                    >
                      2X
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
              <StyledToggleButtonGroup
                size="small"
                value={betTab}
                exclusive
                onChange={handleChange}
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
        </Box>
      </Grid>

      <Grid item xs={12} md={4} sm={3.5}>
        <Card
          sx={{
            height: 1,
            borderRadius: 2,
            border: '1px solid #2B4C79',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            px={3}
            py={1.5}
            sx={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Typography variant="h6">Active Players</Typography>
            <Typography
              className="crash-game-status"
              style={{
                fontSize: 16,
                position: 'relative',
              }}
            >
              {players.length}
              <span className="good" />
            </Typography>
          </Stack>
          <CardContent sx={{ padding: 0 }}>
            <Stack px={2}>
              <Stack
                direction="row"
                alignItems="center"
                width={1}
                borderTop="1px solid #2B4C79"
                py={1}
              >
                <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.25}>
                  Player
                </Typography>
                <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.25}>
                  Multiplier
                </Typography>
                <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.25}>
                  Payout
                </Typography>
                <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.25}>
                  Amount
                </Typography>
              </Stack>
              {players.map((row: PlayerType, index: number) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  width={1}
                  borderTop="1px solid #2B4C79"
                  py={1}
                >
                  <Stack direction="row" alignItems="center" gap={1} width={0.25}>
                    <Avatar
                      alt={row.first_name}
                      src={row.avatar.includes('http') ? row.avatar : `${baseUrl}/${row.avatar}`}
                      sx={{ width: 20, height: 20 }}
                    />
                    <Typography fontSize={10}>
                      {row.first_name} {row.last_name}
                    </Typography>
                  </Stack>
                  <Stack width={0.25}>
                    <Typography fontSize={10}>
                      {row.autoCashOut ? `${(row.autoCashOut / 100).toFixed(2)}x` : ''}
                    </Typography>
                  </Stack>
                  <Stack width={0.25}>
                    <Typography
                      fontSize={10}
                      color={
                        (row?.stoppedAt || 0) >= (row?.autoCashOut || 0)
                          ? 'success.main'
                          : 'error.main'
                      }
                    >
                      {row.stoppedAt ? `${(row.stoppedAt / 100).toFixed(2)}x` : ''}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1} width={0.25}>
                    <Typography fontSize={10}>{row.betAmount}</Typography>
                    <Avatar
                      alt={row.currency}
                      src={row.currencyIcon}
                      sx={{ width: 20, height: 16, borderRadius: 0.5 }}
                    />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
