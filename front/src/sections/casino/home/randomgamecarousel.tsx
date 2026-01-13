/* eslint-disable no-nested-ternary */
import { useState, useRef, useEffect, useCallback } from 'react';
import { Stack, Typography, Skeleton, Button, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import type { SwiperInstance } from 'src/types/swiper';
import useLocales from 'src/locales/use-locales';
import Image from 'src/components/image';
import type { ICasinoGame } from 'src/types';
import { getImageUrl } from 'src/utils';
import './RandomGameCarousel.css';

interface RandomGameCarouselProps {
  randomGames: ICasinoGame[];
  playGame: (type: string | undefined, provider_code: string, game_code: string, game_name: string) => void;
}

const RandomGameCarousel = ({ randomGames, playGame }: RandomGameCarouselProps) => {
  const { t } = useLocales();
  const currentGameIndexRef = useRef(0);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [cardSize, setCardSize] = useState({ width: 100, height: 100 });
  const [slidesPerView, setSlidesPerView] = useState(3);

  const isNarrowScreen = window.innerWidth < 400;

  const updateLayout = useCallback(() => {
  const container = document.querySelector('.random-game-swiper')?.parentElement;
  const availableWidth = container ? container.clientWidth : window.innerWidth;

  let newWidth = 100;
  let newHeight = 100;
  let newSlidesPerView = 3;

  if (availableWidth < 400) {
    newWidth = 100;
    newHeight = 100;
    newSlidesPerView = 3;
  } else if (availableWidth < 600) {
    newWidth = 100;
    newHeight = 100;
    newSlidesPerView = 3;
  } else {
    newWidth = availableWidth < 900 ? 110 : availableWidth < 1200 ? 115 : availableWidth < 1440 ? 130 : availableWidth < 1920 ? 140 : 160;
    newHeight = newWidth;
    const totalCardWidth = newWidth;
    const margin = availableWidth < 600 ? 2 : availableWidth >= 1024 ? 4 : 2;
    const spaceBetween = availableWidth < 600 ? 1 : 2;
    const totalSpacePerCard = totalCardWidth + (margin * 2) + spaceBetween;
    newSlidesPerView = Math.max(3, Math.floor(availableWidth / totalSpacePerCard));

    if (availableWidth >= 853 && availableWidth <= 1258) newSlidesPerView = 5;
    else if (availableWidth < 1000) newSlidesPerView = 5;
    else if (availableWidth >= 1024 && availableWidth < 1440) newSlidesPerView = 5;

    if (newSlidesPerView % 2 === 0) newSlidesPerView = Math.max(3, newSlidesPerView - 1);
    newSlidesPerView = Math.min(newSlidesPerView, 7);
  }

  setCardSize({ width: newWidth, height: newHeight });
  setSlidesPerView(newSlidesPerView);
}, []);

useEffect(() => {
  updateLayout();
  window.addEventListener('resize', updateLayout);
  return () => window.removeEventListener('resize', updateLayout);
}, [updateLayout]);

  const getScaleForIndex = (index: number, activeIndex: number) => {
    const distance = Math.abs(index - activeIndex);
    if (isNarrowScreen) {
      if (distance === 0) return 1;
      if (distance === 1) return 0.65;
      if (distance === 2) return 0.6;
      if (distance === 3) return 0.5;
      return 0.5;
    }

    let scale;
    if (distance === 0) {
      if (window.innerWidth >= 1920) {
        scale = 1.5;
      } else if (window.innerWidth >= 800) {
        scale = 1.4;
      } else {
        scale = 1.3;
      }
    } else if (distance === 1) {
      scale = window.innerWidth >= 1920 ? 1.0 : 0.9;
    } else if (distance === 2) {
      scale = window.innerWidth >= 1920 ? 0.8 : 0.7;
    } else if (distance === 3) {
      scale = window.innerWidth >= 1920 ? 0.6 : 0.5;
    } else {
      scale = 0.4;
    }
    return scale;
  };

  const getMarginForIndex = (index: number, activeIndex: number) => {
    const distance = Math.abs(index - activeIndex);
    if (distance === 1) {
      if (isNarrowScreen) return { marginLeft: '5px', marginRight: '5px' };
      if (window.innerWidth >= 1024) return { marginLeft: '4px', marginRight: '4px' };
      return { marginLeft: '2px', marginRight: '2px' };
    }
    return { marginLeft: '1px', marginRight: '1px' };
  };

  return (
    <Stack
      sx={{
        position: 'relative',
        width: '100%',
        bgcolor: '#232626',
        backdropFilter: 'blur(8px)',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <Stack
        gap={2}
        sx={{
          mt: 3,
          px: 1,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
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
            fontSize: { xs: 20, md: 28 },
            fontWeight: 'bold',
          }}
        >
          <span style={{ color: '#24ee89' }}>{t('need_help')}</span>{' '}
          <span style={{ color: '#FFFFFF' }}>{t('picking_game')}</span>
        </Typography>
        <Typography
          variant="h1"
          textAlign="center"
          color="#FFFFFF"
          sx={{
            fontSize: { xs: 12, md: 20 },
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          {t('biggest_giveaway')}
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
            borderTop: '19px solid #24ee89',
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
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            reverseDirection: false,
          }}
          modules={[Autoplay, Navigation]}
          className="random-game-swiper"
          onSlideChange={(swiperInstance: SwiperInstance) => {
            currentGameIndexRef.current = swiperInstance.realIndex;
            setCurrentGameIndex(swiperInstance.realIndex);
          }}
          onInit={(swiperInstance: SwiperInstance) => {
            currentGameIndexRef.current = Math.floor(randomGames.length / 2);
            setCurrentGameIndex(currentGameIndexRef.current);
            swiperInstance.slideTo(currentGameIndexRef.current, 0);
          }}
        >
          {randomGames.length === 0 ? (
            [...Array(7)].map((_, index: number) => (
              <SwiperSlide key={index} style={{ backgroundColor: 'transparent' }}>
                <Stack gap={1}>
                  <Skeleton
                    sx={{
                      width: cardSize.width,
                      height: cardSize.height,
                      borderRadius: 2,
                      border: '2px solid #24ee89',
                      bgcolor: '#15221F',
                    }}
                  />
                </Stack>
              </SwiperSlide>
            ))
          ) : (
            randomGames.map((game: ICasinoGame, index: number) => (
              <SwiperSlide key={index} style={{ backgroundColor: 'transparent' }}>
                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  {index === currentGameIndex && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: {
                          xs: '45%',
                          sm: '90%'
                        },
                        left: '50%',
                        transform: {
                          xs: 'translate(-50%, -50%)',
                          sm: 'translate(-50%, -70%)'
                        },
                        width: { 
                          xs: cardSize.width * 1.7,
                          sm: cardSize.width * 2.5, 
                          md: cardSize.width * 3 
                        },
                        height: { 
                          xs: cardSize.height * 1.7,
                          sm: cardSize.height * 2.5, 
                          md: cardSize.height * 3 
                        },
                        zIndex: 1,
                        backgroundImage: 'url(/assets/images/casino/home/moln.png)',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: { 
                          xs: 0.9,
                          sm: 0.6 
                        },
                      }}
                    />
                  )}
                  <Stack
                    sx={{
                      cursor: 'pointer',
                      m: 0.5,
                      mb: 1,
                      p: 0.5,
                      width: cardSize.width,
                      height: cardSize.height,
                      aspectRatio: '1 / 1',
                      transition: 'transform 0.7s ease-in-out, box-shadow 0.7s ease-in-out',
                      transform: `scale(${getScaleForIndex(index, currentGameIndex)})`,
                      borderRadius: 2,
                      overflow: 'visible',
                      bgcolor: '#15221F',
                      boxShadow: index === currentGameIndex ? '0 0 10px #24ee89, 0 0 0 2px #24ee89' : '0 0 0 2px #24ee89',
                      ...getMarginForIndex(index, currentGameIndex),
                      zIndex: 2,
                    }}
                    onClick={() => playGame(game.type, game.provider_code, game.game_code, game.game_name)}
                  >
                    <Image
                      sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 2,
                        backgroundColor: '#15221F',
                        '& img': {
                          objectFit: 'contain',
                          width: '100%',
                          height: '100%',
                          objectPosition: 'center',
                        },
                      }}
                      src={getImageUrl(game.banner)}
                    />
                  </Stack>
                </Box>
              </SwiperSlide>
            ))
          )}
        </Swiper>

        <Button
          variant="contained"
          color="primary"
          sx={{
            px: { xs: 4, md: 6 },
            py: { xs: 1, md: 2 },
            bgcolor: '#24ee89',
            color: '#050514ff',
            fontWeight: '700',
            borderRadius: 1,
            fontSize: { xs: 16, md: 16 },
            textTransform: 'uppercase',
            mt: { xs: 4, md: 7 },
          }}
          onClick={() => {
            if (randomGames.length > 0) {
              const currentGame = randomGames[currentGameIndex];
              playGame(currentGame.type, currentGame.provider_code, currentGame.game_code, currentGame.game_name);
            }
          }}
        >
          {t('play_random_game')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default RandomGameCarousel;