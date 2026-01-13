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
  SelectChangeEvent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import $ from 'jquery';

import { useSelector } from 'src/store';
import Iconify from 'src/components/iconify';
import useApi from 'src/hooks/use-api';
import { Random, resultPopup } from 'src/utils/games';
import Timer from 'src/components/custom/Timer';
import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';
import { HistoryProps } from 'src/types';

const hex = {
  0: ['#ffc000', '#997300'],
  1: ['#ffa808', '#a16800'],
  2: ['#ffa808', '#a95b00'],
  3: ['#ff9010', '#a95b00'],
  4: ['#ff7818', '#914209'],
  5: ['#ff6020', '#b93500'],
  6: ['#ff4827', '#c01d00'],
  7: ['#ff302f', '#c80100'],
  8: ['#ff1837', '#91071c'],
  9: ['#ff003f', '#990026'],
};

const colors = {
  8: [hex[9], hex[7], hex[4], hex[2], hex[0], hex[2], hex[4], hex[7], hex[9]],
  9: [hex[9], hex[7], hex[6], hex[5], hex[2], hex[2], hex[5], hex[6], hex[7], hex[9]],
  10: [hex[9], hex[8], hex[7], hex[5], hex[4], hex[1], hex[4], hex[5], hex[7], hex[8], hex[9]],
  11: [
    hex[9],
    hex[8],
    hex[7],
    hex[5],
    hex[4],
    hex[2],
    hex[2],
    hex[4],
    hex[5],
    hex[7],
    hex[8],
    hex[9],
  ],
  12: [
    hex[9],
    hex[8],
    hex[7],
    hex[6],
    hex[5],
    hex[4],
    hex[1],
    hex[4],
    hex[5],
    hex[6],
    hex[7],
    hex[8],
    hex[9],
  ],
  13: [
    hex[9],
    hex[8],
    hex[7],
    hex[6],
    hex[5],
    hex[4],
    hex[2],
    hex[2],
    hex[4],
    hex[5],
    hex[6],
    hex[7],
    hex[8],
    hex[9],
  ],
  14: [
    hex[9],
    hex[8],
    hex[7],
    hex[6],
    hex[5],
    hex[4],
    hex[3],
    hex[2],
    hex[3],
    hex[4],
    hex[5],
    hex[6],
    hex[7],
    hex[8],
    hex[9],
  ],
  15: [
    hex[9],
    hex[8],
    hex[7],
    hex[6],
    hex[5],
    hex[4],
    hex[3],
    hex[2],
    hex[2],
    hex[3],
    hex[4],
    hex[5],
    hex[6],
    hex[7],
    hex[8],
    hex[9],
  ],
  16: [
    hex[9],
    hex[8],
    hex[7],
    hex[6],
    hex[5],
    hex[4],
    hex[3],
    hex[2],
    hex[1],
    hex[2],
    hex[3],
    hex[4],
    hex[5],
    hex[6],
    hex[7],
    hex[8],
    hex[9],
  ],
} as any;
const gameData = {
  low: {
    8: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
    10: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
    12: [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
    14: [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
    16: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
  },
  medium: {
    8: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    10: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
    12: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
    14: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
    16: [110, 41, 1, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
  },
  high: {
    8: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
    10: [76, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 76],
    12: [170, 24, 8.1, 2, 0.7, 0.3, 0.2, 0.3, 0.7, 2, 8.1, 24, 170],
    14: [420, 56, 18, 5, 1.9, 0.3, 0.2, 0.1, 0.2, 0.3, 1.9, 5, 18, 56, 420],
    16: [1000, 130, 26, 9, 4, 2, 0.3, 0.2, 0.1, 0.2, 0.3, 2, 4, 9, 26, 130, 1000],
  },
} as any;
const difficulties = ['low', 'medium', 'high'];
const numberPins = [8, 10, 12, 14, 16];
const speed = 300;

const Plinko = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { isLoggedIn, balance, realBalance, baseUrl } = useSelector((state) => state.auth);
  const { playPlinkoApi, getPlinkoHistoryApi } = useApi();

  const [loading, setLoading] = useState(false);
  const [betAmount, setBetAmount] = useState('0.00');
  const [history, setHistory] = useState<HistoryProps[]>([]);

  const [difficulty, setDifficulty] = useState('low');
  const [pins, setPins] = useState(8);

  const onDifficulty = (event: SelectChangeEvent<string>) => {
    setDifficulty(event.target.value);
  };

  const onPins = (event: SelectChangeEvent<number>) => {
    setPins(Number(event.target.value));
  };

  const getDataFromObj = (obj: any) => {
    const step = Math.floor(obj.attr('step'));
    const delta = Math.floor(obj.attr('delta'));
    const target = $('.plinkoContainer .plinko').find(`[row='${step}'][pos='${delta}']`);
    return {
      top: target.css('top'),
      left: target.css('left'),
    };
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

    try {
      setLoading(true);

      const param = {
        amount,
        difficulty,
        pins,
      };

      const res = await playPlinkoApi(param);

      if (!res?.data) return;

      if (res.data.history) {
        setTimeout(() => {
          setHistory([res.data.history, ...history]);
        }, 3000);
      }

      const s = 1 / 3 / (pins + 2);
      const css = {
        position: 'absolute',
        top: `${-100 * s}%`,
        left: '50%',
        width: `${100 * s}%`,
        // height: `${100 * s}%`,
        aspectRatio: '1/1',
        background: `hsl(${Random(0, 360)}, 90%, 60%)`,
        borderRadius: '50%',
        animationDuration: `${speed / 1000}s`,
        transform: 'translate(-50%, -125%)',
      };
      const attr = {
        step: 0,
        delta: 0,
        target: res.data.target,
      };
      const ball = $('<div>').css(css).attr(attr);
      $('.plinkoContainer .plinko').append(ball);
      const animationCallbacks = () => {
        animationCallback(ball);
      };
      ball.animate(getDataFromObj(ball), speed, animationCallbacks);
      setTimeout(
        () => {
          setLoading(false);
          resultPopup(res.data);
        },
        speed * gameData[difficulty][pins].length + 1000
      );
    } catch (error) {
      console.error('Plinko Play Error => ', error);
      setLoading(false);
    }
  };

  const animationCallback = (obj: any) => {
    obj.attr('step', Math.floor(obj.attr('step')) + 1);
    const step = Math.floor(obj.attr('step'));

    if (step !== pins + 1) {
      let heading = Math.random() < 0.5 ? 0 : 1;
      const target = Math.floor(obj.attr('target'));
      const delta = Math.floor(obj.attr('delta'));
      if (delta === target) heading = 0;
      else if (pins - step + 1 === target - delta) heading = 1;

      const pin = $('.plinkoContainer .plinko').find(
        `[row=${step - 1}][pos=${Math.floor(obj.attr('delta'))}]`
      );
      pin.addClass('pulsate');
      setTimeout(() => pin.removeClass('pulsate'), 700);

      obj.attr('delta', Math.floor(obj.attr('delta')) + heading);
      obj
        .removeAttr('heading')
        .delay(speed / 10)
        .queue(() => {
          obj.attr('heading', heading).dequeue();
        });

      const animationCallbacks = () => {
        animationCallback(obj);
      };
      obj.animate(getDataFromObj(obj), speed, animationCallbacks);
    } else {
      obj
        .removeAttr('heading')
        .delay(speed / 10)
        .queue(() => {
          obj.attr('heading', 2).dequeue();
        })
        .delay(speed)
        .queue(() => {
          obj.remove().dequeue();
        });
    }
  };

  const reset = () => {
    $('.plinkoContainer .plinko').empty();
    for (let i = 0; i <= pins; i += 1) {
      for (let j = 0; j <= i; j += 1) {
        const x = 0.5 + (j - i / 2) / (pins + 2);
        const y = (i + 1) / (pins + 2);
        const s = 1 / (i === pins ? 3 : 5) / (pins + 2);
        const isBucket = i === pins;
        const width = isBucket ? 100 * 2.2 * s + 1 : 100 * s * 1.5;
        const css = {
          position: 'absolute',
          top: `${100 * y}%`,
          left: `${100 * x}%`,
          width: `${width}%`,
          // height: `${isBucket ? 100 * 1.4 * s : 100 * s}%`,
          aspectRatio: '1/1',
          background: isBucket ? colors[pins][j][0] : '#05fff3',
          'border-bottom': isBucket ? `${width / 2}px solid ${colors[pins][j][1]}` : 'none',
          borderRadius: isBucket ? '3px' : '50%',
          transform: 'translate(-50%, -50%)',
        };
        const attr = { row: i, pos: j };
        const e = $('<div>')
          .css(css)
          .attr(attr)
          .addClass(isBucket ? 'bucket' : 'pin');
        if (isBucket)
          e.html(
            `${gameData[difficulty][pins][j] < 130 ? 'x' : ''}${gameData[difficulty][pins][j]}`
          );
        $('.plinkoContainer .plinko').append(e);
      }
    }
  };

  useEffect(() => {
    reset();
    // eslint-disable-next-line
  }, [pins, difficulty]);

  const getHistory = async () => {
    const res = await getPlinkoHistoryApi();
    if (!res?.data) return;
    setHistory(res.data);
  };

  useEffect(() => {
    getHistory();
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
      className="game-container game-plinko"
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
          Plinko Game
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
                <Typography variant="h6">Plinko Game</Typography>
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
              <Box className="game-content game-content-plinko">
                <Box className="plinkoContainer">
                  <Box className="plinko" />
                </Box>
              </Box>

              <Stack
                position="absolute"
                left={20}
                gap={3}
                sx={{
                  ...(isMobile && {
                    top: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 0.9,
                  }),
                }}
              >
                <Stack>
                  <Typography fontSize={14}>Risk</Typography>
                  <Select
                    value={difficulty}
                    onChange={onDifficulty}
                    sx={{
                      mt: 1,
                      width: 109,
                      borderRadius: 50,
                      fontSize: 16,
                      bgcolor: '#1D3E6B',
                      border: '2px solid #2B4C79',
                      '& .MuiSelect-select': {
                        py: 1,
                        px: 1.5,
                        textTransform: 'uppercase',
                      },
                    }}
                  >
                    {difficulties.map((item, index) => (
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
                <Stack>
                  <Typography fontSize={14}>Rows</Typography>
                  <Select
                    value={pins}
                    onChange={onPins}
                    sx={{
                      mt: 1,
                      width: 109,
                      borderRadius: 50,
                      fontSize: 16,
                      bgcolor: '#1D3E6B',
                      border: '2px solid #2B4C79',
                      '& .MuiSelect-select': {
                        py: 1,
                        px: 1.5,
                        textTransform: 'uppercase',
                      },
                    }}
                  >
                    {numberPins.map((item, index) => (
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
              </Stack>
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
                    disabled={loading || !pins || !difficulty}
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
                        <Typography fontSize={10}>{(row?.target || 0).toFixed(2)}x</Typography>
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

export default Plinko;
