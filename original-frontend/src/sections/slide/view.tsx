import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Typography,
  CardContent,
  Card,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  Chip,
  Button,
  InputBase,
  toggleButtonGroupClasses,
  ToggleButtonGroup,
  styled,
  ToggleButton,
  Avatar,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Timer from 'src/components/custom/Timer';
import { useSelector } from 'src/store';
import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';

import { TabPanelProps } from 'src/types';

import betaudio from 'src/assets/audio/bet.mp3';
import sliding from 'src/assets/audio/sliding.mp3';

import Slider, { findTile } from './Slider';
import StatusBar from './StatusBar';

import { authenticateSockets, slideSocket } from './socket';

interface IHistory {
  _id: string;
  resultpoint: number;
}

interface IBetPlayer {
  playerID: string;
  betAmount: number;
  avatar: string;
  username: string;
  first_name: string;
  last_name: string;
  currency: string;
  currencyIcon: string;
  target: number;
}

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

const betAudio = new Audio();
const slidingAudio = new Audio();

betAudio.src = betaudio;
slidingAudio.src = sliding;

enum STATUS {
  WAITTING,
  STARTING,
  BETTING,
  PLAYING,
}

const playAudio = (key: string) => {
  try {
    if (key === 'bet') {
      if (betAudio) {
        // Play audio muted initially
        betAudio.muted = true;
        betAudio
          .play()
          .then(() => {
            // Unmute after a small delay
            setTimeout(() => {
              betAudio.muted = false;
            }, 1000); // Adjust delay as needed
          })
          .catch((error: any) => {
            console.error('Failed to autoplay audio:', error);
          });
      }
    } else if (key === 'sliding') {
      if (slidingAudio) {
        // Play audio muted initially
        slidingAudio.muted = true;
        slidingAudio
          .play()
          .then(() => {
            // Unmute after a small delay
            setTimeout(() => {
              slidingAudio.muted = false;
            }, 1000); // Adjust delay as needed
          })
          .catch((error: any) => {
            console.error('Failed to autoplay audio:', error);
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const SlideView = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isLoggedIn, balance, realBalance, token, baseUrl } = useSelector((store) => store.auth);

  const [betAmount, setBetAmount] = useState<string>('0.00');
  const [target, setTarget] = useState<string>('2');
  const betCount = useRef<number>(0);
  const [autobet, setAutobet] = useState<boolean>(false);
  const [betPlayers, setBetPlayers] = useState<IBetPlayer[]>([]);

  const [betTab, setBetTab] = useState<TabPanelProps>('manual');

  const [history, setHistory] = useState<IHistory[]>([]);

  const [result, setResult] = useState({
    numbers: [
      1.903584107931594, 7.289733272636531, 1.3637520028046712, 2.1687325855871227,
      2.4933819106663493, 1.498308102164589, 1.4985860487052827, 21.750156733109126,
      1.0372314374834941, 4.866700181583145, 1.3724955280886675, 6.029560018920336,
      1.0303612131867523, 1.790765019475776, 1.0509659303212602, 1.3427846331361688,
      1.043602614826846, 1, 1.7554225649186417, 1.9452640717656329, 1.9146219934302606,
      4.869526482116821, 1.6029811093702553, 1.2435240630267617, 17.437289699821303,
      1.276313397368619, 1.618755824614112, 9.886094186702175, 1.5709471875430103,
      1.0521788401854846, 1.3911934025482007, 1.3252738435995668, 1.906647723872426,
      1.090347584906667, 1.2848101589784566, 1.007087172210973, 11.548618542693777,
      1.3578319475086218, 4.639070394589904, 1.8465654390716766, 2.653733488076682,
      4.923510038032103, 4.921580919662703, 1.3178708730473734, 1.7319504108869979,
      1.511790731631906, 1.415210820644928, 5.80904104812333, 1.1317336828287066, 1.322065143934753,
      7.242526244532375, 2.5955453056761604, 1.168085793132742, 3.2424142021519637,
      6.723184381982699, 10.76300946407673, 1.3864677993193353, 1.550989717093865,
      1.0660077023468517, 3.363056173638654, 2.679747580002418, 4.034726347339524,
      5.715358587221796, 21.046970995887037, 2.593111595629966, 1.3907866095722856,
      8.08699725169305, 2.3378138615475215, 1.8070323153254058, 1.9535634982554118,
      7.573343939658181, 1.253450763655036, 8.003569610632168, 2.5789112031547177,
      2.7480245233718996, 2.2153270662421325, 1.7588492912318467, 1.310647410959055,
      2.629692012488445, 1.7299793236036611, 2.671240918732696, 18.872152846456686,
      1.0117321367489212, 5.7415093107764905, 5.9960418900001295, 1.8347721783099589,
      1.027356841602837, 75.45281444815788, 1.646594016671491, 1.337322225052752,
    ],
    multiplier: 1,
  });

  const savedBet = useRef<any | undefined>();
  const elapsedTime = 5;
  const inputDisable = useRef<boolean>(false);

  const [privateHash, setPriviateHash] = useState<string>('');
  const [publichSeed, setPublicSeed] = useState<string>('');

  const [status, setStatus] = useState(STATUS.WAITTING);
  const [betting, setBetting] = useState(false);
  const [planedbet, setPlanedBet] = useState<boolean>(false);
  const [betcount, setBetCount] = useState(0);

  const [stopProfitA, setStopPorfitA] = useState<number>(0);
  const [stopLossA, setStopLossA] = useState<number>(0);
  const [amountInputFlag, setAmountInputFlag] = useState(true);

  const stopOnProfit = useRef(0);
  const stopOnLoss = useRef(0);

  const handleChangeTab = (event: React.MouseEvent<HTMLElement>, newValue: TabPanelProps) => {
    setBetTab(newValue);
  };

  const onBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  useEffect(() => {
    handleBetChange(betAmount, realBalance, setBetAmount);
  }, [betAmount, realBalance]);

  const onPlay = async () => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }

    const amount = Number(betAmount);

    if (!validateBetAmount(amount, balance)) {
      return;
    }

    if (Number(target) < 1.4) {
      setAmountInputFlag(false);
      toast.error('Min Target 1.4');
      return;
    }

    if (Number(betAmount) > balance) {
      setAmountInputFlag(false);
      toast.error('Your Balance is not enough!');
      return;
    }

    /* eslint-disable */

    if (status !== STATUS.BETTING) {
      savedBet.current = {
        target,
        betAmount,
        currencyId: '',
        infinity: autobet && betcount > 0,
      };

      if (autobet && betcount > 0) {
        betCount.current = betcount;
        betCount.current--;
        setBetCount(betCount.current);
      } else {
        betCount.current = 0;
      }

      console.log(target, savedBet.current);
      setPlanedBet(true);
    } else {
      slideSocket?.emit('join-game', target, betAmount, '');
      setBetting(true);
      inputDisable.current = true;
      console.log('join-game');
      if (autobet) {
        betCount.current = betcount;
        savedBet.current = {
          target,
          betAmount,
          currencyId: '',
          infinity: betcount > 0,
        };
        setPlanedBet(true);
      }
    }
    /* eslint-enable */
  };

  const startBetting = () => {
    /* eslint-disable */
    if (autobet) {
      if (planedbet) {
        if (stopProfitA !== 0 && stopOnProfit.current <= 0) {
          setPlanedBet(false);
          return;
        }
        // check stop on loss amount
        if (
          stopLossA !== 0 &&
          stopOnLoss.current <= 0 &&
          Math.abs(stopOnLoss.current) > Math.abs(stopOnProfit.current)
        ) {
          setPlanedBet(false);
        }

        if (savedBet.current.infinity && betCount.current > 0) {
          betCount.current--;
          setBetCount(betCount.current);
          slideSocket?.emit(
            'join-game',
            savedBet.current.target,
            savedBet.current.betAmount,
            savedBet.current.currencyId
          );
          setBetting(true);
          inputDisable.current = true;
        } else if (!savedBet.current.infinity) {
          slideSocket?.emit(
            'join-game',
            savedBet.current.target,
            savedBet.current.betAmount,
            savedBet.current.currencyId
          );
          setBetting(true);
          inputDisable.current = true;
        } else {
          savedBet.current = undefined;
          setPlanedBet(false);
        }
      }
    } else {
      if (planedbet) {
        slideSocket?.emit(
          'join-game',
          savedBet.current.target,
          savedBet.current.betAmount,
          savedBet.current.currencyId
        );
        inputDisable.current = true;
        setBetting(true);
        savedBet.current = undefined;
        setPlanedBet(false);
      }
    }
    /* eslint-enable */
  };

  const joinSuccess = (data: any) => {
    console.log('join betting');

    setBetting(false);
    playAudio('bet');

    if (planedbet && stopLossA !== 0) {
      stopOnLoss.current -= savedBet.current.betAmount;
    }
  };

  const joinFailed = (data: any) => {
    setBetting(false);
  };

  const handleStatus = (data: any) => {
    if (data.status === STATUS.STARTING) {
      setBetPlayers([]);
      setPublicSeed(data.publicSeed);
      setPriviateHash(data.privateHash);
      setStatus(STATUS.STARTING);
      inputDisable.current = false;
      if (data._id) {
        addGameToHistory({ _id: data._id, resultpoint: data.crashPoint });
      }
    } else if (data.status === STATUS.BETTING) {
      setStatus(STATUS.BETTING);
      startBetting();
    } else if (data.status === STATUS.PLAYING) {
      setStatus(STATUS.PLAYING);
      playAudio('sliding');
      inputDisable.current = false;
      if (planedbet && savedBet.current.target <= data.crashPoint && stopProfitA !== 0) {
        stopOnProfit.current -= savedBet.current.betAmount;
      }

      setTimeout(() => {
        setBetPlayers(data.players);
      }, 3000);
      setResult({ numbers: data.numbers, multiplier: data.crashPoint });
    }
  };

  const addGameToHistory = (game: any) => {
    setHistory((state) =>
      state.length >= 6 ? [...state.slice(1, state.length), game] : [...state, game]
    );
  };

  const getButtonContent = () => {
    if (betting) return 'Betting...';

    if (status === STATUS.PLAYING) {
      if (planedbet) {
        if (autobet) return 'Stop Autobet';
        return 'Cancel Bet';
      }
      if (autobet) return 'Start Autobet';
      return 'Bet (Next Round)';
    }

    if (status === STATUS.BETTING) {
      if (autobet) {
        if (inputDisable.current) return 'Waiting...';
        if (planedbet) return 'Stop Autobet';
        return 'Start Autobet';
      }
      if (planedbet) return 'Cancel Bet';
      if (inputDisable.current) return 'Waiting..';
      return 'Bet';
    }

    return 'Starting...';
  };

  const joinBet = (_betPlayers: any[]) => {
    setBetPlayers([...betPlayers, ..._betPlayers]);
  };

  useEffect(() => {
    slideSocket.on('connect', () => {
      console.log('Slide Socket Server connected');
    });

    slideSocket.on('disconnect', () => {
      console.log('Slide Socket Server disconnected');
    });

    slideSocket.on('game-join-error', joinFailed);

    slideSocket.on('game-join-sucess', joinSuccess);

    slideSocket.on('slide-track', handleStatus);

    slideSocket.on('bet', joinBet);

    slideSocket.on('history', (data) => {
      setHistory(data.reverse().slice(0, 6));
    });

    if (history.length === 0) {
      slideSocket.emit('games');
    }

    return () => {
      slideSocket.off('connection');
      slideSocket.off('disconnect');
      slideSocket.off('game-join-error');

      slideSocket.off('game-join-sucess');

      slideSocket.off('slide-track');
      slideSocket.off('history');
      slideSocket.off('bet');
    };
  }, [target, betAmount, status, history, planedbet, autobet]);

  useEffect(() => {
    setTimeout(() => {
      if (!slideSocket.connected) {
        slideSocket.connect();
      }
    }, 1000);
    return () => {
      slideSocket.disconnect();
      console.log('Slide Socket disconnected');
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) authenticateSockets(token);
  }, [isLoggedIn, token]);

  const disable = inputDisable.current || planedbet;

  useEffect(() => {
    setAutobet(betTab === 'auto');
  }, [betTab]);

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
        disabled={disable}
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
        disabled={disable}
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
        disabled={disable}
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
          Slide Game
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
                <Typography variant="h6">Slide Game</Typography>
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
              <div className="w-full bg-[#10100f] h-full flex justify-center ">
                <div className={`max-w-[1300px] ${isMobile ? 'w-full' : ''} `}>
                  <div className="grid grid-cols-1 sm:grid-cols-4 rounded-md overflow-hidden  bg-panel border-[1px] border-[#020202bb]  shadow-md">
                    <div className="col-span-4  gap-2 min-h-[350px] relative h-full overflow-hidden">
                      <div className="flex absolute right-1/2 translate-x-1/2 top-5 z-20 w-[300px] space-x-1">
                        {history.slice(history.length - 10, history.length).map((h: any, index) => (
                          <Button
                            onClick={() => {}}
                            className="p-[3px] w-10  text-sm font-medium text-white"
                            key={index}
                            style={{
                              background: findTile(h.resultpoint).color,
                              color: findTile(h.resultpoint).text,
                            }}
                          >
                            {h.resultpoint}x
                          </Button>
                        ))}
                      </div>
                      <div className="w-full h-full flex items-center">
                        <Slider
                          multiplier={result.multiplier}
                          elapsedTime={elapsedTime}
                          numbers={result.numbers}
                        />
                      </div>
                      <div className="absolute bottom-10 left-5 z-20">
                        <div className="flex space-x-1 w-20 items-center">
                          <div className="w-3 h-3 rounded-full bg-bet_button" />
                          <div className="text-white text-sm">Bets: {betPlayers.length}</div>
                        </div>
                      </div>
                      <div className="w-full absolute bottom-0 z-20">
                        <StatusBar status={status} />
                      </div>
                      <div
                        className="absolute z-10 top-0 left-0 w-full h-full"
                        style={{ background: 'linear-gradient(90deg,#071824,transparent,#071824)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Stack>

            <Stack p={3} gap={3} bgcolor="#1D3E6B">
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
                  disabled={disable}
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
                  disabled={disable}
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
                  disabled={disable}
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
                  disabled={disable}
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

                {isLoggedIn ? (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      py: 1,
                      px: 3,
                      width: 230,
                      borderRadius: 50,
                      fontSize: { xs: 12, sm: 16 },
                    }}
                    disabled={disable}
                    onClick={() => {
                      if (betting || inputDisable.current) return;
                      if (status === STATUS.PLAYING) {
                        if (planedbet) {
                          savedBet.current = undefined;
                          setPlanedBet(false);
                        } else {
                          onPlay();
                        }
                      } else if (status === STATUS.BETTING) {
                        onPlay();
                      }
                    }}
                  >
                    {getButtonContent()}
                  </Button>
                ) : (
                  <Button
                    disabled={disable}
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
                  disabled={disable}
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
                  disabled={disable}
                >
                  2X
                </IconButton>
              </Stack>

              <Stack direction="row" gap={0.4} alignItems="flex-end" justifyContent="center">
                <Stack>
                  <Typography sx={{ fontSize: 11 }}>Target</Typography>
                  <Stack direction="row" width={1}>
                    <InputBase
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="0.00"
                      type="number"
                      error={parseFloat(target) <= 1.4 || true}
                      inputProps={{ step: 0.01, min: 1.4 }}
                      sx={{
                        width: 1,
                        maxWidth: 300,
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
                  onChange={handleChangeTab}
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
              <Typography variant="h6">Active Game Round</Typography>
              <Typography
                className="crash-game-status"
                style={{
                  fontSize: 16,
                  position: 'relative',
                }}
              >
                {betPlayers.length}
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
                  <Typography
                    fontSize={{ xs: 10, sm: 11 }}
                    color="#A9C1DC"
                    width={0.25}
                    textAlign="center"
                  >
                    Target
                  </Typography>
                  <Typography
                    fontSize={{ xs: 10, sm: 11 }}
                    color="#A9C1DC"
                    width={0.25}
                    textAlign="center"
                  >
                    Payout
                  </Typography>
                  <Typography
                    fontSize={{ xs: 10, sm: 11 }}
                    color="#A9C1DC"
                    width={0.25}
                    textAlign="right"
                  >
                    Amount
                  </Typography>
                </Stack>
                {betPlayers.map((row, index: number) => (
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
                      <Typography fontSize={10} textAlign="center">
                        {row.target.toFixed(2)}x
                      </Typography>
                    </Stack>
                    <Stack width={0.25}>
                      <Typography
                        fontSize={10}
                        textAlign="center"
                        color={result.multiplier > row.target ? 'success.main' : 'error.main'}
                      >
                        {(status === STATUS.PLAYING && 0) ||
                          (result.multiplier > row.target ? row.target * row.betAmount : 0)}
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
    </Stack>
  );
};

export default SlideView;
