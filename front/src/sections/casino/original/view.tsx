import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Container, Stack, Typography, Chip } from '@mui/material';
import { isMobile } from 'react-device-detect';

import { useSelector } from 'src/store';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { useRouter, usePathname } from 'src/routes/hooks';
import { API_PATH, API_URL, GAME_API_URL } from 'src/config-global';
import { SplashScreen } from 'src/components/loading-screen';
import { useResponsive } from 'src/hooks/use-responsive';
import { useLocales } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

import { paths } from 'src/routes/paths';

export default function OriginalGameView() {
  useScrollToTop();

  const { token } = useSelector((store) => store.auth);
  const router = useRouter();
  const pathname = usePathname();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const game = params.get('game') || '';

  const { t, currentLang } = useLocales();
  const smDown = useResponsive('down', 'sm');

  const [areIconsLoaded, setAreIconsLoaded] = useState(false);

  const banners = useSelector((state) => state.config.banners);

  const validGames = [
    'crash',
    'coinflip',
    'plinko',
    'mines',
    'dice',
    'wheel',
    'blackjack',
    'roulette',
    'slide',
    'keno',
    'hilo',
    'hilo_multi',
    'diamonds',
    'videopoker',
    'flowerpoker',
    'limbo',
    'baccarat_single',
    'baccarat_multi',
    'goal',
  ];

  // Убираем автоматический запуск игры - показываем только базовый URL без конкретной игры
  const GAME_URL = !token
    ? `${GAME_API_URL}?baseUrl=${API_URL}`
    : `${GAME_API_URL}?token=${token}&getUser=${API_URL}${API_PATH.GET_GAME_USER}&baseUrl=${API_URL}`;
  console.log("GAME_URL", GAME_URL);
  const ALL = useMemo(
    () => [
      {
        label: t('original'),
        icon: '/assets/icons/casino/category/all.png',
        url: paths.casino.original,
      },
      {
        label: t('top_games'),
        icon: '/assets/icons/casino/category/top_games.png',
        url: paths.casino.top_games,
      },
      {
        label: t('poker'),
        icon: '/assets/icons/casino/category/poker.png',
        url: `${paths.casino.live}/live-casino-poker`,
      },
      {
        label: t('blackjack'),
        icon: '/assets/icons/casino/category/blackjack.png',
        url: `${paths.casino.live}/live-casino-blackjack`,
      },
      {
        label: t('slots'),
        icon: '/assets/icons/casino/category/slots.png',
        url: `${paths.casino.slot}/casino-slots`,
      },
      {
        label: t('roulette'),
        icon: '/assets/icons/casino/category/roulette.png',
        url: `${paths.casino.live}/live-casino-roulette`,
      },
      {
        label: t('dice'),
        icon: '/assets/icons/casino/category/dice.png',
        url: `${paths.casino.slot}/casino-dice`,
      },
      {
        label: t('lobby'),
        icon: '/assets/icons/casino/category/lobby.png',
        url: `${paths.casino.lobby}/live-casino-lobby`,
      },
      {
        label: t('other'),
        icon: '/assets/icons/casino/category/other.png',
        action: 'openProvidersPopup',
      },
    ],
    [t]
  );

  const handleCategoryClick = (row: any) => {
    if (row.url) {
      router.push(`/${currentLang.value}${row.url}`);
    } else if (row.action === 'openProvidersPopup') {
      console.log('Open providers popup');
    }
  };

  // Определяем активный элемент меню на основе текущего pathname
  const activeMenuIndex = useMemo(() => {
    // Убираем язык из пути для сравнения
    const pathWithoutLang = pathname.replace(`/${currentLang.value}`, '');

    // Ищем индекс элемента, чей URL совпадает с текущим путем
    const foundIndex = ALL.findIndex((item) => {
      if (!item.url) return false;
      // Проверяем точное совпадение или если текущий путь начинается с URL элемента
      return pathWithoutLang === item.url || pathWithoutLang.startsWith(item.url);
    });

    // Если найден подходящий элемент, возвращаем его индекс
    if (foundIndex !== -1) {
      return foundIndex;
    }

    // Если ничего не найдено, возвращаем индекс 'other' (последний элемент)
    return ALL.length - 1;
  }, [pathname, currentLang.value, ALL]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAreIconsLoaded(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const banner = banners.find((b) => b.type === 'casino_category_slot');

  return (
    <Container
      maxWidth={false}
      sx={{
        p: 0,
        m: 0,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Stack gap={{ xs: 2, sm: 3 }} px={{ xs: 2, sm: 3 }} sx={{ flexShrink: 0 }}>
        <Stack
          sx={{
            width: 1,
            height: { xs: 100, sm: 150 },
            borderRadius: 0.8,
            position: 'relative',
            bgcolor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            ...(banner?.image && {
              background: `url(${API_URL}/${banner?.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }),
          }}
        >
          {/* Inset yellow border */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              p: 1.5,
              pointerEvents: 'none',
            }}
          >
            <Box sx={{ border: '3px solid #24ee89', borderRadius: 0.8, width: '100%', height: '100%' }} />
          </Box>
          <Stack direction="row" gap={1.5} alignItems="center" sx={{ zIndex: 1 }}>
            <Box
              sx={{
                height: 2,
                width: { xs: 40, sm: 70 },
                background: 'linear-gradient(90deg, #24ee89 0%, rgba(255,231,26,0) 100%)',
              }}
            />
            <Typography 
              variant="h3" 
              textTransform="uppercase"
              sx={{
                fontFamily: '"Impact", "CircularStd", sans-serif !important',
                fontWeight: '700 !important',
                fontStyle: 'italic !important',
                fontSize: { xs: '28px', sm: '42px' },
                lineHeight: { xs: '26px', sm: '38px' },
                letterSpacing: '0.05em !important',
                textAlign: 'center',
                transform: 'skewX(-5deg) !important',
                transformOrigin: 'left center !important',
              }}
            >
              {t('original_games')}
            </Typography>
            <Box
              sx={{
                height: 2,
                width: { xs: 40, sm: 70 },
                background: 'linear-gradient(270deg, #24ee89 0%, rgba(255,231,26,0) 100%)',
              }}
            />
          </Stack>
        </Stack>

        <Box sx={{ px: 0.1 }}>
          <Stack
            direction="row"
            spacing={{ xs: 3, sm: 5 }}
            sx={{
              justifyContent: 'flex-start',
              py: 2,
              borderBottom: '1px solid #2B2F3D',
              pb: 2,
              overflowX: 'auto', // Горизонтальная прокрутка на мобильных
              '&::-webkit-scrollbar': {
                display: 'none', // Скрываем скроллбар
              },
              scrollbarWidth: 'none', // Для Firefox
            }}
          >
            {ALL.map((item, index) => {
              const isActive = index === activeMenuIndex;
              const isOther = item.action === 'openProvidersPopup';
              return (
                <Typography
                  key={index}
                  onClick={() => !isOther && handleCategoryClick(item)}
                  sx={{
                    cursor: isOther ? 'default' : 'pointer',
                    fontSize: { xs: 14, sm: 16 },
                    fontWeight: 500,
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    textTransform: 'uppercase',
                    flexShrink: 0, // Не сжимается при прокрутке
                    whiteSpace: 'nowrap', // Текст не переносится
                    color: isActive ? '#24ee89' : '#A0A3A7',
                    position: 'relative',
                    pb: 1,
                    zIndex: 1,
                    transition: 'color 0.3s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: -2,
                      height: 16,
                      background: 'linear-gradient(0deg, rgba(255,231,26,0.6) 0%, rgba(255,231,26,0) 100%)',
                      opacity: 0,
                      pointerEvents: 'none',
                      transition: 'opacity 0.3s ease',
                      zIndex: 0,
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: -2,
                      height: '2px',
                      background: '#24ee89',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      zIndex: 0,
                    },
                    ...(!isOther && {
                      '&:hover': {
                        color: '#24ee89',
                        '&::before': { opacity: 1 },
                        '&::after': { opacity: 1 },
                      },
                    }),
                    ...(isActive && {
                      '&::before': { opacity: 1 },
                      '&::after': { opacity: 1 },
                    }),
                  }}
                >
                  {item.label}
                </Typography>
              );
            })}
          </Stack>
        </Box>
      </Stack>

      <Box
        sx={{
          mt: 2,
          flexShrink: 0,
          position: 'relative',
          border: '3px solid #CAAE51',
          borderRadius: 1,
        }}
      >
        <SplashScreen
          sx={{
            position: 'absolute',
            bgcolor: 'transparent',
            borderRadius: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        />
        <Box
          component="iframe"
          src={GAME_URL}
          allow="autoplay; screen-wake-lock; fullscreen *;"
          sx={{
            position: 'relative',
            width: '100%',
            minHeight: '120vh',
            border: 0,
            zIndex: 2,
            borderRadius: 0,
          }}
        />
      </Box>
    </Container>
  );
}
