/* eslint-disable consistent-return */
import { useEffect, useMemo, useState, useRef, useCallback, memo, lazy, Suspense } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';
import type { SwiperInstance } from 'src/types/swiper';
import {
  Box,
  Paper,
  Stack,
  Button,
  Skeleton,
  Typography,
  Chip,
  useMediaQuery,
  Link,
  useTheme,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'src/store';
import { ChangePage } from 'src/store/reducers/menu';
import { useBoolean } from 'src/hooks/use-boolean';
import { useLocales } from 'src/locales';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useResponsive } from 'src/hooks/use-responsive';
import { API_URL, APP_NAME } from 'src/config-global';
import type { ICasinoGame, ICasinoNav, ICasinoProvider } from 'src/types';
import { capitalize, getImageUrl, TopGames } from 'src/utils';
import { PermanentSpinDialog } from 'src/layouts/global/daily-spin-dialog';
import HomeBanner from './home-banner';
import MiddleCarousel from './middle-carousel';
import ProvidersAry from './providers.json';
import gamesData from '../jackpot/games.json';
import MobilePromotions from './mobile-promotions';
import MobileBottomBanners from './mobile-bottom-banners';

// Import Swiper styles
// eslint-disable-next-line
import 'swiper/css';
// eslint-disable-next-line
import 'swiper/css/pagination';
// eslint-disable-next-line
import 'swiper/css/navigation';
import 'swiper/css/grid';
import GameCardsRow from './GameCardsRow';

const RandomGameCarousel = lazy(() => import('./randomgamecarousel'));
const ViewGameModal = lazy(() => import('./view-game'));
const Providers = lazy(() => import('./providers'));

interface Widget7777Gaming {
  addConfig: (config: { lang: string; currency: string; market: string }) => void;
  init: (callback: () => void) => void;
  app: {
    initJackpotOdometers: (options: {
      tooltip: boolean;
      useIcons: boolean;
      dateCountryCode: string;
    }) => void;
    events: {
      trigger: (event: string) => void;
    };
  };
}

declare global {
  interface Window {
    widget7777gaming?: Widget7777Gaming;
  }
}

const topGameIndexMap = new Map(TopGames.map((code, index) => [code, index]));

// Random winner generator for jackpot carousel
const generateRandomWinner = () => {
  const names = ['Alex', 'Mike', 'Sarah', 'John', 'Emma', 'David', 'Lisa', 'Tom', 'Anna', 'Chris', 'Kate', 'Max', 'Sofia', 'Ryan', 'Mia', 'Oliver', 'Liam', 'Noah', 'Elijah', 'Mason', 'Logan', 'Jacob', 'Lucas', 'Henry'];
  const multipliers = [1.5, 2.1, 3.7, 4.2, 5.8, 7.3, 8.9, 10.5, 12.1, 15.0];
  const amounts = [50, 75, 120, 200, 350, 500, 750, 1200, 2000, 3500, 5000];

  return {
    name: names[Math.floor(Math.random() * names.length)],
    multiplier: multipliers[Math.floor(Math.random() * multipliers.length)],
    amount: amounts[Math.floor(Math.random() * amounts.length)],
    game: ['Starburst', 'Book of Dead', 'Gonzo Quest', 'Mega Moolah', 'Sweet Bonanza', 'Gates of Olympus', 'Wolf Gold'][Math.floor(Math.random() * 7)]
  };
};

// Jackpot winners carousel component
const JackpotWinnersCarousel = memo(() => {
  const [winners, setWinners] = useState<any[]>([]);

  useEffect(() => {
    // Initial winners
    const initialWinners = Array.from({ length: 10 }, generateRandomWinner);
    setWinners(initialWinners);

    // Update carousel every 2 seconds
    const interval = setInterval(() => {
      setWinners(prev => {
        const newWinner = generateRandomWinner();
        return [newWinner, ...prev.slice(0, 9)];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{
      backgroundColor: '#2B2F3D',
      borderRadius: 1,
      p: 2,
      mt: 2,
      overflow: 'hidden'
    }}>
      <Typography variant="h6" sx={{ color: '#24ee89', mb: 2, textAlign: 'center' }}>
        Recent Winners
      </Typography>
      <Box sx={{
        display: 'flex',
        gap: 1,
        animation: 'slide 20s linear infinite',
        '@keyframes slide': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }}>
        {[...winners, ...winners].map((winner, index) => (
          <Box key={index} sx={{
            minWidth: 200,
            backgroundColor: 'rgba(138, 43, 226, 0.1)',
            borderRadius: 1,
            p: 1.5,
            border: '1px solid rgba(138, 43, 226, 0.3)',
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{ color: '#24ee89', fontWeight: 'bold' }}>
              {winner.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#FFFFFF', display: 'block' }}>
              x{winner.multiplier}
            </Typography>
            <Typography variant="body2" sx={{ color: '#67F962', fontWeight: 'bold' }}>
              ${winner.amount}
            </Typography>
            <Typography variant="caption" sx={{ color: '#9E9E9E', fontSize: '10px' }}>
              {winner.game}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
});

// Category Card Component
interface CategoryCardProps {
  category: {
    label: string;
    icon: string;
    bgImage: string;
    url?: string;
    action?: string;
  };
  index: number;
  isSelected: boolean;
  onClick: (category: any, index: number) => void;
}

const CategoryCard = memo(({ category, index, isSelected, onClick }: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onClick={() => onClick(category, index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        bgcolor: '#2B2F3D',
        border: isSelected ? '2px solid #24ee89' : 'none',
        borderRadius: 2,
        height: { xs: 180, sm: 200 },
        minWidth: { xs: 140, sm: 160 },
        flex: 1,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          border: '2px solid #24ee89',
        },
      }}
    >
      {/* Background Image - Full Cover */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${category.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: '70% 80%',
          backgroundRepeat: 'no-repeat',
          opacity: 1,
        }}
      />

      {/* Overlay Mask */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: (isSelected || isHovered)
            ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(138, 43, 226, 0.1) 100%)'
            : 'transparent',
          transition: 'all 0.3s ease',
        }}
      />

      {/* Content */}
      <CardContent
        sx={{
          position: 'relative',
          zIndex: 2,
          p: { xs: 1, sm: 2 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <Stack alignItems="center" gap={1} mb={1}>
          <Iconify
            icon={category.icon}
            sx={{
              width: 32,
              height: 32,
              color: '#9E9E9E',
            }}
          />
          <Typography
            className="impact-font"
            sx={{
              color: '#FFFFFF !important',
              fontSize: { xs: '18px', sm: '24px' },
              lineHeight: { xs: '22px', sm: '38px' },
              textAlign: 'center',
              transform: 'skewX(-7deg)', // Легкий наклон вправо
              transformOrigin: 'left center',
              wordBreak: 'break-word',
              hyphens: 'auto',
            }}
          >
            {category.label}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
});

function CasinoView() {
  const router = useRouter();
  const { pathname } = useLocation();
  const smDown = useResponsive('down', 'sm');

  const { t, currentLang } = useLocales();

  const ALL = [
    {
      label: 'CASINO',
      icon: 'target',
      bgImage: '/assets/category/1.jpg',
    },
    {
      label: 'TOP GAMES',
      icon: 'star',
      bgImage: '/assets/category/2.png',
      url: paths.casino.top_games,
    },
    {
      label: 'SLOTS',
      icon: 'currency-dollar',
      bgImage: '/assets/category/5.png',
      url: `${paths.casino.slot}/casino-slots`,
    },
    {
      label: 'POKER',
      icon: 'suit-spade',
      bgImage: '/assets/category/3.png',
      url: `${paths.casino.live}/live-casino-poker`,
    },
    {
      label: 'BLACKJACK',
      icon: 'suit-club',
      bgImage: '/assets/category/4.png',
      url: `${paths.casino.live}/live-casino-blackjack`,
    },
    {
      label: 'ORIGINAL',
      icon: 'diamond',
      bgImage: '/assets/category/6.png',
    },
  ];

  const [search, setSearch] = useState<string>('');
  const [viewGame, setViewGame] = useState<string>('');
  const [categories, setCategories] = useState<any[]>([]);
  const [providers, setProviders] = useState<ICasinoProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ICasinoProvider | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const dispatch = useDispatch();
  const { isLoggedIn, token } = useSelector((store) => store.auth);
  const permanentSpinModal = useBoolean(false);

  const { casino_lists, top_games, fast_games } = useSelector((state) => state.casino);

  const auth = useSelector((state) => state.auth);

  const OPERATOR_LABEL = 'timeless';
  const BASE_URL = `https://ngt-play-mrk-${OPERATOR_LABEL}.7777gaming.tech`;
  const GAME_LOAD_URL = `${BASE_URL}/js/ngt/widget7777gaming-bootstrap.js`;

  const banners = useSelector((store) => store.config.banners);

  // All banner variables removed per user request

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const providersPopup = useBoolean(false);

  const handleCategoryClick = (row: any, index: number) => {
    setSelectedCategory(index);
    if (row.url) {
      router.push(`/${currentLang.value}${row.url}`);
    } else if (row.action === 'openProvidersPopup') {
      providersPopup.onTrue();
    }
  };

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

  const Filterd = useMemo(
    () =>
      casino_lists.reduce(
        (ary: any, row) => {
          const jackpotData = row.games
            .filter((e) => e.details?.tags && e.details?.tags.includes('jackpot'))
            .map((e) => ({ ...e, type: row.type }));
          const sortedJackpotData = [...jackpotData].sort((a, b) => {
            const isA7777 = a.details?.vendor === '7777' ? -1 : 1;
            const isB7777 = b.details?.vendor === '7777' ? -1 : 1;
            return isA7777 - isB7777;
          });
          ary.jackpot = [...ary.jackpot, ...sortedJackpotData];

          const liveCasinoData = row.games
            .filter((e) => e.details?.tags && e.details?.tags.includes('casinolive'))
            .map((e) => ({ ...e, type: row.type }));
          ary.liveCasino = [...(ary.liveCasino || []), ...liveCasinoData];

          const blackjackData = row.games
            .filter(
              (e) =>
                e.details?.tags &&
                e.details?.tags.includes('casinolive') &&
                e.details?.tags.includes('blackjack')
            )
            .map((e) => ({ ...e, type: row.type }));
          ary.blackjack = [...(ary.blackjack || []), ...blackjackData];

          return ary;
        },
        { jackpot: [], liveCasino: [], blackjack: [] }
      ),
    [casino_lists]
  );

  const onCloseViewGame = () => {
    setViewGame('');
  };

  const sortTopGames = useCallback(
    (games: ICasinoGame[]) =>
      games.sort((a, b) => {
        const indexA = topGameIndexMap.get(a.game_code) ?? Infinity;
        const indexB = topGameIndexMap.get(b.game_code) ?? Infinity;
        return indexA - indexB;
      }),
    []
  );

  const filteredData = useMemo(() => {
    // Optimize by checking if casino_lists exists first
    if (!casino_lists?.length) return [];

    if (!search && !selectedProvider)
      return casino_lists.reduce((ary: ICasinoNav[], e: ICasinoNav) => {
        if (e.games.length < 8) return ary;
        const temp =
          e.games.length > 2000
            ? e.games.filter((r) => TopGames.includes(r.game_code))
            : sortTopGames(e.games.slice());
        return [...ary, { ...e, games: temp }];
      }, []);

    let filtered: ICasinoNav[] = casino_lists;

    if (selectedProvider)
      filtered = filtered.reduce((ary: ICasinoNav[], e: ICasinoNav) => {
        const temp = e.games.filter((r) => r.details?.vendor === selectedProvider.value);
        return temp.length ? [...ary, { ...e, games: sortTopGames(temp) }] : ary;
      }, []);

    if (search)
      filtered = filtered.reduce((ary: ICasinoNav[], e: ICasinoNav) => {
        const temp = e.games.filter((r) =>
          r.game_name.toLowerCase().includes(search.toLowerCase())
        );
        return temp.length ? [...ary, { ...e, games: sortTopGames(temp) }] : ary;
      }, []);

    return filtered.sort((a, b) => b.games.length - a.games.length);
  }, [search, selectedProvider, casino_lists, sortTopGames]);

  // JackPot
  const [jackpotGames, setJackpotGames] = useState([]);

  const onJackpotClick = (jackpot: any) => {
    setJackpotGames(jackpot.games);
  };

  useEffect(() => {
    if (document.getElementById('w7g-bootstrap')) return;
    const script = document.createElement('script');
    script.id = 'w7g-bootstrap';
    script.src = GAME_LOAD_URL;
    script.async = true;

    script.onload = () => {
      if (window.widget7777gaming) {
        const userCurrency = auth?.currency?.symbol || 'USD';
        window.widget7777gaming.addConfig({
          lang: 'en',
          currency: userCurrency,
          market: 'luckverse777',
        });
        window.widget7777gaming.init(() => {
          if (window.widget7777gaming?.app) {
            window.widget7777gaming.app.initJackpotOdometers({
              tooltip: true,
              useIcons: true,
              dateCountryCode: 'en-GB',
            });
          }
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      const scriptElement = document.getElementById('w7g-bootstrap');
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, [GAME_LOAD_URL, auth]);

  useEffect(() => {
    if (window.widget7777gaming?.app && Filterd.jackpot.length) {
      window.widget7777gaming.app.events.trigger('update-odometers');
    }
  }, [Filterd.jackpot]);

  /* eslint-disable */
  useEffect(() => {
    // @ts-ignore
    if (!document?.factory) return;
    // @ts-ignore
    document.factory.fetch('jackpot_goodwin').then((JPWidget: any) => {
      new JPWidget({
        el: 'jackpot-gw',
        onJackpotClick: onJackpotClick,
        popupContainer: 'popup',
        navigation: { view: 'compact' },
        settings: {
          orientation: 'horizontal',
          backgroundColor: '#2B2F3D',
          logo: {
            url: 'https://luckverse777.com/logo/logo_title.svg',
            position: 'center',
            order: 1,
          },
          totalPrizePool: { show: true, position: 'center', order: 2 },
          jackpots: {
            position: 'center',
            order: 3,
            orientation: 'horizontal',
            updateInterval: 2000, // Обновление каждые 2 секунды
          },
          jackpotHigh: {
            order: 1,
            orientation: 'horizontal',
            iconURL: 'https://luckverse777.com/logo/logo_icon.svg',
          },
          jackpotMedium: { order: 2, orientation: 'horizontal' },
          jackpotLow: { order: 3, orientation: 'horizontal' },
          winnerSettings: {
            generateRandomWinners: true,
            winnerNames: ['Alex', 'Mike', 'Sarah', 'John', 'Emma', 'David', 'Lisa', 'Tom', 'Anna', 'Chris', 'Kate', 'Max', 'Sofia', 'Ryan', 'Mia'],
            multiplierRange: [1.5, 15.0],
            amountRange: [50, 5000],
          },
        },
      });
    });
  }, [document]);

  // end JackPot
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('view');
    if (id === 'jackpot') setViewGame(id);

    if (!isLoggedIn) {
      if (pathname.includes('signup')) dispatch(ChangePage('register'));
      else if (pathname.includes('signin')) dispatch(ChangePage('login'));
    }

    if (pathname.includes('spin')) {
      if (!isLoggedIn) {
        toast.error(t('please_login_first'));
      } else {
        permanentSpinModal.onTrue();
      }
    }
  }, [pathname, isLoggedIn, dispatch, t, permanentSpinModal]);

  useEffect(() => {
    if (!casino_lists.length) return;
    const temp = [
      {
        label: t('live_casino'),
        icon: '/assets/icons/casino/live_casino.png',
        url: paths.casino.live,
      },
      {
        label: t('slots'),
        icon: '/assets/icons/casino/slots.png',
        url: paths.casino.slot,
      },
      // {
      //   label: t("virtual_game"),
      //   icon: "/assets/icons/casino/eygpt.png",
      //   url: paths.casino.virtual
      // },
      {
        label: t('lottery'),
        icon: '/assets/icons/casino/lottery.png',
        url: paths.casino.lottery,
      },
      {
        label: t('sports_game'),
        icon: '/assets/icons/casino/sports_game.png',
        url: paths.casino.sports,
      },
      {
        label: t('other'),
        icon: '/assets/icons/casino/others.png',
        url: paths.casino.other,
      },
    ];
    setCategories(temp);

    const pvders = casino_lists.reduce((ary: ICasinoProvider[], row: ICasinoNav) => {
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
  }, [casino_lists]);

  const allGames = useMemo(
    () => casino_lists.flatMap((row: ICasinoNav) => row.games),
    [casino_lists]
  );
  const [randomGames, setRandomGames] = useState<ICasinoGame[]>([]);
  const hasGeneratedGames = useRef(false);

  useEffect(() => {
    if (casino_lists.length > 0 && !hasGeneratedGames.current) {
      const games = Array.from({ length: 100 }, () => {
        const randomIndex = Math.floor(Math.random() * allGames.length);
        return allGames[randomIndex];
      });
      setRandomGames(games);
      hasGeneratedGames.current = true;
    }
  }, [casino_lists, allGames]);

  // const FooterBanner = ({ banner }: { banner: string }) => {
  //   const selected = banners.find((b) => b.type === banner);

  //   if (selected?.image)
  //     return (
  //       <Box position="relative">
  //         <Image src={`${API_URL}/${selected.image}`} sx={{ borderRadius: 0.5 }} />
  //         {selected?.button && (
  //           <Box
  //             sx={{
  //               position: 'absolute',
  //               left: '3%',
  //               bottom: '4%',
  //               // border: "1px solid gold"
  //             }}
  //           >
  //             <Link href={selected.link} style={{ textDecoration: 'none' }}>
  //               <Button
  //                 color="primary"
  //                 variant="contained"
  //                 disabled={!selected.link}
  //                 className="bold-font"
  //                 sx={{
  //                   py: 0.4,
  //                   px: { xs: 2, md: 3 },
  //                   fontSize: { xs: 11, md: 14 },
  //                   border: 'solid 1px #e6be69',
  //                 }}
  //               >
  //                 {selected?.button_name || APP_NAME}
  //               </Button>
  //             </Link>
  //           </Box>
  //         )}
  //       </Box>
  //     );

  //   return (
  //     <Paper
  //       component={Stack}
  //       p={2}
  //       alignItems="center"
  //       gap={3}
  //       textAlign="center"
  //       position="relative"
  //       width={{ xs: 1, sm: 0.4 }}
  //       overflow="hidden"
  //     >
  //       <Typography variant="h5">{selected?.title || t('cta_for_bonus_page')}</Typography>
  //       <Typography variant="subtitle2">
  //         {selected?.description || t('cta_for_bonus_page_desc')}
  //       </Typography>
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         size="large"
  //         sx={{
  //           px: 5,
  //           py: 3,
  //           background: 'linear-gradient(180deg, #5CC04A 0%, #14A875 100%)',
  //           textTransform: 'uppercase',
  //           zIndex: 2,
  //         }}
  //       >
  //         {t('get_bonus')}
  //       </Button>
  //       <Stack
  //         direction="row"
  //         sx={{ position: 'absolute', justifyContent: 'space-between', width: 0.9, bottom: 0 }}
  //       >
  //         <Box component="img" src="/assets/images/casino/cta2.png" />
  //         <Box component="img" src="/assets/images/casino/cta2.png" />
  //       </Stack>
  //     </Paper>
  //   );
  // };

  const leftBanner = (
    <Card
      sx={{
        flex: 1,
        position: 'static',
        backgroundImage: smDown
          ? `
            linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.7) 100%),
            url(/assets/images/casino/home/back.png)`
          : `
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(255, 255, 255, 0.1) 10%, rgba(0, 0, 0, 0.1) 50%),
            linear-gradient(to top, rgba(0, 0, 0, 0.1) 0%, rgba(255, 255, 255, 0.1) 10%, rgba(0, 0, 0, 0.1) 50%),  
            linear-gradient(to right, rgba(0, 0, 0, 0.1) 0%, rgba(255, 255, 255, 0.1) 10%, rgba(0, 0, 0, 0.1) 50%), 
            linear-gradient(to left, rgba(0, 0, 0, 0.1) 0%, rgba(255, 255, 255, 0.1) 10%, rgba(0, 0, 0, 0.1) 50%), 
            url(/assets/images/casino/home/back.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        border: smDown ? '2px solid #67F962' : 'none',
        borderRadius: 1,
        overflow: 'visible',
        ...(smDown && {
          minWidth: 150,
          height: 225,
        }),
        ...(!smDown && {
          width: '100%',
          borderRadius: 1,
        }),
      }}
    >
      <CardContent
        sx={{
          p: { xs: '12px !important', sm: 3 },
          position: 'relative',
          overflow: 'visible',
          ...(smDown && {
            border: 'none',
            m: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            textAlign: 'center',
          }),
          ...(!smDown && {
            border: '2px solid #67F962',
            borderRadius: 1,
            m: { xs: 1, sm: 2 },
          }),
        }}
      >
        {smDown && (
          <Image
            src="/assets/images/casino/home/footer1.png"
            alt="spin"
            sx={{
              position: 'absolute',
              top: '65%',
              height: '80%',
              transform: 'translateY(-100%)',
              width: 'auto',
              maxWidth: '100%',
              zIndex: 3,
              right: '0%',
              left: '0%',
            }}
          />
        )}
        <Box
          sx={{
            ...(smDown && {
              position: 'absolute',
              top: '60%',
              height: '40%',
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              px: '12px',
            }),
            ...(!smDown && {
              mt: 0,
              flexGrow: 1,
              zIndex: 4,
            }),
          }}
        >
          <Typography
            fontSize={{ xs: 18, sm: 32 }}
            fontWeight={400}
            textTransform="uppercase"
            zIndex={2}
            position="relative"
            sx={{
              fontFamily: 'Impact, sans-serif',
              letterSpacing: 0,
              maxWidth: smDown ? '100%' : '50%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              lineHeight: 1,
              color: '#FFFFFF',
            }}
          >
            {t('casino')}
          </Typography>
          <Typography
            fontSize={{ xs: 18, sm: 32 }}
            fontWeight={400}
            textTransform="uppercase"
            zIndex={2}
            position="relative"
            sx={{
              fontFamily: 'Impact, sans-serif',
              letterSpacing: 0,
              maxWidth: smDown ? '100%' : '50%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              lineHeight: 1,
              color: '#FFFFFF',
            }}
          >
            {t('welcome_bonus')}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              router.push(`/${currentLang.value}${paths.casino.signin}`);
            }}
            sx={{
              my: { xs: 1, sm: 2 },
              py: { xs: 0.75, sm: 1.5 },
              px: { xs: 2, sm: 3 },
              borderRadius: 50,
              ...(smDown && {
                minWidth: 80,
                fontSize: 12,
                py: 0.75,
              }),
              fontFamily: 'Cera Pro, sans-serif',
              fontWeight: 700,
              fontSize: 12,
              lineHeight: 1,
              letterSpacing: 0,
              textTransform: 'uppercase',
            }}
          >
            {t('get_now')}
          </Button>
        </Box>
        {!smDown && (
          <Image
            src="/assets/images/casino/home/footer1.png"
            alt="spin"
            sx={{
              position: 'absolute',
              right: 0,
              width: 212,
              top: -25,
              zIndex: 3,
            }}
          />
        )}
      </CardContent>
    </Card>
  );

  const rightBanner = (
    <Card
      sx={{
        flex: 1,
        position: 'static',
        backgroundImage: smDown
          ? `
            linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.7) 100%),
            url(/assets/images/casino/home/back.png)`
          : `
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(255, 255, 255, 0.1) 10%, rgba(0, 0, 0, 0.1) 50%),
            linear-gradient(to top, rgba(0, 0, 0, 0.1) 0%, rgba(255, 255, 255, 0.1) 10%, rgba(0, 0, 0, 0.1) 50%),  
            linear-gradient(to right, rgba(0, 0, 0, 0.1) 0%, rgba(255, 255, 255, 0.1) 10%, rgba(0, 0, 0, 0.1) 50%), 
            linear-gradient(to left, rgba(0, 0, 0, 0.1) 0%, rgba(255, 255, 255, 0.1) 10%, rgba(0, 0, 0, 0.1) 50%), 
            url(/assets/images/casino/home/back.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        border: smDown ? '2px solid #67F962' : 'none',
        borderRadius: 1,
        overflow: 'visible',
        ...(smDown && {
          minWidth: 150,
          height: 225,
        }),
        ...(!smDown && {
          width: '100%',
          borderRadius: 1,
        }),
      }}
    >
      <CardContent
        sx={{
          p: { xs: '12px !important', sm: 3 },
          position: 'relative',
          overflow: 'visible',
          ...(smDown && {
            border: 'none',
            m: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            textAlign: 'center',
          }),
          ...(!smDown && {
            border: '2px solid #67F962',
            borderRadius: 1,
            m: { xs: 1, sm: 2 },
          }),
        }}
      >
        {smDown && (
          <Image
            src="/assets/images/casino/home/footer2.png"
            alt="spin"
            sx={{
              position: 'absolute',
              top: '65%',
              height: '80%',
              transform: 'translateY(-100%)',
              width: 'auto',
              maxWidth: '100%',
              zIndex: 3,
              right: '0%',
              left: '0%',
            }}
          />
        )}
        <Box
          sx={{
            ...(smDown && {
              position: 'absolute',
              top: '60%',
              height: '40%',
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              px: '12px',
            }),
            ...(!smDown && {
              mt: 0,
              flexGrow: 1,
              zIndex: 4,
            }),
          }}
        >
          <Typography
            fontSize={{ xs: 18, sm: 32 }}
            fontWeight={400}
            textTransform="uppercase"
            zIndex={2}
            position="relative"
            sx={{
              fontFamily: 'Impact, sans-serif',
              letterSpacing: 0,
              maxWidth: smDown ? '100%' : '50%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1,
              color: '#FFFFFF',
            }}
          >
            {t('megaways')}
          </Typography>
          <Typography
            fontSize={{ xs: 18, sm: 32 }}
            fontWeight={400}
            textTransform="uppercase"
            zIndex={2}
            position="relative"
            sx={{
              fontFamily: 'Impact, sans-serif',
              letterSpacing: 0,
              maxWidth: smDown ? '100%' : '50%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1,
              color: '#FFFFFF',
            }}
          >
            {t('to_win')}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push(`/${currentLang.value}${paths.casino.megaways}`)}
            sx={{
              my: { xs: 1, sm: 2 },
              py: { xs: 0.75, sm: 1.5 },
              px: { xs: 2, sm: 3 },
              borderRadius: 50,
              ...(smDown && {
                minWidth: 80,
                fontSize: 12,
                py: 0.75,
              }),
              fontFamily: 'Cera Pro, sans-serif',
              fontWeight: 700,
              fontSize: 12,
              lineHeight: 1,
              letterSpacing: 0,
              textTransform: 'uppercase',
            }}
          >
            {t('get_now')}
          </Button>
        </Box>
        {!smDown && (
          <Image
            src="/assets/images/casino/home/footer2.png"
            alt="gamification"
            sx={{
              position: 'absolute',
              right: 0,
              width: 212,
              top: -20,
              zIndex: 3,
            }}
          />
        )}
      </CardContent>
    </Card>
  );

  const footerBanner = (
    <Stack position="relative" pt={{ xs: 2, sm: 4 }} overflow="hidden" width="100%">
      {smDown ? (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: '100%',
            padding: '10px',
            background: 'transparent',
          }}
        >
          {leftBanner}
          {rightBanner}
        </Stack>
      ) : (
        <Grid
          container
          pt={4}
          spacing={1}
          sx={{
            background: 'transparent',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <Grid item xs={12} md={6} position="relative">
            {leftBanner}
          </Grid>
          <Grid item xs={12} md={6} position="relative">
            {rightBanner}
          </Grid>
        </Grid>
      )}
    </Stack>
  );

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hidden containers for jackpot widget */}
      <div id="jackpot-gw" style={{ display: 'none' }} />
      <div id="popup" style={{ display: 'none' }} />
      
      {/* <HomeBanner openDailyWheel={permanentSpinModal.onTrue} second={false} /> */}

      {/* Mobile Promotions Section - только для главной страницы казино на мобильных */}
      <MobilePromotions />

      <GameCardsRow />

      {/* <HomeCarousel /> */}

      {/* All banner sections removed per user request */}

      <PermanentSpinDialog open={permanentSpinModal.value} onClose={permanentSpinModal.onFalse} />

      <Stack

      >
        {smDown ? (
          <Box
            sx={{
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(25, 25, 55, 0.3)',
                borderRadius: 3,
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#2B2F3D',
                borderRadius: 3,
                '&:hover': {
                  background: '#3A3F4D',
                },
              },
            }}
          >
            <Stack
              direction="row"
              sx={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1 }
              }}
            >
              {ALL.map((category, index) => (
                <CategoryCard
                  key={index}
                  category={category}
                  index={index}
                  isSelected={selectedCategory === index}
                  onClick={handleCategoryClick}
                />
              ))}
            </Stack>
          </Box>
        ) : (
          <Box
            sx={{
              p: 2,
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(25, 25, 55, 0.3)',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#2B2F3D',
                borderRadius: 4,
                '&:hover': {
                  background: '#3A3F4D',
                },
              },
            }}
          >
            <Stack
              direction="row"
              sx={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1
              }}
            >
              {ALL.map((category, index) => (
                <CategoryCard
                  key={index}
                  category={category}
                  index={index}
                  isSelected={selectedCategory === index}
                  onClick={handleCategoryClick}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>

      {/* Providers Popup */}
      <Dialog
        open={providersPopup.value}
        onClose={providersPopup.onFalse}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: 'transparent',
            border: '2px solid #CAAE51',
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: '#050514', textAlign: 'center', bgcolor: '#24ee89', py: 2 }}>
          {t('providers')}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'transparent', p: 3 }}>
          <Suspense fallback={<Skeleton height={200} />}>
            <Providers
              providers={providers}
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
              onClose={providersPopup.onFalse}
            />
          </Suspense>
        </DialogContent>
      </Dialog>

      {/* Общий контейнер для всех каруселей игр */}
      <Box
        sx={{
          mt: 4,
          bgcolor: '#2B2F3D',
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Top Games */}
        <Stack gap={1}>
          <Stack direction="row" justifyContent="space-between" px={2}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'FONTSPRING DEMO - Blunt Con It, Impact, sans-serif !important',
                  fontWeight: '400 !important',
                  fontStyle: 'italic !important',
                  fontSize: '21px !important',
                  lineHeight: '100% !important',
                  letterSpacing: '5% !important',
                  textTransform: 'uppercase !important',
                  color: '#FFFFFF !important',
                  transform: 'skewX(-5deg)'
                }}
              >
                {t('top_games')}
              </Typography>
            </Stack>
            <Chip
              clickable
              label={t('show_all')}
              variant="outlined"
              size="small"
              color="primary"
              component={RouterLink}
              to={`/${currentLang.value}${paths.casino.top_games}`}
              onDelete={() => { }}
              sx={{
                color: '#ffffffff',
                border: 'solid 1px #24ee89',
                bgcolor: '#2B2F3D',
                fontSize: '10px',
                fontWeight: 'bold',
                height: 20,
                px: 1,
                '&:hover': {
                  bgcolor: '#373b49ff',
                  border: 'solid 1px #24ee89',
                },
              }}
              deleteIcon={<Iconify icon="mingcute:down-line" />}
            />
          </Stack>
          <Swiper
            slidesPerView={2}
            spaceBetween={10}
            loop={top_games.length > 1}
            loopAdditionalSlides={50}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            style={{
              padding: '0 10px',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
            }}
            breakpoints={{
              600: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              900: {
                slidesPerView: 5,
                spaceBetween: 12,
              },
              1200: {
                slidesPerView: 5,
                spaceBetween: 12,
              },
              1500: {
                slidesPerView: 6,
                spaceBetween: 15,
              },
            }}
            onSlideChange={(swiper: SwiperInstance) => {
              const { activeIndex = 0, slides, params } = swiper;
              const slidesPerViewRaw = params.slidesPerView;
              const slidesPerView = typeof slidesPerViewRaw === 'number' ? slidesPerViewRaw : 2;
              const totalSlides = top_games.length;

              const remainingSlides = totalSlides - (activeIndex % totalSlides) - slidesPerView;

              if (remainingSlides < 0) {
                swiper.slideToLoop(0, 0);
              }
            }}
            className="top-games-swiper"
          >
            {top_games.length === 0
              ? [...Array(6)].map((_, index) => (
                <SwiperSlide key={index} style={{ backgroundColor: 'transparent' }}>
                  <Stack gap={1}>
                    <Skeleton
                      sx={{
                        width: { xs: '48vw', md: 180 },
                        height: { xs: 160, md: 240 },
                        borderRadius: 0.5,
                      }}
                    />
                  </Stack>
                </SwiperSlide>
              ))
              : top_games.map((game, index) => (
                <SwiperSlide key={index} style={{ backgroundColor: 'transparent' }}>
                  <Stack
                    sx={{
                      cursor: 'pointer',
                      m: 0.5,
                      mb: 1,
                      p: 0.5,
                      width: { xs: '48vw', md: 180 },
                      minWidth: { xs: 'none', md: 180 },
                      maxWidth: { xs: 'none', md: 180 },
                      height: { xs: '160px', md: '240px' },
                      aspectRatio: '3 / 4',
                      bgcolor: 'transparent',
                      borderRadius: 0.5,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onClick={() =>
                      playGame(game.type, game.provider_code, game.game_code, game.game_name)
                    }
                  >
                    <Image
                      src={getImageUrl(game.banner)}
                      sx={{
                        width: '100%',
                        height: '85%',
                        borderRadius: 0.5,
                        bgcolor: 'background.default',
                        '& img': {
                          objectFit: 'fill',
                          width: '100%',
                          height: '100%',
                          objectPosition: 'center',
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#FFFFFF',
                        textAlign: 'center',
                        mt: 0.5,
                        fontSize: { xs: 10, md: 12 },
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {game.game_name}
                    </Typography>
                  </Stack>
                </SwiperSlide>
              ))}
          </Swiper>
        </Stack>

        {/* <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={0.5}
          sx={{
            backgroundColor: theme.palette.background.default,
            width: '100%',
            paddingTop: '10px',
          }}
        >
         
        </Stack> */}

        {/* All banner sections completely removed - no content here */}

        <Stack gap={2} sx={{ position: 'relative', mt: 3 }}>
          <Stack direction="row" justifyContent="space-between" px={2}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'FONTSPRING DEMO - Blunt Con It, Impact, sans-serif !important',
                  fontWeight: '400 !important',
                  fontStyle: 'italic !important',
                  fontSize: '21px !important',
                  lineHeight: '100% !important',
                  letterSpacing: '5% !important',
                  textTransform: 'uppercase !important',
                  color: '#FFFFFF !important',
                  transform: 'skewX(-5deg)'
                }}
              >
                {t('fast_games')}
              </Typography>
            </Stack>
            <Chip
              clickable
              label={t('show_all')}
              variant="outlined"
              size="small"
              color="primary"
              component={RouterLink}
              to={`/${currentLang.value}${paths.casino.fast_games}`}
              onDelete={() => { }}
              sx={{
                color: '#ffffffff',
                border: 'solid 1px #24ee89',
                bgcolor: '#2B2F3D',
                fontSize: '10px',
                fontWeight: 'bold',
                height: 20,
                px: 1,
                '&:hover': {
                  bgcolor: '#A6A6C2',
                  border: 'solid 1px #24ee89',
                },
              }}
              deleteIcon={<Iconify icon="mingcute:down-line" />}
            />
          </Stack>
          <Swiper
            slidesPerView={2}
            spaceBetween={10}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={fast_games.length > 1}
            loopAdditionalSlides={50}
            modules={[Autoplay]}
            style={{
              padding: '0 10px',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
            }}
            breakpoints={{
              600: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              900: {
                slidesPerView: 5,
                spaceBetween: 12,
              },
              1200: {
                slidesPerView: 5,
                spaceBetween: 12,
              },
              1500: {
                slidesPerView: 6,
                spaceBetween: 15,
              },
            }}
            onSlideChange={(swiper: SwiperInstance) => {
              const { activeIndex = 0, slides, params } = swiper;
              const slidesPerViewRaw = params.slidesPerView;
              const slidesPerView = typeof slidesPerViewRaw === 'number' ? slidesPerViewRaw : 2;
              const totalSlides = fast_games.length;

              const remainingSlides = totalSlides - (activeIndex % totalSlides) - slidesPerView;

              if (remainingSlides < 0) {
                swiper.slideToLoop(0, 0);
              }
            }}
            className="other-games-swiper"
          >
            {fast_games.length === 0
              ? [...Array(10)].map((_, index) => (
                <SwiperSlide key={index} style={{ backgroundColor: 'transparent' }}>
                  <Stack gap={1}>
                    <Skeleton
                      sx={{
                        width: { xs: '48vw', md: 180 },
                        height: { xs: 160, md: 240 },
                        borderRadius: 0.5,
                      }}
                    />
                  </Stack>
                </SwiperSlide>
              ))
              : fast_games.map((game, index) => (
                <SwiperSlide key={index} style={{ backgroundColor: 'transparent' }}>
                  <Stack
                    sx={{
                      cursor: 'pointer',
                      m: 0.5,
                      mb: 1,
                      p: 0.5,
                      width: { xs: '48vw', md: 180 },
                      minWidth: { xs: 'none', md: 180 },
                      maxWidth: { xs: 'none', md: 180 },
                      height: { xs: 160, md: 240 },
                      aspectRatio: '3 / 4',
                      bgcolor: 'transparent',
                      borderRadius: 0.5,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onClick={() =>
                      playGame(game.type, game.provider_code, game.game_code, game.game_name)
                    }
                  >
                    <Image
                      src={getImageUrl(game.banner)}
                      sx={{
                        width: '100%',
                        height: '85%',
                        borderRadius: 0.5,
                        backgroundColor: '#1a1a1a',
                        '& img': {
                          objectFit: 'fill',
                          width: '100%',
                          height: '100%',
                          objectPosition: 'center',
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#FFFFFF',
                        textAlign: 'center',
                        mt: 0.5,
                        fontSize: { xs: 10, md: 12 },
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {game.game_name}
                    </Typography>
                  </Stack>
                </SwiperSlide>
              ))}
          </Swiper>
        </Stack>

        {/* Middle2Carousel removed - contained jackpot banner */}



        {/* Live Casino */}
        <Stack gap={1} mt={3}>
          <Stack direction="row" justifyContent="space-between" px={2}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'FONTSPRING DEMO - Blunt Con It, Impact, sans-serif !important',
                  fontWeight: '400 !important',
                  fontStyle: 'italic !important',
                  fontSize: '21px !important',
                  lineHeight: '100% !important',
                  letterSpacing: '5% !important',
                  textTransform: 'uppercase !important',
                  color: '#FFFFFF !important',
                  transform: 'skewX(-5deg)'
                }}
              >
                {t('live_casino')}
              </Typography>
            </Stack>
            <Chip
              clickable
              label={t('show_all')}
              variant="outlined"
              size="small"
              color="primary"
              component={RouterLink}
              to={`/${currentLang.value}${paths.casino.live}`}
              sx={{
                color: '#ffffffff',
                border: 'solid 1px #24ee89',
                bgcolor: '#2B2F3D',
                fontSize: '12px',
                fontWeight: 'bold',
                height: 24,
                px: 1.5,
                '&:hover': {
                  bgcolor: '#A6A6C2',
                  border: 'solid 1px #24ee89',
                },
              }}
              deleteIcon={<Iconify icon="mingcute:down-line" />}
            />
          </Stack>
          <Swiper
            slidesPerView={2}
            spaceBetween={10}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            style={{
              padding: '0 10px',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
            }}
            breakpoints={{
              600: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              900: {
                slidesPerView: 5,
                spaceBetween: 12,
              },
              1200: {
                slidesPerView: 5,
                spaceBetween: 12,
              },
              1500: {
                slidesPerView: 6,
                spaceBetween: 15,
              },
            }}
            className="other-games-swiper"
          >
            {!Filterd.liveCasino.length
              ? [...Array(10)].map((_, index) => (
                <SwiperSlide key={index} style={{ backgroundColor: 'transparent' }}>
                  <Stack gap={1}>
                    <Skeleton
                      sx={{
                        width: { xs: '48vw', md: 180 },
                        height: { xs: 160, md: 240 },
                        borderRadius: 0.5,
                      }}
                    />
                  </Stack>
                </SwiperSlide>
              ))
              : Filterd.liveCasino.map((game: any, index: number) => (
                <SwiperSlide key={index} style={{ backgroundColor: 'transparent' }}>
                  <Stack
                    sx={{
                      cursor: 'pointer',
                      m: 0.5,
                      mb: 1,
                      p: 0.5,
                      width: { xs: '48vw', md: 180 },
                      minWidth: { xs: 'none', md: 180 },
                      maxWidth: { xs: 'none', md: 180 },
                      height: { xs: 160, md: 240 },
                      aspectRatio: '3 / 4',
                      bgcolor: 'transparent',
                      borderRadius: 0.5,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onClick={() => {
                      if (game.type)
                        playGame(
                          game.type,
                          game.provider_code,
                          game.game_code,
                          game.game_name
                        );
                    }}
                  >
                    <Image
                      src={game.banner}
                      sx={{
                        width: '100%',
                        height: '85%',
                        borderRadius: 0.5,
                        backgroundColor: 'transparent',
                        '& img': {
                          objectFit: 'fill',
                          width: '100%',
                          height: '100%',
                          objectPosition: 'center',
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#FFFFFF',
                        textAlign: 'center',
                        mt: 0.5,
                        fontSize: { xs: 10, md: 12 },
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {game.game_name}
                    </Typography>
                  </Stack>
                </SwiperSlide>
              ))}
          </Swiper>
        </Stack>

        {/* <MiddleCarousel /> */}

        {/* Blackjack */}
        <Stack gap={1} mt={3}>
          <Stack direction="row" justifyContent="space-between" px={2}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'FONTSPRING DEMO - Blunt Con It, Impact, sans-serif !important',
                  fontWeight: '400 !important',
                  fontStyle: 'italic !important',
                  fontSize: '21px !important',
                  lineHeight: '100% !important',
                  letterSpacing: '5% !important',
                  textTransform: 'uppercase !important',
                  color: '#FFFFFF !important',
                  transform: 'skewX(-5deg)'
                }}
              >
                {t('blackjack')}
              </Typography>
            </Stack>
            <Chip
              clickable
              label={t('show_all')}
              variant="outlined"
              size="small"
              color="primary"
              component={RouterLink}
              to={`/${currentLang.value}${paths.casino.live}/live-casino-blackjack`}
              sx={{
                color: '#ffffffff',
                border: 'solid 1px #24ee89',
                bgcolor: '#2B2F3D',
                fontSize: '12px',
                fontWeight: 'bold',
                height: 24,
                px: 1.5,
                '&:hover': {
                  bgcolor: '#A6A6C2',
                  border: 'solid 1px #24ee89',
                },
              }}
              deleteIcon={<Iconify icon="mingcute:down-line" />}
            />
          </Stack>
          <Swiper
            slidesPerView={2}
            spaceBetween={10}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            style={{
              padding: '0 10px',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
            }}
            breakpoints={{
              600: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              900: {
                slidesPerView: 5,
                spaceBetween: 12,
              },
              1200: {
                slidesPerView: 5,
                spaceBetween: 12,
              },
              1500: {
                slidesPerView: 6,
                spaceBetween: 15,
              },
            }}
            className="other-games-swiper"
          >
            {!Filterd.blackjack.length
              ? [...Array(10)].map((_, index) => (
                <SwiperSlide key={index} style={{ backgroundColor: 'transparent' }}>
                  <Stack gap={1}>
                    <Skeleton
                      sx={{
                        width: { xs: '48vw', md: 180 },
                        height: { xs: 160, md: 240 },
                        borderRadius: 0.5,
                      }}
                    />
                  </Stack>
                </SwiperSlide>
              ))
              : Filterd.blackjack.map((game: any, index: number) => (
                <SwiperSlide key={index} style={{ backgroundColor: 'transparent' }}>
                  <Stack
                    sx={{
                      cursor: 'pointer',
                      m: 0.5,
                      mb: 1,
                      p: 0.5,
                      width: { xs: '48vw', md: 180 },
                      minWidth: { xs: 'none', md: 180 },
                      maxWidth: { xs: 'none', md: 180 },
                      height: { xs: 160, md: 240 },
                      aspectRatio: '3 / 4',
                      bgcolor: 'transparent',
                      borderRadius: 0.5,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onClick={() => {
                      if (game.type)
                        playGame(
                          game.type,
                          game.provider_code,
                          game.game_code,
                          game.game_name
                        );
                    }}
                  >
                    <Image
                      src={game.banner}
                      sx={{
                        width: '100%',
                        height: '85%',
                        borderRadius: 0.5,
                        backgroundColor: 'transparent',
                        '& img': {
                          objectFit: 'fill',
                          width: '100%',
                          height: '100%',
                          objectPosition: 'center',
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#FFFFFF',
                        textAlign: 'center',
                        mt: 0.5,
                        fontSize: { xs: 10, md: 12 },
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {game.game_name}
                    </Typography>
                  </Stack>
                </SwiperSlide>
              ))}
          </Swiper>
        </Stack>

      </Box>

      <Suspense fallback={null}>
        <ViewGameModal
          open={!!viewGame}
          title={t(viewGame)}
          onClose={onCloseViewGame}
          games={Filterd[viewGame] || []}
          playGame={playGame}
        />
      </Suspense>

      {/* Mobile Bottom Banners - для всех страниц казино на мобильных */}
      <MobileBottomBanners />
    </Box>
  );
}

export default memo(CasinoView);
