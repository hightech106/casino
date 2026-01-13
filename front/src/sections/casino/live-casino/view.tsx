import { useEffect, useState } from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';

import {
  Box,
  Typography,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Card,
  Paper,
  Autocomplete,
  Button,
} from '@mui/material';

import { useSelector } from 'src/store';
import { useLocales } from 'src/locales';
import { useParams, useRouter } from 'src/routes/hooks';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { Transitions } from 'src/components/animate';
import Image from 'src/components/image';

import { paths } from 'src/routes/paths';
import { capitalize, getImageUrl } from 'src/utils';
import { API_URL } from 'src/config-global';
import type { ICasinoNav, ICasinoProvider } from 'src/types';
import MobileBottomBanners from '../home/mobile-bottom-banners';

// Import Swiper styles
// eslint-disable-next-line
import 'swiper/css';
// eslint-disable-next-line
import 'swiper/css/pagination';
// eslint-disable-next-line
import 'swiper/css/navigation';

export default function LiveCasinoView() {
  useScrollToTop();
  const { t, currentLang } = useLocales();
  const { category } = useParams();

  const router = useRouter();
  const { isLoggedIn } = useSelector((store) => store.auth);

  const [games, setGames] = useState<ICasinoNav[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<ICasinoProvider | null>(null);
  const [providers, setProviders] = useState<ICasinoProvider[]>([]);

  const { casino_lists } = useSelector((store) => store.casino);
  const banners = useSelector((store) => store.config.banners);

  const formatGameName = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const playGame = (
    type: string | undefined,
    provider_code: string,
    game_code: string,
    game_name: string
  ) => {
    const gameType = type || 'casino';
    const formattedGameName = formatGameName(game_name);
    router.push(
      `/${currentLang.value}${paths.casino.root}/${gameType}/${provider_code}/${formattedGameName}/${game_code}/play`
    );
  };

  const filteredData = () => {
    if (!search && !selectedProvider) {
      const _games = games.filter((e) => e.games.length > 3);
      return _games.length > 6 ? _games : games;
    }

    let filtered = games;
    if (selectedProvider)
      filtered = filtered.reduce((ary: ICasinoNav[], e: ICasinoNav) => {
        const temp = e.games.filter((r) => r.details.vendor === selectedProvider?.value);
        if (!temp.length) return ary;
        return [...ary, { ...e, games: temp }];
      }, []);

    if (search)
      filtered = filtered.reduce((ary: ICasinoNav[], e: ICasinoNav) => {
        const temp = e.games.filter((r) =>
          r.game_name.toLowerCase().includes(search.toLowerCase())
        );
        if (!temp.length) return ary;
        return [...ary, { ...e, games: temp }];
      }, []);

    return filtered.sort((a, b) => b.games.length - a.games.length);
  };

  useEffect(() => {
    if (!casino_lists.length) return;
    const livegames: ICasinoNav[] = casino_lists.filter((e) => e.type === category);
    setGames(livegames);

    const pvders = livegames.reduce((ary: ICasinoProvider[], row: ICasinoNav) => {
      const gameAry = row.games.reduce((ary2: ICasinoProvider[], game) => {
        if (
          ary.some((e) => e.value === game.details.vendor) ||
          ary2.some((e) => e.value === game.details.vendor)
        ) {
          return ary2;
        }
        return [
          ...ary2,
          {
            value: game.details.vendor,
            label: capitalize(game.details.vendor.replaceAll('-', ' ')),
          },
        ];
      }, []);
      return [...ary, ...gameAry];
    }, []);

    setProviders(pvders);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [casino_lists, category]);

  const banner = banners.find((b) => b.type === 'casino_category1');

  if (!casino_lists.length) return <LoadingScreen sx={{ height: '70vh' }} />;

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
            {category?.replaceAll('-', ' ')}
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
              py: 1.2,
            },
            '& input::placeholder': {
              color: '#ffffff',
            },
            '& fieldset': {
              borderRadius: 1,
            },
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
                bgcolor: '#2B2F3D',
                height: 56,
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

      <Box
        sx={{
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          backgroundColor: '#2B2F3D',
        }}
      >
        <Transitions in direction="up" type="slide">
          {filteredData().map((row, index) => (
            <Stack key={index} gap={{ xs: 1, sm: 2 }} sx={{ mb: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" px={1}>
                <Typography
                  variant="h5"
                  textTransform="uppercase"
                  sx={{
                    fontFamily: '"Impact", "CircularStd", sans-serif !important',
                    fontWeight: '700 !important',
                    fontStyle: 'italic !important',
                    transform: 'skewX(-5deg) !important',
                    transformOrigin: 'left center !important',
                  }}
                >
                  {row.name}
                </Typography>
                <Typography
                  component={Link}
                  to={`${row.code}${selectedProvider ? `?pvder=${selectedProvider.value}` : ''}`}
                  sx={{
                    cursor: 'pointer',
                    fontFamily: '"Impact", "CircularStd", sans-serif !important',
                    fontWeight: '700 !important',
                    fontStyle: 'italic !important',
                    fontSize: '14px !important',
                    lineHeight: '100% !important',
                    letterSpacing: '0.05em !important',
                    textTransform: 'uppercase !important',
                    color: '#A0A3A7',
                    transform: 'skewX(-5deg) !important',
                    transformOrigin: 'left center !important',
                    textDecoration: 'none',
                    '&:hover': {
                      color: '#24ee89',
                    },
                  }}
                >
                  {t('show_all')} →
                </Typography>
              </Stack>
              <Box
                sx={{
                  '& .swiper-wrapper': {
                    px: { xs: 0, sm: 1.5 },
                  },
                }}
              >
                <Swiper
                  slidesPerView="auto"
                  spaceBetween={20}
                  autoplay={{
                    delay: 15000,
                    disableOnInteraction: false,
                  }}
                  modules={[Autoplay]}
                >
                  {row.games.slice(0, 30).map((game, index2) => (
                    <SwiperSlide
                      key={index2}
                      style={{ backgroundColor: 'transparent', width: 128 }}
                    >
                      <Box
                        key={game._id}
                        sx={{
                          m: { xs: '4px', sm: 0.5 },
                          boxShadow:
                            'rgba(27, 23, 23, 0.2) 0px 4px 6px -1px, rgba(0, 0, 0, 0.12) 0px 2px 4px -1px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          flexDirection: 'column',
                          width: 112,
                          height: '200px',
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
                        }}
                        onClick={() =>
                          playGame(row.type, game.provider_code, game.game_code, game.game_name)
                        }
                      >
                        <Image
                          alt="image"
                          className="image"
                          src={getImageUrl(game.banner)}
                          sx={{
                            width: '100%',
                            height: 145,
                            '& img': {
                              objectFit: 'fill',
                            },
                          }}
                        />
                        <Box
                          sx={{
                            p: 1,
                            bgcolor: '#2B2F3D',
                            height: '55px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            fontSize={10}
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontWeight: 500,
                              mb: 0.5,
                            }}
                          >
                            {game.game_name}
                          </Typography>
                          <Typography
                            fontSize={8}
                            color="text.disabled"
                            textTransform="capitalize"
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {game.details.vendor.replaceAll('-', ' ')}
                          </Typography>
                        </Box>
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
                              fontSize: 16,
                              position: 'absolute',
                              color: '#FFFFFF !important',
                              textShadow: '0px 2px 0px rgba(0,0,0,.3)',
                              textAlign: 'center',
                              width: '100%',
                              fontWeight: 'bold',
                            }}
                          >
                            {game.game_name}
                          </Typography>
                          <Typography
                            sx={{
                              bottom: 1,
                              fontSize: 12,
                              position: 'absolute',
                              textTransform: 'capitalize',
                              color: '#FFFFFF !important',
                              textAlign: 'center',
                              width: '100%',
                            }}
                          >
                            {game.details?.vendor ? `(${game.details.vendor})` : ''}
                          </Typography>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: '#24ee89',
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Iconify icon="solar:play-bold" sx={{ color: '#000', fontSize: 20 }} />
                          </Box>
                        </Button>
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            </Stack>
          ))}
        </Transitions>
      </Box>
      <MobileBottomBanners />
    </Stack>
  );
}
