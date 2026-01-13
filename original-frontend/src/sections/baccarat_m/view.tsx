import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useMediaQuery, useTheme } from '@mui/material';
import { useSelector } from 'src/store';

import Container from 'src/components/custom/Container';
import AmountInput from 'src/components/custom/AmountInput';
import Button from 'src/components/custom/Button';
import { DefaultAvatar } from 'src/components/custom/CurrentBets';
import ChipButtonGroup from 'src/components/custom/ChipButtonGroup';
import SwitchTab from 'src/components/custom/SwitchTab';
import Iconify from 'src/components/iconify';

import { fCurrency } from 'src/utils/format-number';

import backgroundImg from 'src/assets/images/games/baccaratbg.png';

import { authenticateSockets, baccaratSocket } from './socket';
import { CHIP_VALUES, playAudio, RATIO, STATUS } from './config';
import { ICard, IChip, IPlace } from './type';

import CardComponent from './card';
import ProgressBar from './progress';
import ResultModal from './modal';
import FairnessView from './fairness';
import PlacesSVG from './svgs';

let THIRD_CARD_DELAY = 1000;
let RESTART_DELAY = 1000;
let BETTING_DELAY = 9000;
let SETTLEMENT_DELAY = 9000;

const BaccaratMulti = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isLoggedIn, token, user, balance, baseUrl } = useSelector((store) => store.auth);

  const [activeTab, setActiveTab] = useState(0);
  const [chipIndex, setChipIndex] = useState<IChip>(0);
  const [placeIndex, setPlaceIndex] = useState<IPlace | undefined>();

  const [bets, setBets] = useState<
    Record<
      string,
      {
        playerId: string;
        chip: IChip;
        place: IPlace;
        currencyId: string;
      }[]
    >
  >({});

  const [chips, setChips] = useState<
    Record<
      any,
      {
        playerId: string;
        chip: IChip;
        place: IPlace;
        x: number;
        y: number;
        r: number;
        self?: boolean;
        currencyId: string;
      }[]
    >
  >({});

  const [history, setHistory] = useState<any[]>([]);

  const [privateHash, setPriviateHash] = useState<string>('');
  const [publichSeed, setPublicSeed] = useState<string>('');

  const [status, setStatus] = useState<STATUS>(STATUS.WAITING);

  const [playerHand, setPlayerHand] = useState<ICard[]>([]);
  const [bankerHand, setBankerHand] = useState<ICard[]>([]);

  const [result, setResult] = useState<any>({});

  const [visible, setVisibleModal] = useState(false);

  const [userId, setUserId] = useState<string>('');
  const elapsed = useRef(0);

  const gameData = (data: any) => {
    setUserId(data?.playerId || user._id);
    handleStatus(data.status);
    setPriviateHash(data.hashedServerSeed);
    setPublicSeed(data.clientSeed);
    setPlayerHand([...data.playerHand]);
    setBankerHand([...data.bankerHand]);
    THIRD_CARD_DELAY = data.THIRD_CARD_DELAY;
    RESTART_DELAY = data.RESTART_DELAY;
    BETTING_DELAY = data.BETTING_DELAY;
    SETTLEMENT_DELAY = data.SETTLEMENT_DELAY;
    elapsed.current = Date.now() + data.elapsed;
  };

  const handleStatus = (data: any) => {
    // console.log(STATUS[data.status], data);
    elapsed.current = Date.now();
    if (data.status === STATUS.WAITING) {
      console.log('Waiting');
    } else if (data.status === STATUS.STARTING) {
      playAudio('end');
      setVisibleModal(false);
      setResult({});
      setBets({});
      setChips({});
      setBankerHand([]);
      setPlayerHand([]);
    } else if (data.status === STATUS.BETTING) {
      console.log('Betting');
    } else if (data.status === STATUS.PLAYING) {
      console.log('Playing');
    }
    setStatus(data.status);
  };

  const roundStart = (data: any) => {
    setPriviateHash(data.hashedServerSeed);
    setPublicSeed(data.clientSeed);
  };

  const dealCard = (data: any) => {
    const { player, banker }: { player: ICard[]; banker: ICard[] } = data;
    setPlayerHand([...playerHand, ...player]);
    setBankerHand([...bankerHand, ...banker]);
  };

  const onBetRes = (data: any) => {
    console.log('bet res--', data);
    if (data.status) {
      playAudio('bet');
    }
  };

  const onbet = (data: any) => {
    console.log('bet---', data);
    if (!bets[data.playerId]?.length) {
      bets[data.playerId] = [];
    }
    bets[data.playerId].push({
      playerId: data.playerId,
      place: data.place,
      chip: data.chip,
      currencyId: data.currencyId,
    });

    setBets({ ...bets });

    if (!chips[data.place]?.length) {
      chips[data.place] = [];
    }
    chips[data.place].push({
      playerId: data.playerId,
      place: data.place,
      chip: data.chip,
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
      r: Math.random() * 360,
      self: data.playerId === userId,
      currencyId: data.currencyId,
    });

    setChips({ ...chips });
  };

  const onCancelbetRes = (data: any) => {};

  const onCancelBet = (data: any) => {
    if (data.status && bets[data.player.playerId]) {
      const bet: any = bets[data.player.playerId].pop();
      if (!bets[data.player.playerId].length) {
        delete bets[data.player.playerId];
      }
      setBets({ ...bets });
      chips[bet.place] = chips[bet.place]
        .filter((c: any) => c.playerId === data.player.playerId)
        .slice(0, -1);
      setChips({ ...chips });
    }
  };

  const onClearBetRes = (data: any) => {};

  const onClearBet = (data: any) => {
    if (data.status && bets[data.player.playerId]) {
      Object.keys(chips).forEach((place) => {
        chips[place] = chips[place].filter((c: any) => c.playerId !== data.player.playerId);
      });

      setChips({ ...chips });
      delete bets[data.player.playerId];
      setBets({ ...bets });
    }
  };

  const onResult = (data: any) => {
    setTimeout(() => {
      setResult(data);
      if (bets[userId]?.length && bets[userId].findIndex((b) => b.place === data.winner) !== -1) {
        setVisibleModal(true);
        playAudio('win');
      }
    }, 1500);
  };

  const onPlay = async () => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }
    if ((status === STATUS.BETTING || status === STATUS.THIRD_CARD_BETTING) && placeIndex) {
      baccaratSocket.emit('bet', { chip: chipIndex, place: placeIndex, currencyId: 'eth' });
    }
  };

  const clearBet = () => {
    if (status === STATUS.BETTING || status === STATUS.THIRD_CARD_BETTING) {
      baccaratSocket.emit('clear');
    }
  };

  const cancelBet = () => {
    if (status === STATUS.BETTING || status === STATUS.THIRD_CARD_BETTING) {
      baccaratSocket.emit('cancel');
    }
  };

  const getButtonContent = () => {
    if (status === STATUS.BETTING || status === STATUS.THIRD_CARD_BETTING) {
      return 'Short bet';
    }

    if (status === STATUS.SETTLEMENT) {
      return 'Waitting...';
    }
    return 'Starting...';
  };

  const onChooseChip = (chip: any) => {
    setChipIndex(chip);
  };

  const onChoosePlace = (place: IPlace) => {
    setPlaceIndex(place);
    if (status === STATUS.BETTING || status === STATUS.THIRD_CARD_BETTING) {
      baccaratSocket.emit('bet', { chip: chipIndex, place, currencyId: 'eth' });
    }
  };

  const getTotalBet = (playerId: string) => {
    let total = 0;

    Object.keys(bets).forEach((value) => {
      if (playerId === value) {
        bets[value].forEach((val) => {
          total += (CHIP_VALUES[val?.chip] || 0) / RATIO;
        });
      }
    });

    return total;
  };

  const getBets = () => {
    const _bets: any = [];

    Object.entries(bets).forEach(([value, betArray]) => {
      const total = betArray.reduce((acc, bet) => acc + (CHIP_VALUES[bet?.chip] || 0) / RATIO, 0);

      _bets.push({
        betAmount: total,
        playerID: value,
        name: value,
        // avatar:
      });
    });
    return _bets;
  };

  const getDelay = (): number => {
    if (status === STATUS.WAITING) {
      return 0;
    }
    if (status === STATUS.STARTING) {
      return RESTART_DELAY;
    }
    if (status === STATUS.BETTING || status === STATUS.THIRD_CARD_BETTING) {
      return BETTING_DELAY;
    }
    if (status === STATUS.PLAYING) {
      return 0;
    }
    if (status === STATUS.SETTLEMENT) {
      return SETTLEMENT_DELAY;
    }
    return 0;
  };

  useEffect(() => {
    baccaratSocket.on('connect', () => {
      console.log('Server connected');
    });

    baccaratSocket.on('disconnect', () => {
      console.log('Server disconnected');
    });

    baccaratSocket.on('game-data', gameData);
    baccaratSocket.on('game-status', handleStatus);
    baccaratSocket.on('round-start', roundStart);

    baccaratSocket.on('deal-card', dealCard);
    baccaratSocket.on('bet-res', onBetRes);
    baccaratSocket.on('bet', onbet);
    baccaratSocket.on('cancelbet-res', onCancelbetRes);
    baccaratSocket.on('cancelbet', onCancelBet);
    baccaratSocket.on('clearbet-res', onClearBetRes);
    baccaratSocket.on('clearbet', onClearBet);
    baccaratSocket.on('result', onResult);

    return () => {
      baccaratSocket.off('connection');
      baccaratSocket.off('disconnect');

      baccaratSocket.off('game-data');
      baccaratSocket.off('game-status');
      baccaratSocket.off('round-start');

      baccaratSocket.off('deal-card');
      baccaratSocket.off('bet-res');
      baccaratSocket.off('bet');
      baccaratSocket.off('cancelbet-res');
      baccaratSocket.off('cancelbet');
      baccaratSocket.off('clear-res');
      baccaratSocket.off('result');
    };
  }, [status, history, playerHand, bankerHand]);

  useEffect(() => {
    if (!baccaratSocket.connected) {
      setTimeout(() => {
        baccaratSocket.connect();
        baccaratSocket.emit('init');
      }, 1000);
    }
    return () => {
      if (!baccaratSocket.disconnected) baccaratSocket.disconnect();
      console.log('Slide Socket disconnected');
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) authenticateSockets(token);
  }, [isLoggedIn, token]);

  const disable = !(status === STATUS.BETTING || status === STATUS.THIRD_CARD_BETTING);

  return (
    <Container className="w-full bg-[#10100f] h-full flex justify-center ">
      <div className={`max-w-[1300px] mt-5 ${isMobile ? 'w-full p-1' : 'w-full'} `}>
        <div className="grid grid-cols-1 sm:grid-cols-4 rounded-md overflow-hidden  bg-panel shadow-md">
          {!isMobile && (
            <div className="col-span-1 p-2 min-h-[560px] bg-sider_panel shadow-[0px_0px_15px_rgba(0,0,0,0.25)] flex flex-col justify-between">
              <div className="flex flex-col">
                <SwitchTab
                  active={activeTab}
                  onChange={setActiveTab}
                  options={['BET', 'Fairness']}
                />
                {activeTab === 0 ? (
                  <>
                    <ChipButtonGroup
                      chipValues={CHIP_VALUES}
                      onChooseChip={onChooseChip}
                      selected={chipIndex}
                      label={
                        <div className="flex mt-5 items-center">
                          <div className="text-white font-bold text-sm">
                            Chip Value {(CHIP_VALUES[chipIndex] / RATIO).toString()}
                          </div>

                          <div className="mx-1 w-4">
                            {/* <CurrencyIcon /> */}
                            <Iconify
                              icon="material-symbols:attach-money-rounded"
                              sx={{ color: 'primary.main', minWidth: 20 }}
                            />
                          </div>
                        </div>
                      }
                    />
                    <AmountInput onChange={() => {}} value={getTotalBet(userId)} disabled />
                    <Button disabled={disable} onClick={onPlay}>
                      {getButtonContent()}
                    </Button>
                  </>
                ) : (
                  <FairnessView
                    privateHash={privateHash}
                    publicSeed={publichSeed}
                    privateSeed={result?.serverSeed || ''}
                  />
                )}
              </div>
              {activeTab === 0 && <CurrentBets bets={getBets()} />}
            </div>
          )}
          <div
            className={`col-span-3 ${
              isMobile ? 'min-h-[400px] ' : 'min-h-[300px] '
            } relative h-full overflow-hidden`}
          >
            <div className="flex flex-col md:p-5 p-1 justify-between h-full w-full">
              <div
                className="flex w-full justify-between h-full rounded-md pb-8 "
                style={{
                  background: `url(${backgroundImg})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: isMobile ? '40%' : '30%',
                  backgroundPosition: 'center 90%',
                }}
              >
                <div className="w-1/2">
                  <CardComponent
                    Hand={playerHand}
                    dealPosition={{ x: 1000, y: -300 }}
                    Label="Payer"
                  />
                </div>
                <div className="w-1/2">
                  <CardComponent
                    Hand={bankerHand}
                    dealPosition={{ x: 500, y: -300 }}
                    Label="Banker"
                  />
                </div>
              </div>
              <ProgressBar elapsed={elapsed.current} delay={getDelay()} disabled={disable} />
              <PlacesSVG onChoosePlace={onChoosePlace} bets={bets} chips={chips} result={result} />
              <div className="flex justify-between">
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
            <div
              className="min:w-[60px] absolute right-0 top-0 -translate-y-2/3 translate-x-1/2 w-[60px] md:w-[100px] rounded-lg shadow-md bg-[#21bd13] border-2 border-b-8"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                aspectRatio: '2 / 3',
              }}
            />
            <ResultModal
              visible={visible}
              bets={bets[userId] || []}
              result={result}
              onClose={() => setVisibleModal(false)}
            />
          </div>
          {isMobile && (
            <div className="col-span-1 p-2 min-h-[560px] bg-sider_panel shadow-[0px_0px_15px_rgba(0,0,0,0.25)] flex flex-col justify-between">
              {activeTab === 0 && (
                <>
                  <ChipButtonGroup
                    chipValues={CHIP_VALUES}
                    onChooseChip={onChooseChip}
                    selected={chipIndex}
                    label={
                      <div className="flex items-center">
                        <div className="text-white font-bold text-sm">
                          Chip Value {(CHIP_VALUES[chipIndex] / RATIO).toString()}
                        </div>{' '}
                        <div className="mx-1 w-4">
                          <Iconify
                            icon="material-symbols:attach-money-rounded"
                            sx={{ color: 'primary.main', minWidth: 20 }}
                          />
                          {/* <CurrencyIcon /> */}
                        </div>
                      </div>
                    }
                  />
                  <Button disabled={disable} onClick={onPlay}>
                    {getButtonContent()}
                  </Button>
                  <AmountInput onChange={() => {}} value={getTotalBet(userId)} disabled />
                  <CurrentBets bets={getBets()} />
                </>
              )}
              <SwitchTab active={activeTab} onChange={setActiveTab} options={['BET', 'Fairness']} />
              {activeTab === 1 && (
                <FairnessView
                  privateHash={privateHash}
                  publicSeed={publichSeed}
                  privateSeed={result?.serverSeed || ''}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default BaccaratMulti;

const CurrentBets = ({ bets }: { bets: any[] }) => (
  <div className="mt-5">
    <div className="h-[250px] overflow-y-auto bg-panel  rounded-sm ">
      {bets.map((row, index) => (
        <div
          key={index}
          className={`flex px-3 py-1.5 items-center hover:bg-[#29374793] justify-between ${
            index % 2 === 0 ? 'bg-opacity-10' : ''
          }`}
        >
          <div className="flex items-center w-3/5">
            {!row?.avatar ? (
              <div className="text-stone-100" style={{ width: '30px' }}>
                <DefaultAvatar />
              </div>
            ) : (
              <img
                alt={row.name}
                src={row?.avatar || 'default.png'}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="text-xs px-1 font-[14px] text-white max-w-sm overflow-hidden text-ellipsis whitespace-nowrap ">
              {row.name || row.playerID}
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-4">
              <Iconify
                icon="material-symbols:attach-money-rounded"
                sx={{ color: 'primary.main', minWidth: 20 }}
              />
              {/* <CurrencyIcon /> */}
            </div>
            <span
              className={`text-xs px-1 ${
                row?.isWin ? 'text-green-600' : 'text-stone-100'
              } font-bold`}
            >
              {fCurrency(row.betAmount)}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
