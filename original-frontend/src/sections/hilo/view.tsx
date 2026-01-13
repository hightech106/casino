import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography, Avatar, CardContent, Card, Grid, Stack,
  useMediaQuery, useTheme, Box, Chip, Button,
  IconButton,
  InputBase
} from '@mui/material';

import toast from 'react-hot-toast';
import Iconify from 'src/components/iconify';
import { ForwardIcon, SameIcon, UpwardIcon } from 'src/components/svgs';
import Timer from 'src/components/custom/Timer';

import { useSelector } from 'src/store';
import useApi from 'src/hooks/use-api';

import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';
import { HistoryProps } from 'src/types';
import { ICard, ICardData } from './types';

import StartCard from './cards/start';
import NewCard from './cards/new';
import CurrentCard from './cards/current';
import CardItem from './cards/item';
import ResultModal from './modal';

import {
  enableAudio,
  generateRandomCard,
  getCardRankValue,
  MULTIPLIERS,
  playAudio,
} from './config';


const HiloGame = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { balance, realBalance, isLoggedIn, baseUrl } = useSelector((store) => store.auth);
  const { betHiloApi, createHiloApi, getHiloApi, cashoutHiloApi, getHiloHistoryApi } = useApi();

  const [activeTab, setActiveTab] = useState(0);
  const [betAmount, setBetAmount] = useState<string>('0.00');
  const [loading, setLoading] = useState(false);
  const cardContain = useRef(null);
  const [gameId, setGameId] = useState('');
  const [privatekeyHash, setPrivateKeyHash] = useState('');
  const [publickey, setPublicKey] = useState('');
  const [privatekey, setPrivateKey] = useState('');
  const [startCard, setStartCard] = useState(generateRandomCard());
  const [visible, setVisibleModal] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalOdds, setTotalOdds] = useState(1);
  const [isLose, setLose] = useState(false);
  const [cardData, setCardData] = useState<ICardData>({
    newCard: null,
    currentCard: null,
    rounds: [],
  });

  const [history, setHistory] = useState<HistoryProps[]>([]);


  const isCahOut = gameId !== '';

  const onHigher = () => {
    if (currentCardValue === 13) {
      onBet('Same_H');
    } else if (currentCardValue === 1) {
      onBet('Higher');
    } else {
      onBet('HSame');
    }
  };

  const onLower = () => {
    if (currentCardValue === 1) {
      onBet('Same_L');
    } else if (currentCardValue === 13) {
      onBet('Lower');
    } else {
      onBet('LSame');
    }
  };

  const onSkip = () => {
    onBet('Skip');
  };

  const onBet = async (type: string) => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }

    setLoading(true);
    setLose(false);
    playAudio('guess');
    try {
      if (gameId !== '') {
        const res = await betHiloApi(type);
        if (!res?.data) return;
        const { status, odds, profit, rounds, privateKey, type: _type, history: _history } = res.data;
        if (status) {
          setTotalProfit(profit);
          setTotalOdds(odds);
          setCardData({
            ...cardData,
            newCard: rounds[rounds.length - 1]?.card || null,
            currentCard: rounds.length === 2 ? startCard : cardData.newCard,
            rounds,
          });
          if (_type === 'LOST') {
            setGameId('');
            setLose(true);
            setPrivateKey(privateKey);
          }
          if (_history) {
            changeHistory(_history);
          }
        }
      } else {
        const newcard = generateRandomCard();
        setStartCard(newcard);
        setCardData({
          ...cardData,
          newCard: null,
          currentCard: startCard,
          rounds: [{ card: newcard, multiplier: 1, type: 'Start' }],
        });
      }
    } catch (error) {
      setLoading(false);
    }

    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const createBet = async () => {
    const amount = Number(betAmount);
  
    if (!validateBetAmount(amount, balance)) {
      return;
    }

    setLoading(true);
    setLose(false);
    playAudio('bet');
    try {
      const param = {
        amount,
        startCard,
      };
      const res = await createHiloApi(param);
      if (!res?.data) return;

      const { status, odds, publicKey, privateHash, rounds, gameId: _gameId, history: _history } = res.data;
      if (status) {
        setGameId(_gameId);
        setPrivateKeyHash(privateHash);
        setPublicKey(publicKey);
        setCardData({
          ...cardData,
          rounds,
        });
        if (_history) {
          changeHistory(_history);
        }
      }
    } catch (error) {
      toast.error('error');
    }
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const cashOut = async () => {
    setLoading(true);
    try {
      const param = {
        amount: Number(betAmount),
        startCard,
      };

      const res = await cashoutHiloApi(param);
      if (!res?.data) return;

      const { status, profit, multiplier, privateKey, history: _history } = res.data;
      if (status) {
        setGameId('');
        setStartCard(cardData.rounds[cardData.rounds.length - 1].card);
        setVisibleModal(true);
        setPrivateKey(privateKey);
        playAudio('win');
        if (_history) {
          changeHistory(_history);
        }
      } else {
        toast.error('Not found game');
      }
    } catch (error) {
      toast.error('error');
    }
    setLoading(false);
  };

  const getGame = async () => {
    const res = await getHiloApi();
    if (!res?.data) return;

    const {
      status,
      odds,
      publicKey,
      privateHash,
      rounds,
      gameId: _gameId,
      profit,
      amount,
    } = res.data;

    if (status) {
      setGameId(_gameId);
      setPrivateKeyHash(privateHash);
      setPublicKey(publicKey);
      setTotalProfit(profit);
      setTotalOdds(odds);
      setBetAmount(amount);
      setCardData({
        ...cardData,
        newCard: rounds.length > 0 ? rounds[0].card : startCard,
        rounds,
      });
    } else {
      setCardData({
        ...cardData,
        rounds: [{ card: startCard, multiplier: 1, type: 'Start' }],
      });
    }

    enableAudio();
  };

  useEffect(() => {
    getGame();
  }, []);

  const checkDisable = () => {
    if (isCahOut) {
      if (
        !loading &&
        cardData.rounds.filter((v) => v.type !== 'Start' && v.type !== 'Skip').length > 0
      ) {
        return false;
      }
      return true;
    }
    return loading;
  };

  const getCurrentCardValue = () =>
    cardData.rounds.length === 0
      ? 1
      : getCardRankValue(
        cardData.rounds[cardData.rounds.length - 1]?.card || { suit: 'Clubs', rank: 'A' }
      );

  const getMultipliers = () => {
    const card: ICard = cardData.rounds[cardData.rounds.length - 1]?.card || {
      suit: 'Clubs',
      rank: 'A',
    };
    return MULTIPLIERS[card.rank];
  };

  const currentCardValue = getCurrentCardValue();
  const currentMultipliers = getMultipliers();

  const getProbability = () => {
    const value = currentCardValue;
    if (value === 13) {
      return [(100 / 13).toFixed(2), ((100 / 13) * value - 1).toFixed(2)];
    }
    if (value === 1) {
      return [(100 - (100 / 13) * value).toFixed(2), (100 / 13).toFixed(2)];
    }
    return [(100 - (100 / 13) * value - 1).toFixed(2), ((100 / 13) * value).toFixed(2)];
  };

  const probability = getProbability();

  const getHistory = async () => {
    const res = await getHiloHistoryApi();
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
        onClick={() => setBetAmount((state) => (parseFloat(state) + 1).toFixed(2) || '0.00')}
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
          Hilo Game
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
                <Typography variant="h6">Hilo Game</Typography>
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
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Grid container className="game-container game-wheel">
                <Grid item xs={12}>
                  <Stack
                    sx={{
                      position: 'relative',
                      width: 1,
                      height: 1,
                      minHeight: 363,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div className="w-full h-full flex justify-center ">
                      <div className={`max-w-[1300px] ${isMobile ? 'w-full p-1' : 'w-full'} `}>
                        <div className="grid grid-cols-1 sm:grid-cols-4 rounded-md overflow-hidden shadow-md">
                          <div
                            className={`col-span-4 ${isMobile ? 'min-h-[470px] ' : 'min-h-[450px] '
                              } relative h-full overflow-hidden`}
                          >
                            <div className="flex flex-col w-full h-full justify-between p-2">
                              <div className="flex justify-around min-h-[40%] items-center">
                                <div className="flex justify-center">
                                  <div className="fill-[#ffce00] md:w-32 w-16 flex flex-col  items-center opacity-80">
                                    <UpwardIcon width={100} />
                                    <div className="text-[#ffce00] font-bold md:text-sm text-xs">
                                      {probability[0]}%
                                    </div>
                                  </div>
                                </div>
                                <div className="relative">
                                  <div className="-translate-y-[85px]">
                                    <div
                                      className="absolute min:w-[110px] -translate-x-1/2 translate-y-[8px] w-[90px] md:w-[110px] select-none"
                                      style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                        aspectRatio: '2 / 3',
                                      }}
                                    >
                                      <div
                                        className="absolute inset-0 w-full  h-full flex items-center justify-center bg-cover bg-center rounded-lg shadow-md transition-transform duration-500 border-2"
                                        style={{
                                          backfaceVisibility: 'hidden',
                                          background: 'green',
                                        }}
                                      />
                                    </div>
                                    <div
                                      className="absolute min:w-[110px] -translate-x-1/2 translate-y-[6px] w-[90px] md:w-[110px] select-none"
                                      style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                        aspectRatio: '2 / 3',
                                      }}
                                    >
                                      <div
                                        className="absolute inset-0 w-full  h-full flex items-center justify-center bg-cover bg-center rounded-lg shadow-md transition-transform duration-500 border-2"
                                        style={{
                                          backfaceVisibility: 'hidden',
                                          background: 'green',
                                        }}
                                      />
                                    </div>
                                    <div
                                      className="absolute min:w-[110px] -translate-x-1/2 translate-y-[4px] w-[90px] md:w-[110px] select-none"
                                      style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                        aspectRatio: '2 / 3',
                                      }}
                                    >
                                      <div
                                        className="absolute inset-0 w-full  h-full flex items-center justify-center bg-cover bg-center rounded-lg shadow-md transition-transform duration-500 border-2"
                                        style={{
                                          backfaceVisibility: 'hidden',
                                          background: 'green',
                                        }}
                                      />
                                    </div>
                                    <div
                                      className="absolute min:w-[110px] -translate-x-1/2 translate-y-[2px] w-[90px] md:w-[110px] select-none"
                                      style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                        aspectRatio: '2 / 3',
                                      }}
                                    >
                                      <div
                                        className="absolute inset-0 w-full  h-full flex items-center justify-center bg-cover bg-center rounded-lg shadow-md transition-transform duration-500 border-2"
                                        style={{
                                          backfaceVisibility: 'hidden',
                                          background: 'green',
                                        }}
                                      />
                                    </div>
                                    {!cardData.newCard && startCard && <StartCard card={startCard} />}
                                    {cardData.newCard && <NewCard card={cardData.newCard} isLose={isLose} />}
                                    {cardData.currentCard && <CurrentCard card={cardData.currentCard} />}
                                  </div>
                                </div>
                                <div className="flex justify-center">
                                  <div className="fill-[#7F47FD] md:w-32 w-16 flex flex-col items-center opacity-80">
                                    <div className="rotate-180 md:w-32 flex justify-center w-16">
                                      <UpwardIcon width={100} />
                                    </div>
                                    <div className="text-[#7F47FD] font-bold md:text-sm text-xs text-center">
                                      {probability[1]}%
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <Card sx={{ overflow: 'visible' }}>
                                <CardContent
                                  sx={{
                                    p: '15px !important',
                                    bgcolor: 'secondary.main',
                                    border: '1px solid #2B4C79',
                                    borderRadius: 1.5,
                                  }}
                                >
                                  <Grid container spacing={1}>
                                    <Grid item xs={6} sm={4}>
                                      <Stack gap={1}>
                                        <Typography>Profit Higher {`(${currentMultipliers.Higher.toFixed(2)}x)`}</Typography>
                                        <InputBase
                                          value={(currentMultipliers.Higher * Number(betAmount)).toFixed(5)}
                                          placeholder="0.00"
                                          sx={{
                                            px: 3,
                                            py: 1,
                                            borderRadius: 50,
                                            border: '1px solid #2B4C79',
                                            bgcolor: '#0C1F3A',
                                          }}
                                          inputProps={{ readOnly: true }}
                                        />
                                      </Stack>
                                    </Grid>
                                    <Grid item xs={6} sm={4}>
                                      <Stack gap={1}>
                                        <Typography>Profit Lower {`(${currentMultipliers.Lower.toFixed(2)}x)`}</Typography>
                                        <InputBase
                                          value={(currentMultipliers.Lower * Number(betAmount)).toFixed(5)}
                                          placeholder="0.00"
                                          sx={{
                                            px: 3,
                                            py: 1,
                                            borderRadius: 50,
                                            border: '1px solid #2B4C79',
                                            bgcolor: '#0C1F3A',
                                          }}
                                          inputProps={{ readOnly: true }}
                                        />
                                      </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                      <Stack gap={1}>
                                        <Typography>Total Profit {`(${totalOdds.toFixed(2)}x)`}</Typography>
                                        <InputBase
                                          value={totalProfit.toFixed(5)}
                                          placeholder="0.00"
                                          sx={{
                                            px: 3,
                                            py: 1,
                                            borderRadius: 50,
                                            border: '1px solid #2B4C79',
                                            bgcolor: '#0C1F3A',
                                          }}
                                          inputProps={{ readOnly: true }}
                                        />
                                      </Stack>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </Card>

                              <div
                                className="flex max-w-full min-w-full h-[306px] md:p-2 p-1 overflow-y-auto overflow-x-scroll"
                                ref={cardContain}
                              >
                                <div className="max-w-[100%] flex">
                                  {cardData.rounds.map((round, index) => (
                                    <CardItem
                                      key={index}
                                      round={round}
                                      index={index}
                                      isLose={cardData.rounds.length - 1 === index && isLose}
                                      onEndAnimation={() => {
                                        if (index === cardData.rounds.length - 1) {
                                          if (cardContain.current) {
                                            const contain = cardContain.current as HTMLElement;
                                            contain.scrollIntoView({ behavior: 'smooth' });
                                            contain.scrollTo({
                                              left: contain.scrollWidth,
                                              top: 0,
                                              behavior: 'smooth',
                                            });
                                          }
                                        }
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>

                            </div>
                            <ResultModal
                              visible={visible}
                              profit={totalProfit}
                              odds={totalOdds}
                              onClose={() => setVisibleModal(false)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Stack>
                </Grid>
              </Grid>
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
                <Grid container spacing={1}>
                  <Grid item xs={6} sm={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        px: 2,
                        height: 1,
                        borderRadius: 50,
                        border: '2px solid #2B4C79',
                        bgcolor: '#1D3E6B',
                        whiteSpace: 'nowrap',
                      }}
                      disabled={loading || !isCahOut}
                      onClick={onHigher}
                    >
                      <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" justifyContent="center" >
                        {(currentCardValue === 13 && (
                          <>
                            Same
                            <SameIcon width={18} height={18} fill="#F2BF0B" />
                          </>
                        )) ||
                          (currentCardValue === 1 ? (
                            <>
                              Higher
                              <UpwardIcon width={18} height={18} fill="#F2BF0B" />
                            </>
                          ) : (
                            <>
                              Higher or Same
                              <UpwardIcon width={18} height={18} fill="#F2BF0B" />
                            </>
                          ))}

                        {probability[0]}%
                      </Stack>
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        px: 2,
                        height: 1,
                        borderRadius: 50,
                        border: '2px solid #2B4C79',
                        bgcolor: '#1D3E6B',
                        whiteSpace: 'nowrap',
                      }}
                      disabled={loading || !isCahOut}
                      onClick={onLower}
                    >
                      <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" justifyContent="center" >
                        {(currentCardValue === 1 && (
                          <>
                            Same
                            <SameIcon width={18} height={18} fill="#E278EA" />
                          </>
                        )) ||
                          (currentCardValue === 13 ? (
                            <>
                              Lower
                              <UpwardIcon width={18} height={18} fill="#E278EA" className='rotate-180' />
                            </>
                          ) : (
                            <>
                              Lower or Same
                              <UpwardIcon width={18} height={18} fill="#E278EA" className='rotate-180' />
                            </>
                          ))}

                        {probability[1]}%
                      </Stack>
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        px: 2,
                        height: 1,
                        borderRadius: 50,
                        border: '2px solid #2B4C79',
                        bgcolor: '#1D3E6B',
                        whiteSpace: 'nowrap',
                      }}
                      disabled={loading}
                      onClick={onSkip}
                    >
                      <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" justifyContent="center" >
                        Skip Card
                        <ForwardIcon width={18} height={18} fill="#FFF" />
                      </Stack>
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

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

                {isLoggedIn ? (
                  <Button
                    variant="contained"
                    color={isCahOut ? 'error' : 'primary'}
                    sx={{
                      py: 1,
                      px: 3,
                      width: 230,
                      borderRadius: 50,
                      fontSize: 18,
                    }}
                    disabled={checkDisable()} onClick={isCahOut ? cashOut : createBet}
                  >
                    {isCahOut ? 'Cashout' : 'Bet'}
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
          <Card
            sx={{
              height: 1,
              borderRadius: 2,
              border: '1px solid #2B4C79',
              maxHeight: 925,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
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

export default HiloGame;
