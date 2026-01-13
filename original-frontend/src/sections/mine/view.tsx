import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import moment from 'moment';
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
  Select,
  MenuItem,
  toggleButtonGroupClasses,
  styled,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
} from '@mui/material';


import useApi from 'src/hooks/use-api';
import { useSelector } from 'src/store';
import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';

import Iconify from 'src/components/iconify';
import Timer from 'src/components/custom/Timer';
import { BombSvg } from 'src/components/svgs';

import { HistoryProps, TabPanelProps } from 'src/types';
import { GAME_STATUS, MINE_OBJECT, MineArea } from './types';
import MineButton from './button';
import MineModal from './modal';

export const MINE_API = '/mine';

function calculateMinesGame(mines: number, picks: number, bet: string | number): any {
  const totalSlots = 25; // Total number of slots
  const safeSlots = totalSlots - mines; // Slots without mines

  // Function to calculate factorial
  function factorial(n: number): number {
    let value = 1;

    // eslint-disable-next-line
    for (let i = 2; i <= n; i++) {
      value *= i;
    }
    return value;
  }

  // Function to calculate combinations
  function combination(n: number, k: number): number {
    if (k > n || k < 0 || n < 0) return 0;
    return factorial(n) / (factorial(k) * factorial(n - k));
  }

  // Calculate total combinations and safe combinations
  const totalCombinations = combination(totalSlots, picks);
  const safeCombinations = combination(safeSlots, picks);

  // Guard against division by zero
  if (safeCombinations === 0 || totalCombinations === 0) {
    return {
      probability: 0,
      roundedLossAmount: 0,
      roundedChance: 0,
      roundedWinAmount: 0,
    };
  }

  // Calculate probability and other metrics
  let probability = 0.99 * (totalCombinations / safeCombinations);
  probability = Math.round(probability * 100) / 100;

  const winAmount = Number(bet) * probability;
  const roundedWinAmount = Math.round(winAmount * 100000000) / 100000000;

  // Guard against division by zero
  const lossAmount = probability !== 1 ? 100 / (probability - 1) : 0;
  const roundedLossAmount = Math.round(lossAmount * 100) / 100;

  const chance = probability !== 0 ? 99 / probability : 0;
  const roundedChance = Math.round(chance * 100000) / 100000;

  // Log results if conditions are met
  if (mines + picks <= totalSlots && picks > 0 && mines > 0) {
    if (mines && picks) {
      return {
        probability,
        roundedLossAmount,
        roundedChance,
        roundedWinAmount,
      };
    }
  }
  return {
    probability: 0,
    roundedLossAmount: 0,
    roundedChance: 0,
    roundedWinAmount: 0,
  };
}

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

const MineGame: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { isLoggedIn, balance, realBalance, baseUrl } = useSelector((state) => state.auth);

  const { getMineApi, playMineApi, betMineApi, cashoutMineApi, autoBetMineApi, getMineHistoryApi } =
    useApi();

  const [betTab, setBetTab] = useState<TabPanelProps>('manual');

  const [mineCount, setMineCount] = useState<number>(3);
  const [betAmount, setBetAmount] = useState('0.00');
  const [status, setStatus] = useState<GAME_STATUS>(GAME_STATUS.READY);
  const [loading, setLoading] = useState(false);
  const [mineAreas, setMineAreas] = useState<MineArea[]>([]);
  const [autoAreas, setAutoAreas] = useState<MineArea[]>([]);

  const [history, setHistory] = useState<HistoryProps[]>([]);

  const statusRef = useRef<any>();
  const [resultVisible, setResultVisible] = useState(false);
  const [autoBetCount, setAutoBetCount] = useState(0);
  const [isInfinity, setInfinity] = useState(false);
  const [stopProfitA, setStopProfitA] = useState(0);
  const [stopLossA, setStopLossA] = useState(0);
  const [areaFlag, setAreaFlag] = useState(true);

  const [totalProfit, setProfitA] = useState<number>(0);
  const [totalLoss, setLossA] = useState<number>(0);

  const [result, setResult] = useState({
    odds: 0,
    profit: 0,
  });

  const profitAndOdds = calculateMinesGame(mineCount, mineAreas.length, betAmount);
  const resetGame = () => {
    setResultVisible(false);
    setMineAreas([]);
    setStatus(GAME_STATUS.READY);
    setLoading(false);
  };

  const checkActiveGame = async () => {
    const res = await getMineApi();
    if (!res?.data) return;
    if (res?.data.success) {
      const { datas, amount, mines } = res.data;
      setStatus(GAME_STATUS.LIVE);
      setMineAreas(datas);
      setBetAmount(amount);
      setMineCount(mines);
    }
  };

  const changeHistory = (param: HistoryProps) => {
    let ss = false;
    const updated = history.map((item) => {
      if (item._id === param._id) {
        ss = true;
        return param;
      }
      return item;
    });
    if (!ss) {
      setHistory([param, ...history]);
      return;
    }
    setHistory(updated);
  };

  const createBet = async () => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }

    if (loading) return;

    const amount = Number(betAmount);

    if (!validateBetAmount(amount, balance)) {
      return;
    }

    resetGame();
    setLoading(true);

    const param = {
      mines: mineCount,
      amount: Number(betAmount),
    };
    const res = await playMineApi(param);
    setLoading(false);
    if (!res?.data) return;
    if (res?.data.status === 'BET') {
      setStatus(GAME_STATUS.LIVE);
      if (res.data?.history) {
        changeHistory(res.data.history);
      }
      return;
    }
    checkActiveGame();
  };

  const selectArea = async (point: number) => {
    if (GAME_STATUS.LIVE === status) return;
    const autoIndex = autoAreas.findIndex((m: MineArea) => m.point === point);
    if (autoIndex === -1) {
      setAutoAreas((prev) => [...prev, { point, mine: null, mined: false }]);
    } else {
      setAutoAreas([...autoAreas.filter((m: MineArea, index: number) => index !== autoIndex)]);
    }
  };

  const placeBet = async (point: number) => {
    if (GAME_STATUS.READY === status) return;
    const mine = mineAreas.find((m: MineArea) => m.point === point);
    if (mine) return;

    setLoading(true);

    setMineAreas((prev) => [...prev, { point, mine: null, mined: false }]);

    const res = await betMineApi(point);
    if (!res?.data) return;

    const { data } = res;
    if (data.status === 'BET') {
      setMineAreas((prev) =>
        prev.map((m) => (m.point === point ? { ...m, mine: MINE_OBJECT.GEM, mined: true } : m))
      );
    } else if (data.status === 'END') {
      if (data.datas.findIndex((m: any) => !m.mined || m.mine === MINE_OBJECT.BOMB) === -1) {
        console.log(data.datas, '===>result');
        setResult({
          odds: profitAndOdds.probability,
          profit: profitAndOdds.roundedWinAmount,
        });
        setResultVisible(true);
      }
      setMineAreas(data.datas);
      if (data?.history) {
        changeHistory(data.history);
      }
      setStatus(GAME_STATUS.READY);
    } else {
      checkActiveGame();
    }
    setLoading(false);
  };

  const cashout = async () => {
    if (status !== GAME_STATUS.LIVE || loading || mineAreas.length === 0) return;
    setLoading(true);
    const res = await cashoutMineApi();
    if (!res?.data) return;
    setLoading(false);
    if (res.data.status === 'END') {
      setResult({
        odds: profitAndOdds.probability,
        profit: profitAndOdds.roundedWinAmount,
      });
      setMineAreas(res.data.datas);
      setStatus(GAME_STATUS.READY);
      setResultVisible(true);
      if (res.data?.history) {
        changeHistory(res.data.history);
      }
      return;
    }
    checkActiveGame();
  };

  const randomBet = async () => {
    const excludeArray = mineAreas.map((m) => m.point);
    const allNumbers: number[] = Array.from({ length: 25 }, (_, i) => i); // Creates an array [0, 1, 2, ..., 24]
    const availableNumbers = allNumbers.filter((num) => !excludeArray.includes(num)); // Exclude numbers

    if (availableNumbers.length === 0) {
      throw new Error('No available numbers to choose from');
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    placeBet(availableNumbers[randomIndex]);
  };

  const onBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === GAME_STATUS.READY) {
      setBetAmount(e.target.value);
    }
  };

  useEffect(() => {
    handleBetChange(betAmount, realBalance, setBetAmount);
  }, [betAmount, realBalance]);

  const handleChangeTab = (event: React.MouseEvent<HTMLElement>, newValue: TabPanelProps) => {
    if (status === GAME_STATUS.READY) {
      setBetTab(newValue);
      resetGame();
    }
  };

  // const handleBetCount = (value: number) => {
  //   const count = value;
  //   if (count >= 0) {
  //     setAutoBetCount(value);
  //   }
  //   setInfinity(count === 0);
  // };

  useEffect(() => {
    checkActiveGame();
  }, []);

  // ------------------- auto -----------------------

  // Function to start auto betting
  const autoBet = () => {
    if (loading) return;
    setLoading(true);
    setInfinity(autoBetCount === 0);
    setStatus(GAME_STATUS.LIVE);
  };

  // Function to stop auto betting
  const stopBet = () => {
    setLoading(false);
    setStatus(GAME_STATUS.READY);
  };

  // Function to handle the betting loop
  const runTimeBet = async () => {
    if (statusRef.current === GAME_STATUS.READY) return;

    setMineAreas([...autoAreas]);

    const param = {
      points: autoAreas.map((a) => a.point),
      mines: mineCount,
      amount: Number(betAmount),
    };

    const res = await autoBetMineApi(param);
    if (!res?.data) {
      stopBet();
      return;
    }

    if (res.data.status === 'END') {
      const minedBombIndex = res.data.datas.findIndex(
        (m: any) => m.mined && m.mine === MINE_OBJECT.BOMB
      );
      if (minedBombIndex === -1) {
        const _profitAndOdds = calculateMinesGame(mineCount, autoAreas.length, 1);

        setResult({
          odds: _profitAndOdds.probability,
          profit: _profitAndOdds.roundedWinAmount,
        });
        setResultVisible(true);
        if (stopProfitA !== 0) {
          setProfitA((prevCount) => {
            if (prevCount + Number(betAmount) >= stopProfitA) {
              stopBet();
              return 0;
            }
            return prevCount + Number(betAmount);
          });
        }
      } else if (stopLossA !== 0) {
        setLossA((prevCount) => {
          if (prevCount + Number(betAmount) >= stopLossA) {
            stopBet();
            return 0;
          }
          return prevCount + Number(betAmount);
        });
      }
      setMineAreas(res.data.datas);

      if (res.data?.history) {
        changeHistory(res.data.history);
      }
    } else {
      stopBet();
    }

    console.log(
      isInfinity,
      autoBetCount,
      '=====autobet======',
      stopLossA,
      stopProfitA,
      '---',
      totalProfit,
      totalLoss
    );
    if (isInfinity) {
      setTimeout(() => {
        setResultVisible(false);
        setMineAreas([]);
        setTimeout(() => {
          runTimeBet();
        }, 1000);
      }, 1500);
    } else if (autoBetCount > 0) {
      setTimeout(() => {
        setResultVisible(false);
        setMineAreas([]);
        setAutoBetCount((prevCount) => {
          const newCount = prevCount > 0 ? prevCount - 1 : prevCount;
          if (newCount === 0) {
            stopBet(); // Stop betting when no more bets are left
          }
          return newCount;
        });
      }, 1500);
    } else {
      stopBet(); // Stop betting if the conditions aren't met
    }
  };

  // Automatically trigger the betting loop when autoBetCount or isAutoRun changes
  useEffect(() => {
    if (status === GAME_STATUS.LIVE && betTab === 'auto') {
      setTimeout(runTimeBet, 1000); // Adjust delay as needed
    }
  }, [status, betTab, autoBetCount]);

  // -------------auto end ---------------------//

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (autoAreas.length > 0) {
      setAreaFlag(true);
    }
  }, [autoAreas]);

  const getHistory = async () => {
    const res = await getMineHistoryApi();
    if (!res?.data) return;
    setHistory(res.data);
  };

  useEffect(() => {
    getHistory();
  }, []);

  const disabled = GAME_STATUS.LIVE === status || loading;
  const isAuto = betTab === 'auto';

  const disabledbtn = (!isAuto && loading) || (isAuto && autoAreas.length === 0);

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
        disabled={disabled}
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
        disabled={disabled}
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
        disabled={disabled}
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
          Mine Game
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
                <Typography variant="h6">Mine Game</Typography>
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
              <div className="flex w-full justify-center items-center">
                <div
                  className={` ${
                    isMobile ? 'flex flex-col  items-center' : 'flex'
                  } w-full h-full max-w-[1300px] rounded-md py-3 overflow-hidden justify-center `}
                >
                  {/* Main content */}
                  <div className={`${isMobile ? 'w-[300px]' : 'w-[400px]  p-5'} relative`}>
                    <div
                      className={`grid grid-cols-5 gap-2.5 p-1.5 ${
                        !areaFlag ? 'animate-bounding2' : ''
                      } `}
                    >
                      {[...Array(25)].map((_, index) => {
                        const mine = mineAreas.find((m) => m.point === index);
                        const auto = isAuto
                          ? autoAreas.findIndex((m) => m.point === index) !== -1
                          : false;
                        return (
                          <div
                            key={index}
                            className={`overflow-hidden max-h-[126px] ${
                              mineAreas.length === 0 ? 'animate-zoomIn' : ''
                            } `}
                          >
                            <MineButton
                              point={index}
                              mine={mine}
                              isAuto={auto}
                              onClick={isAuto ? selectArea : placeBet}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <MineModal
                      visible={resultVisible}
                      data={{
                        odds: result.odds,
                        profit: result.profit,
                        coin: null,
                      }}
                    />
                  </div>
                </div>
              </div>
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
                {isAuto || status === GAME_STATUS.READY ? (
                  <Stack direction="row" alignItems="center" gap={2}>
                    <Typography>Mines</Typography>
                    <Select
                      fullWidth
                      disabled={disabled}
                      value={mineCount}
                      onChange={(e) => setMineCount(Number(e.target.value))}
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
                      {[...Array(22)].map((_, index) => (
                        <MenuItem
                          key={index}
                          value={3 + index}
                          disabled={loading}
                          sx={{
                            textTransform: 'uppercase',
                          }}
                        >
                          {3 + index}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                ) : (
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Typography fontSize={14} color="#A9C1DC">
                        Mines:
                      </Typography>
                      <Typography fontSize={14}>{mineCount}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Typography fontSize={14} color="#A9C1DC">
                        Games:
                      </Typography>
                      <Typography>{25 - mineCount - mineAreas.length}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Typography fontSize={14} color="#A9C1DC">
                        Profit {`(${profitAndOdds.probability}x)`}:
                      </Typography>
                      <Typography fontSize={14}>{profitAndOdds.roundedWinAmount}</Typography>
                    </Stack>
                    <IconButton
                      color="success"
                      sx={{
                        fontSize: 16,
                        bgcolor: '#1D3E6B',
                        border: '2px solid #2B4C79',
                      }}
                      title="Pick Random"
                      onClick={randomBet}
                    >
                      <Iconify icon="mdi:luck" width={20} height={20} />
                    </IconButton>
                  </Stack>
                )}
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
                  disabled={disabled}
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
                  disabled={disabled}
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
                  disabled={disabled}
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
                  disabled={disabled}
                  onClick={() => setBetAmount('50000.00')}
                >
                  50,000
                </Button>
              </Stack>

              {isAuto && (
                <Stack direction="row" gap={1}>
                  <TextField
                    type="number"
                    fullWidth
                    label="Stop on Profit"
                    value={stopProfitA}
                    disabled={disabled}
                    onChange={(e) => setStopProfitA(Number(e.target.value))}
                    sx={{
                      bgcolor: '#0C1F3A',
                      border: '2px solid #2B4C79',
                      borderRadius: 50,
                      fontSize: 14,
                      '& fieldset': {
                        border: 0,
                        borderRadius: 50,
                      },
                    }}
                  />
                  <TextField
                    type="number"
                    fullWidth
                    label="Stop on Loss"
                    value={stopLossA}
                    disabled={disabled}
                    onChange={(e) => setStopLossA(Number(e.target.value))}
                    sx={{
                      bgcolor: '#0C1F3A',
                      border: '2px solid #2B4C79',
                      borderRadius: 50,
                      fontSize: 14,
                      '& fieldset': {
                        border: 0,
                        borderRadius: 50,
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
                    color={status === GAME_STATUS.LIVE ? 'error' : 'primary'}
                    sx={{
                      py: 1,
                      px: 3,
                      width: 230,
                      borderRadius: 50,
                      gap: 1,
                      fontSize: { xs: 14, sm: 18 },
                    }}
                    disabled={disabledbtn}
                    onClick={() => {
                      console.log(isAuto, '==.isAuto', status);

                      if (loading) return;
                      if (!isAuto) {
                        if (status === GAME_STATUS.LIVE) {
                          cashout();
                        } else {
                          createBet();
                        }
                      } else if (status === GAME_STATUS.LIVE) {
                        stopBet();
                      } else {
                        autoBet();
                      }
                    }}
                  >
                    {(status === GAME_STATUS.LIVE && (isAuto ? 'Stop (A)' : 'CASHOUT')) ||
                      (isAuto ? 'Start (A)' : 'BET')}
                    {loading && (
                      <div className="h-6 flex items-center justify-center animate-zoom">
                        <BombSvg />
                      </div>
                    )}
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
                  disabled={disabled}
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
                  disabled={disabled}
                >
                  2X
                </IconButton>

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
                          {(row?.payout || 0).toFixed(2)}
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

export default MineGame;
