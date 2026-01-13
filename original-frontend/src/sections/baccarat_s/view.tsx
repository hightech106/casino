import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Button,
  CardContent,
  Card,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
  Box,
  Chip,
  IconButton,
  ToggleButtonGroup,
  styled,
  toggleButtonGroupClasses,
  ToggleButton,
  Avatar,
  TextField,
  Container
} from '@mui/material';
import toast from 'react-hot-toast';

import { useSelector } from 'src/store';
import useApi from 'src/hooks/use-api';
import Iconify from 'src/components/iconify';


import ChipButtonGroup from 'src/components/custom/ChipButtonGroup';
import Timer from 'src/components/custom/Timer';

import chipBoard from 'src/assets/images/games/chipboard.svg';

import { HistoryProps, TabPanelProps } from 'src/types';

import { CHIP_VALUES, enableSound, playAudio, RATIO, setAudioVolume } from './config';
import { EmptyCard, GameCard } from './cards';
import ResultModal from './modal';
import { ICard, IChip, IPlace } from './type';


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

const calculateScore = (hand: ICard[]): number => {
  const score = hand.reduce((total, card) => {
    if (card.rank === 'A') return total + 1;
    if (['J', 'Q', 'K', '10'].includes(card.rank)) return total;
    return total + parseInt(card.rank, 10);
  }, 0);

  return score % 10;
};

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
    maxHeight: 835,
    display: 'flex',
    flexDirection: 'column',
  }
};


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
      <Typography variant="h6">Baccarat Game</Typography>
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

interface HistoryListProps {
  history: HistoryProps[];
  baseUrl: string;
}

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
  </>
);


const BaccaratSingle = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { createBaccaratSingleApi, betBaccaratSingleApi, getBaccaratHistoryApi } = useApi();

  const { isLoggedIn, baseUrl } = useSelector((store) => store.auth);

  const { soundVolume, showGameAnimation, gameHotKeyEnabled } = useSelector(
    (state) => state.setting
  );

  const [betTab, setBetTab] = useState<TabPanelProps>('manual');


  const [chipValue, selectChip] = useState(0);
  const [bets, setBets] = useState<{ place: IPlace; amount: number }[]>([]);
  const [totalBet, setTotalAmount] = useState(0);

  const [playerHand, setPlayerHand] = useState<ICard[]>([]);
  const [bankerHand, setBankerHand] = useState<ICard[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [clientSeed, setClientSeed] = useState<string>('');
  const [serverSeed, setServerSeed] = useState<string>('');
  const [serverSeedHash, setServerSeedHash] = useState<string>('');
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [resultData, setResultData] = useState<any>();
  const [showResult, setShowResult] = useState<boolean>(false);

  const [stopProfitA, setStopProfitA] = useState<number>(0);
  const [stopLossA, setStopLossA] = useState<number>(0);
  const [sumProfit, setSumProfit] = useState(0);
  const [sumLost, setSumLost] = useState(0);
  const [stoppedAutobet, setStoppedAutobet] = useState(false);
  const [autoBetting, setAutoBetting] = useState(false);
  const [autoBetCount, setAutoBetCount] = useState<number>(0);

  const [history, setHistory] = useState<HistoryProps[]>([]);


  const disabled = loading || gameStart || autoBetting;

  const gameEnd = !gameStart && resultData;

  const playerScore = calculateScore(playerHand);
  const bankerScore = calculateScore(bankerHand);
  const containRef = useRef<any>(null);

  const isAuto = betTab === 'auto';

  const handleChangeTab = (event: React.MouseEvent<HTMLElement>, newValue: TabPanelProps) => {
    setBetTab(newValue);
  };

  const startBet = async () => {
    setLoading(true);
    setServerSeed('');
    const res = await createBaccaratSingleApi(clientSeed);
    if (!res?.data) return;
    const { data } = res;
    if (data.status) {
      setClientSeed(data.clientSeed);
      setServerSeedHash(data.serverHash);

      if (autoBetting) {
        if (stoppedAutobet) {
          setStoppedAutobet(false);
          setAutoBetting(false);
        } else {
          setTimeout(() => {
            startAutoBet();
          }, 3000);
        }
      }
    }
    setLoading(false);
  };

  const placeBet = async () => {
    if (loading) return;
    if (gameStart) return;
    if (stoppedAutobet) return;
    setLoading(true);
    if (bets.length === 0) {
      toast.error('Please place a bet');
    } else {
      setGameStart(true);
      if (bankerHand.length || playerHand.length) {
        setPlayerHand([]);
        setBankerHand([]);
        playAudio('end');
      }
      setResultData(null);
      setShowResult(false);
      playAudio('bet');
      const b: any = {};

      /* eslint-disable */
      for (const bet of bets) {
        if (!b[bet.place]) {
          b[bet.place] = 0;
        }
        b[bet.place] += bet.amount / RATIO;
      }
      /* eslint-enable */

      const res = await betBaccaratSingleApi({
        currency: '',
        bets: b,
      });
      if (!res?.data) return;

      if (res.data.status) {
        setTimeout(() => {
          setResultData(res.data);
        }, 1000);
      }

      if (res.data?.history) {
        setHistory([res.data.history, ...history]);
      }
    }
    setLoading(false);
  };

  const startAutoBet = async () => {
    if (gameStart || loading || stoppedAutobet) return;
    if (!bets.length) {
      toast.error('Please place a bet');
      return;
    }
    if (!autoBetting) {
      setAutoBetting(true);
      setSumProfit(0);
      setSumLost(0);
      if (!autoBetCount) setAutoBetCount(Infinity);
      if (!stopProfitA) setStopProfitA(Infinity);
      if (!stopLossA) setStopLossA(Infinity);
    } else {
      if (autoBetCount !== Infinity && autoBetCount - 1 === 0) {
        setAutoBetCount(0);
        setAutoBetting(false);
        return;
      }

      setAutoBetCount((prev) => prev - 1);

      if (stopProfitA !== Infinity && sumProfit >= stopProfitA) {
        setAutoBetting(false);
        return;
      }
      if (stopLossA !== Infinity && sumLost >= stopLossA) {
        setAutoBetting(false);
        return;
      }
    }
    placeBet();
  };

  const stopAutobet = async () => {
    if (!autoBetting || stoppedAutobet) return;
    setStoppedAutobet(true);
  };

  const renderChips = (placeId: IPlace) => {
    let value = 0;

    /* eslint-disable */
    for (const bet of bets.filter((b) => b.place === placeId)) {
      value += bet.amount;
    }
    /* eslint-enable */

    if (value === 0) {
      return <></>;
    }

    const chips = [];

    /* eslint-disable */
    for (let i = CHIP_VALUES.length - 1; i >= 0; i--) {
      if (value >= CHIP_VALUES[i]) {
        const chipCount = Math.floor(value / CHIP_VALUES[i]);
        chips.push({ chipIndex: i, count: chipCount });
        break;
      }
    }
    /* eslint-enable */

    const getChipColor = (val: number): string => {
      if (val < 100) return '#5176a7';
      if (val < 1000) return '#2679e7';
      if (val < 10000) return '#8a5bed';
      if (val < 100000) return '#51e4ed';
      if (val < 1000000) return '#ed5151 ';
      if (val < 10000000) return '#CD7F32';
      return '#e7c651';
    };

    const formatChipValue = (val: number): string => {
      if (val >= 1e9) return `${Number((val / 1e9).toFixed(4))}B`;

      if (val >= 1e6) return `${Number((val / 1e6).toFixed(4))}M`;

      if (val >= 1e3) return `${Number((val / 1e3).toFixed(3))}K`;

      return Number(value.toFixed(2)).toString();
    };

    return (
      <div className="flex flex-col relative z-10">
        {chips.map((c, index1) => {
          const color = getChipColor(CHIP_VALUES[c.chipIndex]);
          return Array.from({ length: c.count }).map((_, index2) => (
            <div
              key={`${c.chipIndex}-${index2}-${index1}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${-1 * index2 * (index1 + 1)}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `url(${chipBoard})`,
                aspectRatio: '1',
                width: isMobile ? '30px' : '40px',
                minWidth: isMobile ? '30px' : '40px',
                fontSize: isMobile ? '10px' : '12px',
                backgroundColor: color,
                borderRadius: '50%',
                color: '#ffff',
                fontWeight: 'bold',
                userSelect: 'none',
                boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
                outline: '2px solid rgba(0, 0, 0, 0.3)',
              }}
            >
              {index1 === chips.length - 1 && index2 === c.count - 1 ? formatChipValue(value) : 0}
            </div>
          ));
        })}
      </div>
    );
  };

  const renderValue = (placeId: IPlace) => {
    let value: number = 0;

    /* eslint-disable */
    for (const bet of bets) {
      if (bet.place === placeId) {
        value += bet.amount;
      }
    }
    /* eslint-enable */

    return value / RATIO;
  };

  const cancelBet = () => {
    if (disabled) return;
    const bet = bets.pop();
    setBets([...bets]);
  };

  const clearBet = () => {
    if (disabled) return;
    setBets([]);
  };

  const handlePlaceBet = (id: IPlace) => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }
    if (disabled) return;
    setBets([...bets, { place: id, amount: CHIP_VALUES[chipValue] }]);
    playAudio('bet');
  };

  const getCardPosition = (left: number, top: number, side: string) => {
    const container = containRef.current;
    if (!container) return { x: 0, y: 0 };
    let x = container.clientWidth / 4 + left;
    const y = container.clientHeight / 2 + top;
    x *= side === 'left' ? -1 : 1;
    x = side === 'center' ? 0 : x;
    return { x, y };
  };

  useEffect(() => {
    const total = bets.reduce((prev, curr) => ({ place: '', amount: prev.amount + curr.amount }), {
      place: '',
      amount: 0,
    });
    setTotalAmount(total.amount / RATIO);
  }, [bets]);

  /* eslint-disable */

  useEffect(() => {
    if (resultData && gameStart) {
      setServerSeedHash(resultData.serverHash);
      setClientSeed(resultData.clientSeed);
      setServerSeed(resultData.serverSeed);
      const { bankerHand, playerHand } = resultData;

      let acount = 0;
      let count = 0;
      const dely = 700;

      for (let i = 0; i < 3; i++) {
        if (playerHand[i]) {
          setTimeout(() => {
            acount++;
            setPlayerHand((prev) => [...prev, playerHand[i]]);
            if (count === acount) {
              if (resultData?.status === 'WIN') {
                playAudio('win');
                setSumProfit((prev) => prev + resultData.profit);
              } else {
                setSumLost((prev) => prev + resultData.profit);
              }
              setGameStart(false);
            }
          }, dely * count);
          count++;
        }
        if (bankerHand[i]) {
          setTimeout(() => {
            acount++;
            setBankerHand((prev) => [...prev, bankerHand[i]]);
            if (count === acount) {
              if (resultData?.status === 'WIN') {
                playAudio('win');
                setSumProfit((prev) => prev + resultData.profit);
              } else {
                setSumLost((prev) => prev + Math.abs(resultData.profit));
              }
              setGameStart(false);
            }
          }, dely * count);
          count++;
        }
      }
    } else if (!gameStart && resultData) {
      setShowResult(true);
      startBet();
    }
  }, [resultData, gameStart]);
  /* eslint-enable */

  useEffect(() => {
    startBet();
  }, []);

  useEffect(() => {
    enableSound();
    startBet();
  }, []);

  useEffect(() => {
    setAudioVolume(soundVolume / 10);
  }, [soundVolume]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (!gameHotKeyEnabled) return;
      switch (event.keyCode) {
        case 32:
          if (isAuto)
            if (autoBetting) stopAutobet();
            else startAutoBet();
          else placeBet();
          break;
        case 81:
          cancelBet();
          event.preventDefault();
          break;
        case 87:
          clearBet();
          event.preventDefault();
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [betTab, bets, gameStart, autoBetting, gameHotKeyEnabled]);


  const getHistory = async () => {
    const res = await getBaccaratHistoryApi();
    if (!res?.data) return;
    setHistory(res.data);
  };

  useEffect(() => {
    getHistory();
  }, []);

  const getBetTypeCondition = (betType: string) => {
    switch (betType) {
      case 'Player':
        return playerScore > bankerScore;
      case 'Tie':
        return playerScore === bankerScore;
      case 'Banker':
        return playerScore < bankerScore;
      default:
        return false;
    }
  };

  const getBetTypeMultiplier = (betType: string) => {
    switch (betType) {
      case 'Player':
        return '2';
      case 'Tie':
        return '9';
      case 'Banker':
        return '1.95';
      default:
        return '0';
    }
  };

  return (
    <Stack className="game-container" sx={styles.gameContainer}>
      <Stack sx={styles.header}>
        <Link to="/" style={{ textDecoration: 'none', color: '#8199B4', fontSize: 14 }}>
          Home
        </Link>
        <Iconify icon="lsicon:right-filled" sx={{ color: '#8199B4', fontSize: 16 }} />
        <Typography fontSize={14} fontWeight={500} noWrap>
          Baccarat Game
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8} sm={8.5}>
          <Box sx={styles.gameBox}>
            <GameHeader />

            <Stack
              sx={{
                width: 1,
                height: 0.6,
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Container
                maxWidth={false}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'center', md: 'flex-start' },
                  maxWidth: { xs: 400, md: 1300 },
                  width: '100%',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    px: { xs: 0, md: 5 },
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      py: 2,
                    }}
                  >
                    BACCARAT
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      px: 5,
                      width: '100%',
                      minHeight: { xs: 254, md: 300 },
                      position: 'relative',
                    }}
                    ref={containRef}
                  >
                    <Box sx={{ display: 'flex', mt: -0.5, justifyContent: 'center' }}>
                      <Typography
                        sx={{
                          bgcolor: gameEnd && playerScore < bankerScore ? 'error.main' : 'success.main',
                          textAlign: 'center',
                          width: { xs: 40, md: 56 },
                          height: 20,
                          fontSize: { xs: '0.75rem', md: '1rem' },
                          borderRadius: 6,
                          fontWeight: 'bold',
                          color: 'white',
                          animation: 'zoomIn 0.3s ease-in-out',
                        }}
                      >
                        {playerScore}
                      </Typography>
                    </Box>

                    <Box>
                      <Box>
                        <EmptyCard pos={getCardPosition(0, 20, 'center')} />
                        <EmptyCard pos={getCardPosition(0, 18, 'center')} />
                        <EmptyCard pos={getCardPosition(0, 16, 'center')} />
                        <EmptyCard pos={getCardPosition(0, 14, 'center')} />
                        <EmptyCard pos={getCardPosition(0, 12, 'center')} />
                        <EmptyCard pos={getCardPosition(0, 10, 'center')} />
                        <EmptyCard pos={getCardPosition(0, 8, 'center')} />
                      </Box>

                      <Box
                        sx={{
                          opacity: gameEnd && playerScore < bankerScore ? 0.5 : 1,
                          transition: 'opacity 0.5s',
                        }}
                      >
                        <GameCard
                          pos={getCardPosition(isMobile ? -20 : -60, isMobile ? -35 : -50, 'left')}
                          dpos={getCardPosition(0, 8, 'center')}
                          card={playerHand[0]}
                          showAnimation={showGameAnimation}
                        />
                        <GameCard
                          pos={getCardPosition(isMobile ? -5 : -30, isMobile ? 0 : 0, 'left')}
                          dpos={getCardPosition(0, 8, 'center')}
                          card={playerHand[1]}
                          showAnimation={showGameAnimation}
                        />
                        <GameCard
                          pos={getCardPosition(isMobile ? 10 : 0, isMobile ? 35 : 50, 'left')}
                          dpos={getCardPosition(0, 8, 'center')}
                          card={playerHand[2]}
                          showAnimation={showGameAnimation}
                        />
                      </Box>

                      <Box
                        sx={{
                          opacity: gameEnd && playerScore > bankerScore ? 0.5 : 1,
                          transition: 'opacity 0.5s',
                        }}
                      >
                        <GameCard
                          pos={getCardPosition(isMobile ? -20 : -60, isMobile ? -35 : -50, 'right')}
                          dpos={getCardPosition(0, 8, 'center')}
                          card={bankerHand[0]}
                          showAnimation={showGameAnimation}
                        />
                        <GameCard
                          pos={getCardPosition(isMobile ? -5 : -30, isMobile ? 0 : 0, 'right')}
                          dpos={getCardPosition(0, 8, 'center')}
                          card={bankerHand[1]}
                          showAnimation={showGameAnimation}
                        />
                        <GameCard
                          pos={getCardPosition(isMobile ? 10 : 0, isMobile ? 35 : 50, 'right')}
                          dpos={getCardPosition(0, 8, 'center')}
                          card={bankerHand[2]}
                          showAnimation={showGameAnimation}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', mt: -0.5, justifyContent: 'center' }}>
                      <Typography
                        sx={{
                          bgcolor: gameEnd && playerScore > bankerScore ? 'error.main' : 'success.main',
                          textAlign: 'center',
                          width: { xs: 40, md: 56 },
                          height: 20,
                          fontSize: { xs: '0.75rem', md: '1rem' },
                          borderRadius: 6,
                          fontWeight: 'bold',
                          color: 'white',
                          animation: 'zoomIn 0.3s ease-in-out',
                        }}
                      >
                        {bankerScore}
                      </Typography>
                    </Box>
                  </Box>

                  <Stack spacing={1} sx={{ width: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#c7c7c7',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      PLACE YOUR BETS
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        justifyContent: 'space-around',
                        width: '100%',
                      }}
                    >
                      {['Player', 'Tie', 'Banker'].map((betType, index) => (
                        <Button
                          key={index}
                          onClick={() => handlePlaceBet(betType as IPlace)}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '30%',
                            maxWidth: 200,
                            border: 2,
                            borderRadius: 0.5,
                            borderColor: ' ',
                            bgcolor: gameEnd && getBetTypeCondition(betType) ? '#1967DC' : '#335481',
                            '&:hover': {
                              bgcolor: '#1D3E6B',
                            },
                            justifyContent: 'space-between',
                            p: { xs: 0, md: 1 },
                            alignItems: 'center',
                            userSelect: 'none',
                            cursor: 'pointer',
                            animation: showGameAnimation ? 'zoomIn 0.3s ease-in-out' : 'none',
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography sx={{ color: '#b8b8b8' }}>
                              {renderValue(betType as IPlace)}
                            </Typography>
                          </Stack>

                          <Box sx={{ my: { xs: 2, md: 3 } }}>
                            {renderChips(betType as IPlace)}
                          </Box>

                          <Typography
                            sx={{
                              color: '#b8b8b8',
                              fontSize: { xs: '0.75rem', md: '0.875rem' },
                              fontWeight: 'bold',
                            }}
                          >
                            {betType} {getBetTypeMultiplier(betType)}x
                          </Typography>
                        </Button>
                      ))}
                    </Stack>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ my: 1 }}
                    >
                      <Button
                        onClick={cancelBet}
                        startIcon={
                          <Box sx={{ width: 24, px: 1 }}>
                            <svg viewBox="0 0 64 64" fill="currentColor">
                              <path d="M37.973 11.947H16.24l5.84-5.84L15.973 0 .053 15.92l15.92 15.92 6.107-6.107-5.76-5.76h21.653C47.92 19.973 56 28.053 56 38c0 9.947-8.08 18.027-18.027 18.027h-21.76v8h21.76C52.347 64.027 64 52.373 64 38c0-14.373-11.653-26.027-26.027-26.027v-.026Z" />
                            </svg>
                          </Box>
                        }
                        sx={{
                          color: '#c7c7c7',
                          fontWeight: 'bold',
                          height: 20,
                        }}
                      >
                        Undo
                      </Button>

                      <Button
                        onClick={clearBet}
                        endIcon={
                          <Box sx={{ width: 24, px: 1 }}>
                            <svg viewBox="0 0 64 64" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M31.943 13.08c-9.37 0-17.128 6.904-18.476 16.004l4.798-.002-9.146 12.96-9.12-12.96h5.334l.012-.124C6.889 15.536 18.291 5.112 32.127 5.112a26.823 26.823 0 0 1 17.5 6.452l-5.334 6.186.02.018a18.584 18.584 0 0 0-12.37-4.688Zm22.937 8.752L64 34.792h-5.174l-.01.12C57.332 48.398 45.902 58.888 32.02 58.888a26.826 26.826 0 0 1-17.646-6.576l5.334-6.186a18.597 18.597 0 0 0 12.47 4.776c9.406 0 17.188-6.96 18.49-16.11h-4.934l9.146-12.96ZM19.708 46.126l-.016-.014.016.014Z"
                              />
                            </svg>
                          </Box>
                        }
                        sx={{
                          color: '#c7c7c7',
                          fontWeight: 'bold',
                          height: 20,
                        }}
                      >
                        Clear
                      </Button>
                    </Stack>
                  </Stack>

                  <ResultModal
                    visible={showResult}
                    profitAmount={resultData?.profit || 0}
                    multiplier={resultData?.multiplier}
                    onClose={() => {
                      setShowResult(false);
                    }}
                    showAnimation={showGameAnimation}
                  />
                </Box>
              </Container>
            </Stack>

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
                <Stack direction="row" gap={2} width={1}>
                  <Stack gap={0.5} width={0.7}>
                    <Typography variant="body2" color="text.secondary">
                      Chip Value
                    </Typography>
                    <ChipButtonGroup
                      onChooseChip={(v) => {
                        if (!disabled) selectChip(v as IChip);
                      }}
                      selected={chipValue}
                      chipValues={CHIP_VALUES}
                    />
                  </Stack>
                  <Stack gap={0.5}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      Total Bet
                    </Typography>
                    <Typography variant="h6">{totalBet.toFixed(2)}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Stack p={3} gap={3} bgcolor="#1D3E6B">
              {isAuto && (
                <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                  <TextField
                    type="number"
                    variant="filled"
                    label="Number of Bets"
                    value={autoBetCount === Infinity ? 0 : autoBetCount}
                    disabled={disabled}
                    onChange={(e) => {
                      setAutoBetCount(Number(e.target.value));
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
                    value={stopProfitA === Infinity ? 0 : stopProfitA}
                    disabled={disabled}
                    onChange={(e) => {
                      setStopProfitA(Number(e.target.value));
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
                    value={stopLossA === Infinity ? 0 : stopLossA}
                    disabled={disabled}
                    onChange={(e) => {
                      setStopLossA(Number(e.target.value));
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
                      fontSize: 18,
                    }}
                    onClick={() => {
                      if (isAuto)
                        if (autoBetting) stopAutobet();
                        else startAutoBet();
                      else placeBet();
                    }}
                    disabled={loading || (!isAuto && gameStart) || (isAuto && stoppedAutobet)}
                  >
                    {(betTab === 'manual' && 'Bet') || (autoBetting ? 'Stop AutoBet' : 'Start AutoBet')}
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

                <StyledToggleButtonGroup
                  size="small"
                  exclusive
                  onChange={handleChangeTab}
                  value={betTab}
                  disabled={disabled}
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
    </Stack >
  );
};

export default BaccaratSingle;
