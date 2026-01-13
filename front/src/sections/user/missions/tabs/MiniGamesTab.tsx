/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { Typography, Box, Stack, CardMedia, Button, IconButton } from '@mui/material';
import { useResponsive } from 'src/hooks/use-responsive';
import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locales';
import type { MiniGame } from 'src/types/mission';
import useApi from 'src/hooks/use-api';

const preventDefaultInteractions = (e: React.SyntheticEvent) => {
  e.preventDefault();
};

type MiniGamesTabProps = {
  setActiveTab?: (tab: string) => void;
  setActiveMiniGame?: (miniGame: string | null) => void;
};

export default function MiniGamesTab({ setActiveTab, setActiveMiniGame }: MiniGamesTabProps) {
  const { t } = useLocales();
  const smDown = useResponsive('down', 'sm');

  const { get_scratch_game, get_wheel_50_prizes, get_wheel_100_prizes } = useApi();

  const [miniGames, setMiniGames] = useState<MiniGame[]>([
    {
      id: 1,
      title: 'WHEEL X 50',
      description: 'Spin and win incredible prizes!',
      image: '/assets/images/missions/wheel2.png',
      points: 10,
    },
    {
      id: 2,
      title: 'LUCKVERSE777',
      description: 'Scratch and win prizes!',
      image: '/assets/images/missions/scratch.png',
      points: 5,
    },
    {
      id: 3,
      title: 'WHEEL X 100',
      description: 'Spin and win incredible prizes!',
      image: '/assets/images/missions/wheel2.png',
      points: 10,
    },
  ]);

  useEffect(() => {
    if (setActiveTab) {
      setActiveTab('mini-games');
    }

    const fetchGameCosts = async () => {
      try {
        const [wheel50Response, scratchResponse, wheel100Response] = await Promise.all([
          get_wheel_50_prizes(),
          get_scratch_game(),
          get_wheel_100_prizes(),
        ]);

        const wheel50Cost = wheel50Response?.data?.cost || 50;
        const scratchCost = scratchResponse?.data?.cost || 2;
        const wheel100Cost = wheel100Response?.data?.cost || 100;

        setMiniGames((prevGames) =>
          prevGames.map((game) => {
            if (game.id === 1) return { ...game, points: wheel50Cost };
            if (game.id === 2) return { ...game, points: scratchCost };
            if (game.id === 3) return { ...game, points: wheel100Cost };
            return game;
          })
        );
      } catch (error) {
        console.error('Error fetching game costs:', error);
        setMiniGames((prevGames) =>
          prevGames.map((game) => {
            if (game.id === 1) return { ...game, points: 50 };
            if (game.id === 2) return { ...game, points: 2 };
            if (game.id === 3) return { ...game, points: 100 };
            return game;
          })
        );
      }
    };

    fetchGameCosts();
  }, [get_scratch_game, get_wheel_50_prizes, get_wheel_100_prizes, setActiveTab]);

  const handleScratchGameClick = () => {
    if (setActiveMiniGame) {
      setActiveMiniGame('scratch-game');
    }
  };

  const handleWheelGameClick = () => {
    if (setActiveMiniGame) {
      setActiveMiniGame('wheel-game');
    }
  };

  const handleWheelX100GameClick = () => {
    if (setActiveMiniGame) {
      setActiveMiniGame('wheel-x100-game');
    }
  };

  return (
    <Stack
      sx={{
        px: smDown ? { xs: 3, pr: 0 } : 3,
        py: 1.8,
        width: 1,
        height: 1,
        gap: 2,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
      onDragStart={preventDefaultInteractions}
      onTouchStart={preventDefaultInteractions}
      onTouchMove={preventDefaultInteractions}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        sx={{
          width: 1,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        {!smDown && (
          <Typography
            sx={{
              '&.MuiTypography-root': {
                fontSize: '32px',
                fontWeight: '700',
                fontFamily: 'Geogrotesque Cyr',
                fontStyle: 'italic',
              },
              textTransform: 'uppercase',
              transform: 'skew(-5deg)',
              color: '#A0A3A7',
              lineHeight: '100%',
              letterSpacing: '0%',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }}
          >
            {t('mini_games')}
          </Typography>
        )}
        {smDown && (
          <IconButton sx={{ p: 0, mr: 0 }}>
            <Iconify icon="mdi:history" sx={{ width: 28, height: 28 }} />
          </IconButton>
        )}
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          gap: 2,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        {miniGames.map((miniGame, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            onClick={
              index === 0
                ? handleWheelGameClick
                : index === 1
                ? handleScratchGameClick
                : index === 2
                ? handleWheelX100GameClick
                : undefined
            }
            sx={{
              borderRadius: '4px', // Увеличиваем радиус для лучшего вида
              border: '1px solid',
              borderImage:
                'linear-gradient(270deg, #24ee89 -0.26%, #24ee89 70.16%) 1',
              bgcolor: '#2B2F3D',
              position: 'relative',
              cursor: index === 0 || index === 1 || index === 2 ? 'pointer' : 'default',
              overflow: 'hidden',
            }}
          >
            {/* Фон для карточек с колесом */}
            {index !== 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '52%',
                  height: '100%',
                  backgroundImage: `url(/assets/images/missions/mini_bg.png)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'left center',
                  zIndex: 0,
                  clipPath: 'polygon(0 0, 100% 0, 55% 100%, 0 100%)',
                }}
              />
            )}

            {/* Фон для карточки скретча */}
            {index === 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '45%',
                  height: '100%',
                  backgroundImage: `url(/assets/images/missions/new_bg_scrath.png)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'left center',
                  zIndex: 0,
                  clipPath: 'polygon(0 0, 100% 0, 55% 100%, 0 100%)',
                }}
              />
            )}

            <Box
              p={1.5}
              sx={{
                ...(index !== 1 && {
                  ml: '8%', // Увеличиваем отступ для колес, чтобы показать больше фона
                  bgcolor: 'transparent',
                  borderRadius: 50,
                }),
                ...(index === 1 && {
                  ml: '2%',
                  bgcolor: 'transparent',
                }),
                position: 'relative',
                zIndex: 2,
              }}
            >
              <CardMedia
                component="img"
                src={miniGame.image}
                alt={miniGame.title}
                sx={{
                  width: index === 1 ? 260 : 185, // Увеличиваем лого скретча
                  minWidth: index === 1 ? 220 : 145,
                  borderRadius: 50,
                  objectFit: 'contain',
                  aspectRatio: '1/1',
                }}
              />
            </Box>

            <Stack
              sx={{
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: 2,
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Button
                sx={{
                  borderRadius: '2.56px',
                  background: 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
                  border: '1px solid #24ee89',
                  px: 0.7,
                  py: 0.3,
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: 'Geogrotesque Cyr',
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#24ee89',
                }}
              >
                {miniGame.points} POINTS
              </Button>

              <Stack
                sx={{
                  ml: smDown ? 0 : undefined,
                  pl: smDown ? 0 : undefined,
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    color: '#FFF',
                    fontWeight: 600,
                    fontSize: 28,
                    fontFamily: 'Geogrotesque Cyr, sans-serif',
                    textTransform: 'uppercase',
                  }}
                >
                  {index === 0 || index === 2 ? (
                    // WHEEL white + X 50 / X 100 yellow
                    <>
                      <span style={{ color: '#FFF' }}>WHEEL </span>
                      <span style={{ color: '#24ee89' }}>
                        {miniGame.title.replace('WHEEL ', '')}
                      </span>
                    </>
                  ) : (
                    // luckverse777 fully yellow
                    <span style={{ color: '#24ee89' }}>{miniGame.title}</span>
                  )}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    fontFamily: 'Geogrotesque Cyr',
                    textTransform: 'uppercase',
                  }}
                >
                  {miniGame.description}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Box>
    </Stack>
  );
}
