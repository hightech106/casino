import { useParams, useRouter } from 'src/routes/hooks';
import { useSelector } from 'src/store';
import { useLocales } from 'src/locales';
import { useResponsive } from 'src/hooks/use-responsive';
import { useMemo } from 'react';

// @mui
import { Box, Stack, Typography, Skeleton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';

// components
import Image from 'src/components/image';
import SvgColor from 'src/components/svg-color';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import type { ICasinoNav, ICasinoGame } from 'src/types';
import { getImageUrl, TopGames } from 'src/utils';

// Import Swiper styles
import 'swiper/css';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const topGameIndexMap = new Map(TopGames.map((code, index) => [code, index]));

export default function VendorPage() {
  useScrollToTop();

  const { t, currentLang } = useLocales();
  const { vendor } = useParams();
  const router = useRouter();
  const smDown = useResponsive('down', 'sm');

  const { casino_lists } = useSelector((state) => state.casino);

  const groupedGames = useMemo(() => {
    let vendorGames: ICasinoGame[] = [];

    if (vendor === 'live-casino') {
      vendorGames = casino_lists
        .flatMap((row: ICasinoNav) => row.games)
        .filter(
          (game: ICasinoGame) => game.details?.tags && game.details?.tags.includes('casinolive')
        );
    } else if (vendor === 'blackjack') {
      vendorGames = casino_lists
        .flatMap((row: ICasinoNav) => row.games)
        .filter(
          (game: ICasinoGame) =>
            game.details?.tags &&
            game.details?.tags.includes('casinolive') &&
            game.details?.tags.includes('blackjack')
        );
    } else {
      vendorGames = casino_lists
        .flatMap((row: ICasinoNav) => row.games)
        .filter((game: ICasinoGame) => game.details?.vendor === vendor);
    }

    const providerCodes: string[] = [];
    vendorGames.forEach((game: ICasinoGame) => {
      if (!providerCodes.includes(game.provider_code)) {
        providerCodes.push(game.provider_code);
      }
    });

    const grouped = providerCodes.map((providerCode) => {
      const games = vendorGames
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
        games,
      };
    });

    return grouped.filter((group) => group.games.length > 0);
  }, [casino_lists, vendor]);

  const totalGames = groupedGames.reduce((sum, group) => sum + group.games.length, 0);

  const playGame = (
    type: string | undefined,
    provider_code: string,
    game_code: string,
    game_name: string
  ) => {
    const gameType = type || 'casino';
    const formattedGameName = game_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    router.push(
      `/${currentLang.value}${paths.casino.root}/${gameType}/${provider_code}/${formattedGameName}/${game_code}/play`
    );
  };

  if (!groupedGames.length) {
    return (
      <Box sx={{ backgroundColor: '#232626', minHeight: '100vh', p: 3 }}>
        <Typography variant="h4" sx={{ color: '#FFFFFF', mb: 3, textTransform: 'capitalize' }}>
          {vendor?.replace(/-/g, ' ')} Games
        </Typography>
        <Typography sx={{ color: '#FFFFFF' }}>{t('no_games_available')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#232626', minHeight: '100vh', p: 3 }}>
      <Stack direction="row" alignItems="center" gap={2} mb={3}>
        <Typography variant="h4" sx={{ color: '#FFFFFF', textTransform: 'capitalize' }}>
          {vendor?.replace(/-/g, ' ')} Games
        </Typography>
        <Typography variant="h6" sx={{ color: '#FFFFFF', opacity: 0.7 }}>
          {totalGames} {t('games').toUpperCase()}
        </Typography>
      </Stack>

      <Stack gap={3}>
        {groupedGames.map((group, groupIndex) => (
          <Stack key={groupIndex} gap={1}>
            <Stack direction="row" justifyContent="space-between" px={2}>
              <Stack direction="row" alignItems="center" gap={1}>
                <SvgColor src="/assets/icons/leftbar/provider.svg" sx={{ width: 24, height: 24 }} />
                <Typography
                  variant="h5"
                  textTransform="uppercase"
                  className="bold-font"
                  sx={{ color: '#FFFFFF' }}
                >
                  {group.providerCode} ({group.games.length})
                </Typography>
              </Stack>
            </Stack>

            <Box sx={{ position: 'relative' }}>
              <Swiper
                slidesPerView={3}
                spaceBetween={10}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                style={{
                  padding: '0 40px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                breakpoints={{
                  600: {
                    slidesPerView: 3,
                    spaceBetween: 15,
                  },
                  900: {
                    slidesPerView: 6,
                    spaceBetween: 15,
                  },
                  1200: {
                    slidesPerView: 6,
                    spaceBetween: 15,
                  },
                  1500: {
                    slidesPerView: 6,
                    spaceBetween: 15,
                  },
                }}
                className="other-games-swiper"
              >
                {!group.games.length
                  ? [...Array(12)].map((_, skeletonIndex) => (
                      <SwiperSlide key={skeletonIndex} style={{ backgroundColor: 'transparent' }}>
                        <Stack gap={1}>
                          <Skeleton
                            sx={{
                              width: { xs: 140, md: 180 },
                              height: { xs: 200, md: 240 },
                              borderRadius: 0.5,
                            }}
                          />
                        </Stack>
                      </SwiperSlide>
                    ))
                  : group.games.map((game: ICasinoGame, gameIndex: number) => (
                      <SwiperSlide key={gameIndex} style={{ backgroundColor: 'transparent' }}>
                        <Stack
                          sx={{
                            cursor: 'pointer',
                            m: 0.5,
                            mb: 1,
                            p: 0.5,
                            width: { xs: 140, md: 180 },
                            height: { xs: 200, md: 240 },
                          }}
                          onClick={() =>
                            playGame(game.type, game.provider_code, game.game_code, game.game_name)
                          }
                        >
                          <Image
                            src={getImageUrl(game.banner)}
                            sx={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 0.5,
                              backgroundColor: '#232626',
                              '& img': {
                                objectFit: 'fill',
                                width: '100%',
                                height: '100%',
                                objectPosition: 'center',
                              },
                            }}
                          />
                        </Stack>
                      </SwiperSlide>
                    ))}
              </Swiper>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
