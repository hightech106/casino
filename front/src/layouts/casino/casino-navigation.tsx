import { useCallback, useEffect, useMemo, useState } from 'react';
// routes
import { paths } from 'src/routes/paths';
import { useLocales } from 'src/locales';
// components
import SvgColor from 'src/components/svg-color';
import Iconify from 'src/components/iconify';
import useApi from 'src/hooks/use-api';
import { useDispatch } from 'react-redux';
import type { ICasinoNav, INavData } from 'src/types';
import { updateCasinoLists, updateTopGames, updateFastGames } from 'src/store/reducers/casino';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/leftbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const iconify = (name: string) => <Iconify icon={name} width={24} height={24} />;

const ICONS = {
  home: icon('home'),
  favorite: iconify('mingcute:star-fill'),
  promotion: icon('promotion'),
  all: icon('all'),
  live: icon('live-casino'),
  slot: icon('slots'),
  top_games: icon('top_games'),
  fast_games: icon('fast_games'),
  club: icon('our-club'),
  video_poker: iconify('icon-park-solid:poker'),
  lottery: icon('lottery'),
  roulette: iconify('tabler:wheel'),
  card: iconify('tabler:play-card'),
  // fast_games: iconify('game-icons:airplane'),
  dice: iconify('ri:dice-fill'),
  lobby: iconify('fluent-emoji-high-contrast:top-hat'),
  dragon: iconify('arcticons:emoji-dragon-face'),
  tablegames: iconify('material-symbols:table-bar-outline'),
  blackjack: iconify('arcticons:black-and-white-icon'),
  poker: iconify('arcticons:pokerstars'),
  andarbahar: iconify('streamline:industry-innovation-and-infrastructure'),
  virtual: iconify('mdi:virtual-meeting'),
  sports: icon('sports'),
  other: icon('other'),
  jackpot: icon('jackpot'),
  megaways: icon('megaways'),
  leaderboard: icon('leaderboard'),
  tournament: icon('tournament'),
  original: icon('original'),
};

// ----------------------------------------------------------------------

export const CASINO_LINK = [
  { title: 'home', path: paths.casino.root, icon: ICONS.home },
  // {
  //   title: 'promotion',
  //   path: paths.casino.promotion,
  //   icon: ICONS.promotion,
  // },
  {
    title: 'top',
    path: paths.casino.top_games,
    icon: ICONS.top_games,
  },
  {
    title: 'fast',
    path: paths.casino.fast_games,
    icon: ICONS.fast_games,
  },
  {
    title: 'original',
    path: paths.casino.original,
    icon: ICONS.original,
  },
  {
    title: 'megaways',
    path: paths.casino.megaways,
    icon: ICONS.megaways,
  },
  {
    title: 'jackpot',
    path: paths.casino.jackPot,
    icon: ICONS.jackpot,
  },
  {
    title: 'games',
    path: paths.casino.slot,
    icon: ICONS.slot,
    children: 'casino',
  },
  {
    title: 'live',
    path: paths.casino.live,
    icon: ICONS.live,
    open: true,
    children: 'live-casino',
  },
  {
    title: 'luckverse777_club',
    path: paths.casino.journey,
    icon: ICONS.club,
  },
  {
    title: 'lottery',
    path: paths.casino.lottery,
    icon: ICONS.lottery,
    children: 'lottery',
  },
  {
    title: 'sports',
    path: paths.casino.sports,
    icon: ICONS.sports,
    children: 'sports',
  },
  {
    title: 'other',
    path: paths.casino.other,
    icon: ICONS.other,
    children: 'other',
  },
  // {
  //   title: 'blackjack',
  //   path: paths.casino.blackjack,
  //   icon: ICONS.blackjack,
  //   children: "blackjack"
  // },
  // {
  //   title: 'Game show',
  //   path: paths.casino.gameshow,
  //   icon: ICONS.live,
  //   children: "gameshow"
  // },
  // {
  //   title: 'poker',
  //   path: paths.casino.poker,
  //   icon: ICONS.poker,
  //   children: "poker"
  // },
  // {
  //   title: 'Crash game',
  //   path: paths.casino.crashgame,
  //   icon: ICONS.fast_games,
  //   children: "crashgame"
  // },
  // {
  //   title: 'Dragon tiger',
  //   path: paths.casino.dragontiger,
  //   icon: ICONS.dragon,
  //   children: "dragontiger"
  // },
  // {
  //   title: 'andarbahar',
  //   path: paths.casino.andarbahar,
  //   icon: ICONS.andarbahar,
  //   children: "andarbahar"
  // },
];

export function useNavData() {
  const { t, currentLang } = useLocales();

  const dispatch = useDispatch();
  const { get_casino_provider, get_top_games, get_fast_games } = useApi();

  const [items, setItems] = useState<INavData[]>([]);
  const [casinoProvider, setCasinoProvider] = useState<ICasinoNav[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getCasinoProvider = useCallback(async () => {
    setLoading(true);
    const res = await get_casino_provider();

    setLoading(false);
    if (!res?.data) return;
    setCasinoProvider(res.data);
    dispatch(updateCasinoLists(res.data));

    const topGamesRes = await get_top_games();
    if (topGamesRes?.data) {
      dispatch(updateTopGames(topGamesRes.data));
    }

    const fastGamesRes = await get_fast_games();
    if (fastGamesRes?.data) {
      dispatch(updateFastGames(fastGamesRes.data));
    }
  }, [dispatch, get_casino_provider, get_top_games, get_fast_games]);

  useEffect(() => {
    if (!casinoProvider.length) return;
    const _items: INavData[] = casinoProvider.map((e) => ({
      title: e.name,
      path: `/${currentLang.value}${paths.casino.root}/${e.type}/${e.code}`,
      type: e.type,
      info: e.count,
    }));
    setItems(_items);
  }, [casinoProvider, currentLang]);

  useEffect(() => {
    getCasinoProvider();
    // eslint-disable-next-line
  }, []);

  const data = [
    // OVERVIEW
    // ----------------------------------------------------------------------
    {
      subheader: '',
      items: CASINO_LINK.map((e) => ({
        ...e,
        path: `/${currentLang.value}${e.path}`,
        title: t(e.title),
        ...(e.children && {
          children: items.filter((item) => item.type === e.children),
        }),
      })),
    },
  ];

  return data;
}
