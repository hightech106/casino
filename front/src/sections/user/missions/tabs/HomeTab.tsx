/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import {
  Typography,
  Box,
  Stack,
  Grid,
  CardMedia,
  Button,
  LinearProgress,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useLocales } from 'src/locales';
import { useResponsive } from 'src/hooks/use-responsive';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Iconify from 'src/components/iconify';
import { useSelector } from 'src/store';
import useApi from 'src/hooks/use-api';
import { API_URL } from 'src/config-global';

import type { Mission, HomeTabProps, ShopItem, UserStats } from 'src/types/mission';
import { cardStyles } from 'src/styles/cardStyles';
import BackendMissionDetails from './MissionDetails';
import ShopItemPopup from './ShopItemPopup';

const styles = {
  root: {
    px: 3,
    py: 3.5,
    width: 1,
    height: 1,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  sectionTitle: {
    fontFamily: 'Geogrotesque Cyr, sans-serif',
    fontWeight: 700,
    fontStyle: 'italic',
    fontSize: { xs: 20, sm: 18, md: 18 },
    lineHeight: '100%',
    letterSpacing: '0%',
    verticalAlign: 'middle',
    textTransform: 'uppercase',
    transform: 'skew(-5deg)',
    color: '#A0A3A7',
    mb: 1,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  featuredShop: {
    p: { xs: 1, sm: 1.5 },
    ...cardStyles.featuredCard,
    alignItems: 'center',
    position: 'relative',
    minHeight: { sm: 185 },
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `linear-gradient(135deg, #232626 0%, #232626 50%, transparent 50%)`,
      pointerEvents: 'none',
      zIndex: 0,
    },
    '& > *': {
      position: 'relative',
      zIndex: 1,
    },
  },
  featuredImage: {
    width: { xs: 100, sm: 110 },
    objectFit: 'contain',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    pointerEvents: 'none',
  },
  featuredCircle: {
    width: 140,
  },
  featuredText: {
    textAlign: 'center',
    position: 'absolute',
    textShadow: '0px 4.667px 4.667px rgba(0, 0, 0, 0.25)',
    WebkitTextStrokeWidth: '1px',
    WebkitTextStrokeColor: '#F93731',
    fontFamily: 'Impact, sans-serif',
    fontSize: { xs: 28, sm: 32.667 },
    fontWeight: 400,
    lineHeight: 'normal',
    textTransform: 'uppercase',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  buyButton: {
    bgcolor: '#24ee89',
    color: '#111',
    borderRadius: 50,
    fontSize: { xs: 10, sm: 14 },
    fontWeight: 800,
    fontFamily: 'Cera Pro, sans-serif',
    textTransform: 'uppercase',
    py: { xs: 0.7, sm: 1.1 },
    px: { xs: 1.2, sm: 2.2 },
    gap: 1,
    whiteSpace: 'nowrap',
    position: 'absolute',
    right: { xs: 12, sm: 18 },
    bottom: { xs: 6, sm: 6 },
    '&:disabled': {
      bgcolor: 'transparent',
      color: '#A0A0A0',
      border: '1px solid rgba(255, 255, 255, 0.12)',
    },
  },
  miniGameCard: {
    width: 1,
    height: { xs: 'auto', sm: 0.9 },
    ...cardStyles.miniGameCard,
    justifyContent: 'space-between',
    position: 'relative',
  },
  miniGameImage: {
    height: { xs: 80, sm: 107 },
    borderRadius: '4px 4px 0px 0px',
  },
  miniGameWheel: {
    bgcolor: '#2B2F3D',
    borderRadius: 50,
    p: 0.65,
    mt: { xs: -6, sm: -8 },
  },
  miniGameWheelImage: {
    height: { xs: 98, sm: 135 },
    borderRadius: 2,
    objectFit: 'contain',
  },
  shopItem: {
    px: { xs: 1, sm: 1.5 },
    pb: { xs: 2, sm: 1.5 },
    ...cardStyles.shopCard,
    alignItems: 'center',
    position: 'relative',
    mb: { xs: 1, sm: 0 },
    cursor: 'pointer',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `linear-gradient(135deg, #232626 0%, #232626 50%, transparent 50%)`,
      pointerEvents: 'none',
      zIndex: 0,
    },
    '& > *': {
      position: 'relative',
      zIndex: 1,
    },
  },
  shopItemImage: {
    width: { xs: 80, sm: 100 },
    objectFit: 'contain',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    pointerEvents: 'none',
  },
  payoutText: {
    textAlign: 'center',
    background: 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
    border: '1px solid #24ee89',
    textShadow: '0px 2.82px 2.82px rgba(0, 0, 0, 0.25)',
    WebkitTextStrokeWidth: '0.6px',
    WebkitTextStrokeColor: '#24ee89',
    fontFamily: 'Impact',
    fontSize: { xs: 14, sm: 18 },
    fontWeight: 400,
    lineHeight: '1.2',
    textTransform: 'uppercase',
    color: '#24ee89',
    px: { xs: 0.5, sm: 0.8 },
    py: { xs: 0.4, sm: 0.5 },
    borderRadius: 2.56,
    minWidth: { xs: 70, sm: 82 },
    minHeight: { xs: 26, sm: 30 },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutTextFreeSpins: {
    textAlign: 'center',
    background: 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
    border: '1px solid #24ee89',
    textShadow: '0px 2.82px 2.82px rgba(0, 0, 0, 0.25)',
    WebkitTextStrokeWidth: '0.6px',
    WebkitTextStrokeColor: '#24ee89',
    fontFamily: 'Impact',
    fontSize: { xs: 14, sm: 18 },
    fontWeight: 400,
    lineHeight: '1.2',
    textTransform: 'uppercase',
    color: '#24ee89',
    px: { xs: 0.5, sm: 0.8 },
    py: { xs: 0.4, sm: 0.5 },
    borderRadius: 2.56,
    minWidth: { xs: 70, sm: 82 },
    minHeight: { xs: 26, sm: 30 },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionCard: {
    p: { xs: 1.5, sm: 1, md: 1.5, lg: 2 },
    ...cardStyles.missionCard,
    position: 'relative',
    gap: 0.8,
    width: { xs: '85%', sm: '100%' },
    minWidth: { xs: 210, sm: 'auto' },
    minHeight: { xs: 220, sm: 185, md: 185, lg: 185, xl: 185 },
    maxHeight: { xs: 230, sm: 195, md: 195, lg: 195, xl: 195 },
    height: { xs: 'auto', sm: '100%' },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: { xs: '0px 4px 8px rgba(0, 0, 0, 0.3)', sm: 'none' },
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: { xs: 'scale(1.02)', sm: 'none' },
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `linear-gradient(135deg, #232626 0%, #232626 50%, transparent 50%)`,
      pointerEvents: 'none',
      zIndex: 0,
    },
    '& > *': {
      position: 'relative',
      zIndex: 1,
    },
  },
  missionTitle: {
    color: '#FFF',
    fontWeight: '600 !important',
    fontSize: { xs: 18, sm: 16, md: 16 },
    fontFamily: 'Geogrotesque Cyr, sans-serif !important',
    lineHeight: 1.3,
    textTransform: 'uppercase',
    transform: 'skewX(-5deg)',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    textAlign: 'center',
    maxWidth: '100%',
    minHeight: { xs: 'auto', sm: 40 },
  },
  missionDescription: {
    fontSize: { xs: 18, sm: 16, md: 16 },
    fontWeight: 700,
    fontFamily: 'Cera Pro, sans-serif',
    textTransform: 'uppercase',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  progressBar: {
    height: 8,
    width: {
      xs: '100%',
      sm: '70%',
      md: '60%',
      lg: '50%',
      xl: '40%',
    },
    borderRadius: 5,
    bgcolor: '#A0A3A7',
    '& .MuiLinearProgress-bar': {
      bgcolor: '#24ee89',
    },
  },
  pointsButton: {
    background: 'linear-gradient(90deg, rgba(138, 43, 226, 0.35) 0%, #24ee89 100%)',
    borderRadius: 0.5,
    border: '1px solid #24ee89',
    px: 0.7,
    py: 0.3,
    fontSize: { xs: 12, sm: 12, md: 14 },
    fontWeight: 400,
    fontFamily: 'Impact, sans-serif',
    textTransform: 'uppercase',
    color: '#24ee89',
    transform: 'skew(-5deg)',
  },
} as const;

interface ExtendedMission extends Mission {
  isLocked?: boolean;
  condition?: string;
  points?: number;
}

interface ExtendedHomeTabProps extends HomeTabProps {
  setActiveTab: (tab: string) => void;
  setActiveMiniGame: (game: string | null) => void;
  shopItems: ShopItem[];
  buyItem: (id: string) => Promise<any>;
  refreshItems: () => Promise<void>;
  userPoints: number;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  refreshUserStats?: () => Promise<void>;
  handleTabClick?: (tabName: string) => void;
}

interface MissionDetailsProps {
  image: string;
  title: string;
  description: string | string[];
  progress: number;
  reward: number;
  onViewDetails: () => void;
  isLocked?: boolean;
  status: string;
  sx?: SxProps<Theme>;
}

interface MiniGameProps {
  title: string;
  description: string;
  image: string;
  points: number;
  onClick: () => void;
  sx?: SxProps<Theme>;
}

const MissionDetails: React.FC<MissionDetailsProps> = ({
  image,
  title,
  progress,
  reward,
  onViewDetails,
  isLocked = false,
  status,
  sx,
}) => {
  const { t } = useLocales();
  const smUp = useResponsive('up', 'sm');

  const getStatusText = () => {
    if (status === 'completed') return t('completed');
    if (status === 'claimable') return t('claim_your_reward');
    if (status === 'notcompleted') return progress > 0 ? t('you_have_joined') : t('not_started');
    return t('unknown');
  };

  return (
    <Stack
      sx={{ ...styles.missionCard, ...sx }}
      alignItems="center"
      gap={0.5}
      onClick={onViewDetails}
    >
      {!smUp && (
        <Typography
          sx={{
            fontSize: { xs: 12, sm: 10, md: 12 },
            fontWeight: 400,
            fontFamily: 'Cera Pro, sans-serif',
            textTransform: 'uppercase',
            color: status === 'completed' ? '#67F962' : '#FFF',
            bgcolor: status === 'completed' ? '#142214' : '#731A1E',
            border: status === 'completed' ? '1px solid #67F962' : '1px solid #DF353D',
            px: 1,
            py: 0.3,
            borderRadius: 0.5,
          }}
        >
          {getStatusText()}
        </Typography>
      )}
      <Typography sx={styles.missionTitle}>{title}</Typography>
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: { xs: 100, sm: 80, md: 90, lg: 100 },
          objectFit: 'contain',
          borderRadius: image.includes('wheel') ? 50 : 0,
        }}
      />
      {!isLocked && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            ...styles.progressBar,
            width: '100%',
          }}
        />
      )}
      <Stack direction="row" alignItems="center" justifyContent="center" gap={0.5}>
        <Typography
          sx={{
            fontSize: { xs: 14, sm: 12, md: 14 },
            fontWeight: '500 !important',
            fontFamily: 'Geogrotesque Cyr, sans-serif !important',
            textTransform: 'uppercase',
          }}
        >
          {t('reward')}:
        </Typography>
        <Typography sx={styles.pointsButton}>
          {reward} {t('points')}
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontSize: { xs: 12, sm: 10, md: 12 },
          fontWeight: 700,
          fontFamily: 'Geogrotesque Cyr, sans-serif',
          textTransform: 'uppercase',
          color: '#FFF',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails();
        }}
      >
        {t('view_details')} →
      </Typography>
    </Stack>
  );
};

const MiniGame: React.FC<MiniGameProps> = ({ title, description, image, points, onClick, sx }) => {
  const { t } = useLocales();
  const smUp = useResponsive('up', 'sm');

  return (
    <Stack
      sx={{
        ...styles.miniGameCard,
        ...sx,
        minHeight: smUp ? '240px' : 'auto',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: { xs: '0px 4px 8px rgba(0, 0, 0, 0.3)', sm: 'none' },
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: { xs: 'scale(1.02)', sm: 'none' },
        },
        padding: 0.5,
        paddingTop: 0,
        position: 'relative',
      }}
      alignItems="center"
      onClick={onClick}
    >
      <Stack
        sx={{
          alignItems: 'center',
          textAlign: 'center',
          padding: 0,
          gap: 0,
          paddingTop: { xs: '80px', sm: '107px' },
        }}
      >
        <CardMedia
          component="img"
          image="/assets/images/missions/wheel_bg.png"
          alt={title}
          sx={{
            ...styles.miniGameImage,
            width: '100%',
            display: 'block',
            margin: 0,
            padding: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '4px 4px 0px 0px',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            ...styles.miniGameWheel,
            mt: { xs: '-70px', sm: '-90px' },
            position: 'relative',
            zIndex: 2,
          }}
        >
          <CardMedia component="img" image={image} alt={title} sx={styles.miniGameWheelImage} />
        </Box>
        <Typography
          sx={{
            color: '#FFF',
            fontWeight: 600,
            fontSize: { xs: 20, sm: 16, md: 16 },
            fontFamily: 'Geogrotesque Cyr, sans-serif',
            lineHeight: 1.1,
            textTransform: 'uppercase',
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 12, sm: 13, md: 14 },
            fontWeight: 7,
            fontFamily: 'Cera Pro, sans-serif',
            textTransform: 'uppercase',
            mt: 0.5,
          }}
        >
          {description}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" gap={0.5} sx={{ mt: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 12, md: 14 },
              fontWeight: 400,
              fontFamily: 'Impact, sans-serif',
              textTransform: 'uppercase',
            }}
          >
            {t('price')}:
          </Typography>
          <Button
            sx={{
              background:
                'linear-gradient(90deg, rgba(138, 43, 226, 0.35) 0%, #24ee89 100%)',
              borderRadius: 0.5,
              border: '1px solid #24ee89',
              px: 0.7,
              py: 0.3,
              fontSize: { xs: 14, sm: 12, md: 14 },
              fontWeight: 400,
              fontFamily: 'Impact, sans-serif',
              textTransform: 'uppercase',
              color: '#24ee89',
              transform: 'skew(-5deg)',
            }}
          >
            {points} {t('points')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default function HomeTab({
  missions,
  setActiveTab,
  setActiveMiniGame,
  shopItems,
  buyItem,
  refreshItems,
  userPoints,
  userStats,
  setUserStats,
  refreshUserStats,
  handleTabClick,
}: ExtendedHomeTabProps) {
  const { t } = useLocales();
  const smDown = useResponsive('down', 'sm');
  const { user } = useSelector((state) => state.auth);
  const latestMissions = missions.slice(0, 3);

  const getMiniGameId = (title: string) => {
    switch (title) {
      case 'WHEEL X 50':
        return 'wheel-game';
      case 'Scratch':
        return 'scratch-game';
      case 'WHEEL X 100':
        return 'wheel-x100-game';
      default:
        return null;
    }
  };

  const [selectedShopItem, setSelectedShopItem] = useState<ShopItem | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [isBuying, setIsBuying] = useState<string | null>(null);
  const { get_scratch_game, get_wheel_50_prizes, get_wheel_100_prizes } = useApi();

  const [miniGames, setMiniGames] = useState([
    {
      title: 'WHEEL X 50',
      description: 'Spin and win incredible prizes!',
      image: '/assets/images/missions/wheel.png',
      points: 50,
    },
    {
      title: 'Scratch',
      description: 'Scratch and win no deposit bonuses and bonus points',
      image: '/assets/images/missions/scrath_logo.png',
      points: 5,
    },
    {
      title: 'WHEEL X 100',
      description: 'Spin and win incredible prizes!',
      image: '/assets/images/missions/wheel.png',
      points: 100,
    },
  ]);

  const fetchMiniGamePrices = useCallback(async () => {
    try {
      const wheel50Response = await get_wheel_50_prizes();
      const wheel50Cost = wheel50Response?.data?.cost || 50;
      const Scratchresponse = await get_scratch_game();
      const scratchCost = Scratchresponse?.data?.cost || 2;
      const wheel100Response = await get_wheel_100_prizes();
      const wheel100Cost = wheel100Response?.data?.cost || 100;

      setMiniGames([
        {
          title: 'WHEEL X 50',
          description: 'Spin and win incredible prizes!',
          image: '/assets/images/missions/wheel.png',
          points: wheel50Cost,
        },
        {
          title: 'Scratch',
          description: 'Scratch and win no deposit bonuses and bonus points',
          image: '/assets/images/missions/scrath_logo.png',
          points: scratchCost,
        },
        {
          title: 'WHEEL X 100',
          description: 'Spin and win incredible prizes!',
          image: '/assets/images/missions/wheel.png',
          points: wheel100Cost,
        },
      ]);
    } catch (error) {
      console.error('Error fetching mini-game prices:', error);
      toast.error(t('failed_to_load_mini_game_prices'));
    }
  }, [get_wheel_50_prizes, get_scratch_game, get_wheel_100_prizes, t]);

  useEffect(() => {
    fetchMiniGamePrices();
  }, [fetchMiniGamePrices]);

  const renderViewAll = (tab: string) => (
    <Button
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        handleTabClick ? handleTabClick(tab) : setActiveTab(tab);
        setActiveMiniGame(null);
      }}
      sx={{
        p: 0,
        minWidth: 'auto',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '&:hover .MuiTypography-root': {
          color: '#A0A3A7',
        },
      }}
    >
      <Typography sx={{ ...styles.sectionTitle, fontSize: { xs: 16, sm: 18 } }}>
        VIEW ALL
      </Typography>
    </Button>
  );

  const handleMissionClick = () => setActiveTab('missions');
  const handleCardClick = (item: ShopItem) => {
    setSelectedShopItem(item);
    setPopupOpen(true);
  };
  const handleCloseShopPopup = () => {
    setPopupOpen(false);
    setSelectedShopItem(null);
  };

  const handleBuyItem = async (id: string) => {
    if (!id || id.length !== 24) {
      toast.error(t('invalid_item_id'));
      return;
    }
    const item = shopItems.find((i) => i._id === id);
    if (!item) {
      toast.error(t('item_not_found'));
      return;
    }
    const itemCost = Number(item.cost) || 0;
    if (userPoints < itemCost) {
      toast.error(t('insufficient_points'));
      return;
    }
    setIsBuying(id);
    try {
      const response = await buyItem(id);
      if (response?.status === 200 && response?.data?.message === 'Purchase successful') {
        toast.success(t('item_purchased_successfully'));
        await refreshItems();
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (refreshUserStats) {
          try {
            await refreshUserStats();
          } catch (error) {
            console.error('Failed to refresh user stats:', error);
            setUserStats((prev) => ({ ...prev, points: prev.points - itemCost }));
            toast(t('stats_update_failed_locally_updated'), { icon: '⚠️' });
          }
        } else {
          setUserStats((prev) => ({ ...prev, points: prev.points - itemCost }));
        }
        await refreshItems();
        handleCloseShopPopup();
      } else {
        toast.error(response?.data?.message || t('failed_to_purchase_item'));
      }
    } catch (error: any) {
      let errorMessage = t('failed_to_purchase_item');
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data?.message?.includes('id')) errorMessage = t('invalid_item_id');
        else if (status === 401) errorMessage = t('unauthorized_purchase');
        else if (status === 403) errorMessage = t('forbidden_purchase');
        else if (status === 404) errorMessage = t('item_not_found');
        else if (data?.message) errorMessage = data.message;
      } else if (error.message?.includes('Network Error')) errorMessage = t('network_error');
      toast.error(errorMessage);
    } finally {
      setIsBuying(null);
    }
  };

  const newestShopItem = shopItems
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
  const featuredShopItem = newestShopItem
    ? {
        image: newestShopItem.banner_path
          ? `${API_URL}/${newestShopItem.banner_path}`
          : newestShopItem.type_gift === 'free_spins'
          ? '/assets/images/missions/wheel.png'
          : '/assets/images/missions/coin_by.png',
        title: t(newestShopItem.type_gift.replace('_', '-')),
        price:
          newestShopItem.type_gift === 'free_spins'
            ? `${Math.floor(Number(newestShopItem.payout))} FS`
            : `${Number(newestShopItem.payout).toFixed(2)} ${newestShopItem.currencySymbol || ''}`,
        gradient:
          newestShopItem.type_gift === 'free_spins'
            ? 'linear-gradient(90deg, #142214 0%, #13ACBA 100%)'
            : 'linear-gradient(90deg, #142214 0%, #357035 100%)',
        borderColor: newestShopItem.type_gift === 'free_spins' ? '#00E9FF' : '#67F962',
        buyPoints: Number(newestShopItem.cost) || 0,
        hasEnoughPoints: userPoints >= (Number(newestShopItem.cost) || 0),
        item: newestShopItem,
      }
    : null;

  const displayedShopItems = shopItems.slice(0, 2).map((item) => {
    const isFreeSpins = item.type_gift === 'free_spins';
    let image = '/assets/images/missions/coin_by.png';
    if (item.banner_path) image = `${API_URL}/${item.banner_path}`;
    else if (isFreeSpins) image = '/assets/images/missions/wheel.png';
    const itemCost = Number(item.cost) || 0;
    const hasEnoughPoints = userPoints >= itemCost;
    return {
      image,
      title: t(item.type_gift.replace('_', '-')),
      price: isFreeSpins
        ? `${Math.floor(Number(item.payout))} FS`
        : `${Number(item.payout).toFixed(2)} ${item.currencySymbol || ''}`,
      gradient: isFreeSpins
        ? 'linear-gradient(90deg, #142214 0%, #13ACBA 100%)'
        : 'linear-gradient(90deg, #142214 0%, #357035 100%)',
      borderColor: isFreeSpins ? '#00E9FF' : '#67F962',
      buyPoints: itemCost,
      hasEnoughPoints,
      item,
    };
  });

  return (
    <Stack sx={{ ...styles.root, pt: smDown ? 1 : 3.5 }}>
      {/* Mobile Layout (xs) */}
      {smDown && (
        <Stack spacing={2}>
          <Stack>
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={0.5}>
              <Typography sx={styles.sectionTitle}>{t('recent_missions')}</Typography>
              {smDown && renderViewAll('missions')}
            </Stack>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: { xs: 1, sm: 2 },
                overflow: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {latestMissions.length > 0 ? (
                latestMissions.map((mission) => (
                  <MissionDetails
                    key={mission._id}
                    image={
                      mission.banner_path
                        ? `${API_URL}/${mission.banner_path}`
                        : '/assets/images/missions/default.png'
                    }
                    title={mission.title}
                    description={mission.description}
                    progress={mission.progress}
                    reward={mission.reward}
                    onViewDetails={handleMissionClick}
                    isLocked={mission.min_level > 0 && mission.progress === 0}
                    status={mission.status}
                  />
                ))
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    color: '#E0E0E0',
                    textAlign: 'center',
                    width: '100%',
                    fontSize: { xs: 14, sm: 16 },
                  }}
                >
                  {t('no_missions_available')}
                </Typography>
              )}
            </Box>
          </Stack>

          <Stack>
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={0.5}>
              <Typography sx={styles.sectionTitle}>{t('mini_games')}</Typography>
              {smDown && renderViewAll('mini-games')}
            </Stack>
            <Box
              sx={{
                overflow: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, pb: 1 }}>
                {miniGames.map((game, index) => (
                  <MiniGame
                    key={index}
                    title={game.title}
                    description={game.description}
                    image={game.image}
                    points={game.points}
                    onClick={() => {
                      const gameId = getMiniGameId(game.title);
                      if (gameId) {
                        setActiveMiniGame(gameId);
                        setActiveTab('mini-games');
                      } else {
                        toast.error(t('invalid_mini_game'));
                      }
                    }}
                    sx={{ minWidth: { xs: '65%' } }}
                  />
                ))}
              </Box>
            </Box>
          </Stack>

          <Stack>
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={0.5}>
              <Typography sx={styles.sectionTitle}>{t('more_in_the_shop')}</Typography>
              {smDown && renderViewAll('shop')}
            </Stack>
            <Box sx={{ minHeight: { xs: '340px' } }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  pb: 1,
                  overflow: 'auto',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                {displayedShopItems.map((item, index) => (
                  <Stack
                    key={index}
                    sx={{
                      ...styles.shopItem,
                      minWidth: { xs: '70%', sm: '80%' },
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                    }}
                    onClick={() => handleCardClick(item.item)}
                  >
                    <Typography
                      sx={
                        item.item.type_gift === 'free_spins'
                          ? styles.payoutTextFreeSpins
                          : styles.payoutText
                      }
                    >
                      {item.price}
                    </Typography>
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt="shop item"
                      sx={{
                        ...styles.shopItemImage,
                        width: item.image.includes('wheel') ? 80 : 100,
                        mt: 1,
                      }}
                    />
                    <Button
                      sx={{
                        ...styles.buyButton,
                        position: 'relative',
                        mt: 1,
                        right: 'auto',
                        bottom: 'auto',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyItem(item.item._id);
                      }}
                      disabled={isBuying === item.item._id || !item.hasEnoughPoints}
                    >
                      by {item.buyPoints}
                      {isBuying === item.item._id && (
                        <Iconify
                          icon="mdi:loading"
                          sx={{
                            width: { xxs: 10, xs: 12, sm: 16 },
                            height: { xxs: 10, xs: 12, sm: 16 },
                            ml: 1,
                          }}
                        />
                      )}
                    </Button>
                  </Stack>
                ))}
              </Box>
            </Box>
          </Stack>
        </Stack>
      )}

      {/* Desktop Layout (sm and up) */}
      {!smDown && (
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ alignItems: 'stretch' }}>
          {/* First Row */}
          <Grid item xs={12} sm={8} md={8} lg={8}>
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between">
              <Typography sx={styles.sectionTitle}>{t('recent_missions')}</Typography>
              {!smDown && renderViewAll('missions')}
            </Stack>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2,
                mb: 3,
                minHeight: { sm: '195px' }, // Consistent height for desktop
              }}
            >
              {latestMissions.length > 0 ? (
                latestMissions.map((mission) => (
                  <MissionDetails
                    key={mission._id}
                    image={
                      mission.banner_path
                        ? `${API_URL}/${mission.banner_path}`
                        : '/assets/images/missions/default.png'
                    }
                    title={mission.title}
                    description={mission.description}
                    progress={mission.progress}
                    reward={mission.reward}
                    onViewDetails={handleMissionClick}
                    isLocked={mission.min_level > 0 && mission.progress === 0}
                    status={mission.status}
                  />
                ))
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    color: '#E0E0E0',
                    textAlign: 'center',
                    width: '100%',
                    fontSize: { xs: 14, sm: 14 },
                  }}
                >
                  {t('no_missions_available')}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between">
              <Typography sx={styles.sectionTitle}>{t('featured_in_the_shop')}</Typography>
              {!smDown && renderViewAll('shop')}
            </Stack>
            <Stack sx={{ height: { sm: '185px' } }}>
              {featuredShopItem ? (
                <Stack
                  direction="row"
                  sx={{
                    ...styles.featuredShop,
                    p: featuredShopItem.image.includes('wheel') ? 1.5 : 1,
                  }}
                  onClick={() => handleCardClick(featuredShopItem.item)}
                >
                  <CardMedia
                    component="img"
                    image={featuredShopItem.image}
                    alt="shop item"
                    sx={{
                      ...styles.featuredImage,
                      width: featuredShopItem.image.includes('wheel') ? 80 : { sm: 110 },
                    }}
                  />
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={{ xxs: 0.8, xs: 1, sm: 2 }}
                    sx={{ flexGrow: 0.1 }}
                  >
                    <Typography
                      sx={{
                        ...(featuredShopItem.item.type_gift === 'free_spins'
                          ? styles.payoutTextFreeSpins
                          : styles.payoutText),
                        mb: 0.5,
                      }}
                    >
                      {featuredShopItem.price}
                    </Typography>
                  </Stack>
                  <Button
                    sx={styles.buyButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyItem(featuredShopItem.item._id);
                    }}
                    disabled={
                      isBuying === featuredShopItem.item._id || !featuredShopItem.hasEnoughPoints
                    }
                  >
                    by {featuredShopItem.buyPoints}
                    {isBuying === featuredShopItem.item._id && (
                      <Iconify
                        icon="mdi:loading"
                        sx={{
                          width: { xxs: 10, xs: 12, sm: 16 },
                          height: { xxs: 10, xs: 12, sm: 16 },
                          ml: 1,
                        }}
                      />
                    )}
                  </Button>
                </Stack>
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    color: '#E0E0E0',
                    textAlign: 'center',
                    width: '100%',
                    fontSize: { xs: 14, sm: 14 },
                  }}
                >
                  {t('no_items_available')}
                </Typography>
              )}
            </Stack>
          </Grid>

          {/* Second Row */}
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between">
              <Typography sx={styles.sectionTitle}>{t('more_in_missions')}</Typography>
              {!smDown && renderViewAll('missions')}
            </Stack>
            <Box sx={{ minHeight: { sm: '340px' } }}>
              {missions[0] ? (
                <MissionDetails
                  image={
                    missions[0].banner_path
                      ? `${API_URL}/${missions[0].banner_path}`
                      : '/assets/images/missions/default.png'
                  }
                  title={missions[0].title}
                  description={t('place_bets_on_sports', { label: 3 })}
                  progress={missions[0].progress}
                  reward={missions[0].reward}
                  onViewDetails={handleMissionClick}
                  isLocked={missions[0].min_level > 0 && missions[0].progress === 0}
                  status={missions[0].status}
                  sx={{
                    justifyContent: 'space-around',
                    px: 0,
                    minHeight: { sm: '280px' },
                    width: '100%',
                    height: { sm: '280px' },
                  }}
                />
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    color: '#E0E0E0',
                    textAlign: 'center',
                    width: '100%',
                    fontSize: { xs: 14, sm: 14 },
                  }}
                >
                  {t('no_missions_available')}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between">
              <Typography sx={styles.sectionTitle}>{t('mini_games')}</Typography>
              {!smDown && renderViewAll('mini-games')}
            </Stack>
            <Box sx={{ minHeight: { sm: '340px' } }}>
              {miniGames[0] ? (
                <MiniGame
                  title={miniGames[0].title}
                  description={miniGames[0].description}
                  image={miniGames[0].image}
                  points={miniGames[0].points}
                  onClick={() =>
                    handleTabClick ? handleTabClick('mini-games') : setActiveTab('mini-games')
                  }
                  sx={{
                    justifyContent: 'space-around',
                    px: 0,
                    minHeight: { sm: '280px' },
                    height: { sm: '280px' },
                  }}
                />
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    color: '#E0E0E0',
                    textAlign: 'center',
                    width: '100%',
                    fontSize: { xs: 14, sm: 14 },
                  }}
                >
                  {t('no_mini_games_available')}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between">
              <Typography sx={styles.sectionTitle}>{t('more_in_the_shop')}</Typography>
              {!smDown && renderViewAll('shop')}
            </Stack>
            <Box sx={{ minHeight: { sm: '340px' } }}>
              <Stack gap={1} sx={{ minHeight: { sm: '280px' } }}>
                {displayedShopItems.map((item, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    sx={{
                      ...styles.shopItem,
                      p: item.image.includes('wheel') ? 2 : undefined,
                      height: { sm: '135px' },
                    }}
                    onClick={() => handleCardClick(item.item)}
                  >
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt="shop item"
                      sx={{
                        ...styles.shopItemImage,
                        width: item.image.includes('wheel') ? 80 : 100,
                      }}
                    />
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="center"
                      spacing={{ xxs: 0.8, xs: 1, sm: 2 }}
                      sx={{ flexGrow: 0.1, pt: 1.5 }}
                    >
                      <Typography
                        sx={{
                          ...(item.item.type_gift === 'free_spins'
                            ? styles.payoutTextFreeSpins
                            : styles.payoutText),
                          mb: 0.5,
                        }}
                      >
                        {item.price}
                      </Typography>
                    </Stack>
                    <Button
                      sx={{
                        ...styles.buyButton,
                        py: { xs: 0.5, sm: 0.7 },
                        px: { xs: 1, sm: 1.5 },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyItem(item.item._id);
                      }}
                      disabled={isBuying === item.item._id || !item.hasEnoughPoints}
                    >
                      by {item.buyPoints}
                      {isBuying === item.item._id && (
                        <Iconify
                          icon="mdi:loading"
                          sx={{
                            width: { xxs: 10, xs: 12, sm: 16 },
                            height: { xxs: 10, xs: 12, sm: 16 },
                            ml: 1,
                          }}
                        />
                      )}
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      )}

      <ShopItemPopup
        open={popupOpen}
        onClose={handleCloseShopPopup}
        item={selectedShopItem}
        onBuy={handleBuyItem}
        isBuying={isBuying === selectedShopItem?._id}
        userPoints={userPoints}
        userStats={userStats}
        setUserStats={setUserStats}
      />
    </Stack>
  );
}
