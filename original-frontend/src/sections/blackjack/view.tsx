import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
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
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useSelector } from 'src/store';
import useApi from 'src/hooks/use-api';

import Iconify from 'src/components/iconify';
import Timer from 'src/components/custom/Timer';

import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';
import { DoubleIcon, HitIcon, SplitIcon, StandIcon } from 'src/assets/icons';

import deal from 'src/assets/audio/deal.mp3';
import clean from 'src/assets/audio/mucked.mp3';
import reverse from 'src/assets/audio/flip.mp3';

import CenterImg from 'src/assets/images/games/blackjack.png';

import { HistoryProps } from 'src/types';
import CardPanel from './cardpanel';
import RenderCard from './card';
import Modal from './modal';
import { ICard } from './types';


const dealAudio = deal;
const cleanAudio = clean;
const reverseAudio = reverse;

const STATUS = {
  win: 'Player wins! Dealer busts.',
  lose: 'Dealer wins! Player busts.',
  draw: "It's a tie!",
  continue: 'Player continues.',
  insuance: 'Dealer has blackjack! Insurance paid 2:1.',
  notInsurance: 'No blackjack. Insurance bet lost.',
};

let audioEnabled = false;
let audioVolume = 1;
const audioPlay = (audioClip: any) => {
  if (!audioEnabled) return;
  const audio = new Audio(audioClip);
  audio.volume = audioVolume;
  audio
    .play()
    .then(() => { })
    .catch((error: any) => {
      console.log('Failed to autoplay audio:', error);
    });
};

const BlackjackGame = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { balance, isLoggedIn, realBalance, baseUrl } = useSelector((state) => state.auth);
  const { soundVolume } = useSelector((state) => state.setting);

  const {
    playBlackjackApi,
    hitBlackjackApi,
    splitBlackjackApi,
    standBlackjackApi,
    insuranceBlackjackApi,
    doubleBlackjackApi,
    getBlackjackHistoryApi,
  } = useApi();

  const [disabled, setDisable] = useState<string[]>(['hit', 'double', 'stand', 'split']);

  // const [amount, setAmount] = useState<string>('0.00');
  const [betAmount, setBetAmount] = useState('0.00');
  const [dealerHand, setDealerHand] = useState<ICard[]>([]);
  const [playerHand, setPlayerHand] = useState<ICard[]>([]);
  const [playerHand2, setPlayerHand2] = useState<ICard[]>([]);

  const [history, setHistory] = useState<HistoryProps[]>([]);

  const [dealerHandValue, setDealerHandValue] = useState(0);
  const [playerHandValue, setPlayerHandValue] = useState(0);
  const [playerHand2Value, setPlayerHand2Value] = useState(0);
  const [match, setMatch] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clear, setClear] = useState(false);
  const [splited, setSplited] = useState(0);
  const [insuranceVisible, setInsuranceVisble] = useState(false);
  const [activedTab, setTab] = useState(0);
  const [resultvisble, setResultVsible] = useState(false);

  const [clientSeed, setClientSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');
  const [serverSeedHash, setServerSeedHash] = useState('');

  const [multiplier, setMultiplier] = useState(0);
  const [profit, setProfit] = useState(0);


  useEffect(() => {
    if (match === 1) setResultVsible(true);
  }, [match]);

  const init = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setPlayerHand2([]);
    setDisable(['hit', 'double', 'stand', 'split', 'bet', 'amount', 'insurance']);
    setMatch(0);
    setClear(false);
    setPlayerHandValue(0);
    setPlayerHand2Value(0);
    setDealerHandValue(0);
    setSplited(0);
    setResultVsible(false);
  };

  useEffect(() => {
    handleBetChange(betAmount, realBalance, setBetAmount);
  }, [betAmount, realBalance]);

  const onPlay = async () => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }

    const betValue = Number(betAmount);

    if (!validateBetAmount(betValue, balance)) {
      return;
    }

    setClear(true);
    setDisable(['hit', 'double', 'stand', 'split', 'bet', 'amount', 'insurance']);
    if (!playerHand.length) return;
    audioPlay(cleanAudio);
  };

  const getCards = async () => {
    // const { data } = await axiosServices.post("/blackjack/start", { amount });
    const res = await playBlackjackApi(Number(betAmount));
    if (!res?.data) return;
    const { data } = res;
    console.log('handleBet', playerHand, dealerHand);
    setServerSeedHash(data.serverSeedHash);
    setClientSeed(data.clientSeed);
    setServerSeed('');

    if (data.history) {
      setHistory([data.history, ...history]);
    }

    /* eslint-disable */
    for (let i = 0; i < data.playerHand.length; i++) {
      setTimeout(
        () => {
          playerHand[i] = undefined;
          setPlayerHand([...playerHand]);
        },
        470 + 1000 * i
      );
      setTimeout(
        () => {
          playerHand[i] = data.playerHand[i];
          setPlayerHand([...playerHand]);
          audioPlay(dealAudio);
        },
        500 + 1000 * i
      );
    }

    for (let j = 0; j < data.dealerHand.length; j++) {
      setTimeout(
        () => {
          dealerHand[j] = undefined;
          setDealerHand([...dealerHand]);
        },
        970 + 1000 * j
      );
      setTimeout(
        () => {
          dealerHand[j] = data.dealerHand[j];
          setDealerHand([...dealerHand]);
          audioPlay(dealAudio);
        },
        1000 + 1000 * j
      );
    }

    setTimeout(
      () => {
        setPlayerHandValue(data.playerValue);
        setPlayerHand2Value(data.playerValue2);
      },
      data.playerHand.length * 500 + 1000
    );

    setTimeout(
      () => {
        setDealerHandValue(data.dealerValue);
        switch (data.result) {
          case STATUS.continue:
            if (!data.canSplit) setDisable(['amount', 'bet', 'split']);
            else setDisable(['amount', 'bet']);

            if (data.dealerHand[0].rank === 'A') {
              setInsuranceVisble(true);
            }

            break;
          case STATUS.win:
            audioPlay(reverseAudio);
            setTimeout(
              () => {
                setDisable(['hit', 'double', 'stand', 'split']);
                setMatch(1);
              },
              [data.playerHand, data.dealerHand, data.playerHand2].sort(
                (a, b) => b.length - a.length
              )[0].length *
              200 +
              1000
            );
            setMultiplier(data.multiplier);
            setServerSeed(data.serverSeed);
            setProfit(data.profit);
            setClientSeed(data.clientSeed);
            break;
          case STATUS.lose:
            audioPlay(reverseAudio);
            setTimeout(
              () => {
                setDisable(['hit', 'double', 'stand', 'split']);
                setMatch(2);
              },
              [data.playerHand, data.dealerHand, data.playerHand2].sort(
                (a, b) => b.length - a.length
              )[0].length *
              200 +
              1000
            );
            setMultiplier(0);
            setServerSeed(data.serverSeed);
            setClientSeed(data.clientSeed);
            break;
          case STATUS.draw:
            audioPlay(reverseAudio);
            setTimeout(
              () => {
                setDisable(['hit', 'double', 'stand', 'split']);
                setMatch(3);
              },
              [data.playerHand, data.dealerHand, data.playerHand2].sort(
                (a, b) => b.length - a.length
              )[0].length *
              200 +
              1000
            );
            setMultiplier(1);
            setServerSeed(data.serverSeed);
            setClientSeed(data.clientSeed);
            break;
        }
      },
      data.dealerHand.length * 500 + 1500
    );

    /* eslint-enable */
  };

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

  const handleHit = async () => {
    setDisable(['hit', 'double', 'stand', 'split', 'bet', 'amount']);
    // const { data } = await axiosServices.post("/blackjack/hit");
    const res = await hitBlackjackApi();
    if (!res?.data) return;
    const data = res.data;

    console.log('hit', data);

    if (playerHand.length !== data.playerHand.length) {
      playerHand[playerHand.length] = undefined;
      setPlayerHand([...playerHand]);
    }

    setTimeout(() => {
      audioPlay(dealAudio);

      setTimeout(() => {
        audioPlay(reverseAudio);
      }, 500);
      setPlayerHand(data.playerHand);
    }, 500);
    setTimeout(() => {
      if (data.result === STATUS.lose) {
        setDealerHandValue(data.dealerValue);
        setDisable(['split', 'double', 'hit', 'stand']);
        setMatch(2);
        setMultiplier(0);
        setServerSeed(data.serverSeed);
        setClientSeed(data.clientSeed);
      } else if (data.result === STATUS.continue) setDisable(['bet', 'amount', 'split']);
      setPlayerHandValue(data.handValue);
      if (data.handValue === 21) {
        handleStand();
      }

      if (data.switched) {
        console.log('switch', playerHand, playerHand2);
        setPlayerHand([...playerHand2]);
        setPlayerHand2(data.playerHand);
        setPlayerHandValue(playerHand2Value);
        setPlayerHand2Value(data.handValue);
        setSplited(2);
      }
    }, 1000);

    if (data.history) {
      setTimeout(() => {
        changeHistory(data.history);
      }, 2000);
    }
  };

  const handleStand = async () => {
    setDisable(['hit', 'double', 'stand', 'split', 'bet', 'amount']);

    // const { data } = await axiosServices.post("/blackjack/stand");
    const res = await standBlackjackApi();
    if (!res?.data) return;
    const data = res.data;
    console.log('stand', data);

    if (dealerHand.length === data.dealerHand.length) {
      audioPlay(reverseAudio);
      setDealerHand(data.dealerHand);
      setDealerHandValue(data.dealerValue);
      setMultiplier(data.multiplier);
      setProfit(data.profit);
      switch (data.result) {
        case STATUS.win:
          setMatch(1);
          break;
        case STATUS.lose:
          setMatch(2);
          break;
        case STATUS.draw:
          setMatch(3);
          break;

        default:
          setMatch(0);
      }
    }

    /* eslint-disable */

    for (let j = 0, i = dealerHand.length - 1; i < data.dealerHand.length; j++, i++) {
      if (j) {
        setTimeout(
          () => {
            dealerHand[i] = undefined;
            setDealerHand([...dealerHand]);
          },
          470 + 1000 * j
        );
      }

      setTimeout(
        () => {
          if (i === data.dealerHand.length - 1) {
            setTimeout(() => {
              setDealerHandValue(data.dealerValue);
              setDisable(['split', 'double', 'hit', 'stand']);
              setMultiplier(data.multiplier);
              setServerSeed(data.serverSeed);
              setClientSeed(data.clientSeed);
              switch (data.result) {
                case STATUS.win:
                  setMatch(1);
                  break;
                case STATUS.lose:
                  setMatch(2);
                  break;
                case STATUS.draw:
                  setMatch(3);
                  break;
              }
            }, 500);
          }
          dealerHand[i] = data.dealerHand[i];
          setDealerHand([...dealerHand]);
          if (j) audioPlay(dealAudio);
          setTimeout(() => {
            audioPlay(reverseAudio);
          }, 500);
        },
        500 + 1000 * j
      );
    }

    if (data.history) {
      setTimeout(() => {
        changeHistory(data.history);
      }, 2000);
    }
    /* eslint-enable */
  };

  const handleDouble = async () => {
    setBetAmount((Number(betAmount) * 2).toFixed(2));
    setDisable(['hit', 'double', 'stand', 'split', 'bet', 'amount']);
    // const { data } = await axiosServices.post("/blackjack/double");
    const res = await doubleBlackjackApi();
    if (!res?.data) return;
    const data = res.data;
    console.log('double', data);
    if (playerHand.length !== data.playerHand.length) {
      playerHand[playerHand.length] = undefined;
      setPlayerHand([...playerHand]);
    }

    setTimeout(() => {
      audioPlay(dealAudio);
      setTimeout(() => {
        audioPlay(reverseAudio);
      }, 500);
      setPlayerHand(data.playerHand);
    }, 500);
    setTimeout(() => {
      if (data.result === STATUS.lose) {
        setDisable(['hit', 'double', 'stand', 'split']);
        setServerSeed(data.serverSeed);
        setClientSeed(data.clientSeed);
        setMatch(2);
      } else {
        handleStand();
      }
      setPlayerHandValue(data.handValue);
      if (data.handValue === 21) {
        handleStand();
      }
    }, 1000);

    if (data.history) {
      setTimeout(() => {
        changeHistory(data.history);
      }, 2000);
    }
  };

  const handleSplit = async () => {
    setDisable(['hit', 'double', 'stand', 'split', 'bet', 'amount']);
    setPlayerHand2([playerHand[1], undefined]);
    setPlayerHand([playerHand[0], undefined]);
    setSplited(1);
    setPlayerHandValue(0);

    // const { data } = await axiosServices.post("/blackjack/split", { amount });
    const res = await splitBlackjackApi(Number(betAmount));
    if (!res?.data) return;
    const { data } = res;
    console.log('split', data);

    setTimeout(() => {
      audioPlay(dealAudio);
      setTimeout(() => {
        audioPlay(reverseAudio);
      }, 500);

      setPlayerHand2(data.hand2.cards);
      setPlayerHand2Value(data.hand2.value);
    }, 1000);

    setTimeout(() => {
      audioPlay(dealAudio);
      setPlayerHand(data.hand1.cards);
      setPlayerHandValue(data.hand1.value);
    }, 500);

    setTimeout(() => {
      if (data.hand1.value === 21) {
        handleStand();
      } else {
        setDisable(['split', 'bet', 'amount']);
      }
    }, 1500);
  };

  const insurance = async (confirm: boolean) => {
    setDisable(['hit', 'double', 'stand', 'split', 'bet', 'amount', 'insurance']);
    setInsuranceVisble(false);
    // const { data } = await axiosServices.post("/blackjack/insurance", {
    //   confirm,
    // });
    const res = await insuranceBlackjackApi(confirm);
    if (!res?.data) return;
    const data = res.data;

    switch (data.result) {
      case STATUS.insuance:
        audioPlay(reverseAudio);
        setDealerHand(data.dealerHand);
        setDealerHandValue(data.dealerHandValue);
        setMatch(2);
        setDisable(['hit', 'double', 'stand', 'split']);
        break;
      case STATUS.notInsurance:
        if (playerHand[0]?.rank === playerHand[1]?.rank) setDisable(['bet', 'amount']);
        else setDisable(['bet', 'amount', 'split']);
        setInsuranceVisble(false);
        break;
      default:
        break;
    }

    if (data.history) {
      setTimeout(() => {
        changeHistory(data.history);
      }, 1000);
    }
  };

  useEffect(() => {
    setLoading(false);
    if (!dealerHand.length && !playerHand.length && !loading) {
      getCards();
    }
  }, [dealerHand, playerHand]);
  useEffect(() => {
    if (clear) {
      setTimeout(
        () => {
          init();
        },
        [playerHand, dealerHand, playerHand2].sort((a, b) => b.length - a.length)[0].length * 200 +
        500
      );
    }
  }, [clear]);

  useEffect(() => {
    audioEnabled = true;
  }, []);

  useEffect(() => {
    audioVolume = Number(soundVolume) / 10;
  }, [soundVolume]);

  const getHistory = async () => {
    const res = await getBlackjackHistoryApi();
    if (!res?.data) return;
    setHistory(res.data);
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <Stack>
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
          Blackjack Game
        </Typography>
      </Stack>

      <Grid container spacing={2} mt={1}>
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
                borderRadius: '16px 16px 0 0',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <Stack>
                <Typography variant="h6">Blackjack Game</Typography>
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
                height: 'auto',
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div className="max-w-[1300px] w-full p-1 flex justify-center" style={{ zIndex: 99 }}>
                <div className="grid grid-cols-3  w-full  md:max-w-none   md:grid-cols-4 rounded-md overflow-hidden shadow-md">
                  <div className="gap-2 col-span-4  w-full min-h-[380px]   relative h-full overflow-hidden justify-center  flex">
                    <Modal
                      odds={multiplier}
                      profit={profit}
                      visible={resultvisble}
                      onClose={() => setResultVsible(false)}
                    />

                    <div className=" h-full bg-no-repeat bg-center flex absolute bg-[length:400px_200px]  w-full space-x-1">
                      <div>
                        {[...Array(10)].map((val, key) => (
                          <RenderCard
                            key={key}
                            style={{
                              top: `${-10 - key / 2}% `,
                              right: '3%',
                            }}
                          />
                        ))}
                      </div>
                      <div className="grid grid-rows-6 gap-1 w-full">
                        <div className="row-span-1  w-full" />
                        <div className="row-span-1  w-full relative">
                          <CardPanel
                            hand={dealerHand}
                            handValue={dealerHandValue}
                            match={match}
                            clear={clear}
                            isDealerCard
                            isMobile={isMobile}
                          />
                        </div>
                        <div className="row-span-2  w-full" />
                        <div className="row-span-1  w-full relative">
                          {splited === 0 ? (
                            <CardPanel
                              hand={playerHand}
                              handValue={playerHandValue}
                              match={match}
                              clear={clear}
                            />
                          ) : (
                            <div className=" grid  grid-cols-2 w-full h-full">
                              <div className=" z-10">
                                <CardPanel
                                  hand={splited === 1 ? playerHand2 : playerHand}
                                  handValue={splited === 1 ? playerHand2Value : playerHandValue}
                                  match={match}
                                  clear={clear}
                                  isMain={splited === 2}
                                  splited={splited}
                                  isMobile={isMobile}
                                />
                              </div>
                              <div>
                                <CardPanel
                                  hand={splited === 2 ? playerHand2 : playerHand}
                                  handValue={splited === 2 ? playerHand2Value : playerHandValue}
                                  match={match}
                                  clear={clear}
                                  isMain={splited === 1}
                                  splited={splited}
                                  isMobile={isMobile}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="row-span-1  w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <img src={CenterImg} alt="center" className="absolute" />
            </Stack>

            <Stack p={3} gap={3} bgcolor="#163560">
              {insuranceVisible ? (
                <Stack>
                  <div className="text-red-500 font-bold p-2 pt-0 text-center w-full">
                    Insurance?
                  </div>
                  <Stack direction="row" gap={2} justifyContent="center" alignItems="center">
                    <Button
                      onClick={() => insurance(true)}
                      disabled={disabled.includes('insurance')}
                      variant="contained"
                      color="success"
                    >
                      Accept.
                    </Button>
                    <Button onClick={() => insurance(false)} variant="contained" color="error">
                      No.
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="center"
                  alignItems="center"
                  gap={1}
                >
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
                        gap: 1,
                      }}
                      disabled={disabled.includes('hit')}
                      onClick={handleHit}
                    >
                      Hit
                      <HitIcon />
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
                        gap: 1,
                      }}
                      disabled={disabled.includes('stand')}
                      onClick={handleStand}
                    >
                      Stand
                      <StandIcon />
                    </Button>
                  </Stack>

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
                      onClick={() => setBetAmount((Number(betAmount) - 1).toFixed(2))}
                    >
                      <Iconify icon="ic:sharp-minus" width={24} height={24} />
                    </Button>
                    <InputBase
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder="0.00"
                      sx={{
                        px: 2,
                        bgcolor: '#0C1F3A',
                        border: '2px solid #2B4C79',
                        borderWidth: '2px 0 2px 0',
                      }}
                      type="number"
                      disabled={disabled.includes('amount')}
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
                      onClick={() => setBetAmount((Number(betAmount) + 1).toFixed(2))}
                    >
                      <Iconify icon="ic:sharp-plus" width={24} height={24} />
                    </Button>
                  </Stack>

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
                        gap: 1,
                      }}
                      disabled={disabled.includes('split')}
                      onClick={handleSplit}
                    >
                      Split
                      <SplitIcon />
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
                        gap: 1,
                      }}
                      disabled={disabled.includes('double')}
                      onClick={handleDouble}
                    >
                      Double
                      <DoubleIcon />
                    </Button>
                  </Stack>
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
                    disabled={disabled.includes('bet')}
                    onClick={onPlay}
                  >
                    Bet
                  </Button>
                ) : (
                  <Button
                    disabled={loading}
                    sx={{
                      py: 1,
                      px: 3,
                      width: 230,
                      borderRadius: 50,
                      fontSize: { xs: 14, sm: 18 },
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
              maxHeight: 780,
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
                      <Stack direction="row" alignItems="center" gap={1} width={0.25}>
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
                      <Stack width={0.25}>
                        <Typography fontSize={10}>{`${(row?.target || 0).toFixed(2)}x`}</Typography>
                      </Stack>
                      <Stack width={0.25}>
                        <Typography
                          fontSize={10}
                          color={row.payout >= row.bet ? 'success.main' : 'error.main'}
                        >
                          {(row?.payout || 0).toFixed(2)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap={1} width={0.25}>
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

export default BlackjackGame;
