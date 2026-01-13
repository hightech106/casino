import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import toast from 'react-hot-toast';
import {
  Typography,
  Avatar,
  CardContent,
  Card,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
  Box,
  Chip,
  IconButton,
  Button,
  toggleButtonGroupClasses,
  styled,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
} from '@mui/material';
import useApi from 'src/hooks/use-api';
import { useSelector } from 'src/store';
import { IRoulette } from 'src/contexts/type';

import Timer from 'src/components/custom/Timer';
import Iconify from 'src/components/iconify';

import ChipButtonGroup from 'src/components/custom/ChipButtonGroup';

import { HistoryProps, TabPanelProps } from 'src/types';

import chipBoard from 'src/assets/images/games/chipboard.svg';

import { CHIP_VALUES, enableSound, playAudio, WHEELNUMBERS } from './config';
import { RouletteCanvas } from './engin';
import ResultModal from './modal';

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

type ChipIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const RouletteGame = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { createRouletteApi, betRouletteApi, getRouletteHistoryApi } = useApi();

  const { balance, isLoggedIn, realBalance, baseUrl } = useSelector((state) => state.auth);

  const [betTab, setBetTab] = useState<TabPanelProps>('manual');

  const [chipValue, selectChip] = useState<ChipIndex>(0);
  const [outcomeNumber, setOutComeNumber] = useState<number>(-1);
  const [bets, setBets] = useState<IRoulette[]>([]);
  const [selectHover, setSelectHover] = useState<string | number | null>(null);
  const [totalBet, setTotalBet] = useState(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isWheeling, setIsWheeling] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [clientSeed, setClientSeed] = useState<string>('');
  const [serverSeed, setServerSeed] = useState<string>('');
  const [serverSeedHash, setServerSeedHash] = useState<string>('');

  const [profit, setProfit] = useState<number>(0);
  const [lossAmount, setLossAmount] = useState<number>(0);
  const [autoBetCount, setAutoBetCount] = useState<number>(0);

  const [stopProfitA, setStopProfitA] = useState<number>(0);
  const [stopLossA, setStopLossA] = useState<number>(0);
  const [sumProfit, setSumProfit] = useState(0);
  const [sumLost, setSumLost] = useState(0);
  const [stoppedAutobet, setStoppedAutobet] = useState(false);
  const [autoBetting, setAutoBetting] = useState(false);

  const [history, setHistory] = useState<HistoryProps[]>([]);

  const isAuto = betTab === 'auto';

  const disabled = loading || isWheeling || autoBetting;

  const handleClickBet = () => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }

    if ((disabled && !isAuto) || (!!isAuto && stoppedAutobet)) return;
    if (!isAuto) {
      placeBet();
    } else if (autoBetting) {
      setStoppedAutobet(true);
    } else {
      startAutoBet();
    }
  };

  const handleChangeTab = (event: React.MouseEvent<HTMLElement>, newValue: TabPanelProps) => {
    setBetTab(newValue);
  };

  const startBet = async () => {
    setLoading(true);
    setServerSeed('');
    const res = await createRouletteApi(clientSeed);
    if (!res?.data) return;
    if (res.data.status) {
      setClientSeed(res.data.clientSeed);
      setServerSeedHash(res.data.serverHash);
    }
    setLoading(false);
  };

  const placeBet = async () => {
    if (bets.length === 0) {
      toast.error('Please place a bet');
      return;
    }
    if (balance < totalBet) {
      toast.error('Your Balance is not enough!');
      return;
    }
    setLoading(true);
    setShowResult(false);
    const res = await betRouletteApi(bets);
    if (!res?.data) {
      setLoading(false);
      return;
    }
    const { data } = res;
    if (data.status) {
      setIsWheeling(true);
      setOutComeNumber(data.outcome);
      setServerSeedHash(data.serverHash);
      setClientSeed(data.clientSeed);
      setServerSeed(data.serverSeed);
      setProfit(data.profit);
      setLossAmount(data.lossAmount);
      playAudio('bet');
    }

    if (data?.history) {
      setHistory([data.history, ...history]);
    }

    setLoading(false);
  };

  const startAutoBet = () => {
    if (bets.length) {
      setAutoBetting(true);
      setStoppedAutobet(false);
      if (!autoBetCount) setAutoBetCount(Infinity);
      if (!stopProfitA) setStopProfitA(Infinity);
      if (!stopLossA) setStopLossA(Infinity);
      setSumProfit(0);
      setSumLost(0);
      placeBet();
    } else {
      toast.error('Please place a bet');
      setAutoBetting(false);
    }
  };

  useEffect(() => {
    if (showResult && isAuto) {
      const sumP = sumProfit + profit;
      const sumL = lossAmount > 0 ? sumLost + lossAmount : sumLost;
      setSumProfit(sumP);
      setSumLost(sumL);
      console.log(autoBetCount > 0, sumLost < stopLossA, sumP < stopProfitA, !stoppedAutobet);
      if (autoBetCount > 0 && sumL < stopLossA && sumP < stopProfitA && !stoppedAutobet) {
        setTimeout(() => {
          setAutoBetCount(autoBetCount - 1);
          if (autoBetCount) {
            placeBet();
          }
          setShowResult(false);
        }, 2500);
      } else {
        setAutoBetting(false);
        setStoppedAutobet(false);
      }
    }
  }, [showResult, isAuto]);

  const cancelBet = () => {
    if (disabled) return;
    const bet = bets.pop();
    setTotalBet(totalBet - (bet?.amount || 0));
    setBets([...bets]);
  };

  const clearBet = () => {
    if (disabled) return;
    setBets([]);
    setTotalBet(0);
  };

  const handleHoverPlace = (id: string | number | null) => {
    if (disabled) return;
    setSelectHover(id);
  };

  const handlePlaceBet = (id: string | number) => {
    if (disabled) return;
    setBets([...bets, { placeId: id, amount: CHIP_VALUES[chipValue] }]);
    playAudio('bet');
    setTotalBet(totalBet + CHIP_VALUES[chipValue]);
  };

  const renderPlace = (position: number, index: number) => {
    const number = isMobile
      ? position + 1 + 12 * index
      : (position + 1) * 3 - 13 * Math.floor(position / 4) + 12 * index;
    const odd = Math.ceil(number / 9) % 2 === 0;
    let color = (odd && (number % 2 ? 0 : 1)) || (number % 2 ? 1 : 0);
    const origincolor = color;
    if (number === 28 || number === 10) {
      color = 0;
    }
    let hover = false;
    if (selectHover) {
      if (typeof selectHover === 'number') {
        hover = number === selectHover;
      } else if (typeof selectHover === 'string') {
        if (selectHover.includes('_to_')) {
          const n = selectHover.split('_to_');
          const start = Number(n[0]);
          const end = Number(n[1]);
          hover = start <= number && end >= number;
        } else if (selectHover.includes('Red')) {
          hover = color === 1;
        } else if (selectHover.includes('Black')) {
          hover = color === 0;
        } else if (selectHover.includes('Odd')) {
          if (odd) {
            hover = origincolor === 0;
          } else {
            hover = origincolor === 1;
          }
        } else if (selectHover.includes('Even')) {
          if (odd) {
            hover = origincolor === 1;
          } else {
            hover = origincolor === 0;
          }
        } else if (selectHover.includes('2:1')) {
          const num = selectHover.split(':');
          const s = isMobile ? (number + 2) % 3 : Math.floor(position / 4);
          if (Number(num[2]) === s) {
            hover = true;
          }
        }
      }
    } else if (number === outcomeNumber && showResult) {
      hover = true;
    }

    return (
      <div
        key={position}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePlaceBet(number);
          }
        }}
        role="button"
        tabIndex={0}
        className={`col-span-1 flex items-center cursor-pointer select-none relative justify-center font-bold aspect-[1] rounded border-[1px] border-[#ffffff3d] ${
          (color === 0 && (hover ? 'bg-[#709cb9]' : 'bg-[#2f4553]')) ||
          (hover ? 'bg-[#fa617b]' : 'bg-[#fe2247]')
        } text-white`}
        onMouseEnter={() => {
          handleHoverPlace(number);
        }}
        onMouseLeave={() => {
          handleHoverPlace(null);
        }}
        onClick={() => handlePlaceBet(number)}
      >
        {number}
        <div className="absolute left-[50%] top-[50%] ">{renderChips(number)}</div>
      </div>
    );
  };

  const renderPlace2 = (index: number) => {
    const startNumber = 1 + 12 * index;
    const endNumber = 12 + 12 * index;
    const leftId = (index === 0 && '1_to_18') || (index === 1 ? 'Red' : 'Odd');
    const rightId = (index === 0 && 'Even') || (index === 1 ? 'Black' : '19_to_36');
    const centerId = `${startNumber}_to_${endNumber}`;

    if (isMobile)
      return (
        <>
          <div className="w-[50%] flex-col h-full text-white">
            <div
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePlaceBet(leftId);
                }
              }}
              role="button"
              tabIndex={0}
              className={`flex h-[50%] text-sm items-center cursor-pointer text-center justify-center relative select-none font-bold rounded border-[1px] border-[#ffffff3d] ${
                (index === 1 && (leftId === selectHover ? 'bg-[#fa617b]' : 'bg-[#fe2247]')) ||
                (leftId === selectHover ? `bg-[#709cb9]` : 'bg-[#2f4553]')
              }`}
              onMouseEnter={() => {
                handleHoverPlace(leftId);
              }}
              onMouseLeave={() => {
                handleHoverPlace(null);
              }}
              onClick={() => handlePlaceBet(leftId)}
              style={{ aspectRatio: '1/2' }}
            >
              {leftId.split('_')}
              <div className="absolute left-[50%] top-[50%] ">{renderChips(leftId)}</div>
            </div>
            <div
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePlaceBet(rightId);
                }
              }}
              role="button"
              tabIndex={0}
              className={`flex h-[50%] text-sm items-center cursor-pointer text-center justify-center relative select-none font-bold rounded border-[1px] border-[#ffffff3d] ${
                rightId === selectHover ? `bg-[#709cb9]` : `bg-[#2f4553]`
              }`}
              onMouseLeave={() => {
                handleHoverPlace(null);
              }}
              onMouseEnter={() => {
                handleHoverPlace(rightId);
              }}
              onClick={() => handlePlaceBet(rightId)}
              style={{ aspectRatio: '1/2' }}
            >
              {rightId.split('_')}
              <div className="absolute left-[50%] top-[50%] ">{renderChips(rightId)}</div>
            </div>
          </div>
          <div
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePlaceBet(centerId);
              }
            }}
            role="button"
            tabIndex={0}
            className={`w-[50%] text-sm flex h-full items-center cursor-pointer  text-white text-center justify-center relative select-none font-bold rounded border-[1px] border-[#ffffff3d] ${
              centerId === selectHover ? `bg-[#709cb9]` : `bg-[#2f4553]`
            }`}
            onMouseEnter={() => {
              handleHoverPlace(centerId);
            }}
            onMouseLeave={() => {
              handleHoverPlace(null);
            }}
            onClick={() => handlePlaceBet(centerId)}
            style={{ aspectRatio: '1/4' }}
          >
            {startNumber} to {endNumber}
            <div className="absolute left-[50%] top-[50%]">{renderChips(centerId)}</div>
          </div>
        </>
      );

    return (
      <div className="grid grid-cols-2  gap-1 text-white">
        <div
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePlaceBet(centerId);
            }
          }}
          role="button"
          tabIndex={0}
          className={`md:col-span-2 col-span-1 flex items-center cursor-pointer justify-center relative select-none font-bold rounded border-[1px] border-[#ffffff3d] ${
            centerId === selectHover ? `bg-[#709cb9]` : `bg-[#2f4553]`
          }`}
          onMouseEnter={() => {
            handleHoverPlace(centerId);
          }}
          onMouseLeave={() => {
            handleHoverPlace(null);
          }}
          onClick={() => handlePlaceBet(centerId)}
          style={{ aspectRatio: isMobile ? '1/2' : '4/1' }}
        >
          {startNumber} to {endNumber}
          <div className="absolute left-[50%] top-[50%] ">{renderChips(centerId)}</div>
        </div>
        <div
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePlaceBet(leftId);
            }
          }}
          role="button"
          tabIndex={0}
          className={`col-span-1 flex items-center cursor-pointer justify-center relative select-none font-bold rounded border-[1px] border-[#ffffff3d] ${
            (index === 1 && (leftId === selectHover ? 'bg-[#fa617b]' : 'bg-[#fe2247]')) ||
            (leftId === selectHover ? `bg-[#709cb9]` : 'bg-[#2f4553]')
          }`}
          onMouseEnter={() => {
            handleHoverPlace(leftId);
          }}
          onMouseLeave={() => {
            handleHoverPlace(null);
          }}
          onClick={() => handlePlaceBet(leftId)}
          style={{ aspectRatio: isMobile ? '1/1' : '2/1' }}
        >
          {leftId.split('_')}
          <div className="absolute left-[50%] top-[50%] ">{renderChips(leftId)}</div>
        </div>
        <div
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePlaceBet(rightId);
            }
          }}
          role="button"
          tabIndex={0}
          className={`col-span-1 flex items-center cursor-pointer justify-center relative select-none font-bold rounded border-[1px] border-[#ffffff3d] ${
            rightId === selectHover ? `bg-[#709cb9]` : `bg-[#2f4553]`
          }`}
          onMouseLeave={() => {
            handleHoverPlace(null);
          }}
          onMouseEnter={() => {
            handleHoverPlace(rightId);
          }}
          onClick={() => handlePlaceBet(rightId)}
          style={{ aspectRatio: isMobile ? '1/1' : '2/1' }}
        >
          {rightId.split('_')}
          <div className="absolute left-[50%] top-[50%] ">{renderChips(rightId)}</div>
        </div>
      </div>
    );
  };

  const renderChips = (placeId: string | number) => {
    const value = bets
      .filter((bet) => bet.placeId === placeId)
      .reduce((accumulator, currentBet) => accumulator + currentBet.amount, 0);

    if (value === 0) {
      return <></>;
    }

    const chips = [];

    for (let i = CHIP_VALUES.length - 1; i >= 0; i--) {
      if (value >= CHIP_VALUES[i]) {
        const chipCount = Math.floor(value / CHIP_VALUES[i]);
        chips.push({ chipIndex: i, count: chipCount });
        break;
      }
    }

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
      if (val >= 1e9) {
        return `${Number((val / 1e9).toFixed(4))}B`;
      }
      if (val >= 1e6) {
        return `${Number((val / 1e6).toFixed(4))}M`;
      }
      if (val >= 1e3) {
        return `${Number((val / 1e3).toFixed(3))}K`;
      }
      return Number(val.toFixed(2)).toString();
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
                width: isMobile ? '35px' : '40px',
                minWidth: isMobile ? '35px' : '40px',
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

  const renderPlacePanel = () => {
    if (isMobile)
      return (
        <div
          className={`flex flex-col justify-end w-full ${disabled ? 'opacity-70' : 'opacity-100'}`}
        >
          <div className="h-[7.08%] flex justify-end">
            <div
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePlaceBet(0);
                }
              }}
              role="button"
              tabIndex={0}
              className={`flex w-[60%] justify-center h-full aspect-[4/1] items-center select-none border-[1px] relative rounded ${
                selectHover === 0 || (outcomeNumber === 0 && showResult)
                  ? 'bg-green-200'
                  : `bg-green-500`
              } text-white font-bold`}
              onMouseLeave={() => {
                handleHoverPlace(null);
              }}
              onMouseEnter={() => {
                handleHoverPlace(0);
              }}
              onClick={() => handlePlaceBet(0)}
            >
              0<div className="absolute left-[50%] top-[50%] ">{renderChips(0)}</div>
            </div>
          </div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex flex-col h-[28.4%] w-full">
              <div className="flex justify-end h-full">
                <div className="w-[40%] h-full flex">{renderPlace2(index)}</div>
                <div className="w-[60%] grid grid-cols-3 h-full">
                  {[...Array(12)].map((__, index1) => renderPlace(index1, index))}
                </div>
              </div>
            </div>
          ))}
          <div className="h-[6.8%]">
            <div className="flex justify-end">
              {[...Array(3)].map((_, index) => {
                const id = `2:1:${index}`;
                return (
                  <div
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handlePlaceBet(id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    key={index}
                    onMouseLeave={() => {
                      handleHoverPlace(null);
                    }}
                    onMouseEnter={() => {
                      handleHoverPlace(id);
                    }}
                    onClick={() => handlePlaceBet(id)}
                    className={`w-[20%] flex items-center select-none cursor-pointer relative justify-center font-bold aspect-[1] rounded ${
                      id === selectHover ? 'bg-[#709cb9]' : 'bg-[#05051494]'
                    }  border-[1px] border-[#424242] text-white`}
                  >
                    2:1
                    <div className="absolute left-[50%] top-[50%] ">{renderChips(id)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );

    return (
      <div className={`flex w-[80%] space-x-1 ${disabled ? 'opacity-70' : 'opacity-100'}`}>
        <div className="w-[7.08%] h-full">
          <div
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePlaceBet(0);
              }
            }}
            role="button"
            tabIndex={0}
            className={`flex justify-center w-full cursor-pointer aspect-[1/3] items-center select-none border-[1px] relative rounded ${
              selectHover === 0 || (outcomeNumber === 0 && showResult)
                ? 'bg-green-200'
                : `bg-green-500`
            } text-white font-bold`}
            onMouseLeave={() => {
              handleHoverPlace(null);
            }}
            onMouseEnter={() => {
              handleHoverPlace(0);
            }}
            onClick={() => handlePlaceBet(0)}
          >
            0<div className="absolute left-[50%] top-[50%] ">{renderChips(0)}</div>
          </div>
        </div>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex flex-col w-[28.4%]  space-y-1">
            <div className="grid grid-cols-4 gap-1">
              {[...Array(12)].map((__, index1) => renderPlace(index1, index))}
            </div>
            {renderPlace2(index)}
          </div>
        ))}
        <div className="w-[6.8%]">
          <div className="grid grid-cols-1 gap-1">
            {[...Array(3)].map((_, index) => {
              const id = `2:1:${index}`;
              return (
                <div
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePlaceBet(id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  key={index}
                  onMouseLeave={() => {
                    handleHoverPlace(null);
                  }}
                  onMouseEnter={() => {
                    handleHoverPlace(id);
                  }}
                  onClick={() => handlePlaceBet(id)}
                  className={`col-span-1 flex items-center select-none cursor-pointer relative justify-center font-bold aspect-[1] rounded ${
                    id === selectHover ? 'bg-[#709cb9]' : 'bg-[#05051494]'
                  }  border-[1px] border-[#424242] text-white`}
                >
                  2:1
                  <div className="absolute left-[50%] top-[50%] ">{renderChips(id)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (showResult) {
      startBet();
      playAudio('win');
      setTimeout(() => {
        setIsWheeling(false);
      }, 3000);
    }
  }, [showResult]);

  useEffect(() => {
    enableSound();
    startBet();
  }, []);

  const rouletteColor = WHEELNUMBERS.find((n) => n.Number === outcomeNumber)?.Color;

  const getHistory = async () => {
    const res = await getRouletteHistoryApi();
    if (!res?.data) return;
    setHistory(res.data);
  };

  useEffect(() => {
    getHistory();
  }, []);

  const canvasContent = (
    <>
      <RouletteCanvas
        outcomeNumber={outcomeNumber}
        onAnimationEnd={() => {
          setShowResult(true);
        }}
      />
      <div
        className={`absolute transition-opacity ${
          showResult ? 'opacity-95' : 'opacity-0'
        } duration-300 ease-out top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-[50%] aspect-square rounded-full bg-gradient-to-r ${
          (rouletteColor === 'Red' && 'from-red-600 via-[#e79494] to-red-600') ||
          rouletteColor === 'Black'
            ? 'from-gray-800 via-gray-600 to-gray-800'
            : 'from-[#00ff15] via-[#92f09a] to-[#00ff15]'
        } shadow-lg`}
      >
        <div className="text-white text-4xl font-bold">{outcomeNumber}</div>
        <div className="text-white text-sm mt-2 uppercase">{rouletteColor}</div>
      </div>
    </>
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
          Roulette Game
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
                <Typography variant="h6">Roulette Game</Typography>
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
              <div className="flex w-full justify-center items-center flex-col">
                <div
                  className={`${
                    isMobile ? 'flex flex-col  items-center max-w-[400px]' : 'flex  max-w-[1300px]'
                  }  w-full rounded-md overflow-hidden`}
                >
                  <div
                    className={`${
                      isMobile ? 'min-w-[350px] w-full' : 'w-full  p-5'
                    } mx-auto relative`}
                  >
                    <div className="flex flex-col w-full h-full">
                      {!isMobile && (
                        <div className="flex justify-center p-2 w-full">
                          <div
                            className=" md:w-[30%] w-[60%] relative"
                            style={{
                              aspectRatio: '1/1',
                              background: 'linear-gradient(#0c3a6d 0%, rgba(49, 93, 207, 0) 100%)',
                              borderRadius: '50% 50% 0 0',
                            }}
                          >
                            {canvasContent}
                          </div>
                        </div>
                      )}
                      <div className="flex w-full justify-end relative">
                        {isMobile && (
                          <div
                            className={`${
                              !isWheeling && !autoBetting
                                ? 'w-[35%] left-[20%] top-[20%]'
                                : 'w-[80%] left-[50%] top-[50%]'
                            } absolute  -translate-y-1/2 -translate-x-1/2  z-20  transition-all duration-300 aspect-square `}
                            style={{ aspectRatio: '1/1', borderRadius: '50% 50% 0 0' }}
                          >
                            {canvasContent}
                          </div>
                        )}
                        <div className="md:bg-gray-900 p-4 rounded-lg md:w-full w-[60%]">
                          <div className="flex justify-center w-full">{renderPlacePanel()}</div>
                          <div className="flex justify-between mt-4">
                            <button
                              type="button"
                              className="h-5 fill-white flex text-white font-bold items-center"
                              onClick={cancelBet}
                            >
                              <div className="w-6 px-1">
                                <svg viewBox="0 0 64 64">
                                  <path d="M37.973 11.947H16.24l5.84-5.84L15.973 0 .053 15.92l15.92 15.92 6.107-6.107-5.76-5.76h21.653C47.92 19.973 56 28.053 56 38c0 9.947-8.08 18.027-18.027 18.027h-21.76v8h21.76C52.347 64.027 64 52.373 64 38c0-14.373-11.653-26.027-26.027-26.027v-.026Z" />
                                </svg>
                              </div>
                              <div>Undo</div>
                            </button>
                            <button
                              type="button"
                              className="h-5 fill-white flex text-white font-bold items-center"
                              onClick={clearBet}
                            >
                              <div>Clear</div>
                              <div className="w-6 px-1">
                                <svg viewBox="0 0 64 64">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M31.943 13.08c-9.37 0-17.128 6.904-18.476 16.004l4.798-.002-9.146 12.96-9.12-12.96h5.334l.012-.124C6.889 15.536 18.291 5.112 32.127 5.112a26.823 26.823 0 0 1 17.5 6.452l-5.334 6.186.02.018a18.584 18.584 0 0 0-12.37-4.688Zm22.937 8.752L64 34.792h-5.174l-.01.12C57.332 48.398 45.902 58.888 32.02 58.888a26.826 26.826 0 0 1-17.646-6.576l5.334-6.186a18.597 18.597 0 0 0 12.47 4.776c9.406 0 17.188-6.96 18.49-16.11h-4.934l9.146-12.96ZM19.708 46.126l-.016-.014.016.014Z"
                                  />
                                </svg>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
                <Stack direction="row" gap={2} width={1}>
                  <Stack gap={0.5} width={0.7}>
                    <Typography variant="body2" color="text.secondary">
                      Chip Value
                    </Typography>
                    <ChipButtonGroup
                      onChooseChip={(v) => {
                        if (!disabled) selectChip(v as ChipIndex);
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
                      fontSize: { xs: 14, sm: 18 },
                    }}
                    onClick={handleClickBet}
                    disabled={(disabled && !isAuto) || (isAuto && stoppedAutobet)}
                  >
                    {(!isAuto && 'Bet') || (autoBetting ? 'Stop (Auto)' : 'Start (Auto)')}
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
      <ResultModal
        visible={showResult}
        totalBetAmount={totalBet}
        profitAmount={profit}
        lossAmount={lossAmount}
        onClose={() => {
          setShowResult(false);
          if (!autoBetting) clearBet();
        }}
      />
    </Stack>
  );
};

export default RouletteGame;
