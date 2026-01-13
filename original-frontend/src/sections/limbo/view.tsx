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
} from '@mui/material';
import $ from 'jquery';
import useApi from 'src/hooks/use-api';
import { useSelector } from 'src/store';
import Iconify from 'src/components/iconify';
import Timer from 'src/components/custom/Timer';
import { resultPopup } from 'src/utils/games';
import { HistoryProps } from 'src/types';
import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';

import Limbo1 from 'src/assets/images/games/limbo1.png';
import Limbo2 from 'src/assets/images/games/limbo2.png';
import Rocket from 'src/assets/images/games/rocket.png';
import Mountain from 'src/assets/images/games/mountain.png';

// Types
interface BetInputProps {
  betAmount: string;
  onBetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setBetAmount: (amount: string | ((prev: string) => string)) => void;
  isMobile?: boolean;
}

interface HistoryListProps {
  history: HistoryProps[];
  baseUrl: string;
}

interface ResultProps {
  status: string;
  payout: number;
}

// Constants
const BET_AMOUNTS = [100, 1000, 10000, 50000];

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
    maxHeight: 900,
    display: 'flex',
    flexDirection: 'column',
  },
  actionButton: {
    bgcolor: '#1D3E6B',
    border: '2px solid #2B4C79',
    fontSize: 14,
  },
};

// Components
const BetInput = ({ betAmount, onBetChange, setBetAmount, isMobile }: BetInputProps) => (
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
      <Typography variant="h6">Limbo Game</Typography>
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
  </>
);

const LimboView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { playLimboApi, getLimboHistoryApi } = useApi();
  const { balance, isLoggedIn, realBalance, baseUrl } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [multiplier, setMultiplier] = useState<string>("2.00");
  const [betAmount, setBetAmount] = useState<string>('0.00');
  const [payout, setPayout] = useState(1);
  const [history, setHistory] = useState<HistoryProps[]>([]);

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

    if (parseFloat(multiplier) < 1) {
      toast.error('Target must be greater than 1');
      return;
    }
    setLoading(true);

    const param = {
      amount,
      multiplier: parseFloat(multiplier),
    };
    const res = await playLimboApi(param);
    setLoading(false);
    if (!res?.data) return;

    const { data } = res;
    const win = data.status === 'WIN';
    setPayout(data.payout);

    $('.rocket-wrap').addClass('flying');
    $('.rocket-payout').attr('class', 'rocket-payout');
    $('.counter').attr('class', 'counter');
    $('.rocket-wrap').addClass('flying');
    setTimeout(() => {
      $('.rocket-wrap, .rocket-boom').addClass('boom');
      resultPopup(data);
      setTimeout(() => {
        $('.rocket-payout, .counter')
          .toggleClass('text-danger', !win)
          .toggleClass('text-success', win);
        $('.rocket-wrap').removeClass('flying').removeClass('boom');
        $('.rocket-boom').removeClass('boom');
        setLoading(false);
      }, 400);
    }, 200);

    setTimeout(() => {
      $('.counter').each(function () {
        const size = $(this).text().split('.')[1] ? $(this).text().split('.')[1].length : 0;
        $(this)
          .prop('Counter', 0)
          .animate(
            { Counter: $(this).text() },
            {
              duration: 600,
              step: (func: any) => {
                $(this).text(parseFloat(func).toFixed(size));
              },
            }
          );
      });
    }, 100);

    setHistory([data.history, ...history]);
  };

  const getHistory = async () => {
    const res = await getLimboHistoryApi();
    if (!res?.data) return;
    setHistory(res.data);
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <Stack sx={styles.gameContainer}>
      <Stack sx={styles.header}>
        <Link to="/" style={{ textDecoration: 'none', color: '#8199B4', fontSize: 14 }}>
          Home
        </Link>
        <Iconify icon="lsicon:right-filled" sx={{ color: '#8199B4', fontSize: 16 }} />
        <Typography fontSize={14} fontWeight={500} noWrap>
          Limbo Game
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8} sm={8.5}>
          <Box sx={styles.gameBox}>
            <GameHeader />

            <Stack
              sx={{
                width: 1,
                p: 2,
                height: 0.6,
                maxHeight: 565,
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Stack
                className="game-container game-limbo"
                sx={{
                  width: 1,
                }}
              >
                <Stack
                  sx={{
                    position: 'relative',
                    width: 1,
                    height: '60vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box className="game-content game-content-limbo" minHeight={530}>
                    <Box className="limbo-canvas">
                      <img src={Limbo1} className="cloud cloud-r" alt="" />
                      <img src={Limbo2} className="cloud cloud-d" alt="" />
                      <img src={Limbo1} className="cloud cloud-v" alt="" />
                      <img src={Limbo2} className="cloud cloud-g" alt="" />
                      <img src={Mountain} className="limbo-bg" alt="" />
                      <Box className="bg-star show-1">
                        <Box className="l-star e-r" />
                        <Box className="l-star s-p" />
                        <Box className="l-star r-p" />
                      </Box>
                      <Box className="game-rocket notranslate">
                        <Box className="rocket-number">
                          <span className="rocket-payout">
                            <span className="counter">{payout.toFixed(2)}</span>x
                          </span>
                          <Box className="rocket-boom" />
                        </Box>
                        <Box className="rocket-wrap fire">
                          <Box className="rocket-img">
                            <img src={Rocket} alt="" />
                          </Box>
                          <Box className="rocket-fire" />
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
                  p: '10px !important',
                  bgcolor: 'secondary.main',
                  border: '1px solid #2B4C79',
                  borderRadius: 1.5,
                }}
              >
                <Stack maxWidth={500} width={1} mx="auto">
                  <Typography sx={{ fontSize: 11 }}>Target</Typography>
                  <Stack direction="row" width={1}>
                    <InputBase
                      value={multiplier}
                      onChange={(e) => setMultiplier(e.target.value)}
                      placeholder="0.00"
                      type="number"
                      error={parseFloat(multiplier) <= 1 || true}
                      inputProps={{ step: 0.01, min: 0 }}
                      sx={{
                        width: 1,
                        px: 1.25,
                        py: 0.1,
                        borderRadius: 1,
                        height: 40,
                        bgcolor: '#0f212e',
                        border: '2px solid #2f4553',
                      }}
                    />

                    <Stack sx={{ flexDirection: 'row', gap: 0.1 }}>
                      <IconButton
                        color="inherit"
                        sx={{ ...styles.actionButton, borderRadius: 1 }}
                        onClick={() => {
                          if (parseFloat(multiplier) > 1)
                            setMultiplier((state) => (parseFloat(state) / 2).toFixed(2) || '0');
                        }}
                      >
                        1/2
                      </IconButton>
                      <IconButton
                        color="inherit"
                        sx={{ ...styles.actionButton, borderRadius: 1 }}
                        onClick={() =>
                          setMultiplier((state) => (parseFloat(state) * 2).toFixed(2) || '0')
                        }
                      >
                        2X
                      </IconButton>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Stack p={3} gap={3} bgcolor="#1D3E6B">
              {isMobile && <Stack alignItems="center"><BetInput betAmount={betAmount} onBetChange={onBetChange} setBetAmount={setBetAmount} isMobile={isMobile} /></Stack>}

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
                  sx={styles.actionButton}
                  disabled
                >
                  <Iconify icon="ic:twotone-bar-chart" width={20} height={20} />
                </IconButton>
                <IconButton
                  color="inherit"
                  sx={styles.actionButton}
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
                  sx={styles.actionButton}
                  onClick={() => setBetAmount((Number(betAmount) / 2).toFixed(2))}
                >
                  1/2
                </IconButton>
                <IconButton
                  color="inherit"
                  sx={styles.actionButton}
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

export default LimboView;
