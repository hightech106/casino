import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  ToggleButtonGroup,
} from '@mui/material';
import type { LinearProgressProps } from '@mui/material/LinearProgress';
import ToggleButton from '@mui/material/ToggleButton';
import { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

import { Swiper, SwiperSlide } from 'swiper/react';
import SvgColor from 'src/components/svg-color';
import type { ICasinoGame, ICasinoProvider } from 'src/types';
import { memo, useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter, useSearchParams, usePathname } from 'src/routes/hooks';
import { useLocales } from 'src/locales';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSelector } from 'src/store';

import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { Transitions } from 'src/components/animate';
import Image from 'src/components/image';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { API_URL } from 'src/config-global';
import { paths } from 'src/routes/paths';
import { capitalize, getImageUrl } from 'src/utils';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: { border: 0 },
    position: 'relative',
    '&:not(:last-child)::after': {
      content: '""',
      position: 'absolute',
      right: 0,
      top: 0,
      height: '100%',
      width: '2px',
      backgroundColor: '#786023',
      zIndex: 1,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]: {
    marginLeft: 0,
  },
}));

const MemoizedListItem = memo(
  ({ item }: { item: ICasinoGame }) => {
    const { t, currentLang } = useLocales();
    const { type } = useParams();
    const router = useRouter();

    const formatGameName = useCallback(
      (name: string) =>
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, ''),
      []
    );

    const playGame = useCallback(() => {
      const formattedGameName = formatGameName(item.game_name);
      router.push(
        `/${currentLang.value}${paths.casino.root}/${type}/${item.provider_code}/${formattedGameName}/${item.game_code}/play`
      );
    }, [
      formatGameName,
      currentLang.value,
      type,
      item.game_name,
      item.provider_code,
      item.game_code,
      router,
    ]);

    return (
      <Box
        sx={{
          m: 0.5,
          boxShadow: 'rgba(27, 23, 23, 0.2) 0px 4px 6px -1px, rgba(0, 0, 0, 0.12) 0px 2px 4px -1px',
          cursor: 'pointer',
          display: 'inline-flex',
          flexDirection: 'column',
          width: {
            xs: 'calc(50% - 8px)', // 2 карточки на мобильных
            sm: 'calc(50% - 8px)', // 2 карточки на маленьких планшетах
            md: 'calc(20% - 8px)', // 5 карточек на планшетах
            lg: 'calc(16.66% - 8px)', // 6 карточек на ноутбуках
            xl: 'calc(14.28% - 8px)', // 7 карточек на больших экранах
          },
          height: { xs: 'auto', sm: '240px' },
          aspectRatio: { xs: '3 / 4', sm: 'auto' },
          position: 'relative',
          transition: 'all 0.5s ease',
          zIndex: 1,
          borderRadius: '8px',
          overflow: 'hidden',
          ':hover': {
            zIndex: 5,
            transform: 'translateY(-10px)',
            border: '2px solid #24ee89',
            boxShadow: '0 0 20px rgba(138, 43, 226, 0.6)',
            '& .cover': {
              opacity: 1,
              background: 'rgba(0, 0, 0, 0.7)',
            },
            '& .image': { filter: 'blur(3px)' },
          },
        }}
        onClick={playGame}
      >
        <Image
          alt={item.game_name}
          className="image"
          src={getImageUrl(item.banner)}
          sx={{ height: 1, '& img': { objectFit: 'fill' } }}
        />
        <Button
          sx={{
            p: 2,
            zIndex: 6,
            opacity: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            transition: 'all 0.8s ease',
          }}
          className="cover"
        >
          <Typography
            sx={{
              top: 10,
              fontSize: { xs: 16, sm: 20 },
              position: 'absolute',
              color: '#FFFFFF !important',
              fontFamily: 'Impact, Arial Black, sans-serif',
              fontWeight: 'bold',
              textAlign: 'center',
              textShadow: '0px 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {item.game_name}
          </Typography>
          <Typography
            sx={{
              bottom: 1,
              fontSize: { xs: 12, sm: 14 },
              position: 'absolute',
              textTransform: 'capitalize',
              color: '#FFFFFF !important',
              fontFamily: 'Impact, Arial Black, sans-serif',
            }}
          >
            {item.details?.vendor ? `(${item.details.vendor})` : ''}
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: '#24ee89',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(138, 43, 226, 0.4)',
            }}
          >
            <Iconify
              icon="solar:play-bold"
              sx={{
                color: '#050514',
                fontSize: 28,
              }}
            />
          </Box>
        </Button>
      </Box>
    );
  },
  (prevProps, nextProps) => prevProps.item.game_code === nextProps.item.game_code
);

const PAGE_NUM = 50;

export default function FastGamesPage() {
  useScrollToTop();

  const router = useRouter();
  const pathname = usePathname();
  const { t, currentLang } = useLocales();
  const searchParams = useSearchParams();
  const pvder = searchParams.get('pvder') || '';

  const isMobile = useResponsive('down', 'md');
  const smDown = useResponsive('down', 'sm');

  const [games, setGames] = useState<ICasinoGame[]>([]);
  const [moreLoading, setMoreLoading] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [page, setPage] = useState(PAGE_NUM);
  const [selectedProvider, setSelectedProvider] = useState<ICasinoProvider | null>(null);
  const [providers, setProviders] = useState<ICasinoProvider[]>([]);
  const [areIconsLoaded, setAreIconsLoaded] = useState(false);

  const { fast_games } = useSelector((state) => state.casino);
  const banners = useSelector((state) => state.config.banners);

  const filteredGames = useMemo(() => {
    let result = [...(fast_games || [])];
    if (pvder) {
      result = result.filter((e) => e.details.vendor === pvder);
    }
    if (selectedProvider) {
      result = result.filter((e) => e.details.vendor === selectedProvider.value);
    }
    return result.filter((event) => event.game_name.toLowerCase().includes(search.toLowerCase()));
  }, [fast_games, pvder, selectedProvider, search]);

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

  const handleCategoryClick = (row: any) => {
    if (row.url) {
      // Проверяем, не находимся ли уже на этой странице
      const currentPath = pathname.replace(`/${currentLang.value}`, '');
      const targetPath = row.url;

      if (currentPath !== targetPath && !currentPath.startsWith(targetPath)) {
        router.push(`/${currentLang.value}${row.url}`);
      }
    } else if (row.action === 'openProvidersPopup') {
      console.log('Open providers popup');
    }
  };

  useEffect(() => {
    if (!fast_games.length) {
      setGames([]);
      setPage(PAGE_NUM);
      setProgress(0);
      return;
    }
    setGames(fast_games);
    setPage(PAGE_NUM);
    setProgress(fast_games.length > PAGE_NUM ? (100 / fast_games.length) * PAGE_NUM : 100);
  }, [fast_games]);

  useEffect(() => {
    if (!pvder && fast_games.length) {
      const pvders = fast_games.reduce((ary: ICasinoProvider[], row: ICasinoGame) => {
        if (!ary.some((e) => e.value === row.details.vendor)) {
          ary.push({
            value: row.details.vendor,
            label: capitalize(row.details.vendor.replaceAll('-', ' ')),
          });
        }
        return ary;
      }, []);
      setProviders(pvders);
    }
  }, [fast_games, pvder]);

  useEffect(() => {
    const timer = setTimeout(() => setAreIconsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const LinearProgressWithLabel = (prop: LinearProgressProps & { value: number }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: 0.45, sm: 0.25 } }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant="determinate"
          {...prop}
          sx={{
            backgroundColor: 'var(--Grey-Text, #A0A3A7)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#24ee89',
            },
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
          <span style={{ color: 'white' }}>{page}</span> /{' '}
          <span style={{ color: 'var(--Grey-Text, #A0A3A7)' }}>{filteredGames.length}</span>
        </Typography>
      </Box>
    </Box>
  );

  const banner = banners.find((b) => b.type === 'casino_category_slot');

  if (!games.length) return <LoadingScreen sx={{ height: '70vh' }} />;

  return (
    <Stack gap={{ xs: 2, sm: 3 }} px={{ xs: 2, sm: 3 }}>
      <Stack
        sx={{
          px: 3,
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
          <Box
            sx={{ border: '3px solid #24ee89', borderRadius: 0.8, width: '100%', height: '100%' }}
          />
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
              fontFamily: 'Impact, Arial Black, sans-serif',
              fontSize: { xs: 28, sm: 36 },
              fontWeight: 'bold',
            }}
          >
            {t('fast_games')}
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

      <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 1, sm: 0.5 }} px={0.1}>
        <TextField
          value={search}
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search_your_game')}
          sx={{
            '& input': {
              py: 1.2,
              fontFamily: 'Impact, Arial Black, sans-serif',
              fontSize: { xs: '14px', sm: '16px' },
            },
            '& input::placeholder': {
              color: '#ffffff',
              fontFamily: 'Impact, Arial Black, sans-serif',
            },
            '& fieldset': { borderRadius: 1 },
            '& .MuiInputBase-root': {
              backgroundColor: '#2B2F3D',
              height: 56,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="mdi:search" />
              </InputAdornment>
            ),
          }}
        />
        {providers.length && (
          <Autocomplete
            disablePortal
            value={selectedProvider}
            onChange={(event: any, newValue: ICasinoProvider | null) =>
              setSelectedProvider(newValue)
            }
            options={providers}
            sx={{
              width: { xs: '100%', sm: 220 },
              '& .MuiFormLabel-root': {
                color: '#FFFFFF',
                fontFamily: 'Impact, Arial Black, sans-serif',
                fontSize: { xs: '14px', sm: '16px' },
              },
              '& .MuiIconButton-root': { color: '#FFFFFF' },
              '& .MuiInputBase-root': {
                fontSize: { xs: '14px', sm: '16px' },
                height: 56,
                bgcolor: '#2B2F3D',
                fontFamily: 'Impact, Arial Black, sans-serif',
              },
            }}
            componentsProps={{
              paper: {
                sx: {
                  backgroundColor: '#2B2F3D',
                  color: '#FFFFFF',
                  '& .MuiAutocomplete-option': {
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    '&:hover': {
                      backgroundColor: '#24ee89',
                      color: '#050514',
                    },
                    '&[aria-selected="true"]': {
                      backgroundColor: '#24ee89',
                      color: '#050514',
                    },
                  },
                },
              },
            }}
            renderInput={(params) => <TextField {...params} label={t('provider')} />}
          />
        )}
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
                  color: isActive ? '#24ee89' : '#A0A3A7',
                  position: 'relative',
                  pb: 1,
                  zIndex: 1,
                  transition: 'color 0.3s ease',
                  flexShrink: 0, // Не сжимается при прокрутке
                  whiteSpace: 'nowrap', // Текст не переносится
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: -2,
                    height: 16,
                    background:
                      'linear-gradient(0deg, rgba(255,231,26,0.6) 0%, rgba(255,231,26,0) 100%)',
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

      {pvder && (
        <Stack px={2}>
          <Typography
            sx={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              fontSize: { xs: 14, sm: 16 },
            }}
          >
            {t('filtered_by')}{' '}
            <span style={{ color: '#00ff45', textTransform: 'capitalize' }}>{pvder}</span>{' '}
            {t('provider')}
          </Typography>
        </Stack>
      )}

      <Box
        sx={{
          borderRadius: 3,
          p: 3,
          backgroundColor: '#2B2F3D',
        }}
      >
        <Typography
          variant="h4"
          textTransform="uppercase"
          sx={{
            mb: 3,
            fontFamily: 'Impact, Arial Black, sans-serif',
            fontSize: { xs: 20, sm: 24 },
            fontWeight: 'bold',
          }}
        >
          {t('fast_games')}
        </Typography>
        <Transitions in direction="up" type="slide">
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="flex-start"
            sx={{ m: 0, px: 0, ml: -0.5 }}
          >
            {!filteredGames.length && (
              <Stack p={3}>
                <Typography
                  sx={{
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    fontSize: { xs: 16, sm: 18 },
                  }}
                >
                  {t('game_not_exists')}
                </Typography>
              </Stack>
            )}
            {filteredGames.slice(0, page).map((gameItem: ICasinoGame, index: number) => (
              <MemoizedListItem key={index} item={gameItem} />
            ))}
          </Stack>
          {!moreLoading && filteredGames.length > page && (
            <Stack
              sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
              className="view-more"
            >
              <LinearProgressWithLabel value={progress} />
              <Button
                variant="outlined"
                sx={{
                  gap: 1,
                  color: 'var(--Grey-Text, #A0A3A7)',
                  borderColor: 'transparent',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    color: 'var(--Grey-Text, #A0A3A7)',
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    boxShadow: 'none',
                  },
                }}
                onClick={() => setPage((prev) => prev + PAGE_NUM)}
              >
                {moreLoading ? (
                  <CircularProgress size={15} />
                ) : (
                  <Stack direction="column" alignItems="center">
                    <Typography
                      sx={{
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        fontWeight: 400,
                        fontSize: { xs: 14, sm: 16 },
                        lineHeight: '100%',
                        letterSpacing: '5%',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        color: 'var(--Grey-Text, #A0A3A7)',
                      }}
                    >
                      {!isMobile ? t('view_more') : t('more')}
                    </Typography>
                    <Iconify icon="mingcute:down-line" sx={{ color: '#929599' }} />
                  </Stack>
                )}
              </Button>
            </Stack>
          )}
        </Transitions>
      </Box>
    </Stack>
  );
}
