import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { LinearProgressProps } from '@mui/material/LinearProgress';
import type { ICasinoGame, ICasinoNav, ICasinoProvider } from 'src/types';
import { memo, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'src/routes/hooks';
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
import { capitalize, getImageUrl, TopGames } from 'src/utils';
import SvgColor from 'src/components/svg-color';

const MemoizedListItem = memo(({ item }: any) => {
  const { currentLang } = useLocales();
  const router = useRouter();

  const formatGameName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const playGame = () => {
    const formattedGameName = formatGameName(item.game_name);
    router.push(
      `/${currentLang.value}${paths.casino.root}/${item.type}/${item.provider_code}/${formattedGameName}/${item.game_code}/play`
    );
  };

  return (
    <Box
      sx={{
        m: { xs: '4px', sm: 0.5 },
        boxShadow: 'rgba(27, 23, 23, 0.2) 0px 4px 6px -1px, rgba(0, 0, 0, 0.12) 0px 2px 4px -1px',
        cursor: 'pointer',
        display: 'inline-flex',
        flexDirection: 'column',
        width: {
          xs: 'calc(50% - 8px)',
          sm: 'calc(50% - 8px)',  
          md: 'calc(20% - 8px)',
          lg: 'calc(16.66% - 8px)',
          xl: 'calc(14.28% - 8px)',
        },
        height: '240px',
        position: 'relative',
        transition: 'all .5s ease',
        zIndex: 1,
        borderRadius: '8px',
        overflow: 'hidden',
        border: '2px solid transparent',
        ':hover': {
          zIndex: 5,
          transform: 'translateY(-10px)',
          border: '2px solid #24ee89',
          boxShadow: '0 0 20px rgba(138, 43, 226, 0.6)',
          '& .cover': {
            opacity: 1,
            background: 'transparent',
          },
          '& .image': {
            filter: 'blur(3px)',
          },
        },
        '@media (max-width:767px)': {
          height: 'auto',
          aspectRatio: '3 / 4',
        },
      }}
      onClick={playGame}
    >
      <Image
        alt="image"
        className="image"
        src={getImageUrl(item.banner)}
        sx={{
          height: 1,
          '& img': {
            objectFit: 'fill',
          },
        }}
      />
      <Button
        sx={{
          p: 2,
          zIndex: 6,
          opacity: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
          transition: 'all .8s ease',
        }}
        className="cover"
      >
        <Typography
          sx={{
            top: 10,
            fontSize: 20,
            position: 'absolute',
            color: '#FFFFFF !important',
            textShadow: '0px 2px 0px rgba(0,0,0,.3)',
            textAlign: 'center',
            width: '100%',
            fontWeight: 'bold',
          }}
          className="archivo-font"
        >
          {item.game_name}
        </Typography>
        <Typography
          sx={{
            bottom: 1,
            fontSize: 14,
            position: 'absolute',
            textTransform: 'capitalize',
            color: '#FFFFFF !important',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {item.details?.vendor ? `(${item.details.vendor})` : ''}
        </Typography>
        <Box
          sx={{
            width: 50,
            height: 50,
            backgroundColor: '#24ee89',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Iconify icon="solar:play-bold" sx={{ color: '#000', fontSize: 24 }} />
        </Box>
      </Button>
    </Box>
  );
});

const PAGE_NUM = 50;
const topGameIndexMap = new Map(TopGames.map((code, index) => [code, index]));

export default function LiveCasinoAllView() {
  useScrollToTop();

  const { t } = useLocales();
  const searchParams = useSearchParams();
  const pvder = searchParams.get('pvder') || '';

  const isMobile = useResponsive('down', 'md');

  const [games, setGames] = useState<ICasinoGame[]>([]);
  const [moreLoading, setMoreLoading] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [progress, setProgress] = useState(PAGE_NUM);
  const [page, setPage] = useState(PAGE_NUM);
  const [selectedProvider, setSelectedProvider] = useState<ICasinoProvider | null>(null);
  const [providers, setProviders] = useState<ICasinoProvider[]>([]);

  const { casino_lists } = useSelector((state) => state.casino);
  const banners = useSelector((state) => state.config.banners);

  const formatProviderName = (providerCode: string) => {
    let formatted = providerCode.toLowerCase().startsWith('live')
      ? providerCode.substring(11)
      : providerCode.substring(6);

    formatted = formatted.replace(/-/g, ' ');

    return capitalize(formatted);
  };

  const groupedGames = useMemo(() => {
    const liveCasinoGames = casino_lists
      .flatMap((row: ICasinoNav) => row.games)
      .filter(
        (game: ICasinoGame) => game.details?.tags && game.details?.tags.includes('casinolive')
      )
      .map((game: ICasinoGame) => ({
        ...game,
        type:
          casino_lists.find((row: ICasinoNav) =>
            row.games.some((g: ICasinoGame) => g.game_code === game.game_code)
          )?.type || 'live-casino',
      }));

    const providerCodes: string[] = [];
    liveCasinoGames.forEach((game: ICasinoGame) => {
      if (!providerCodes.includes(game.provider_code)) {
        providerCodes.push(game.provider_code);
      }
    });

    const grouped = providerCodes.map((providerCode) => {
      const providerGames = liveCasinoGames
        .filter((game: ICasinoGame) => game.provider_code === providerCode)
        .sort((a, b) => {
          const indexA = topGameIndexMap.get(a.game_code);
          const indexB = topGameIndexMap.get(b.game_code);
          return (
            (indexA === undefined ? Infinity : indexA) - (indexB === undefined ? Infinity : indexB)
          );
        });

      return {
        providerCode,
        games: providerGames,
      };
    });

    return grouped.filter((group) => group.games.length > 0);
  }, [casino_lists]);

  const totalGames = groupedGames.reduce((sum, group) => sum + group.games.length, 0);

  useEffect(() => {
    const allGames = groupedGames.flatMap((group) => group.games);
    setGames(allGames);
    setPage(PAGE_NUM);
    setProgress(PAGE_NUM);
  }, [groupedGames]);

  useEffect(() => {
    if (!games.length) return;
    const percent = 100 / (games.length || 1);
    if (games.length > page) setProgress(percent * page);
    else setProgress(100);
  }, [games, page]);

  const handleSearchEvent = (data: ICasinoGame[]) => {
    let filteredGames: ICasinoGame[] = data;
    if (pvder) {
      filteredGames = filteredGames.filter((e) => e.details.vendor === pvder);
    }

    if (selectedProvider) {
      filteredGames = filteredGames.filter((e) => e.details.vendor === selectedProvider.value);
    }

    filteredGames = filteredGames.filter((event) =>
      event.game_name.toLowerCase().includes(search.toLowerCase())
    );

    return filteredGames;
  };

  useEffect(() => {
    if (pvder) return;
    if (!games.length) return;

    const pvders = games.reduce((ary: ICasinoProvider[], row: ICasinoGame) => {
      const check = ary.some((e) => e.value === row.details.vendor);
      if (check) return ary;
      return [
        ...ary,
        {
          value: row.details.vendor,
          label: capitalize(row.details.vendor.replaceAll('-', ' ')),
        },
      ];
    }, []);

    setProviders(pvders);
  }, [games, pvder]);

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
          <span style={{ color: 'var(--Grey-Text, #A0A3A7)' }}>{totalGames}</span>
        </Typography>
      </Box>
    </Box>
  );

  const banner = banners.find((b) => b.type === 'casino_category_live');

  if (!games.length) {
    return (
      <Stack gap={3} justifyContent="center" alignItems="center" sx={{ height: '70vh' }}>
        <Typography variant="h5">{t('no_live_casino_games_available')}</Typography>
      </Stack>
    );
  }

  return (
    <Stack gap={3}>
      <Stack
        sx={{
          px: { xs: 2, sm: 3 },
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
            {t('live_casino')}
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

      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        gap={0.5}
        sx={{
          width: '100%',
          px: { xs: 2, sm: 3 },
        }}
      >
        <TextField
          value={search}
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search_your_game')}
          sx={{
            '& input': {
              py: 1.8,
            },
            '& input::placeholder': {
              color: '#ffffff',
            },
            '& fieldset': {
              borderRadius: 1,
            },
            '& .MuiInputBase-root': {
              backgroundColor: '#2B2F3D',
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
            onChange={(event: any, newValue: ICasinoProvider | null) => {
              setSelectedProvider(newValue);
            }}
            options={providers}
            sx={{
              width: { xs: '100%', sm: 220 },
              '& .MuiFormLabel-root, & .MuiIconButton-root': {
                color: '#FFFFFF',
              },
              '& .MuiInputBase-root': {
                fontSize: 14,
                height: isMobile ? 1 : 'auto',
                bgcolor: '#2B2F3D',
              },
            }}
            componentsProps={{
              paper: {
                sx: {
                  backgroundColor: '#2B2F3D',
                  color: '#FFFFFF',
                  '& .MuiAutocomplete-option': {
                    fontFamily: '"Impact", "CircularStd", sans-serif !important',
                    fontWeight: '700 !important',
                    fontStyle: 'italic !important',
                    textTransform: 'uppercase !important',
                    color: '#FFFFFF !important',
                    '&:hover': {
                      backgroundColor: '#24ee89 !important',
                      color: '#050514 !important',
                    },
                    '&[aria-selected="true"]': {
                      backgroundColor: '#24ee89 !important',
                      color: '#050514 !important',
                    },
                  },
                },
              },
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label={t('provider')}
                sx={{
                  '& .MuiFormLabel-root': {
                    fontFamily: '"Impact", "CircularStd", sans-serif !important',
                    fontWeight: '700 !important',
                    fontStyle: 'italic !important',
                    fontSize: '16px !important',
                    lineHeight: '100% !important',
                    letterSpacing: '0.05em !important',
                    textTransform: 'uppercase !important',
                    color: '#FFFFFF !important',
                  },
                }}
              />
            )}
          />
        )}
      </Stack>

      {pvder && (
        <Stack px={3}>
          <Typography
            sx={{
              fontFamily: '"Impact", "CircularStd", sans-serif !important',
              fontWeight: '700 !important',
              fontStyle: 'italic !important',
              transform: 'skewX(-5deg) !important',
              transformOrigin: 'left center !important',
            }}
          >
            {t('filtered_by')}{' '}
            <span style={{ color: '#24ee89', textTransform: 'capitalize' }}>{pvder} </span>{' '}
            {t('provider')}
          </Typography>
        </Stack>
      )}

      <Stack gap={4}>
        {groupedGames.map((group, groupIndex) => {
          const filteredGroupGames = handleSearchEvent(group.games);
          return (
            filteredGroupGames.length > 0 && (
              <Box
                key={groupIndex}
                sx={{
                  borderRadius: 3,
                  p: { xs: 2, sm: 3 },
                  backgroundColor: '#2B2F3D',
                }}
              >
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 3, px: 1 }}>
                  <SvgColor
                    src="/assets/icons/leftbar/provider.svg"
                    sx={{ width: 24, height: 24, color: '#24ee89' }}
                  />
                  <Typography
                    variant="h5"
                    textTransform="uppercase"
                    sx={{
                      fontFamily: '"Impact", "CircularStd", sans-serif !important',
                      fontWeight: '700 !important',
                      fontStyle: 'italic !important',
                      transform: 'skewX(-5deg) !important',
                      transformOrigin: 'left center !important',
                      color: '#FFFFFF',
                    }}
                  >
                    {formatProviderName(group.providerCode)} ({filteredGroupGames.length})
                  </Typography>
                </Stack>

                <Transitions in direction="up" type="slide">
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    justifyContent="flex-start"
                    sx={{
                      m: 0,
                      px: 0,
                      ml: { xs: '-4px', sm: -0.5 },
                    }}
                  >
                    {filteredGroupGames
                      .slice(0, page)
                      .map((gameItem: ICasinoGame, gameIndex: number) => (
                        <MemoizedListItem key={gameIndex} item={gameItem} />
                      ))}
                  </Stack>
                  {!moreLoading && filteredGroupGames.length > page && (
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
                        onClick={() => setPage(page + PAGE_NUM)}
                      >
                        {moreLoading ? (
                          <CircularProgress size={15} />
                        ) : (
                          <Stack direction="column" alignItems="center">
                            <Typography
                              sx={{
                                fontFamily: '"Impact", "CircularStd", sans-serif !important',
                                fontWeight: '700 !important',
                                fontStyle: 'italic !important',
                                fontSize: '16px !important',
                                lineHeight: '100% !important',
                                letterSpacing: '0.05em !important',
                                textAlign: 'center',
                                textTransform: 'uppercase !important',
                                color: 'var(--Grey-Text, #A0A3A7)',
                                transform: 'skewX(-5deg) !important',
                                transformOrigin: 'left center !important',
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
            )
          );
        })}
      </Stack>
    </Stack>
  );
}
