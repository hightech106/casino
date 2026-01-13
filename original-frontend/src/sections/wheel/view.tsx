import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import moment from 'moment';

import { useSelector } from 'src/store';

import useApi from 'src/hooks/use-api';
import Iconify from 'src/components/iconify';
import Timer from 'src/components/custom/Timer';

import $ from 'jquery';
import _ from 'lodash';

import { HistoryProps } from 'src/types';
import { resultPopup } from 'src/utils/games';
import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';

import WheelImg from 'src/assets/images/games/wheel.svg';

import 'src/utils/superwheel';

type IMode = 'double' | 'x50';

const RED = '#FF1CE8';
const BLACK = '#4D6E9B';
const GREEN = '#3BC117';
const YELLOW = '#F9AD17';

const wConfig = {
  width: 360,
  frame: 1,
  type: 'spin',
  duration: 3000,
  line: {
    width: 0,
    color: 'transparent',
  },
  outer: {
    width: 8,
    color: 'rgba(255, 255, 255, 0.1)',
  },
  inner: {
    width: 0,
    color: 'transparent',
  },
  center: {
    width: 90,
    rotate: true,
  },
  marker: {
    animate: true,
  },
};

const colors1 = [
  { label: BLACK, color: 'black', value: 2 },
  { label: GREEN, color: 'green', value: 14 },
  { label: RED, color: 'red', value: 2 },
];

const colors2 = [
  { label: BLACK, color: 'black', value: 2 },
  { label: RED, color: 'red', value: 3 },
  { label: GREEN, color: 'green', value: 5 },
  { label: YELLOW, color: 'yellow', value: 50 },
];

const Wheel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const wheelRef = useRef<HTMLDivElement>(null);

  const { isLoggedIn, balance, realBalance, baseUrl } = useSelector((state) => state.auth);

  const { playWheelApi, getWheelHistoryApi } = useApi();

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<IMode>('double');
  const [betAmount, setBetAmount] = useState<string>('0.00');
  const [history, setHistory] = useState<HistoryProps[]>([]);

  const [color, setColor] = useState('black');

  const fill = (slices: any) => {
    let i = 0;
    const output: any[] = [];
    _.forEach(slices, (slice) => {
      output.push({
        value: i,
        background: slice,
      });
      i += 1;
    });
    return output;
  };

  const renderWheel = () => {
    if (mode === 'double') {
      const gamewheel = $('.game-wheel').find('.wheel') as any;
      gamewheel.wheel({
        slices: fill([
          GREEN,
          RED,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
        ]),
        ...wConfig,
      });
    }
    if (mode === 'x50') {
      const gamewheel = $('.game-wheel').find('.wheel') as any;
      gamewheel.wheel({
        slices: fill([
          YELLOW,
          GREEN,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          GREEN,
          BLACK,
          GREEN,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          GREEN,
          BLACK,
          GREEN,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          GREEN,
          BLACK,
          GREEN,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          GREEN,
          BLACK,
          GREEN,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          RED,
          BLACK,
          GREEN,
        ]),
        ...wConfig,
      });
    }
  };

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

    const param = {
      amount,
      color,
      mode: mode === 'double',
    };

    const res = await playWheelApi(param);
    if (!res?.data) return;
    setLoading(false);

    const gamewheel = $('.game-wheel .wheel') as any;
    gamewheel.wheel('start', 'value', res.data.index);
    setTimeout(() => {
      setLoading(false);
      resultPopup(res.data);

      if (res.data?.history) {
        setHistory([res.data.history, ...history]);
      }
    }, 3000);
  };

  const onMode = (event: any) => {
    const params = event.target.value;
    setMode(params);
    if (params === 'double') {
      setColor(colors1[0].color);
    } else {
      setColor(colors2[0].color);
    }
  };

  const onColor = (params: string) => {
    setColor(params);
  };

  useEffect(() => {
    renderWheel();
    // eslint-disable-next-line
  }, [mode]);

  const getHistory = async () => {
    const res = await getWheelHistoryApi();
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

  const selectedColor = (mode === 'double' ? colors1 : colors2).find(
    (item) => item.color === color
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
          Wheel Game
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
                <Typography variant="h6">Wheel Game</Typography>
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
                    <Box className="game-content game-content-wheel">
                      <Box className="wheel-container">
                        <Box className="wheel" ref={wheelRef} />
                        <Box
                          component="img"
                          src={WheelImg}
                          alt="wheel"
                          sx={{
                            position: 'absolute',
                            width: wheelRef.current?.clientWidth || 0.7,
                            height: wheelRef.current?.clientHeight || 0.7,
                          }}
                        />
                        <Stack
                          sx={{
                            width: 150,
                            height: 150,
                            borderRadius: 50,
                            bgcolor: '#254673',
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `8px solid #1D3E6B`,
                          }}
                        >
                          <Typography fontSize={36} fontWeight={700} color={selectedColor?.label}>
                            {selectedColor?.value.toFixed(2)}x
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>
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
                <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" gap={2}>
                  <Stack direction="row" alignItems="center" gap={1} width={1}>
                    <Typography>Mode</Typography>
                    <Select
                      fullWidth
                      disabled={loading}
                      value={mode}
                      onChange={onMode}
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
                      {['double', 'x50'].map((item, index) => (
                        <MenuItem
                          key={index}
                          value={item}
                          disabled={loading}
                          sx={{
                            textTransform: 'uppercase',
                          }}
                        >
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    width={{ xs: 1, sm: 'fit-content' }}
                  >
                    {(mode === 'double' ? colors1 : colors2).map((item, key) => (
                      <Button
                        key={key}
                        disabled={loading}
                        variant="contained"
                        color="primary"
                        sx={{
                          pt: 2,
                          pb: 1,
                          width: { xs: 1, sm: 0.2 },
                          bgcolor: '#254673',
                          borderBottom: `8px solid ${item.label}`,
                          ...(color === item.color && {
                            bgcolor: `${alpha(item.label, 1)} !important`,
                          }),
                        }}
                        onClick={() => onColor(item.color)}
                      >
                        {item.value.toFixed(2)}x
                      </Button>
                    ))}
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

export default Wheel;
