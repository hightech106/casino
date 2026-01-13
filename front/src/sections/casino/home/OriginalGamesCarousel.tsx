/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-shadow */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Stack, Typography, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import type { SwiperInstance } from 'src/types/swiper';
import Image from 'src/components/image';
import { useLocales } from 'src/locales';

import { useResponsive } from 'src/hooks/use-responsive';

import 'swiper/css';

interface Game {
  name: string;
  displayName: string;
  image: string;
  url: string;
}

interface OriginalGamesGridSectionProps {
  originalGames: Game[];
  currentLang: { value: string };
  paths: { casino: { original: string } };
}

const OriginalGamesGridSection = (
  { originalGames, currentLang, paths }: OriginalGamesGridSectionProps
) => {
  const { t } = useLocales();
  const smDown = useResponsive('down', 'sm');
  const [slidesPerView, setSlidesPerView] = useState<number>(smDown ? 3 : 5);
  const [cardSize, setCardSize] = useState<{ width: number; height: number }>({ width: 60, height: 90 });
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const isNarrowScreen = window.innerWidth < 400;
  const ASPECT_RATIO = 1;

  const updateLayout = useCallback(() => {
    const container = document.querySelector('.original-game-swiper')?.parentElement;
    const availableWidth = container ? container.clientWidth : window.innerWidth;

    const newWidth = isNarrowScreen ? 100 : availableWidth < 600 ? 120 : availableWidth < 900 ? 150 : availableWidth < 1200 ? 180 : availableWidth < 1440 ? 200 : availableWidth < 1920 ? 150 : 200;
    const newHeight = newWidth / ASPECT_RATIO;
    let newSlidesPerView = smDown ? 3 : Math.max(3, Math.min(5, Math.floor(availableWidth / (newWidth + (availableWidth < 600 ? 2 : availableWidth >= 1024 ? 4 : 2) * 2 + (availableWidth < 600 ? 1 : 2)))));

    if (newSlidesPerView % 2 === 0) {
      newSlidesPerView = Math.max(3, newSlidesPerView - 1);
    }

    setCardSize({ width: newWidth, height: newHeight });
    setSlidesPerView(newSlidesPerView);
  }, [smDown, isNarrowScreen, ASPECT_RATIO]);

  useEffect(() => {
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [updateLayout]);

  const getScaleForIndex = useCallback((index: number, activeIndex: number) => {
    const distance = Math.abs(index - activeIndex);
    if (window.innerWidth < 400) {
      return distance === 0 ? 1.5 : distance === 1 ? 0.65 : distance === 2 ? 0.6 : distance === 3 ? 0.5 : 0.5;
    }
    return distance === 0 ? (window.innerWidth >= 1920 ? 1.1 : 1.0)
      : distance === 1 ? 0.7
        : distance === 2 ? 0.6
          : distance === 3 ? 0.4
            : 0.2;
  }, []);

  const getMarginForIndex = useCallback((index: number, activeIndex: number) => {
    const distance = Math.abs(index - activeIndex);
    return distance === 1
      ? window.innerWidth < 400 ? { marginLeft: '5px', marginRight: '5px' }
        : window.innerWidth >= 1024 ? { marginLeft: '4px', marginRight: '4px' }
          : { marginLeft: '2px', marginRight: '2px' }
      : { marginLeft: '1px', marginRight: '1px' };
  }, []);

  return (
    <Grid
      item
      xs={12}
      sm={6}
      sx={{
        position: 'relative',
        px: { xs: 0, sm: 3 },
        py: 0,
        maxHeight: { xs: 300, sm: 400, md: 450 },
      }}
    >
      <Stack
        sx={{
          position: 'relative',
          width: '100%',
          bgcolor: '#232626',
          backdropFilter: 'blur(8px)',
          borderRadius: 1,
          overflow: 'visible',
          maxHeight: { xs: 300, sm: 700, md: 450 },
        }}
      >
        <Stack
          gap={0.5}
          sx={{
            px: 1,
            pt: 0,
            pb: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            minHeight: { xs: 300, md: 400 },
            borderRadius: 1,
            bgcolor: '#232626',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h2"
            textAlign="center"
            sx={{
              fontSize: { xs: 29, md: 32 },

              fontWeight: 'bold',

              color: '#FFFFFF',
              mt: 0.5,
            }}
          >
            <span style={{ color: '#FEDC85' }} >{t('original')}</span><span style={{ color: '#FFFFFF' }}> {t('games')}</span>
          </Typography>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '19px solid #FEDC85',
              zIndex: 10,
              mb: { xs: '2px', sm: '5px' },
            }}
          />
          <Swiper
            grabCursor
            centeredSlides
            speed={1500}
            spaceBetween={2}
            slidesPerView={slidesPerView}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            modules={[Autoplay, Navigation]}
            className="original-game-swiper"
            style={{ width: '100%', height: '200px', paddingTop: '1%', paddingBottom: '0%' }}
            onSlideChange={(swiper: SwiperInstance) => setActiveIndex(swiper.realIndex)}
            onSwiper={(swiper: SwiperInstance) => {
              swiperRef.current = swiper;
              setActiveIndex(swiper.realIndex);
            }}
          >
            {originalGames.map((game: Game, index: number) => {
              const scale = getScaleForIndex(index, activeIndex);
              const margin = getMarginForIndex(index, activeIndex);
              return (
                <SwiperSlide key={index} style={{ backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Link
                    to={`/${currentLang.value}${paths.casino.original}?game=${game.name}`}
                    style={{ textDecoration: 'none' }}
                    aria-label={`Play ${game.displayName} game`}
                  >
                    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                      {index === activeIndex && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: { xs: '45%', sm: '90%' },
                            left: '50%',
                            transform: { xs: 'translate(-50%, -50%)', sm: 'translate(-50%, -70%)' },
                            width: { xs: cardSize.width * 1.7, sm: cardSize.width * 2.5, md: cardSize.width * 3 },
                            height: { xs: cardSize.height * 1.7, sm: cardSize.height * 2.5, md: cardSize.height * 3 },
                            zIndex: 1,
                            backgroundImage: 'url(/assets/images/casino/home/moln.png)',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            opacity: { xs: 0.9, sm: 0.6 },
                          }}
                        />
                      )}
                      <Stack
                        sx={{
                          cursor: 'pointer',
                          m: 0.1,
                          mb: 1,
                          p: 0.5,
                          width: cardSize.width,
                          height: cardSize.height,
                          transition: 'transform 0.7s ease-in-out, box-shadow 0.7s ease-in-out, filter 0.7s ease-in-out',
                          transform: `scale(${scale})`,
                          borderRadius: 0,
                          overflow: 'visible',
                          bgcolor: '#15221F',
                          boxShadow: index === activeIndex ? '0 0 10px #FEDC85, 0 0 0 2px #FEDC85' : '0 0 0 2px #FEDC85',
                          filter: index === activeIndex ? 'none' : 'blur(2px)',
                          ...margin,
                          zIndex: 2,
                        }}
                      >
                        <Image
                          alt={game.displayName}
                          src={game.image}
                          sx={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 0,
                            backgroundColor: '#15221F',
                            '& img': {
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%',
                              objectPosition: 'center',
                              display: 'block',
                            },
                          }}
                        />
                      </Stack>
                    </Box>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <Button
            component={Link}
            to={`/${currentLang.value}${paths.casino.original}`}
            variant="contained"
            sx={{
              px: { xs: 6, md: 6 },
              py: { xs: 1, md: 2 },
              bgcolor: '#CAAE51',
              color: '#FFF',
              fontWeight: 'bold',
              borderRadius: 1,
              fontSize: { xs: 16, md: 18 },
              textTransform: 'uppercase',
              mt: 0.5,
              alignSelf: 'center',
            }}
          >
            {t('show_all')}
          </Button>
        </Stack>
      </Stack>
    </Grid>
  );
};

export default OriginalGamesGridSection;