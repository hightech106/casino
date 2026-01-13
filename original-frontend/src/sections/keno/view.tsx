import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Card,
  Grid,
  InputBase,
  Stack,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';

import $ from 'jquery';
import classnames from 'classnames';

import { useSelector } from 'src/store';
import useApi from 'src/hooks/use-api';

import Iconify from 'src/components/iconify';
import Timer from 'src/components/custom/Timer';
import { chain, Random, resultPopup } from 'src/utils/games';
import { BlueCircleIcon } from 'src/assets/icons';
import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';

import Gem from 'src/assets/images/games/gem.svg';

import { HistoryProps } from 'src/types';

const odds = {
  1: [0, 1.8],
  2: [0, 1.96, 3.6],
  3: [0, 0, 1.5, 24],
  4: [0, 0, 2.1, 7.8, 88.6],
  5: [0, 0, 1.5, 4, 12, 292],
  6: [0, 0, 0, 1.8, 6, 100, 600],
  7: [0, 0, 0, 1.7, 3.2, 14, 200, 700],
  8: [0, 0, 0, 1.5, 2, 5, 39, 100, 800],
  9: [0, 0, 0, 1.4, 1.6, 2.3, 7, 40, 200, 900],
  10: [0, 0, 0, 1.3, 1.4, 1.5, 2.6, 10, 30, 200, 1000],
} as any;

// const odds = {
//     1: [0.4, 2.75],
//     2: [0, 1.8, 5.1],
//     3: [0, 0, 2.8, 50],
//     4: [0, 0, 1.7, 10, 100],
//     5: [0, 0, 1.4, 4, 14, 390],
//     6: [0, 0, 0, 3, 9, 180, 710],
//     7: [0, 0, 0, 2, 7, 30, 400, 800],
//     8: [0, 0, 0, 2, 4, 11, 67, 400, 900],
//     9: [0, 0, 0, 2, 2.5, 5, 15, 100, 500, 1000],
//     10: [0, 0, 0, 1.6, 2, 4, 7, 26, 100, 500, 1000]
// } as any;

const KenoView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { playKenoApi, getKenoHistoryApi } = useApi();
  const { user, isLoggedIn, balance, realBalance, baseUrl } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [betAmount, setBetAmount] = useState<string>('0.00');
  const [autoPickInProcess, setAutoPickInProcess] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [response, setResponse] = useState<number[]>([]);

  const [history, setHistory] = useState<HistoryProps[]>([]);

  const onPlay = async () => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }

    const amount = Number(betAmount);

    if (!validateBetAmount(amount, balance)) {
      return;
    }

    setLoading(true);
    setResponse([]);
    $('.history-keno').removeClass('highlight');

    const param = {
      amount,
      selected,
    };
    const res = await playKenoApi(param);
    if (!res?.data) {
      setLoading(false);
      return;
    }

    const { data } = res;

    let historyIndex = 1;
    $(`.history-keno:nth-child(${historyIndex})`).addClass('highlight');
    chain(10, 100, (i: number) => {
      setResponse(data.picked.slice(0, i));
      if (selected.includes(data.picked[i - 1])) {
        historyIndex += 1;
        $('.history-keno').removeClass('highlight');
        $(`.history-keno:nth-child(${historyIndex})`).addClass('highlight');
      }
      if (i === 9) {
        setLoading(false);
        resultPopup(data);
        if (data?.history) {
          setHistory([data.history, ...history]);
        }
      }
    });
  };

  const tileClick = (number: number) => {
    if (selected.length >= 10 && !selected.includes(number)) return;
    if (!selected.includes(number)) {
      setSelected([...selected, number]);
    } else {
      setSelected([...selected.filter((e) => e !== number)]);
    }
  };

  const onAutoPick = () => {
    if (autoPickInProcess) return;
    setAutoPickInProcess(true);
    setSelected([]);
    const picked: number[] = [];
    while (picked.length < 10) {
      const rand = Random(1, 40);
      if (!picked.includes(rand)) {
        picked.push(rand);
      }
    }

    chain(10, 100, (index: number) => {
      setSelected(picked.slice(0, index));
      if (index === 9) setAutoPickInProcess(false);
    });
  };

  const onClear = () => {
    $('.history-keno').removeClass('highlight');
    setSelected([]);
    setResponse([]);
  };

  const getHistory = async () => {
    const res = await getKenoHistoryApi();
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
        disabled={loading}
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
        disabled={loading}
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
        disabled={loading}
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
          Keno Game
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
                <Typography variant="h6">Keno Game</Typography>
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
                py: 1,
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Stack
                className="game-container game-keno"
                justifyContent="center"
                alignItems="center"
              >
                <Stack
                  sx={{
                    position: 'relative',
                    width: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 2,
                  }}
                >
                  <Box className="game-content game-content-keno">
                    <Box className="keno-grid">
                      {Array.from(Array(40).keys()).map((item, key) => (
                        <Box
                          key={key}
                          className={classnames({
                            active: selected.includes(key + 1),
                            selected: response.includes(key + 1),
                          })}
                          onClick={() => tileClick(key + 1)}
                        >
                          <img src={Gem} className="w-100" alt="" />
                          <span>{key + 1}</span>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </Stack>
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
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems="center"
                  gap={2}
                  width={1}
                >
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      height: 45,
                      borderRadius: 50,
                      border: '2px solid #2B4C79',
                      bgcolor: '#1D3E6B',
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      px: 2,
                      py: 0.5,
                      '&::-webkit-scrollbar': {
                        height: 4,
                      },
                      '&::-webkit-scrollbar-track': {
                        marginLeft: '10px',
                        marginRight: '10px',
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={1}
                    >
                      {selected.length > 0 &&
                        odds[selected.length].map((num: number, key: number) => (
                          <Stack key={key} direction="row" alignItems="center" gap={1} sx={{ pr: 2 }}>
                            <Stack textAlign="center">
                              <Typography fontSize={8}>{key}</Typography>
                              <Typography fontSize={12}>{num}x</Typography>
                            </Stack>
                            <BlueCircleIcon />
                          </Stack>
                        ))}
                    </Stack>
                  </Box>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        borderRadius: 50,
                        border: '2px solid #2B4C79',
                        bgcolor: '#1D3E6B',
                        whiteSpace: 'nowrap',
                      }}
                      onClick={onAutoPick}
                    >
                      Auto Pick
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        borderRadius: 50,
                        border: '2px solid #2B4C79',
                        bgcolor: '#1D3E6B',
                        whiteSpace: 'nowrap',
                      }}
                      onClick={onClear}
                    >
                      Clear Table
                    </Button>
                  </Stack>
                </Stack>
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                      fontSize: 18,
                    }}
                    disabled={loading}
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

export default KenoView;
