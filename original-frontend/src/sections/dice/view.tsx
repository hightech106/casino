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
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import $ from 'jquery';

import useApi from 'src/hooks/use-api';
import { useSelector } from 'src/store';

import { resultPopup } from 'src/utils/games';
import Iconify from 'src/components/iconify';

import darkPanel from 'src/assets/images/games/darkPanel.png';
import Timer from 'src/components/custom/Timer';

import { HistoryProps } from 'src/types';
import moment from 'moment';
import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';

const houseEdge = Number(import.meta.env.REACT_APP_DICE_HOUSE_EDGE);
console.log(houseEdge);
type IMode = 'high' | 'low';

const DiceView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { isLoggedIn, balance, realBalance, baseUrl } = useSelector((state) => state.auth);

  const { playDiceApi, getDiceHistoryApi } = useApi();

  const [loading, setLoading] = useState(false);
  const [betAmount, setBetAmount] = useState<string>('0.00');

  const [history, setHistory] = useState<HistoryProps[]>([]);

  const [target, setTarget] = useState(5050);
  const [mode, setMode] = useState<IMode>('high');
  const [multiplier, setMultiplier] = useState(2);

  const numberSpin = (selector: string) => {
    const element = document.getElementById(selector) as any;
    const factor = 10 + Math.floor(Math.random() * 10);
    const num = 10;
    const section = 100 / (num + 1);
    let stopValue = 1;
    const spin = (flag: boolean, x: number) => {
      let value = element.style.transform;
      value = value ? parseFloat(value.split('(')[1].split(')').join('')) : 0;
      if (flag && flag === true) {
        const isStop = stopValue === 0 ? 0 : 0.5;
        if (
          stopValue !== 1 &&
          (value <= stopValue || value - section / factor <= stopValue) &&
          typeof x !== 'undefined' &&
          value >= x * -section &&
          value <= (x - 0.5 >= 0 ? x - 0.5 : isStop) * -section
        ) {
          element.style.transform = `translateY(${stopValue}%)`;
          stopValue = 1;
          return true;
        }
        stopValue = Math.floor(value / section) >= -num ? Math.floor(value / section) * section : 0;
      }
      if (value && value <= -(section * num)) {
        element.style.transform = `translateY(${section}%)`;
        value = 0;
      } else {
        value -= section / factor;
      }
      element.style.transform = `translateY(${value}%)`;
      return false;
    };
    const spinTimer = setInterval(spin, 5);
    function stop(delay: number, x: number) {
      setTimeout(() => {
        clearTimeout(spinTimer);
        const stopTimer = setInterval(() => {
          if (spin(true, x)) clearInterval(stopTimer);
        }, 5);
      }, delay);
    }
    return {
      stop: (delay: number, x: number) => stop(delay, x),
    };
  };

  const onTarget = (params: number) => {
    setMultiplier(params);
  };

  const onMode = (event: any) => {
    const param = event.target.value as IMode;
    setMode(param);
  };

  useEffect(() => {
    if (mode === 'high') {
      const pct = 100 / multiplier;
      const odds = pct - pct * 0.01 * houseEdge;
      const t = 10000 - Math.ceil((odds / 100) * 10000);
      setTarget(t);
    } else {
      const pct = 100 / multiplier;
      const odds = pct - pct * 0.01 * houseEdge;
      const t = Math.ceil((odds / 100) * 10000);
      setTarget(t);
    }
  }, [multiplier, mode]);

  const onPlay = async () => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }

    $('#scroll1, #scroll2, #scroll3, #scroll4')
      .removeClass('text-danger')
      .removeClass('text-success');

    const amount = Number(betAmount);

    if (!validateBetAmount(amount, balance)) {
      return;
    }

    if (multiplier < 1 || multiplier > 1000) {
      toast.error(`Maximum Odds 1000, Minimum Odds 1.`);
      return;
    }

    setLoading(true);
    const param = {
      amount,
      multiplier,
      target,
      mode: mode === 'high',
    };
    const res = await playDiceApi(param);
    setLoading(false);
    if (!res?.data) return;

    const { data } = res;

    let roll = String(data.roll);
    if (roll.length === 3) {
      roll = `0${roll}`;
    } else if (roll.length === 2) {
      roll = `00${roll}`;
    } else if (roll.length === 1) {
      roll = `000${roll}`;
    }
    const array = String(roll).split('');
    numberSpin('scroll1').stop(500 + Math.floor(Math.random() * 100), Number(array[0]));
    numberSpin('scroll2').stop(600 + Math.floor(Math.random() * 100), Number(array[1]));
    numberSpin('scroll3').stop(700 + Math.floor(Math.random() * 100), Number(array[2]));
    numberSpin('scroll4').stop(800 + Math.floor(Math.random() * 100), Number(array[3]));
    setTimeout(() => {
      const classname = data.status === 'WIN' ? 'text-success' : 'text-danger';
      $('#scroll1, #scroll2, #scroll3, #scroll4').addClass(classname);
    }, 1500);
    setTimeout(() => {
      setLoading(false);
      resultPopup(data);
      if (data.history) {
        setHistory([data.history, ...history]);
      }
    }, 2500);

  };

  const getHistory = async () => {
    const res = await getDiceHistoryApi();
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
          Dice Game
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
                <Typography variant="h6">Dice Game</Typography>
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
              <Stack
                className="game-container game-dice"
                sx={{
                  width: 1,
                  minHeight: { xs: 300, sm: 400 },
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Stack
                  sx={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box className="game-content game-content-dice game-type-local">
                    <Box className="slots">
                      <Box className="target">
                        {mode === 'high' ? '>' : '<'} {target}
                      </Box>
                      <Box
                        component="img"
                        src={darkPanel}
                        alt="slot panel"
                        className="slot-panel"
                      />
                      <Box className="slotcontainer">
                        <Box className="slot">
                          <Box id="scroll1">
                            <Box>0</Box>
                            <Box>1</Box>
                            <Box>2</Box>
                            <Box>3</Box>
                            <Box>4</Box>
                            <Box>5</Box>
                            <Box>6</Box>
                            <Box>7</Box>
                            <Box>8</Box>
                            <Box>9</Box>
                            <Box>0</Box>
                          </Box>
                        </Box>
                        <Box className="slot">
                          <Box id="scroll2">
                            <Box>0</Box>
                            <Box>1</Box>
                            <Box>2</Box>
                            <Box>3</Box>
                            <Box>4</Box>
                            <Box>5</Box>
                            <Box>6</Box>
                            <Box>7</Box>
                            <Box>8</Box>
                            <Box>9</Box>
                            <Box>0</Box>
                          </Box>
                        </Box>
                        <Box className="slot">
                          <Box id="scroll3">
                            <Box>0</Box>
                            <Box>1</Box>
                            <Box>2</Box>
                            <Box>3</Box>
                            <Box>4</Box>
                            <Box>5</Box>
                            <Box>6</Box>
                            <Box>7</Box>
                            <Box>8</Box>
                            <Box>9</Box>
                            <Box>0</Box>
                          </Box>
                        </Box>
                        <Box className="slot">
                          <Box id="scroll4">
                            <Box>0</Box>
                            <Box>1</Box>
                            <Box>2</Box>
                            <Box>3</Box>
                            <Box>4</Box>
                            <Box>5</Box>
                            <Box>6</Box>
                            <Box>7</Box>
                            <Box>8</Box>
                            <Box>9</Box>
                            <Box>0</Box>
                          </Box>
                        </Box>
                      </Box>
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
                <Stack direction="row" alignItems="center" gap={3}>
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
                      {['high', 'low'].map((_, index) => (
                        <MenuItem
                          key={index}
                          value={_}
                          disabled={loading}
                          sx={{
                            textTransform: 'uppercase',
                          }}
                        >
                          {_}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1} width={1}>
                    <Typography>Odds</Typography>
                    <InputBase
                      fullWidth
                      disabled={loading}
                      value={multiplier}
                      onChange={(e) => onTarget(Number(e.target.value))}
                      placeholder="0.00"
                      type="number"
                      inputProps={{ step: 0.01, min: 0 }}
                      sx={{
                        borderRadius: 50,
                        fontSize: 16,
                        bgcolor: '#0C1F3A',
                        border: '2px solid #2B4C79',
                        px: 1.5,
                        py: 0.5,
                      }}
                    />
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
                  <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.2}>
                    Payout
                  </Typography>
                  <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.2}>
                    Amount
                  </Typography>
                  <Typography fontSize={{ xs: 10, sm: 11 }} color="#A9C1DC" width={0.25}>
                    Time
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
                      <Stack width={0.25}>
                        <Typography fontSize={10}>
                          {moment(row.createdAt).format('DD/MM HH:mm')}
                        </Typography>
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

export default DiceView;
