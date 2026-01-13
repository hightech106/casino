import { useCallback, useEffect, useState, useMemo } from 'react';
import { matchPath, useLocation } from 'react-router';
// @mui
import { Box } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// hooks
import useApi from 'src/hooks/use-api';
import { useLocales } from 'src/locales';
// store
import { useDispatch } from 'src/store';
import { updateSportsList } from 'src/store/reducers/sports';
// components
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
// config
import { API_URL } from 'src/config-global';
// types
import type { INavData, ISportsList } from 'src/types';

// ----------------------------------------------------------------------

const POLLING_INTERVAL = 60 * 1000; // 60 seconds

const createIconify = (name: string) => <Iconify icon={name} width={24} height={24} />;

const NAV_ICONS = {
  home: createIconify('mdi:home'),
  live: createIconify('material-symbols:live-tv-outline'),
  favorite: createIconify('mingcute:star-fill'),
  football: createIconify('solar:football-bold'),
} as const;

export const SPORTS_LINK = [
  { title: 'home', path: paths.sports.root, icon: NAV_ICONS.home },
  { title: 'live', path: paths.sports.live, icon: NAV_ICONS.live },
  // {
  //   title: 'favorites',
  //   path: paths.sports.favorite,
  //   icon: ICONS.favorite,
  // },
] as const;

// ----------------------------------------------------------------------

interface UseNavDataReturn {
  subheader: string;
  items: INavData[];
}

export function useNavData(): UseNavDataReturn[] {
  const { t, currentLang } = useLocales();
  const dispatch = useDispatch();
  const { get_sports_list } = useApi();
  const { pathname } = useLocation();
  
  const [sportsList, setSportsList] = useState<ISportsList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const isSportsLink = useMemo(
    () => !!matchPath({ path: 'sports', end: false }, pathname),
    [pathname]
  );

  const fetchSportsList = useCallback(async (lang: string): Promise<void> => {
    try {
      const res = await get_sports_list('LIVE', lang);
      if (!res?.data) return;
      
      setSportsList(res.data);
      dispatch(updateSportsList(res.data));
    } catch (error) {
      console.error('Failed to fetch sports list:', error);
    }
  }, [get_sports_list, dispatch]);

  const fetchSportsListWithLoading = useCallback(async () => {
    setLoading(true);
    await fetchSportsList(currentLang.value);
    setLoading(false);
  }, [fetchSportsList, currentLang.value]);

  // Transform sports list to nav items
  const navItems = useMemo(() => 
    sportsList.map((sport) => ({
      title: sport.SportName,
      path: `/${currentLang.value}${paths.sports.root}/${sport.SportId}`,
      icon: sport.img ? (
        <Image 
          src={`${API_URL}/${sport.img}`} 
          alt={sport.SportName}
          loading="lazy"
        />
      ) : (
        <Box
          component="i"
          className={`sportsicons sportsicon-${sport.SportId}`}
          sx={{ color: sport.color }}
        />
      ),
      info: sport.count,
    })),
    [sportsList, currentLang.value]
  );

  // Initial fetch
  useEffect(() => {
    fetchSportsListWithLoading();
  }, [fetchSportsListWithLoading]);

  // Polling for updates
  useEffect(() => {
    if (!isSportsLink) return;

    const intervalId = setInterval(
      () => fetchSportsList(currentLang.value),
      POLLING_INTERVAL
    );

    // eslint-disable-next-line consistent-return
    return () => clearInterval(intervalId);
  }, [isSportsLink, currentLang.value, fetchSportsList]);

  // Transform base links with current language
  const baseNavItems = useMemo(() => 
    SPORTS_LINK.map((link) => ({
      ...link,
      path: `/${currentLang.value}${link.path}`,
      title: t(link.title),
    })),
    [currentLang.value, t]
  );

  return [
    {
      subheader: '',
      items: baseNavItems,
    },
    {
      subheader: t('sports'),
      items: navItems,
    },
  ];
}
