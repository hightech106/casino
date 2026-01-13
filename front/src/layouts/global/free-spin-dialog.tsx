import { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import Confetti from 'react-confetti';
import { toast } from 'react-hot-toast';
import useWindowSize from 'react-use/lib/useWindowSize';
import { isMobile } from 'react-device-detect';
import { Box, Button, Dialog, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { dispatch, useSelector } from 'src/store';
import { setBonusDate, setLastSpin } from 'src/store/reducers/auth';
import { ChangePage } from 'src/store/reducers/menu';
import { useLocales } from 'src/locales';
import useApi from 'src/hooks/use-api';

import Image from 'src/components/image';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { MotionContainer, varSlide } from 'src/components/animate';

const prizeCount = 12;

type IPrize = {
  _id: string;
  amount: number;
  createdAt: string;
};

type IGame = {
  _id: string;
  game_name: string;
  game_code: number;
  provider_code: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  isJourney?: boolean;
};

export const FreeSpinDialog = ({ open, onClose, isJourney = false }: Props) => {
  const { t } = useLocales();
  const isSmMobile = useMediaQuery('(max-width:520px)');

  const { get_freespin_prizes, play_freespin } = useApi();

  const { isLoggedIn, user } = useSelector((state) => state.auth);


  const spinFinished = useBoolean(false);
  const luckyWheelRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioWinRef = useRef<HTMLAudioElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [spinIndex, setSpinIndex] = useState<any>(null);
  const [prizes, setPrizes] = useState<IPrize[]>([]);
  const [freespinGame, setFreespinGame] = useState<IGame | null>(null);

  const getPrizes = async () => {
    const res = await get_freespin_prizes();
    if (!res?.data) return;
    setPrizes(res.data);
  };

  const showCollectWin = async (wheelIndex: number) => {
    audioWinRef.current?.play();
    spinFinished.onTrue();
    setIsLoading(false);
  };

  function spinWheel(prizeIndex: number, callback: (i: number) => void) {
    if (isLoading) return;

    const anglePerPrize = 360 / prizeCount;
    const pointerAngleOffset = 0;

    let target = prizeIndex * anglePerPrize + pointerAngleOffset;
    target += 360 * prizeCount;

    spinCoroutine(target, prizeIndex, callback);
  }

  /* eslint-disable */

  useEffect(() => {
    getPrizes();
  }, []);

  function spinCoroutine(target: number, prizeIndex: number, callback: (i: number) => void) {
    const duration = 10 * 1000; // 10 seconds
    let start: any = null;

    function animateWheel(time: number) {
      if (!start) start = time;
      const elapsedTime = time - start;

      const t = elapsedTime / duration;
      const easedT = 1 - Math.pow(1 - t, 4);

      const currentAngle = (easedT * target) % 360;
      if (luckyWheelRef.current) {
        luckyWheelRef.current.style.transform = `rotate(${currentAngle}deg)`;
      }

      if (elapsedTime % (duration / prizeCount) < 100) {
        audioRef.current?.play();
      }

      if (elapsedTime < duration) {
        requestAnimationFrame(animateWheel);
      } else {
        elasticEffect(target, prizeIndex, callback);
      }
    }

    requestAnimationFrame(animateWheel);
  }

  function elasticEffect(target: number, prizeIndex: number, callback: (i: number) => void) {
    const randomOffset = Math.random() * 10 - 5; // Small random offset

    const elasticDuration = 700; // 700ms elastic effect
    let start: any = null;

    function animateElastic(time: number) {
      if (!start) start = time;
      const elapsedTime = time - start;

      const elasticT = elapsedTime / elasticDuration;
      const easedElasticT = Math.sin(elasticT * Math.PI * 2) * (1 - elasticT);

      if (luckyWheelRef.current) {
        luckyWheelRef.current.style.transform = `rotate(${(target + randomOffset * easedElasticT) % 360
          }deg)`;
      }

      if (elapsedTime < elasticDuration) {
        requestAnimationFrame(animateElastic);
      } else {
        // Ensure final angle is exact
        const currentAngle = target % 360;
        if (luckyWheelRef.current) {
          luckyWheelRef.current.style.transform = `rotate(${currentAngle}deg)`;
        }
        callback(prizeIndex);
      }
    }

    requestAnimationFrame(animateElastic);
  }

  function resetWheelRotation() {
    if (luckyWheelRef.current) {
      luckyWheelRef.current.style.transform = 'rotate(0deg)';
    }
  }

  /* eslint-enable */

  const handleClose = () => {
    onClose();
    resetWheelRotation();
    spinFinished.onFalse();
  };

  // -----------------------------------------------------

  const now = Date.now();
  const difference = user.last_bonus + 24 * 60 * 60 * 1000 - now;

  const onPlay = async () => {
    // Если у пользователя есть last_spin, то это должен быть journey спин (одноразовый)
    const shouldBeJourney = user?.last_spin ? true : isJourney;

    if (!shouldBeJourney && difference > 0) {
      toast.error("You can't play freespin for another 24 hours");
      return;
    }
    if (!isLoggedIn) {
      dispatch(ChangePage('login'));
      return;
    }
    if (!prizes.length) return;
    if (isLoading) return;
    setIsLoading(true);
    console.log('Вызываем play_freespin с journey:', shouldBeJourney);
    const res = await play_freespin(shouldBeJourney);
    if (!res?.data) return;
    setSpinIndex(res.data.spinIndex);
    spinWheel(res.data.spinIndex, showCollectWin);
    setFreespinGame(res.data.game);
    if (!res.data.isJourney) {
      setTimeout(() => {
        dispatch(setBonusDate(res.data.lastSpinDate));
        // Устанавливаем last_spin чтобы кнопка спина исчезла навсегда
        dispatch(setLastSpin(Date.now()));
      }, 10 * 1000);
    }
  };

  /* eslint-disable */
  const link = location.origin;
  const isDevLink = link.includes('http://');
  /* eslint-enable */

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
        },
      }}
      sx={{
        zIndex: 10000,
        '& .MuiDialog-paperFullWidth': {
          maxWidth: 985,
          height: { xs: '100vh', sm: '700px' },
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/assets/images/spin/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
        ...(isMobile && isSmMobile && {
          '& .MuiDialog-paperFullWidth': {
            width: '100vw',
            height: '100vh',
            maxHeight: '100vh',
            maxWidth: '100vw',
            margin: 0,
            borderRadius: 0,
            backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/assets/images/spin/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        })
      }}
    >
      {/* <Image src="/assets/images/spin/model.png" sx={{
                position: 'absolute',
                right: { xs: 1, sm: "18%" },
                width: { xs: 0.38, sm: 0.21 },
                ...(!isSmMobile ? {
                    bottom: 15,
                } : {
                    bottom: "8%"
                }),
                ...(isDevLink && {
                    filter: "blur(8px)",
                })
            }} /> */}

      <Stack sx={{ height: 1 }}>
        <Stack
          sx={{
            zIndex: 1,
            height: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Stack
            alignItems="center"
            sx={{
              pt: { xs: 2, sm: 5 },
              pb: { xs: 1, sm: 3 },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                transform: 'skew(5deg)',
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  fontSize: isSmMobile ? '36px' : '120px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  color: '#FFD700',
                }}
              >
                FREE
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  fontSize: isSmMobile ? '36px' : '120px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                }}
              >
                SPIN
              </Typography>
            </Stack>
            <Stack
              sx={{
                backgroundColor: '#24ee89',
                borderRadius: 1,
                width: { xs: 220, sm: 274 },
                height: { xs: 32, sm: 37 },
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'skew(5deg)',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  fontSize: { xs: '18px', sm: '16px' },
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textTransform: 'uppercase',
                  color: '#000',
                }}
              >
                {t('and_get_bonuses')}
              </Typography>
            </Stack>
          </Stack>

          <Stack
            sx={{
              position: 'relative',
              height: { xs: 415, sm: 430 },
              width: 1,
              mb: { xs: 0, sm: 3 },
              justifyContent: 'center',
              alignItems: 'center',
              ...(difference > 0 && {
                // opacity: 0.7,
                filter: 'blur(5px)',
              }),
            }}
          >
            {/* <Image
                            src="/assets/images/spin/table.png"
                            sx={{
                                position: 'absolute',
                                width: 203,
                                height: 130,
                                bottom: 0,
                            }}
                        /> */}
            {/* <Label sx={{
                            position: 'absolute',
                            bottom: "11%",
                            color: "#FFF",
                            bgcolor: "#050514ba"
                        }} >
                            {t("you_have_tries", {
                                label: 1
                            })}
                        </Label> */}

            <Stack
              sx={{
                backgroundColor: '#24ee89',
                borderRadius: 1,
                position: 'absolute',
                bottom: 0,
                width: { xs: 220, sm: 274 },
                height: { xs: 32, sm: 37 },
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'skew(5deg)',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  fontSize: { xs: '18px', sm: '16px' },
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  color: '#000',
                }}
              >
                {user?.last_spin ? t('one_time_spin') : t('you_have_tries', {
                  label: 1,
                })}
              </Typography>
            </Stack>

            <Stack
              sx={{
                top: 0,
                height: { xs: 365, sm: 370 },
                width: { xs: 365, sm: 370 },
                left: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                transform: 'translate(-50%)',
              }}
            >
              <Stack
                ref={luckyWheelRef}
                id="spinner"
                sx={{
                  width: 1,
                  height: 1,
                  position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="img"
                  alt="wheel"
                  src="/assets/images/spin/wheel.png"
                  sx={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    left: 0,
                    top: 0,
                    objectFit: 'contain',
                    zIndex: 1
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    width: '86%',
                    height: '86%',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(138,43, 226, 0.5) 0%, rgba(138,43, 226, 0.22) 38%, rgba(138,43, 226, 0.08) 62%, rgba(138,43, 226, 0) 85%, transparent 100%)',
                    filter: 'blur(6px)',
                    borderRadius: '50%',
                    zIndex: 0,
                    pointerEvents: 'none'
                  }}
                />
                {prizes.map((option, index) => (
                  <Box
                    key={index}
                    sx={{
                      height: { xs: 134, sm: 138 },
                      transform: `rotate(${-1 * index * (360 / prizes.length)}deg)`,
                      position: 'absolute',
                      width: 71,
                      top: '13%',
                      left: '40%',
                      // border: "1px solid red",
                      transformOrigin: 'center 100%',
                      zIndex: 2,
                    }}
                  >
                    <Typography
                      className="impact-font"
                      sx={{
                        fontSize: 24,
                        textShadow: '0px 2px 0px rgba(0,0,0,.3)',
                        textAlign: 'center',
                        color: '#000',
                      }}
                      noWrap
                    >
                      {option.amount}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: '#000',
                        textAlign: 'center',
                        lineHeight: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      FREE
                      <br />
                      SPIN
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* <Box component="img" src="/assets/images/spin/border.png"
                                    sx={{ width: 120, top: 0, mt: "0.8px", position: 'absolute', }} /> */}

              {/* Градиентное свечение за spinner */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  position: 'absolute',
                  top: 0,
                  mt: 3,

                  borderRadius: '50%',
                  zIndex: 0,
                }}
              />
              <Box
                component="img"
                alt="spinner"
                src="/assets/images/spin/spinner.png"
                sx={{ width: 26, top: 0, mt: 2, position: 'absolute', zIndex: 4 }}
              />
              <Stack
                sx={{
                  height: { xs: 170, sm: 170 },
                  width: { xs: 170, sm: 170 },
                  position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  className="nunito-font"
                  onClick={onPlay}
                  disabled={isLoading || !prizes.length || spinFinished.value || difference > 0}
                  sx={{
                    // border: "1px solid red",
                    p: 0,
                    zIndex: 2,
                    height: { xs: 63, sm: 63 },
                    width: { xs: 63, sm: 63 },
                    minWidth: 20,
                    fontSize: { xs: 20, sm: 20 },
                    borderRadius: 50,
                    color: '#B8F9FF',
                    textTransform: 'uppercase',
                  }}
                />
                {/* {t("spin")} */}
                {/* </Button> */}
                <Box
                  component="img"
                  alt="center"
                  src="/assets/images/spin/center.png"
                  sx={{ position: 'absolute', width: { xs: 365, sm: 350 }, top: 0, zIndex: 3 }}
                />
                <Typography
                  sx={{
                    fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    fontSize: 18,
                    position: 'absolute',
                    color: '#F7C457',
                    zIndex: 3,
                    transform: 'skew(5deg)',
                    maskImage: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0) 100%)'
                  }}
                >
                  SPIN
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: 'common.white',
            '&:hover': {
              color: 'common.white',
            },
            zIndex: 1,
          }}
        >
          <Iconify icon="mdi:close" />
        </IconButton>
      </Stack>

      {difference > 0 && <CountdownTimer timestemp={user.last_bonus} />}

      <audio ref={audioRef} controls style={{ display: 'none' }}>
        <source src="/assets/media/tick.mp3" type="audio/mp3" />
        <track kind="captions" srcLang="en" label="English" />
      </audio>
      <audio ref={audioWinRef} controls style={{ display: 'none' }}>
        <source src="/assets/media/win.mp3" type="audio/mp3" />
        <track kind="captions" srcLang="en" label="English" />
      </audio>

      {spinFinished.value && (
        <SpinResult prize={prizes[spinIndex]} game={freespinGame} onClose={handleClose} />
      )}
    </Dialog>
  );
};

const CountdownTimer = ({ timestemp }: { timestemp: number }) => {
  const { t } = useLocales();
  const isSmMobile = useMediaQuery('(max-width:520px)');
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCounter = () => {
      const now = Date.now();
      const difference = timestemp + 24 * 60 * 60 * 1000 - now;

      // If the countdown is done, reset to zero
      if (difference <= 0) {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Calculate hours, minutes, and seconds remaining
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      // Update the state with the remaining time
      setTimeRemaining({ hours, minutes, seconds });
    };

    // Call updateCounter immediately to set the initial state
    updateCounter();

    // Set up an interval to update the counter every second
    const intervalId = setInterval(updateCounter, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [timestemp]);

  return (
    <Stack
      width="fit-content"
      sx={{
        zIndex: 1,
        position: 'absolute',
        ...(!isSmMobile && {
          right: 50,
          top: 50,
        }),
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
          fontWeight: 700,
          fontStyle: 'italic',
          color: "#6C63FF",
          textTransform: "uppercase",
          transform: 'skew(5deg)',
        }}
      >
        {t('until_next_spin')}
      </Typography>

      <Stack direction="row" width={1} justifyContent="space-between">
        <Stack>
          <Typography
            sx={{
              fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: 14,
              color: "#C8C8C8",
              transform: 'skew(5deg)',
            }}
          >
            Hours
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: 50,
              color: "#c0f757",
              transform: 'skew(5deg)',
            }}
          >
            {String(timeRemaining.hours).padStart(2, '0')}
          </Typography>
        </Stack>

        <Stack>
          <Typography
            sx={{
              fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: 50,
              height: 55,
              color: "#c0f757",
              transform: 'skew(5deg)',
            }}
          >
            :
          </Typography>
        </Stack>

        <Stack>
          <Typography
            sx={{
              fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: 14,
              color: "#C8C8C8",
              transform: 'skew(5deg)',
            }}
          >
            Minutes
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: 50,
              color: "#c0f757",
              transform: 'skew(5deg)',
            }}
          >
            {String(timeRemaining.minutes).padStart(2, '0')}
          </Typography>
        </Stack>

        <Stack>
          <Typography
            sx={{
              fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: 50,
              height: 55,
              color: "#c0f757",
              transform: 'skew(5deg)',
            }}
          >
            :
          </Typography>
        </Stack>

        <Stack>
          <Typography
            sx={{
              fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: 14,
              color: "#C8C8C8",
              transform: 'skew(5deg)',
            }}
          >
            Seconds
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: 50,
              color: "#c0f757",
              transform: 'skew(5deg)',
            }}
          >
            {String(timeRemaining.seconds).padStart(2, '0')}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

interface SpinResultProps {
  prize: IPrize;
  game: IGame | null;
  onClose: () => void;
}

const SpinResult = ({ prize, game, onClose }: SpinResultProps) => {
  const { t, currentLang } = useLocales();
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [confettiRunning, setConfettiRunning] = useState<number>(0);

  const formatGameName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const handleResultClose = () => {
    if (!game) return;
    const formattedGameName = formatGameName(game.game_name);
    router.push(`/${currentLang.value}$/casino/casino/${game.provider_code}/${formattedGameName}/${game.game_code}/play`);
    onClose();
  };

  useEffect(() => {
    setConfettiRunning(400);
    setTimeout(() => {
      setConfettiRunning(0);
    }, 5000);
  }, []);

  return (
    <Box
      sx={{
        width: 1,
        height: 1,
        zIndex: 1,
        position: 'absolute',
        backdropFilter: 'blur(10px)',
        bgcolor: 'rgba(10, 8, 17, 0.75)',
      }}
    >
      <MotionContainer sx={{ height: 1 }}>
        <Stack
          component={m.div}
          variants={varSlide().inDown}
          sx={{
            top: -15,
            border: 0,
            zIndex: 2,
            position: 'relative',
            alignItems: 'center',
            bgcolor: 'transparent',
            justifyContent: 'center',
            height: { xs: 0.73, sm: 1 },
          }}
        >
          <Box
            component="img"
            alt="dialog"
            src="/assets/images/spin/dialog.png"
            sx={{
              width: { xs: '139%' },
              maxWidth: { xs: 'fit-content' },
              height: 1,
            }}
          />
          <Stack sx={{ position: 'absolute', alignItems: 'center', mt: 5 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
                fontWeight: 700,
                fontStyle: 'italic',
                textTransform: "uppercase",
                transform: 'skew(5deg)',
              }}
            >
              {t('congratulations_hurray')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#000',
                fontSize: '12px',
                transform: 'skew(5deg)',
              }}
            >
              {t('got_freespin', { num: prize.amount, game: game?.game_name })}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Geogrotesque Cyr, Arial, sans-serif',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#000',
                transform: 'skew(5deg)',
              }}
            >
              {prize.amount}
            </Typography>
            {/*  //${prize.currency.symbol} */}
            <Button
              sx={{
                mt: 3,
                py: 1,
                px: 5,
                fontSize: 18,
                borderRadius: 50,
                color: '#634100',
                textTransform: 'uppercase',
                boxShadow: '0px 0px 30px 0px rgba(255, 220, 154, 0.30)',
                background:
                  'linear-gradient(228deg, #FFFD69 -3.31%, #FFFD69 25.11%, #CB9227 102.78%)',
              }}
              onClick={handleResultClose}
            >
              {t('play_now')}
            </Button>
          </Stack>
        </Stack>
      </MotionContainer>

      <Confetti width={width} height={height} gravity={0.15} numberOfPieces={confettiRunning} />
    </Box>
  );
};
