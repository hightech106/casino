/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable arrow-body-style */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocales } from 'src/locales';
import {
  Dialog,
  DialogContent,
  Typography,
  Stack,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  LinearProgress,
  Skeleton,
  Button,
  Drawer,
} from '@mui/material';

import { useSelector, dispatch } from 'src/store';
import { UpdateMissionNotification } from 'src/store/reducers/auth';
import type { INotificationMission } from 'src/types';

import useApi from 'src/hooks/use-api';
import { useResponsive } from 'src/hooks/use-responsive';

import Iconify from 'src/components/iconify';

import { API_URL } from 'src/config-global';

import type { Badge, Level, Mission, Tab, UserStats, MissionModalProps } from 'src/types/mission';
import {
  HomeTab,
  MissionsTab,
  LevelsTab,
  BadgesTab,
  MiniGamesTab,
  BonusesTab,
  RulesTab,
  MailboxTab,
  ShopTab,
} from '../tabs';
import ScratchGame from '../tabs/ScratchGame';
import WheelGamePage from '../tabs/WheelGamePage';
import WheelX100Page from '../tabs/WheelX100Page';

// Constants
const TABS: Tab[] = [
  { name: 'home', label: 'Home', icon: '/assets/icons/missions/home.png' },
  { name: 'missions', label: 'Missions', icon: '/assets/icons/missions/missions.png' },
  { name: 'level', label: 'Level', icon: '/assets/icons/missions/level.png' },
  { name: 'badges', label: 'Badges', icon: '/assets/icons/missions/badges.png' },
  { name: 'mini-games', label: 'Mini Games', icon: '/assets/icons/missions/mini_games.png' },
  { name: 'shop', label: 'Shop', icon: '/assets/icons/missions/shop.png' },
  { name: 'bonuses', label: 'Bonuses', icon: '/assets/icons/missions/bonuses.png' },
  { name: 'rules', label: 'Terms/Conditions', icon: '/assets/icons/missions/teams.png' },
  { name: 'mail', label: 'Mail', icon: '/assets/icons/missions/mail.png' },
];

// Styles
const styles = {
  dialog: {
    '& .MuiDialog-paper': {
      bgcolor: '#232626',
      borderRadius: 0.5,
      width: { xs: '100vw', sm: '90vw' },
      height: { xs: '100dvh', sm: '90vh' },
      maxHeight: { xs: '100dvh' },
      overflow: 'visible',
      maxWidth: 1300,
      border: '1px solid #2B2F3D',
      margin: 0,
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
      boxSizing: 'border-box',
      position: 'relative',
    },
    '& .MuiDialog-container': {
      overflow: 'visible',
    },
  },
  dialogContent: {
    p: 0,
    display: 'flex',
    bgcolor: '#232626',
    height: '100%',
    overflow: 'visible',
    position: 'relative',
    borderRadius: 0.5,
    boxSizing: 'border-box',
  },
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 40,
    height: 40,
    borderRadius: 0,
    border: '1px solid #24ee89',
    background: 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      background: 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
      color: '#FFFFFF',
    },
    zIndex: 2,
    padding: 0,
  },
  closeIcon: {
    width: 18,
    height: 17,
    color: '#FFFFFF',
  },
  sidebar: {
    width: { xs: 1, sm: 240 },
    height: 1,
    borderRadius: 0.5,
    px: 1.5,
    py: 2.5,
    bgcolor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    position: 'relative',
    zIndex: 1,
  },
  avatarContainer: {
    p: 0.5,
    borderRadius: '50%',
    border: '1px solid #24ee89',
    position: 'relative',
    width: { xs: 60, sm: 75 },
    height: { xs: 60, sm: 75 },
    backgroundColor: '#2B2F3D',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarGlare: {
    position: 'absolute',
    width: '150%',
    height: '20px',
    background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent)',
    transform: 'rotate(45deg)',
    animation: 'glare 5s infinite ease-in-out',
    '@keyframes glare': {
      '0%': {
        top: '100%',
        left: '-50%',
      },
      '100%': {
        top: '-50%',
        left: '100%',
      },
    },
  },
  avatarOuter: {
    p: 0.6,
    borderRadius: '50%',
    backgroundColor: '#2B2F3D',
    display: 'inline-flex',
  },
  avatarBlock: {
    width: 211,
    height: 107,
    backgroundImage: 'url(/assets/images/missions/profile/regrctangle.png)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    mb: 0.5,
  },
  profileBackContainer: {
    width: 245,
    height: 700,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    opacity: 1,
    border: '1px solid #2B2F3D',
    position: 'absolute',
    top: 25,
    left: 25,
    background: '#232626',
    zIndex: 0,
  },
  pointsButton: {
    background: '#24ee89 !important',
    color: '#050514 !important',
    borderRadius: 0.5,
    border: 'none !important',
    px: 2.3,
    py: 0.5,
    fontSize: '14px !important',
    fontWeight: '700 ',
    fontFamily: 'Geogrotesque Cyr, sans-serif ',
    fontStyle: 'italic ',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    transform: 'skew(-5deg)',
    '&:hover': {
      background: '#24ee89 !important',
    },
  },
  tabItem: {
    bgcolor: '#2B2F3D',
    borderRadius: 0.7,
    mb: 0.75,
    '&:hover': {
      border: '1px solid #24ee89',
    },
    py: 0.85,
    px: '11px',
  },
  activeTabItem: {
    background: 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
    border: '1px solid #24ee89',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 0,
      height: 0,
      borderLeft: '10px solid transparent',
    },
  },
  contentArea: {
    flex: 1,
    bgcolor: '#232626',
    overflowY: 'auto',
    height: '100%',
    width: '100%',
    WebkitOverflowScrolling: 'touch',
    scrollBehavior: 'auto',
    position: 'relative',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#24ee89',
      borderRadius: '2px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#E6D017',
    },
  },
  statsHeader: {
    py: 1.4,
    px: { xs: 1, sm: 3 },
    height: { xs: 'auto', sm: 'auto' },
    borderBottom: '1px solid #2B2F3D',
    boxShadow: '0px 1px 0px 0px #2B2F3D',
    overflow: 'hidden',
  },
  progressText: {
    color: '#FFF',
    fontSize: { xs: 12, sm: 14 },
    fontFamily: 'Geogrotesque Cyr, sans-serif',
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  progressBar: {
    height: 12,
    width: { xs: '100%', sm: '150px', md: '200px' },
    maxWidth: '100%',
    borderRadius: 5,
    bgcolor: '#A0A3A7',
    '& .MuiLinearProgress-bar': {
      bgcolor: '#24ee89',
    },
  },
};

// Components
const UserAvatar = ({
  avatar,
  username,
  points,
  isHome = false,
  levelProgress,
}: {
  avatar?: string;
  username: string;
  points: number;
  isHome?: boolean;
  levelProgress?: number;
}) => {
  const smDown = useResponsive('down', 'sm');

  const preventDefaultInteractions = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
  }, []);

  return (
    <Stack
      direction="column"
      spacing={1}
      alignItems="center"
      sx={{
        mb: 1,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
      onDragStart={preventDefaultInteractions}
      onTouchStart={preventDefaultInteractions}
      onTouchMove={preventDefaultInteractions}
    >
      <Box sx={styles.avatarBlock}>
        <Box sx={styles.avatarOuter}>
          <Box sx={styles.avatarContainer}>
            <Avatar
              src={avatar}
              sx={{
                ...styles.avatar,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
              onDragStart={preventDefaultInteractions}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                pointerEvents: 'none',
              }}
            >
              <Box sx={styles.avatarGlare} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Stack alignItems="center" spacing={0.5}>
        {!isHome && (
          <Typography
            sx={{
              color: '#FFFFFF',
              fontFamily: 'Geogrotesque Cyr, sans-serif',
              fontWeight: 500,
              fontSize: '21px',
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
              textTransform: 'uppercase',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
            }}
          >
            {username}
          </Typography>
        )}
        <Button sx={styles.pointsButton}>{points} POINTS</Button>
        {smDown && levelProgress !== undefined && (
          <Box width="100%" mt={1}>
            <LinearProgress variant="determinate" value={levelProgress} sx={styles.progressBar} />
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

const StatsHeader = ({ stats }: { stats: UserStats }) => {
  const smDown = useResponsive('down', 'sm');
  const OPTIONS = [
    { icon: '/assets/icons/missions/h-points.png', value: stats.points, label: 'Points' },
    { icon: '/assets/icons/missions/h-badges.png', value: stats.badgesCount, label: 'Badges' },
    {
      icon: '/assets/icons/missions/h-missions.png',
      value: `${stats.missionsCompleted}/${stats.missionsTotal}`,
      label: 'Missions',
    },
    { icon: '/assets/icons/missions/h-level.png', value: stats.level, label: 'Level' },
  ];

  const preventDefaultInteractions = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
  }, []);

  return (
    <Box
      sx={{
        ...styles.statsHeader,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
      onDragStart={preventDefaultInteractions}
      onTouchStart={preventDefaultInteractions}
      onTouchMove={preventDefaultInteractions}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        flexWrap="wrap"
        width={1}
        gap={{ xs: 1, sm: 2 }}
      >
        <Stack
          direction="row"
          alignItems={{ xs: 'center', sm: 'center' }}
          spacing={{ xs: 1, sm: 2 }}
          flexWrap="wrap"
          justifyContent={{ xs: 'center', sm: 'flex-start' }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {OPTIONS.map((stat, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              spacing={{ xs: 0.5, sm: 1.2 }}
              sx={{
                position: 'relative',
                pr: !smDown && index !== OPTIONS.length - 1 ? 2 : 0,
                ...(!smDown &&
                  index !== OPTIONS.length - 1 && {
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      right: 0,
                      top: '10%',
                      height: '80%',
                      width: '2px',
                      background: '#24ee89',
                      transform: 'rotate(15deg)',
                    },
                  }),
              }}
            >
              <Box
                component="img"
                alt={stat.label}
                src={stat.icon}
                sx={{
                  height: { xs: 32, sm: 56 },
                  zIndex: 2,
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                  pointerEvents: 'none',
                }}
                draggable={false}
                onDragStart={preventDefaultInteractions}
              />
              <Stack>
                <Typography
                  sx={{
                    color: '#24ee89',
                    fontSize: { xs: 20, sm: 28 },
                    fontFamily: 'Impact, sans-serif',
                    fontWeight: 700,
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                    ...(smDown && {
                      bgcolor: '#FFF',
                      borderRadius: 1,
                      color: '#404040',
                      px: 1,
                      py: 0,
                      width: 'auto',
                      textAlign: 'center',
                    }),
                  }}
                >
                  {stat.value}
                </Typography>
                {!smDown && (
                  <Typography
                    sx={{
                      ...styles.progressText,
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTouchCallout: 'none',
                    }}
                  >
                    {stat.label}
                  </Typography>
                )}
              </Stack>
            </Stack>
          ))}
        </Stack>
        <Stack
          direction={{ xs: 'row', sm: 'row' }}
          alignItems="center"
          spacing={{ xs: 1.3, sm: 0.7 }}
          width={{ xs: 1, sm: 'auto' }}
          justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
          sx={{ minWidth: 0 }}
        >
          {smDown && (
            <UserAvatar
              avatar={stats.avatar}
              username={stats.username}
              points={stats.points}
              isHome
            />
          )}
          {!smDown && (
            <Stack position="relative" justifyContent="center" alignItems="center">
              <Box
                component="img"
                alt="flag"
                src="/assets/icons/missions/flag.png"
                sx={{
                  minWidth: 45,
                  height: { xs: 50, sm: 70 },
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                  pointerEvents: 'none',
                }}
                draggable={false}
                onDragStart={preventDefaultInteractions}
              />
              <Typography
                sx={{
                  position: 'relative',
                  color: 'transparent',
                  WebkitTextStrokeWidth: '1px',
                  WebkitTextStrokeColor: '#24ee89',
                  fontFamily: 'Impact, sans-serif',
                  fontSize: { xs: 16, sm: 22 },
                  fontWeight: 400,
                  lineHeight: { xs: '18px', sm: '22px' },
                  textTransform: 'uppercase',
                  mt: '-20px',
                  ml: 1,
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                }}
              >
                {stats.level}
              </Typography>
            </Stack>
          )}
          <Stack direction="column" spacing={0.5} width={{ xs: '100%', sm: 'auto' }} flexShrink={0}>
            <Typography
              sx={{
                ...styles.progressText,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
              }}
            >
              Next level -{' '}
              <Typography
                component="span"
                sx={{
                  ...styles.progressText,
                  color: '#24ee89',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                }}
              >
                Level {stats.level + 1}
              </Typography>
            </Typography>
            <LinearProgress
              variant="determinate"
              value={stats.levelProgress}
              sx={styles.progressBar}
            />
            <Typography
              sx={{
                ...styles.progressText,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
              }}
            >
              Points needed:{' '}
              <Typography
                component="span"
                sx={{
                  ...styles.progressText,
                  color: '#24ee89',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                }}
              >
                {stats.points_needed}
              </Typography>
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

// Main Component
export default function MissionsDialog({
  open,
  onClose,
  setActiveTab: setActiveTabProp,
  activeTab: activeTabProp,
  isLoading = false,
}: MissionModalProps) {
  const { t } = useLocales();
  const smDown = useResponsive('down', 'sm');

  const {
    get_user_missions_rank,
    get_user_missions,
    get_notification_mission,
    get_user_items,
    buy_item,
    get_levels,
  } = useApi();

  const [activeTabState, setActiveTabState] = useState('home');
  const [activeMiniGame, setActiveMiniGame] = useState<string | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [shopItems, setShopItems] = useState<any[]>([]);
  const [isDataFetched, setIsDataFetched] = useState(false); // Новый флаг для отслеживания загрузки данных

  const activeTab = activeTabProp || activeTabState;
  const setActiveTab = setActiveTabProp || setActiveTabState;
  const { user } = useSelector((state) => state.auth);

  const [openNav, setOpenNav] = useState(false);
  const [bottomInset, setBottomInset] = useState(0);
  const [safeAreaTop, setSafeAreaTop] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    points_needed: 0,
    level: 0,
    levelProgress: 0,
    missionsCompleted: 0,
    missionsTotal: 0,
    badgesCount: 0,
    username: user.username,
    avatar: user.avatar ? `${API_URL}/${user.avatar}` : undefined,
  });

  const fetchShopItems = useCallback(async () => {
    try {
      const res = await get_user_items();
      if (res?.data?.data) {
        setShopItems(res.data.data);
      } else {
        console.error('Failed to fetch shop items');
      }
    } catch (error) {
      console.error('Error fetching shop items:', error);
    }
  }, [get_user_items]);

  const getUserMissionsRank = useCallback(async () => {
    try {
      const res = await get_user_missions_rank();
      if (!res?.data?.data) {
        console.error('No user missions rank data received', res);
        return;
      }
      const { data } = res.data;
      console.log('User missions rank data:', data);

      // Форматируем уровни из data.levels
      const formattedLevels: Level[] = data.levels.map((level: any) => ({
        num: level.num,
        min_points: level.min_points,
        have: data.level >= level.num, // Сравниваем с текущим уровнем пользователя
        banner_path: level.banner_path ? `${API_URL}/${level.banner_path}` : undefined,
      }));

      setUserStats({
        ...userStats,
        points: data?.points || 0,
        points_needed: data?.points_needed || 0,
        level: data?.level || 0,
        levelProgress: data?.level_progress || 0,
        missionsCompleted: data?.missions_completed_count || 0,
        missionsTotal: data?.all_missions_count || 0,
        badgesCount: data?.badges_count || 0,
      });
      setBadges(data.badges || []);
      setLevels(formattedLevels); // Устанавливаем уровни
    } catch (error) {
      console.error('Error fetching user missions rank:', error);
    }
  }, [get_user_missions_rank, userStats]);

  const getUserMissions = useCallback(async () => {
    try {
      const res = await get_user_missions();
      if (!res?.data?.data) {
        console.error('No user missions data received');
        return;
      }
      setMissions(res.data.data);
    } catch (error) {
      console.error('Error fetching user missions:', error);
    }
  }, [get_user_missions]);

  const getMissionNotifications = useCallback(async () => {
    try {
      const res = await get_notification_mission();
      if (res?.data) {
        const sortedNotifications = res.data.sort(
          (a: INotificationMission, b: INotificationMission) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        dispatch(UpdateMissionNotification(sortedNotifications));
      }
    } catch (error) {
      console.error('Error fetching mission notifications:', error);
    }
  }, [get_notification_mission]);

  // Единый useEffect для загрузки данных только при открытии диалога
  useEffect(() => {
    if (!open || isDataFetched) return;

    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchShopItems(),
          getUserMissionsRank(),
          getUserMissions(),
          getMissionNotifications(),
        ]);
        setIsDataFetched(true); // Устанавливаем флаг после успешной загрузки
      } catch (error) {
        console.error('Error fetching all data:', error);
      }
    };

    fetchAllData();
  }, [
    open,
    isDataFetched,
    fetchShopItems,
    getUserMissionsRank,
    getUserMissions,
    getMissionNotifications,
  ]);

  // Сбрасываем isDataFetched при закрытии диалога
  useEffect(() => {
    if (!open) {
      setIsDataFetched(false); // Сбрасываем флаг, чтобы данные загружались при следующем открытии
    }
  }, [open]);

  // Сбрасываем скролл при смене активного таба или открытии модалки
  useEffect(() => {
    if (open && contentRef.current) {
      // Используем setTimeout чтобы дождаться рендера контента
      const timer = setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      }, 0);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open, activeTab]);

  // Обновление отступов для безопасных зон
  useEffect(() => {
    const updateInsets = () => {
      let safeTop = 0;
      let safeBottom = 0;

      const computedSafeAreaTop = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0',
        10
      );
      const computedSafeAreaBottom = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') ||
          '0',
        10
      );

      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isIOS) {
        safeTop = computedSafeAreaTop || 0;
        safeBottom = computedSafeAreaBottom || 0;
      } else if (isAndroid) {
        safeTop = computedSafeAreaTop || 0;
        safeBottom = computedSafeAreaBottom || 0;
      }
      setSafeAreaTop(safeTop);
      setBottomInset(safeBottom);
    };

    updateInsets();
    window.addEventListener('resize', updateInsets);
    window.visualViewport?.addEventListener('resize', updateInsets);
    window.visualViewport?.addEventListener('scroll', updateInsets);

    return () => {
      window.removeEventListener('resize', updateInsets);
      window.visualViewport?.removeEventListener('resize', updateInsets);
      window.visualViewport?.removeEventListener('scroll', updateInsets);
    };
  }, []);

  const handleTabClick = useCallback((tabName: string) => {
    setActiveTab(tabName);
    setActiveMiniGame(null);
    setOpenNav(false);
  }, []);

  const renderTabContent = () => {
    if (isLoading) {
      return <Skeleton variant="rectangular" height="100%" />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            missions={missions}
            setActiveTab={setActiveTab}
            setActiveMiniGame={setActiveMiniGame}
            shopItems={shopItems}
            buyItem={buy_item}
            refreshItems={fetchShopItems}
            userPoints={userStats.points}
            userStats={userStats}
            setUserStats={setUserStats}
            refreshUserStats={getUserMissionsRank}
            handleTabClick={handleTabClick}
          />
        );
      case 'missions':
        return (
          <MissionsTab
            missions={missions}
            userLevel={userStats.level}
            refreshUserStats={getUserMissionsRank}
          />
        );
      case 'level':
        return <LevelsTab levels={levels} userStats={userStats} />;
      case 'badges':
        return <BadgesTab badges={badges} />;
      case 'mini-games':
        if (activeMiniGame === 'scratch-game') {
          return (
            <ScratchGame
              setActiveTab={setActiveTab}
              setActiveMiniGame={setActiveMiniGame}
              userPoints={userStats.points}
              refreshUserStats={getUserMissionsRank}
              userStats={userStats}
              setUserStats={setUserStats}
            />
          );
        }
        if (activeMiniGame === 'wheel-game') {
          return (
            <WheelGamePage
              setActiveTab={setActiveTab}
              setActiveMiniGame={setActiveMiniGame}
              userStats={userStats}
              setUserStats={setUserStats}
              refreshUserStats={getUserMissionsRank}
            />
          );
        }
        if (activeMiniGame === 'wheel-x100-game') {
          return (
            <WheelX100Page
              setActiveTab={setActiveTab}
              setActiveMiniGame={setActiveMiniGame}
              userStats={userStats}
              setUserStats={setUserStats}
              refreshUserStats={getUserMissionsRank}
            />
          );
        }
        return <MiniGamesTab setActiveTab={setActiveTab} setActiveMiniGame={setActiveMiniGame} />;
      case 'shop':
        return (
          <ShopTab
            shopItems={shopItems}
            buyItem={buy_item}
            refreshItems={fetchShopItems}
            userPoints={userStats.points}
            refreshUserStats={getUserMissionsRank}
            userStats={userStats}
            setUserStats={setUserStats}
          />
        );
      case 'bonuses':
        return <BonusesTab />;
      case 'rules':
        return <RulesTab />;
      case 'mail':
        return <MailboxTab />;
      default:
        return null;
    }
  };

  const renderMobileHeader = () => {
    const currentTab = TABS.find((tab) => tab.name === activeTab);
    const tabLabel = currentTab ? t(currentTab.label.toLowerCase()) : '';

    return (
      <Box
        sx={{
          paddingTop: `calc(${safeAreaTop}px + 0.5rem)`,
          paddingBottom: '0.5rem',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
          bgcolor: '#131716',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1 }}>
          <Stack direction="row" alignItems="center">
            <IconButton onClick={() => setOpenNav(!openNav)}>
              <Iconify icon="mdi:menu" sx={{ width: 28, height: 28 }} />
            </IconButton>
            <Typography
              sx={{
                color: '#FFF',
                fontFamily: 'Cera Pro, sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'uppercase',
                ml: 1,
              }}
            >
              {tabLabel}
            </Typography>
          </Stack>
          <IconButton onClick={activeTab === 'home' ? onClose : () => setActiveTab('home')}>
            <Iconify
              icon={activeTab === 'home' ? 'mdi:close' : 'lets-icons:back'}
              sx={{ width: 28, height: 28 }}
            />
          </IconButton>
        </Stack>
      </Box>
    );
  };

  const renderSidebar = (
    <Box sx={{ position: 'relative', width: { xs: 1, sm: 240 }, height: 1 }}>
      {/* Задний контейнер для профиля */}
      <Box
        sx={{
          ...styles.profileBackContainer,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />

      <Box sx={styles.sidebar}>
        <UserAvatar
          avatar={userStats.avatar}
          username={userStats.username}
          points={userStats.points}
          levelProgress={userStats.levelProgress}
        />
        <List sx={{ flex: 1 }}>
          {TABS.map((tab) => (
            <ListItem
              key={tab.name}
              button
              onClick={() => handleTabClick(tab.name)}
              sx={{
                ...styles.tabItem,
                ...(activeTab === tab.name ? styles.activeTabItem : {}),
              }}
            >
              <ListItemIcon sx={{ mr: 0.85 }}>
                <Box
                  sx={{
                    width: 26,
                    height: 30,
                    backgroundImage: `url(${tab.icon})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    ...(activeTab === tab.name && {
                      backgroundColor: '#24ee89',
                      backgroundImage: 'none',
                      mask: `url(${tab.icon}) no-repeat center`,
                      maskSize: 'contain',
                      WebkitMask: `url(${tab.icon}) no-repeat center`,
                      WebkitMaskSize: 'contain',
                    }),
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={t(tab.label.toLowerCase())}
                primaryTypographyProps={{
                  color: activeTab === tab.name ? '#24ee89' : '#A0A3A7',
                  fontFamily: 'FONTSPRING DEMO - Blunt Con It, sans-serif',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '5%',
                  textTransform: 'uppercase',
                  sx: {
                    transform: 'skew(-5deg)',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  const renderMiddleMenu = () => {
    return (
      <Stack direction="row" gap={1.25} mt={1.5} px={2}>
        {['missions', 'mini-games', 'shop', 'bonuses'].map((name, index) => {
          const tab = TABS.find((e) => e.name === name);
          if (!tab) return <Box key={index} />;
          return (
            <Stack
              key={index}
              bgcolor="#2B2F3D"
              borderRadius={0.6}
              width="21.5vw"
              height="21.5vw"
              justifyContent="center"
              alignItems="center"
              gap={0.5}
              onClick={() => handleTabClick(tab.name)}
            >
              <Box
                component="img"
                src={tab.icon}
                alt={tab.label}
                sx={{ width: 40, aspectRatio: '1/1' }}
              />
              <Typography
                fontSize={12}
                fontWeight={700}
                fontFamily="Cera Pro, sans-serif"
                textTransform="uppercase"
              >
                {tab.name}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={styles.dialog}>
      <DialogContent sx={styles.dialogContent}>
        {!smDown ? (
          <Stack>
            <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
              <IconButton onClick={onClose} sx={styles.closeButton}>
                <Iconify icon="mdi:close" sx={styles.closeIcon} />
              </IconButton>
            </Box>
            {renderSidebar}
          </Stack>
        ) : (
          <Drawer
            open={openNav}
            onClose={() => setOpenNav(false)}
            PaperProps={{
              sx: {
                width: 'auto',
                zIndex: 99999,
                bgcolor: '#232626 !important',
              },
            }}
            ModalProps={{
              sx: {
                zIndex: 99999,
              },
            }}
          >
            {renderSidebar}
          </Drawer>
        )}

        <Box ref={contentRef} sx={styles.contentArea}>
          {smDown && renderMobileHeader()}
          {(!smDown || activeTab === 'home') && <StatsHeader stats={userStats} />}
          {smDown && activeTab === 'home' && renderMiddleMenu()}
          {renderTabContent()}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
