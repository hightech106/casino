import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useMediaQuery, useTheme } from '@mui/material';
import { useSelector } from 'src/store';
import { getHiloMGameCard } from 'src/utils/custom';
import { validateBetAmount, handleBetChange } from 'src/utils/bet-validation';

import Container from 'src/components/custom/Container';
import AmountInput from 'src/components/custom/AmountInput';
import { HigherSvgIcon, LowerSvgIcon } from 'src/components/svgs';
import SwitchTab from 'src/components/custom/SwitchTab';
import CurrencyIcon from 'src/components/custom/CurrencyIcon';
import SettingBar from 'src/components/custom/Setting';
import FairnessView from 'src/components/custom/FairnessView';
import { DefaultAvatar } from 'src/components/custom/CurrentBets';

import { authenticateSockets, hiloSocket } from './socket';
import { MULTIPLIERS, playAudio, setAudioVolume, setSound } from './config';
import { IBet, IBetType, ICard, IRank } from './type';
import CardItem from './card/card';
import HCardItem from './card/hcard';
import StatusBar from './status';

enum GameStatus {
  WATTING,
  BETTING,
  CALCULATIONG,
}

const HiloMGame = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { isLoggedIn, token, balance, realBalance } = useSelector((store) => store.auth);

  const { soundVolume, showGameAnimation, gameHotKeyEnabled } = useSelector(
    (store) => store.setting
  );

  const [betAmount, setBetAmount] = useState("0.00");
  const [activeTab, setActiveTab] = useState(0);
  const [privateSeed, setPrivateSeed] = useState('');
  const [publicSeed, setPublicSeed] = useState('');
  const [privateSeedHash, setPrivateSeedHash] = useState('');
  const [dt, setDt] = useState(0);
  const [status, setStatus] = useState(GameStatus.WATTING);
  const [bettingTime, setBettingTime] = useState(10000);
  const [calculatingTime, setCalculatingTime] = useState(10000);
  const [startCard, setStartCard] = useState<ICard | null>();
  const [history, setHistorys] = useState<{ card: ICard; id: string }[]>([]);
  const [bets, setBets] = useState<IBet[]>([]);
  const [currentBetType, setBetType] = useState('');
  const [loading, setLoading] = useState(false);

  const delyTime = status === GameStatus.CALCULATIONG ? calculatingTime : bettingTime;
  const disabled = status === GameStatus.CALCULATIONG || currentBetType !== '' || loading;

  const handleBet = (betType?: IBetType) => {
    if (!isLoggedIn) {
      toast.error('Please login first!');
      return;
    }

    if (status !== GameStatus.CALCULATIONG) {

      const amount = Number(betAmount);

      if (!validateBetAmount(amount, balance)) {
        return;
      }

      setLoading(true);
      if (currentBetType === '' && betType) {
        hiloSocket.emit('place-bet', {
          amount: betAmount,
          currency: '',
          betType,
        });
      } else {
        hiloSocket.emit('cancel-bet');
      }
      playAudio('bet');
    } else {
      // toast.error(`Please wait${(Math.floor((delyTime - (Date.now() - dt)) / 1000) + 1)}s seconds.`)
    }
  };

  useEffect(() => {
    hiloSocket.on('connect', () => {
      hiloSocket.emit('fetch');
      if (token) authenticateSockets(token);
      console.log('Server connected');
    });

    hiloSocket.on('disconnect', () => {
      console.log('Server disconnected');
    });

    hiloSocket.on('game', (data: any) => {
      setDt(Date.now() - data.dt);
      setStatus(data.status);
      setBettingTime(data.bettingTime);
      setCalculatingTime(data.calculatingTime);
      setPrivateSeedHash(data.privateSeedHash);
      setPublicSeed(data.publicSeed);
      setStartCard(data.startCard);
      setHistorys(
        data.history.map((h: { privateSeed: string; publicSeed: string }) => ({
          card: getHiloMGameCard(h.privateSeed, h.publicSeed),
          id: h.privateSeed,
        }))
      );
    });

    hiloSocket.on('place-bet', (data) => {
      setLoading(false);
      if (data.status) {
        toast.success('Betting success.');
        setBetType(data.betType);
      } else {
        toast.error('Betting failed.');
      }
    });
    hiloSocket.on('bet', (data) => {
      setBets([...bets, { ...data, profit: -data.amount }]);
    });
    hiloSocket.on('game-status', (data) => {
      setLoading(false);
      setStatus(data);
      setDt(Date.now());
    });
    hiloSocket.on('game-start', (data) => {
      setPublicSeed(data.publicSeed);
      setBetType('');
      setPrivateSeedHash(data.privateSeedHash);
      setBets([]);
    });
    hiloSocket.on('game-end', (data) => {
      setPublicSeed(data.publicSeed);
      setPrivateSeed(data.privateSeed);
      setBets(data.bets);
      setStartCard(null);
      setTimeout(() => {
        setStartCard(data.card);
        setHistorys([{ card: data.card, id: data.privateSeed }, ...history]);
      }, 1500);
    });
    hiloSocket.on('cancel-bet', (data) => {
      setLoading(false);
      if (data.status) {
        setBetType('');
        toast.success('Successfully cancelled');
      } else {
        toast.error('Cancellation failed');
      }
    });

    hiloSocket.on('bet-cancel', (data) => {
      setBets([...bets.filter((bet) => bet.userId !== data.userId)]);
    });

    hiloSocket.on('error', (msg: string) => {
      toast.error(msg);
    });

    return () => {
      hiloSocket.off('connect');
      hiloSocket.off('disconnect');
      hiloSocket.off('game');
      hiloSocket.off('place-bet');
      hiloSocket.off('bet');
      hiloSocket.off('game-status');
      hiloSocket.off('game-start');
      hiloSocket.off('game-end');
      hiloSocket.off('cancel-bet');
      hiloSocket.off('bet-cancel');
      hiloSocket.off('error');
    };
  }, [status, bets, startCard, token]);

  useEffect(() => {
    setSound(true);
    if (!hiloSocket.connected) {
      setTimeout(() => {
        hiloSocket.connect();
      }, 1000);
    }
    return () => {
      setSound(false);
      if (!hiloSocket.disconnected) hiloSocket.disconnect();
      console.log('Slide Socket disconnected');
    };
  }, []);

  useEffect(() => {
    setAudioVolume(soundVolume / 10);
  }, [soundVolume]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (!gameHotKeyEnabled) return;
      switch (event.keyCode) {
        case 32:
          handleBet();
          event.preventDefault();
          break;
        case 83:
          setBetAmount((Number(betAmount) * 2).toFixed(2));
          event.preventDefault();
          break;
        case 65:
          setBetAmount((Number(betAmount) / 2).toFixed(2));
          event.preventDefault();
          break;
        case 68:
          setBetAmount("0.00");
          event.preventDefault();
          break;
        case 81:
          handleBet('hi');
          event.preventDefault();
          break;
        case 87:
          handleBet('low');
          event.preventDefault();
          break;
        case 69:
          handleBet('black');
          event.preventDefault();
          break;
        case 82:
          handleBet('red');
          event.preventDefault();
          break;
        case 84:
          handleBet('range_2_9');
          event.preventDefault();
          break;
        case 89:
          handleBet('range_j_q_k_a');
          event.preventDefault();
          break;
        case 85:
          handleBet('range_k_a');
          event.preventDefault();
          break;
        case 73:
          handleBet('a');
          event.preventDefault();
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameHotKeyEnabled, status, bets, startCard, loading]);

  const getMultipliers = () => {
    const card: ICard = startCard || { suit: 'Clubs', rank: 'A' };
    return MULTIPLIERS[card.rank];
  };
  const currentMultipliers = getMultipliers();

  const getCardRankValue = (card: ICard): number => {
    const rankValueMap: { [key in IRank]: number } = {
      A: 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      J: 11,
      Q: 12,
      K: 13,
      Joker: 14,
    };
    return rankValueMap[card.rank];
  };

  const getProbability = () => {
    if (!startCard) return [0, 0];
    const value = getCardRankValue(startCard);
    if (value === 13) {
      return [(100 / 13).toFixed(0), ((100 / 13) * value - 1).toFixed(0)];
    }
    if (value === 1) {
      return [(100 - (100 / 13) * value).toFixed(0), (100 / 13).toFixed(0)];
    }
    return [(100 - (100 / 13) * value - 1).toFixed(0), ((100 / 13) * value).toFixed(0)];
  };
  const probability = getProbability();

  const getbetButtonClassName = (betType: IBetType) => {
    if (betType === 'hi' || betType === 'low') {
      return `flex bg-input_bg w-full items-center rounded-sm select-none shadow-md justify-between ${betType === currentBetType ? 'bg-input_hover' : ''
        } ${disabled && betType !== currentBetType
          ? 'cursor-not-allowed text-[#4FF1FFc9c]'
          : 'hover:bg-input_hover text-[#e7e7e7] cursor-pointer'
        }`;
    }
    return `flex p-2  mt-3 bg-input_bg w-full items-center rounded-sm select-none shadow-md justify-between ${betType === currentBetType ? 'bg-input_hover' : ''
      } ${disabled && betType !== currentBetType
        ? 'cursor-not-allowed text-[#4FF1FFc9c]'
        : 'hover:bg-input_hover text-[#e7e7e7] cursor-pointer'
      }`;
  };

  const renderBets = () => (
    <div className="w-full bg-panel p-1 rounded-sm overflow-y-scroll flex flex-col h-full min-h-[150px] mt-1">
      {bets.map((bet: IBet, index: number) => {
        console.log(bet);
        return (
          <div className="w-full flex justify-between items-center" key={index}>
            <div className="">
              <DefaultAvatar />
            </div>
            <div className="text-white text-sm font-bold">{bet.userId}</div>
            <div className="flex space-x-1 items-center">
              <div
                className={`${bet.status === 'WIN' ? `text-[green]` : `text-white`
                  } text-sm font-bold`}
              >
                {bet.status === 'WIN' ? `${bet.multiplier.toFixed(2)}x` : '-'}
              </div>
              <div
                className={`${bet.status === 'WIN' ? `text-[#ff9430]` : `text-white`
                  } text-sm font-bold`}
              >
                {bet.status === 'WIN' ? bet?.profit || 0 : Math.abs(bet?.amount || 0)}
              </div>
              <div className="w-4 h-4">
                <CurrencyIcon />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
  const renderControls = () => (
    <div className="col-span-1 p-2 md:min-h-[560px] bg-sider_panel shadow-[0px_0px_15px_rgba(0,0,0,0.25)] flex flex-col justify-start">
      <AmountInput
        value={Number(betAmount)}
        onChange={(value) => setBetAmount(value.toString())}
        disabled={disabled}
        amount={Number(betAmount)}
      />
      <SwitchTab
        options={['Controls', 'Leaderboard']}
        active={activeTab}
        onChange={setActiveTab}
        type="sub"
      />
      {activeTab === 0 ? (
        <>
          <div className="flex justify-between mt-3 space-x-3">
            <div
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleBet('hi');
                }
              }}
              role="button"
              tabIndex={0}
              className={getbetButtonClassName('hi')}
              onClick={() => handleBet('hi')}
            >
              <div className="flex items-center p-1  px-2">
                <div className="font-bold"> Hi</div>
                <div className="ml-1">
                  <HigherSvgIcon />
                </div>
              </div>
              <div className="flex flex-col bg-input_hover h-full w-1/3 items-center">
                <div className="text-yellow-400 text-sm font-bold">
                  {`${currentMultipliers.Higher.toFixed(2)}x`}
                </div>
                <div className="text-[#e7e7e7]">{startCard ? probability[0] : '00'}%</div>
              </div>
            </div>
            <div
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleBet('low');
                }
              }}
              role="button"
              tabIndex={0}
              className={getbetButtonClassName('low')}
              onClick={() => handleBet('low')}
            >
              <div className="flex items-center p-1  px-2">
                <div className="font-bold">Low</div>
                <div className="ml-1">
                  <LowerSvgIcon />
                </div>
              </div>
              <div className="flex flex-col bg-input_hover h-full w-1/3 items-center">
                <div className="text-yellow-400 text-sm font-bold">
                  {`${currentMultipliers.Lower.toFixed(2)}x`}
                </div>
                <div className="text-[#e7e7e7]">{startCard ? probability[1] : '00'}%</div>
              </div>
            </div>
          </div>
          <div
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBet('black');
              }
            }}
            role="button"
            tabIndex={0}
            className={getbetButtonClassName('black')}
            onClick={() => handleBet('black')}
          >
            <div className="flex items-center">
              <div className=" font-bold">Black</div>
              <div className="ml-1 w-3 h-3 rounded-full bg-black" />
            </div>
            <div className="text-yellow-400 text-sm font-bold">2.00x</div>
          </div>
          <div
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBet('red');
              }
            }}
            role="button"
            tabIndex={0}
            className={getbetButtonClassName('red')}
            onClick={() => handleBet('red')}
          >
            <div className="flex items-center">
              <div className=" font-bold">Red</div>
              <div className="ml-1 w-3 h-3 rounded-full bg-[#e42c2c]" />
            </div>
            <div className="text-yellow-400 text-sm font-bold">2.00x</div>
          </div>
          <div
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBet('range_2_9');
              }
            }}
            role="button"
            tabIndex={0}
            className={getbetButtonClassName('range_2_9')}
            onClick={() => handleBet('range_2_9')}
          >
            <div className=" font-bold">2-9</div>
            <div className="text-yellow-400 text-sm font-bold">1.50x</div>
          </div>
          <div
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBet('range_j_q_k_a');
              }
            }}
            role="button"
            tabIndex={0}
            className={getbetButtonClassName('range_j_q_k_a')}
            onClick={() => handleBet('range_j_q_k_a')}
          >
            <div className=" font-bold">J, Q, K, A</div>
            <div className="text-yellow-400 text-sm font-bold">3.00x</div>
          </div>
          <div className="flex space-x-3 justify-between">
            <div
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleBet('range_k_a');
                }
              }}
              role="button"
              tabIndex={0}
              className={getbetButtonClassName('range_k_a')}
              onClick={() => handleBet('range_k_a')}
            >
              <div className=" font-bold">K, A</div>
              <div className="text-yellow-400 text-sm font-bold">6.00x</div>
            </div>
            <div
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleBet('a');
                }
              }}
              role="button"
              tabIndex={0}
              className={getbetButtonClassName('a')}
              onClick={() => handleBet('a')}
            >
              <div className=" font-bold">A</div>
              <div className="text-yellow-400 text-sm font-bold">12.00x</div>
            </div>
          </div>
          {/* <div 
          
              onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePlaceBet(number);
          }
        }}
        role="button"
        tabIndex={0}
          className={getbetButtonClassName("joker")} onClick={() => handleBet("joker")}>
                    <div className="flex items-center">
                        <div className=" font-bold">
                            Joker
                        </div>
                        <div className="ml-1 w-4 h-4 fill-[#b9b9b9]">
                            {suits.Joker.icon}
                        </div>
                    </div>
                    <div className="text-yellow-400 text-sm font-bold">
                        24.00x
                    </div>
                </div> */}
        </>
      ) : (
        renderBets()
      )}
    </div>
  );

  useEffect(() => {
    handleBetChange(betAmount, realBalance, setBetAmount);
  }, [betAmount, realBalance]);

  return (
    <Container className="w-full bg-[#10100f] h-full flex justify-center ">
      <div className={`max-w-[1300px] mt-5 w-full ${isMobile ? 'p-1' : ''} `}>
        <div className="grid grid-cols-1 sm:grid-cols-4 rounded-md overflow-hidden bg-panel shadow-md ">
          {!isMobile && renderControls()}
          <div
            className={`col-span-3 ${isMobile ? 'min-h-[370px] ' : 'min-h-[300px] '
              } relative h-full overflow-hidden py-1`}
          >
            <div className="flex justify-center w-full h-full">
              <div className="flex flex-col max-w-[550px] h-full w-full justify-around md:p-0 p-2">
                <div className="flex flex-col w-full justify-center items-center md:min-h-[250px] min-h-[200px] relative">
                  <div
                    className="w-0 h-0 absolute"
                    style={{
                      transform: `translate(0px, 8px)`,
                    }}
                  >
                    <div
                      className="absolute w-[120px] md:w-[135px] select-none bg-[#32566185] rounded-md"
                      style={{
                        perspective: '3000px',
                        aspectRatio: '2 / 3',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  </div>
                  {Array(7)
                    .fill(0)
                    .map((_, index: number) => (
                      <CardItem y={12 - 2 * index} key={index} showAnimation={false} />
                    ))}
                  <CardItem card={startCard} y={-2} showAnimation={showGameAnimation} />
                </div>
                <StatusBar dt={dt} delyTime={delyTime} status={status} />
                <div className="flex flex-col w-full">
                  <div className="flex text-white">RECENT ROUNDS</div>
                  <div className="overflow-y-scroll w-full md:max-h-[260px] mt-1">
                    <div className="grid md:grid-cols-8 grid-cols-6 w-full  gap-2">
                      {(isMobile ? history.slice(0, 6) : history).map((row: any, index: number) => (
                        <div className="col-span-1" key={row.id}>
                          <HCardItem card={row.card} y={0} showAnimation={showGameAnimation} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isMobile && renderControls()}
        </div>
        <div className="w-full">
          <SettingBar
            fairness={
              <FairnessView
                privateSeed={privateSeed}
                publicSeed={publicSeed}
                privateHash={privateSeedHash}
                gameId="hilo-m"
              >
                <div className="text-white font-bold">Fairness</div>
              </FairnessView>
            }
          />
        </div>
      </div>
    </Container>
  );
};

export default HiloMGame;
