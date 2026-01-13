/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Box, IconButton, Button, Typography, Stack, Modal } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locales';
import toast from 'react-hot-toast';
import { useResponsive } from 'src/hooks/use-responsive';
import useApi from 'src/hooks/use-api';
import type { UserStats } from 'src/types/mission';

interface WheelX100PageProps {
  setActiveTab?: (tab: string) => void;
  setActiveMiniGame?: Dispatch<SetStateAction<string | null>>;
  userStats: UserStats;
  setUserStats: Dispatch<SetStateAction<UserStats>>;
  refreshUserStats?: () => Promise<void>;
}

const WheelX100Page: React.FC<WheelX100PageProps> = ({
  setActiveTab,
  setActiveMiniGame,
  userStats,
  setUserStats,
  refreshUserStats,
}) => {
  const { t } = useLocales();
  const smDown = useResponsive('down', 'sm');
  const mdDown = useResponsive('down', 'md');
  const xsDown = useResponsive('down', 'xs');
  const [isLoading, setIsLoading] = useState(false);
  const [spinIndex, setSpinIndex] = useState<number | null>(null);
  const [prizes, setPrizes] = useState<Array<{
    [x: string]: any; text: string; desc: string; reward?: number; type?: string 
  }>>(
    Array(9).fill({ text: '10 Free Spins', desc: '' })
  );
  const [spinCost, setSpinCost] = useState<number>(100);
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const [timeUntilNextPlay, setTimeUntilNextPlay] = useState<number | null>(null); 

  const luckyWheelRef = useRef<HTMLDivElement>(null);
  const prizeCount = 9;
  const lastTickAngleRef = useRef<number>(0);

  const { get_wheel_100_prizes, play_wheel_100 } = useApi();

  const iconButtonSx = {
    color: '#FFF',
    width: 40,
    height: 40,
  };

  const backButtonSx = {
    background: '#232626',
    border: 'none',
    color: '#A0A3A7',
    borderRadius: '8px',
    width: '132px',
    height: '41px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    textTransform: 'uppercase' as const,
    fontFamily: 'FONTSPRING DEMO - Blunt Con It, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    '&:hover': {
      background: '#232626',
      opacity: 0.9,
    },
  };

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const response = await get_wheel_100_prizes();
        if (!response || !response.data || !response.data.data) {
          throw new Error('Invalid response structure: missing data.data');
        }
        if (!Array.isArray(response.data.data)) {
          console.error('response.data.data is not an array:', response.data.data);
          throw new Error(`Expected response.data.data to be an array, got ${typeof response.data.data}`);
        }
        setPrizes(
          response.data.data.map((prize: any) => ({
            text: prize.text || 'Unknown Prize',
            desc: prize.desc || '',
            reward: prize.reward || 0,
            type: prize.type || 'unknown',
            isSmallText: prize.isSmallText || false,
          }))
        );
        setSpinCost(response.data.cost || 100);
        setTimeUntilNextPlay(response.data.timeUntilNextPlay);
      } catch (error: any) {
        console.error('Error fetching wheel prizes:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load wheel prizes';
        toast.error(errorMessage, {
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
            background: '#FFFFFF',
          },
        });
      }
    };

    fetchPrizes();
  }, [get_wheel_100_prizes]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeUntilNextPlay && timeUntilNextPlay > 0) {
      interval = setInterval(() => {
        setTimeUntilNextPlay((prev) => (prev! > 1000 ? prev! - 1000 : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeUntilNextPlay]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleBack = useCallback(() => {
    if (setActiveMiniGame) {
      setActiveMiniGame(null);
    } else if (setActiveTab) {
      setActiveTab('mini-games');
    }
  }, [setActiveMiniGame, setActiveTab]);

  const handleHelp = useCallback(() => {
    setOpenHelpModal(true);
  }, []);

  const handleCloseHelpModal = useCallback(() => {
    setOpenHelpModal(false);
  }, []);

  const handleReset = useCallback(() => {
    setSpinIndex(null);
    if (luckyWheelRef.current) {
      luckyWheelRef.current.style.transform = 'rotate(0deg)';
    }
  }, []);

  const spinWheel = (prizeIndex: number, callback: (i: number) => void) => {
    if (isLoading || timeUntilNextPlay) return;

    const anglePerPrize = 360 / prizeCount;
    const pointerAngleOffset = 0;

    let target = (prizeIndex * anglePerPrize) + pointerAngleOffset;
    target += 360 * prizeCount;

    lastTickAngleRef.current = 0;
    spinCoroutine(target, prizeIndex, callback);
  };

  const spinCoroutine = (target: number, prizeIndex: number, callback: (i: number) => void) => {
    const duration = 10 * 1000;
    let start: number | null = null;
    let lastAngle = 0;

    const anglePerSegment = 360 / prizeCount;

    const animateWheel = (time: number) => {
      if (!start) start = time;
      const elapsedTime = time - start;

      const timeProgress = elapsedTime / duration;
      const easedT = 1 - (1 - timeProgress) ** 4;

      const currentAngle = (easedT * target) % 360;
      if (luckyWheelRef.current) {
        luckyWheelRef.current.style.transform = `rotate(${currentAngle}deg)`;
      }

      lastAngle = currentAngle;

      if (elapsedTime < duration) {
        requestAnimationFrame(animateWheel);
      } else {
        elasticEffect(target, prizeIndex, callback);
      }
    };

    requestAnimationFrame(animateWheel);
  };

  const elasticEffect = (target: number, prizeIndex: number, callback: (i: number) => void) => {
    const randomOffset = Math.random() * 10 - 5;
    const elasticDuration = 700;
    let start: number | null = null;

    const animateElastic = (time: number) => {
      if (!start) start = time;
      const elapsedTime = time - start;

      const elasticT = elapsedTime / elasticDuration;
      const easedElasticT = Math.sin(elasticT * Math.PI * 2) * (1 - elasticT);

      if (luckyWheelRef.current) {
        luckyWheelRef.current.style.transform = `rotate(${(target + randomOffset * easedElasticT) % 360}deg)`;
      }

      if (elapsedTime < elasticDuration) {
        requestAnimationFrame(animateElastic);
      } else {
        const currentAngle = target % 360;
        if (luckyWheelRef.current) {
          luckyWheelRef.current.style.transform = `rotate(${currentAngle}deg)`;
        }
        callback(prizeIndex);
      }
    };

    requestAnimationFrame(animateElastic);
  };

  const onPlay = async () => {
  if (isLoading || timeUntilNextPlay) return;
  if (userStats.points < spinCost) {
    toast.error(t('insufficient_points'));
    return;
  }

  setIsLoading(true);
  try {
    const response = await play_wheel_100();
    const { result, data, reward, points } = response.data;

    setUserStats((prevStats) => ({
      ...prevStats,
      points: prevStats.points - spinCost,
    }));

    if (result === 'lose') {
      setSpinIndex(-1);
      if (refreshUserStats) {
        try {
          await refreshUserStats();
        } catch (refreshError) {
          console.error('Failed to refresh user stats:', refreshError);
          setUserStats((prevStats) => ({
            ...prevStats,
            points: points || prevStats.points,
          }));
          toast(t('stats_update_failed_locally_updated'), { icon: '⚠️' });
        }
      } else {
        setUserStats((prevStats) => ({
          ...prevStats,
          points: points || prevStats.points,
        }));
      }
      toast('No prize won', {
        style: {
          border: '1px solid rgb(10, 10, 10)',
          padding: '16px',
          color: 'black',
          background: '#FFFFFF',
        },
        icon: '😔',
      });
      setTimeUntilNextPlay(86_400_000);
      setIsLoading(false);
      return;
    }

    setSpinIndex(data.index);
    spinWheel(data.index, async (index: number) => {
      let pointsAwarded = 0;
      if (data.type === 'points') {
        pointsAwarded = reward.pointsAwarded || 0;
      }

      if (refreshUserStats) {
        try {
          await refreshUserStats();
        } catch (refreshError) {
          console.error('Failed to refresh user stats:', refreshError);
          setUserStats((prevStats) => ({
            ...prevStats,
            points: (points || prevStats.points) + pointsAwarded,
          }));
          toast(t('stats_update_failed_locally_updated'), { icon: '⚠️' });
        }
      } else {
        setUserStats((prevStats) => ({
          ...prevStats,
          points: (points || prevStats.points) + pointsAwarded,
        }));
      }

      setIsLoading(false);
      let toastMessage = `You won: ${data.title}`;
      if (data.type === 'points') {
        toastMessage = `You won: ${reward.pointsAwarded} Points`;
      } else if (data.type === 'bonus_balance') {
        toastMessage = `You won: ${reward.bonusAwarded} Bonus Balance`;
      } else if (data.type === 'free_spin') {
        toastMessage = `You won: ${reward.freeSpins} Free Spins`;
      }
      toast(toastMessage, {
        style: {
          border: '1px solid rgb(0, 0, 0)',
          padding: '16px',
          color: 'black',
          background: '#FFFFFF',
        },
        icon: '🎉',
      });
      setTimeUntilNextPlay(86_400_000);
    });
  } catch (error: any) {
    setIsLoading(false);
    console.error('Error playing wheel:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to play wheel';
    toast.error(errorMessage, {
      style: {
        border: '1px solid rgb(5, 5, 5)',
        padding: '16px',
        color: 'black',
        background: '#FFFFFF',
      },
    });
    setUserStats((prevStats) => ({
      ...prevStats,
      points: prevStats.points + spinCost,
    }));
  }
};

  return (
    <Box
      sx={{
        bgcolor: '#1a2a1a',
        pt: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
        pb: { xs: 2, sm: 3, md: 4 },
        minHeight: '100%',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: { xs: 'visible', sm: 'auto' },
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(/assets/images/missions/wheel_50/wheel_bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          WebkitFilter: timeUntilNextPlay ? 'blur(2px) brightness(0.8)' : 'none',
          filter: timeUntilNextPlay ? 'blur(2px) brightness(0.8)' : 'none',
          zIndex: 0,
        }}
      />

      

      {timeUntilNextPlay && timeUntilNextPlay > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100, 
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            color: '#FFF',
            padding: 2,
            borderRadius: 1,
            filter: 'none',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Impact, sans-serif',
              fontSize: { xs: 18, sm: 24 },
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Timer till next game: {formatTime(timeUntilNextPlay)}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: { xs: 'static', sm: 'sticky' },
          top: { sm: 0 },
          zIndex: { xs: 'auto', sm: 1000 },
          mb: 1,
        }}
      >
        <Button
          onClick={handleBack}
          sx={backButtonSx}
          aria-label={t('back_button') || 'Back to Games'}
        >
          <Box
            sx={{
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderRight: '8px solid #A0A3A7',
              ml: '-2px',
            }}
          />
          Back to Games
        </Button>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            background: 'transparent',
            border: '1px solid #24ee89',
            borderRadius: '8px',
            padding: '4px 8px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
            filter: timeUntilNextPlay ? 'blur(2px)' : 'none',
          }}
        >
          <IconButton
            onClick={handleHelp}
            sx={iconButtonSx}
            aria-label={t('help_button') || 'Help'}
            disabled={!!timeUntilNextPlay} 
          >
            <Iconify icon="mdi:help-circle" sx={{ width: 24, height: 24 }} />
          </IconButton>
          <Box sx={{ height: '24px', width: '1px', border: '1px solid #fdf901ff' }} />
          <IconButton
            onClick={handleReset}
            sx={iconButtonSx}
            aria-label={t('reset_button') || 'Reset game'}
            disabled={!!timeUntilNextPlay} 
          >
            <Iconify icon="mdi:refresh" sx={{ width: 24, height: 24 }} />
          </IconButton>
        </Box>
      </Box>

      <Modal
        open={openHelpModal}
        onClose={handleCloseHelpModal}
        aria-labelledby="help-modal-title"
        aria-describedby="help-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: '#FFFFFF',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography
            id="help-modal-title"
            variant="h6"
            component="h2"
            sx={{
              fontFamily: 'Impact, sans-serif',
              fontWeight: 400,
              color: '#050514',
              mb: 2,
            }}
          >
            WHEELX100
          </Typography>
          <Typography
            id="help-modal-description"
            sx={{
              fontFamily: 'Cera Pro, sans-serif',
              fontSize: { xs: 14, sm: 16 },
              color: '#050514',
            }}
          >
            You could spin the WHEEL X100 once per a day for a fee in the form of points. The cost for each spin is
            shown under the wheel. Try your luck!
          </Typography>
          <Button
            onClick={handleCloseHelpModal}
            sx={{
              mt: 2,
              background: 'linear-gradient(90deg, #142214 0%, #357035 100%)',
              color: '#FFF',
              borderRadius: '8px',
              padding: '8px 16px',
              textTransform: 'none',
              fontFamily: 'Cera Pro, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              '&:hover': {
                background: 'linear-gradient(90deg, #1A2A1A 0%, #406A40 100%)',
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          mt: { xs: 10, sm: 5, md: 3 },
          mb: { xs: 2, sm: 3, md: 4 },
          zIndex: 2,
          filter: timeUntilNextPlay ? 'blur(2px)' : 'none',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: 250, sm: 350, md: 550 },
            height: { xs: 250, sm: 350, md: 550 },
            mb: { xs: 2, sm: 3, md: 4 },
            zIndex: 2,
            filter: timeUntilNextPlay ? 'blur(2px)' : 'none',
          }}
        >
          <Box
            component="img"
            src="/assets/images/missions/wheel_50/index.png"
            alt="Wheel Index"
            sx={{
              width: { xs: 25, sm: 30, md: 40 },
              height: 'auto',
              mb: -3,
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 4,
              filter: timeUntilNextPlay ? 'blur(2px)' : 'none',
            }}
          />

          <Box
            ref={luckyWheelRef}
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <Box
              component="img"
              src="/assets/images/missions/wheel_50/wheel.png"
              alt="Wheel"
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                zIndex: 2,
              }}
            />
            {prizes.map((option, index) => (
              <Box
                key={index}
                sx={{
                  height: { xs: 60, sm: 80, md: 100 },
                  transform: `rotate(${-1 * index * (360 / prizes.length)}deg)`,
                  position: 'absolute',
                  width: { xs: 30, sm: 40, md: 60 },
                  top: { xs: '8%', sm: '10%', md: '11%' },
                  left: '50%',
                  transformOrigin: { xs: '50% 100px', sm: '50% 140px', md: '50% 200px' },
                  translate: '-50% 0',
                  zIndex: 3,
                  filter: timeUntilNextPlay ? 'blur(2px)' : 'none',
                }}
              >
                <Typography
                  sx={{
                    fontSize: option.isSmallText ? { xs: 10, sm: 12, md: 18 } : { xs: 12, sm: 14, md: 28 },
                    
                    textAlign: 'center',
                    color: '#171A24',
                    fontWeight: 700,
                    fontFamily: 'Geogrotesque Cyr, sans-serif',
                  }}
                >
                  {option.text}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 8, sm: 10, md: 14 },
                    
                    textAlign: 'center',
                    color: '#171A24',
                    fontWeight: 700,
                    fontFamily: 'Geogrotesque Cyr, sans-serif',
                  }}
                >
                  {option.desc}
                </Typography>
              </Box>
            ))}
          </Box>

          <Button
            onClick={onPlay}
            sx={{
              position: 'absolute',
              top: '49%',
              left: '51%',
              transform: 'translate(-49%, -51%)',
              width: { xs: 50, sm: 70, md: 110 },
              height: { xs: 50, sm: 70, md: 110 },
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              zIndex: 5,
              opacity: timeUntilNextPlay ? 0.5 : 1,
              pointerEvents: timeUntilNextPlay ? 'none' : 'auto',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 3,
            filter: timeUntilNextPlay ? 'blur(2px)' : 'none',
          }}
        >
          <Box
            sx={{
              backgroundImage: `url(/assets/images/missions/wheel_50/bg_2.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              px: { xs: 1.5, sm: 2, md: 3 },
              py: { xs: 0.5, sm: 0.8, md: 1 },
              borderRadius: 1,
            }}
          >
            <Typography
              sx={{
                color: '#050514ff',
                fontSize: { xs: 18, sm: 16, md: 24 },
                fontWeight: 400,
                fontFamily: 'Impact, sans-serif',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              WHEEL X100
            </Typography>
          </Box>

          <Box
            sx={{
              mt: { xs: 1, sm: 1.5, md: 2 },
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'center', sm: 'center' }}
              spacing={{ xs: 0.5, sm: 1, md: 1 }}
            >
              <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1, md: 1 }}>
                <Typography
                  sx={{
                    color: '#FFFFFF',
                    fontSize: { xs: 16, sm: 14, md: 18 },
                    fontWeight: 700,
                    fontFamily: 'Geogrotesque Cyr',
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                  }}
                >
                  SPIN COST:
                </Typography>
                <Box
                  sx={{
                    background: 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
                    border: '1px solid #24ee89',
                    borderRadius: '2.56px',
                    px: { xs: 0.8, sm: 1, md: 1 },
                    py: { xs: 0.3, sm: 0.5, md: 0.5 },
                  }}
                >
                  <Typography
                    sx={{
                      color: '#24ee89',
                      fontSize: { xs: 16, sm: 14, md: 18 },
                      fontWeight: 700,
                      fontFamily: 'Geogrotesque Cyr',
                      fontStyle: 'italic',
                      textTransform: 'uppercase',
                    }}
                  >
                    {spinCost} POINTS
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1, md: 1 }}>
                <Typography
                  sx={{
                    color: '#FFFFFF',
                    fontSize: { xs: 16, sm: 14, md: 18 },
                    fontWeight: 700,
                    fontFamily: 'Geogrotesque Cyr',
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                  }}
                >
                  BALANCE:
                </Typography>
                <Box
                  sx={{
                    background: 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
                    border: '1px solid #24ee89',
                    borderRadius: '2.56px',
                    px: { xs: 0.8, sm: 1, md: 1 },
                    py: { xs: 0.3, sm: 0.5, md: 0.5 },
                  }}
                >
                  <Typography
                    sx={{
                      color: '#24ee89',
                      fontSize: { xs: 16, sm: 14, md: 18 },
                      fontWeight: 700,
                      fontFamily: 'Geogrotesque Cyr',
                      fontStyle: 'italic',
                      textTransform: 'uppercase',
                    }}
                  >
                    {userStats.points} POINTS
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WheelX100Page;