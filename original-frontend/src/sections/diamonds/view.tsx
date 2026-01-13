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
  IconButton,
  InputBase,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Grid,
  BoxProps
} from '@mui/material';
import $ from 'jquery';
import gsap from 'gsap';
import useApi from 'src/hooks/use-api';
import { useSelector } from 'src/store';
import { chain, Random } from 'src/utils/games';
import Iconify from 'src/components/iconify';
import Timer from 'src/components/custom/Timer';
import { Diamonds1Icon, Diamonds2Icon, Diamonds3Icon } from 'src/assets/icons';
import { HistoryProps } from 'src/types';
import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';

// Types
interface BetInputProps {
  betAmount: string;
  onBetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setBetAmount: (amount: string | ((prev: string) => string)) => void;
}

interface MultiplierProps {
  multiplier: number;
  probability: number;
  pattern: number[];
}

interface MultiplierDisplayProps {
  multipliers: MultiplierProps[];
  result: ResultProps | null;
}

interface HistoryListProps {
  history: HistoryProps[];
  baseUrl: string;
}

interface ResultProps {
  color: string[];
  odds: number;
  profit: number;
  status: string;
}
// Constants
const BASE_URL = window.location.origin;
const BET_AMOUNTS = [100, 1000, 10000, 50000];
const DIAMOND_MULTIPLIERS: MultiplierProps[] = [
  { multiplier: 50.00, probability: 0.04, pattern: [1, 1, 1, 1, 1] },
  { multiplier: 5.00, probability: 1.25, pattern: [1, 1, 1, 1, 3] },
  { multiplier: 4.00, probability: 2.50, pattern: [1, 1, 1, 2, 2] },
  { multiplier: 3.00, probability: 12.49, pattern: [1, 1, 1, 3, 3] },
  { multiplier: 2.00, probability: 18.74, pattern: [1, 1, 2, 2, 3] },
  { multiplier: 0.10, probability: 49.98, pattern: [1, 1, 3, 3, 3] },
  { multiplier: 0.00, probability: 14.99, pattern: [3, 3, 3, 3, 3] }
];

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
    maxHeight: 850,
    display: 'flex',
    flexDirection: 'column',
  }
};

// Components
const BetInput = ({ betAmount, onBetChange, setBetAmount }: BetInputProps) => (
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
      onClick={() => setBetAmount((state: string) => (parseFloat(state) - 1).toFixed(2) || '0.00')}
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
      onClick={() => setBetAmount((state: string) => (parseFloat(state) + 1).toFixed(2) || '0.00')}
    >
      <Iconify icon="ic:sharp-plus" width={24} height={24} />
    </Button>
  </Stack>
);

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
      <Typography variant="h6">Diamonds Game</Typography>
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

interface DiamondsIconProps extends BoxProps {
  num: number;
}

const DiamondsIcon = ({ num, ...other }: DiamondsIconProps) => {
  if (num === 1) return <Diamonds1Icon {...other} />
  if (num === 2) return <Diamonds2Icon {...other} />
  if (num === 3) return <Diamonds3Icon {...other} />
  return null
}

const MultiplierDisplay = ({ multipliers, result }: MultiplierDisplayProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Stack width={1} justifyContent="center" alignItems="center" gap={2}  >
      {multipliers.map(({ multiplier, probability, pattern }, index: number) => (
        <Stack direction="row" key={index} width={1} gap={{ xs: 0.5, sm: 2 }}  >
          <Stack
            className="history history-diamonds"
            sx={{
              gap: 1,
              cursor: 'pointer',
              borderRadius: 50,
              flexDirection: 'row',
              alignItems: 'center',
              bgcolor: result?.odds === multiplier ? '#294A77' : '#1D3E6B',
            }}
            width={{ xs: 0.8, sm: 0.58 }}
            minWidth={232}
          >
            <Stack direction="row" width={1} gap={{ xs: 0.5, sm: 1.5 }}>
              {pattern.map((number: number, i: number) => (
                <DiamondsIcon
                  key={i}
                  num={number}
                  width={{ xs: 25, sm: 31 }}
                  height={{ xs: 18, sm: 24 }}
                />
              ))}
            </Stack>
            <Typography>
              {multiplier.toFixed(2)}x
            </Typography>
          </Stack>
          <Stack width={0.4} position="relative" >
            {result?.odds === multiplier && (
              <Box
                position="absolute"
                left={0}
                top={isMobile ? -7 : -22}
                bgcolor="#1D3E6B"
                borderRadius={1.5}
                border="1px solid #2B4C79"
                zIndex={2}
                width={1}
              >
                <Box className="left-arrow" />
                {isMobile ? (
                  <Stack p={1} gap={1} >
                    <Stack direction="row" >
                      <Typography fontSize={12} color="#ddd" >Profit :</Typography>
                      <Typography fontSize={12} fontWeight={600}>{(result?.profit || 0).toFixed(2)}</Typography>
                    </Stack>
                    <Stack direction="row" >
                      <Typography fontSize={12} color="#ddd" >Chance :</Typography>
                      <Typography fontSize={12} fontWeight={600}>{probability.toFixed(2)}%</Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack direction="row" px={3} py={1.5} gap={2} >
                    <Stack gap={1} >
                      <Typography fontSize={18}>Profit</Typography>
                      <Stack
                        px={3} py={1.2} bgcolor="#254673" borderRadius={50}
                        border="1px solid #2B4C79" >
                        <Typography fontSize={18} fontWeight={600}>{(result?.profit || 0).toFixed(2)}</Typography>
                      </Stack>
                    </Stack>
                    <Stack gap={1} >
                      <Typography fontSize={18}>Chance</Typography>
                      <Stack
                        px={3} py={1.2} bgcolor="#254673" borderRadius={50}
                        border="1px solid #2B4C79" direction="row" justifyContent="space-between" >
                        <Typography fontSize={18} fontWeight={600}>{probability.toFixed(2)}</Typography>
                        <Typography fontSize={18} fontWeight={600}>%</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                )}
              </Box>
            )}
          </Stack>
        </Stack>
      ))}
    </Stack>
  )
};

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

const DiamondsView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { playDiamondsApi, getDiamondsHistoryApi } = useApi();
  const { balance, realBalance, isLoggedIn, baseUrl } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [betAmount, setBetAmount] = useState<string>('0.00');
  const [history, setHistory] = useState<HistoryProps[]>([]);
  const [result, setResult] = useState<ResultProps | null>(null);

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

    clear();
    setLoading(true);
    const res = await playDiamondsApi(amount);
    setLoading(false);

    if (!res?.data) return;

    chain(5, 200, (i: number) => {
      setDiamond(
        i,
        res.data.color[i - 1],
        $.grep(res.data.color, (e) => e === res.data.color[i - 1]).length >= 2
      );
      if (i === 5) {
        setLoading(false);
        // resultPopup(res.data);
        setResult(res.data);
      }
    });

    if (res.data.history) {
      setHistory([res.data.history, ...history]);
    }
  };

  const setDiamond = (slot: number, color: string, highlight: boolean) => {
    $('.game-container')
      .find(`[data-diamonds-slot='${slot}']`)
      .addClass('dropShadow')
      .addClass(highlight ? color : '')
      .append(`<img src='${BASE_URL}/assets/icons/diamonds/${color}.svg' alt>`)
      .hide()
      .fadeIn(300);

    const down = () => {
      gsap.to(`[data-diamonds-slot='${slot}'] img`, {
        duration: 0.45,
        y: '+=4px',
        rotate: 0.2 + Random(1, 2) / 10,
        ease: 'sine.out',
        onComplete: up,
      });
      gsap.to(`[data-shadow-id='${slot}']`, {
        scale: 0.95,
        duration: 0.45,
        ease: 'sine.out',
      });
    };

    const up = () => {
      gsap.to(`[data-diamonds-slot='${slot}'] img`, {
        duration: 0.4,
        y: '-=4px',
        rotate: 0.1 - Random(1, 2) / 10,
        ease: 'sine.out',
        onComplete: down,
      });
      gsap.to(`[data-shadow-id='${slot}']`, {
        scale: 0.9,
        duration: 0.4,
        ease: 'sine.out',
      });
    };

    up();
  };

  const clear = () => {
    gsap.killTweensOf([
      `[data-diamonds-slot='1'] img`,
      `[data-diamonds-slot='2'] img`,
      `[data-diamonds-slot='3'] img`,
      `[data-diamonds-slot='4'] img`,
      `[data-diamonds-slot='5'] img`,
      `[data-shadow-id='1']`,
      `[data-shadow-id='2']`,
      `[data-shadow-id='3']`,
      `[data-shadow-id='4']`,
      `[data-shadow-id='5']`,
    ]);
    $('.game-container')
      .find(`[data-diamonds-slot]`)
      .attr('class', '')
      .find('img')
      .fadeOut(300, function () {
        $(this).remove();
      });
  };

  const getHistory = async () => {
    const res = await getDiamondsHistoryApi();
    if (!res?.data) return;
    setHistory(res.data);
  };

  useEffect(() => {
    getHistory();
  }, []);


  return (
    <Stack className="game-container" sx={styles.gameContainer}>
      <Stack sx={styles.header}>
        <Link to="/" style={{ textDecoration: 'none', color: '#8199B4', fontSize: 14 }}>
          Home
        </Link>
        <Iconify icon="lsicon:right-filled" sx={{ color: '#8199B4', fontSize: 16 }} />
        <Typography fontSize={14} fontWeight={500} noWrap>
          Diamonds Game
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
                    <Stack
                      className="game-container game-diamonds"
                      sx={{
                        width: 1,
                      }}
                    >
                      <Stack
                        className="game-content game-content-diamonds"
                        sx={{
                          p: { xs: 1, sm: 3 },
                          width: 1,
                          position: 'relative',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Stack
                          direction="row"
                          sx={{
                            width: 1,
                          }}
                        >
                          <MultiplierDisplay multipliers={DIAMOND_MULTIPLIERS} result={result} />
                        </Stack>
                        <Box className="diamonds-grid" width={1} justifyContent="center" alignItems="flex-end" height={130}>
                          {[1, 2, 3, 4, 5].map((slot) => (
                            <Box key={slot} data-diamonds-slot={slot} >
                              <Box className="shadow" data-shadow-id={slot} />
                            </Box>
                          ))}
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>

            <Stack p={3} gap={3} bgcolor="#1D3E6B">
              {isMobile && <Stack alignItems="center"><BetInput betAmount={betAmount} onBetChange={onBetChange} setBetAmount={setBetAmount} /></Stack>}

              <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                {BET_AMOUNTS.slice(0, 2).map((amount) => (
                  <Button
                    key={amount}
                    variant="contained"
                    color="primary"
                    sx={styles.betButton}
                    onClick={() => setBetAmount(amount.toFixed(2))}
                  >
                    {amount.toLocaleString()}
                  </Button>
                ))}

                {!isMobile && <BetInput betAmount={betAmount} onBetChange={onBetChange} setBetAmount={setBetAmount} />}

                {BET_AMOUNTS.slice(2).map((amount) => (
                  <Button
                    key={amount}
                    variant="contained"
                    color="primary"
                    sx={styles.betButton}
                    onClick={() => setBetAmount(amount.toFixed(2))}
                  >
                    {amount.toLocaleString()}
                  </Button>
                ))}

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
    </Stack>
  );
};

export default DiamondsView;
