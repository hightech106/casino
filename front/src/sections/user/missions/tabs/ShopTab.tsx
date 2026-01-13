import { useState, useEffect } from 'react';
import type { SyntheticEvent } from 'react';
import {
  Typography,
  Box,
  Stack,
  Tabs,
  Tab,
  Button,
  Skeleton,
  IconButton,
  CardMedia,
} from '@mui/material';
import { useLocales } from 'src/locales';
import type { ShopTabValue, ShopItem, UserStats } from 'src/types/mission';
import toast from 'react-hot-toast';
import Iconify from 'src/components/iconify';
import { API_URL } from 'src/config-global';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSelector } from 'src/store';
import { cardStyles } from 'src/styles/cardStyles';
import ShopItemPopup from './ShopItemPopup';

// Определение стилей для компонента
const styles = {
  container: {
    width: '100%',
    px: { xxs: 1.5, xs: 2, sm: 3 },
    py: { xxs: 0.8, xs: 1, sm: 1.8 },
    gap: { xxs: 0.8, xs: 1, sm: 2.5, md: 2, lg: 1.2, xl: 2 },
    overflow: 'auto',
    maxHeight: 'calc(100vh - 100px)',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#3B3F4A',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#232626',
    },
  },
  tabs: {
    overflowY: 'visible !important',
    '& .MuiTabScrollButton-root': {
      width: { xxs: 18, xs: 20, sm: 22 },
    },
    '& .MuiTabs-scroller': {
      overflowY: 'visible !important',
    },
    '& .MuiTabs-flexContainer': {
      justifyContent: 'flex-start',
      gap: { xxs: 0.3, xs: 0.5, sm: 1 },
      borderBottom: '1px solid #3B3F4A',
    },
    '& .MuiTab-root': {
      fontSize: { xxs: 12, xs: 14, sm: 16, md: 18 },
      fontWeight: 400,
      color: '#A0A3A7',
      fontFamily: 'Geogrotesque Cyr, sans-serif',
      textTransform: 'uppercase',
      px: { xxs: 0.8, xs: 1, sm: 2 },
      minHeight: { xxs: 36, xs: 40, sm: 48 },
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      position: 'relative',
      zIndex: 1,
      '&.Mui-selected': { 
        color: '#24ee89',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -1,
          height: 16,
          background: 'linear-gradient(0deg, rgba(255,231,26,0.6) 0%, rgba(255,231,26,0) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      },
    },
    '& .MuiTabs-indicator': {
      mb: -0.25,
      height: { xxs: 2, xs: 3, sm: 5 },
      bgcolor: '#24ee89',
      borderRadius: 0.6,
      zIndex: 1,
    },
  },
  shopCard: {
    ...cardStyles.shopCard,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: { xxs: 1, xs: 1.5, sm: 1, md: 0 },
    p: { xxs: 1, xs: 1.2, sm: 1.5, md: 2 },
    pr: { xxs: 9, xs: 10, sm: 11, md: 12 },
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: { xxs: 140, xs: 150, sm: 160, md: 160 },
    height: 'auto',
    overflow: 'hidden',
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
      background: 'linear-gradient(135deg, #232626 0%, #232626 50%, transparent 50%)',
      pointerEvents: 'none',
      zIndex: 0,
    },
  },
  shopItemImage: {
    width: { xxs: 90, xs: 100, sm: 90, md: 120 },
    objectFit: 'contain',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTouchCallout: 'none',
    pointerEvents: 'none',
    cursor: 'default',
  },
  buyButton: {
    bgcolor: '#24ee89',
    color: '#232626',
    borderRadius: 1,
    border: 'none',
    fontSize: { xxs: 10, xs: 11, sm: 12, md: 14 },
    fontWeight: 700,
    fontFamily: 'Geogrotesque Cyr, sans-serif',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    py: { xxs: 0.5, xs: 0.6, sm: 0.8, md: 1 },
    px: { xxs: 0.8, xs: 1, sm: 1.4, md: 2.2 },
    gap: { xxs: 0.4, xs: 0.6, sm: 0.9, md: 1 },
    whiteSpace: 'nowrap',
    position: 'absolute',
    right: { xxs: 8, xs: 10, sm: 12, md: 12 },
    bottom: { xxs: 8, xs: 10, sm: 12, md: 12 },
    transform: 'skew(-5deg)',
    zIndex: 1,
    '&:hover': {
      bgcolor: '#24ee89',
      opacity: 0.9,
    },
    '&:disabled': {
      bgcolor: '#3B3F4A',
      color: '#A0A3A7',
      transform: 'skew(-5deg)',
    },
  },
  payoutText: {
    textAlign: 'center',
    background: 'linear-gradient(90deg, rgba(138, 43, 226, 0.35) 0%, #24ee89 100%)',
    border: '1px solid #24ee89',
    textShadow: '0px 2.82px 2.82px rgba(0, 0, 0, 0.25)',
    WebkitTextStrokeWidth: { xxs: '0.3px', xs: '0.4px', sm: '0.5px', md: '0.6px', xl: '0.7px' },
    WebkitTextStrokeColor: '#2B2F3D',
    fontFamily: 'Geogrotesque Cyr, sans-serif',
    fontSize: { xxs: 14, xs: 16, sm: 16, md: 20, lg: 22, xl: 24 },
    fontWeight: 400,
    lineHeight: 'normal',
    textTransform: 'uppercase',
    color: '#24ee89',
    px: { xxs: 0.4, xs: 0.5, sm: 0.6, md: 1, xl: 1.2 },
    py: { xxs: 0.2, xs: 0.3, sm: 0.3, md: 0.5, xl: 0.6 },
    borderRadius: 0.5,
  },
  payoutTextFreeSpins: {
    textAlign: 'center',
    background: 'linear-gradient(90deg, rgba(138, 43, 226, 0.35) 0%, #24ee89 100%)',
    border: '1px solid #24ee89',
    textShadow: '0px 2.82px 2.82px rgba(0, 0, 0, 0.25)',
    WebkitTextStrokeWidth: { xxs: '0.3px', xs: '0.4px', sm: '0.5px', md: '0.6px', xl: '0.7px' },
    WebkitTextStrokeColor: '#2B2F3D',
    fontFamily: 'Geogrotesque Cyr, sans-serif',
    fontSize: { xxs: 16, xs: 18, sm: 18, md: 20, lg: 22, xl: 24 },
    fontWeight: 400,
    lineHeight: 'normal',
    textTransform: 'uppercase',
    color: '#24ee89',
    px: { xxs: 0.4, xs: 0.5, sm: 0.6, md: 1, xl: 1.2 },
    py: { xxs: 0.2, xs: 0.3, sm: 0.3, md: 0.5, xl: 0.6 },
    borderRadius: 0.5,
  },
};

// Компонент карточки магазина
interface ShopCardProps {
  item: ShopItem;
  onBuy: (id: string) => Promise<void>;
  isBuying: boolean;
  userPoints: number;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  onCardClick: () => void;
}

const ShopCard = ({
  item,
  onBuy,
  isBuying,
  userPoints,
  userStats,
  setUserStats,
  onCardClick,
}: ShopCardProps) => {
  const { t } = useLocales();
  const smDown = useResponsive('down', 'sm');
  const xxsDown = useResponsive('down', 400);

  let imageUrl = '/assets/images/missions/coin_by.png';
  if (item.banner_path) {
    imageUrl = `${API_URL}/${item.banner_path}`;
  } else if (item.type_gift === 'free_spins') {
    imageUrl = './assets/images/missions/wheel.png';
  }

  const typeDisplay = item.type_gift.replace('_', ' ').toUpperCase();

  const itemCost = Number(item.cost) || 0;
  const hasEnoughPoints = userPoints >= itemCost;

  const imageWidth =
    item.type_gift === 'free_spins'
      ? { xxs: 80, xs: 90, sm: 90, md: 110 }
      : { xxs: 90, xs: 100, sm: 100, md: 120 };

  const payoutText =
    item.type_gift === 'free_spins'
      ? `${Math.floor(Number(item.payout))} FS`
      : `${Number(item.payout).toFixed(2)} ${item.currencySymbol || ''}`;

  let coinSize;
  if (xxsDown) {
    coinSize = 10;
  } else if (smDown) {
    coinSize = 12;
  } else {
    coinSize = 24;
  }

  return (
    <Stack sx={styles.shopCard} onClick={onCardClick}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        spacing={{ xxs: 1.5, xs: 2, sm: 2 }}
        sx={{ 
          zIndex: 1
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl}
          alt={item.name || typeDisplay}
          sx={{
            ...styles.shopItemImage,
            width: imageWidth,
            zIndex: 1,
          }}
        />
        <Typography
          sx={{
            ...(item.type_gift === 'free_spins' ? styles.payoutTextFreeSpins : styles.payoutText),
            zIndex: 1,
          }}
        >
          {payoutText}
        </Typography>
      </Stack>
      <Button
        sx={styles.buyButton}
        onClick={(e) => {
          e.stopPropagation();
          onBuy(item._id);
        }}
        disabled={isBuying || !hasEnoughPoints}
      >
        <Box component="span" sx={{ transform: 'skew(5deg)' }}>
          {t('by')} {itemCost}
        </Box>
        {isBuying && (
          <Iconify
            icon="mdi:loading"
            sx={{
              width: { xxs: 10, xs: 12, sm: 14, md: 16 },
              height: { xxs: 10, xs: 12, sm: 14, md: 16 },
              ml: 1,
              transform: 'skew(5deg)',
            }}
          />
        )}
      </Button>
    </Stack>
  );
};

// Основной компонент вкладки магазина
interface ShopTabProps {
  shopItems: ShopItem[];
  buyItem: (id: string) => Promise<any>;
  refreshItems: () => Promise<void>;
  userPoints: number;
  refreshUserStats?: () => Promise<void>;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export default function ShopTab({
  shopItems,
  buyItem,
  refreshItems,
  userPoints,
  refreshUserStats,
  userStats,
  setUserStats,
}: ShopTabProps) {
  const { t } = useLocales();
  const xxsDown = useResponsive('down', 400);
  const xsDown = useResponsive('down', 'xs');
  const smDown = useResponsive('down', 'sm');
  const mdDown = useResponsive('down', 'md');
  const lgDown = useResponsive('down', 'lg');
  const mdUp = useResponsive('up', 'md');
  const xlUp = useResponsive('up', 'xl');
  const [tab, setTab] = useState<ShopTabValue>('free-games');
  const [isBuying, setIsBuying] = useState<string | null>(null);
  const { user } = useSelector((state) => state.auth);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    shopItems.forEach((item, index) => {});
  }, [shopItems]);

  const filteredItems = shopItems.filter((item) => {
    if (tab === 'free-games') return item.type_gift === 'free_spins';
    if (tab === 'cash-bonus') return item.type_gift === 'cash_bonus';
    if (tab === 'free-bet') return item.type_gift === 'free_bet';
    return false;
  });

  const handleTabChange = (_event: SyntheticEvent, newValue: ShopTabValue) => {
    setTab(newValue);
  };

  const handleCardClick = (item: ShopItem) => {
    setSelectedItem(item);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedItem(null);
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
      const requestPayload = { userId: user._id, id };
      const response = await buyItem(id);
      console.log('buyItem response:', {
        status: response?.status,
        data: response?.data,
        headers: response?.headers,
      });

      if (response?.status === 200 && response?.data?.message === 'Purchase successful') {
        toast.success(t('item_purchased_successfully'));
        await refreshItems();

        await new Promise((resolve) => setTimeout(resolve, 500));

        if (refreshUserStats) {
          try {
            await refreshUserStats();
          } catch (refreshError) {
            console.error('Failed to refresh user stats:', refreshError);
            setUserStats((prevStats) => ({
              ...prevStats,
              points: prevStats.points - itemCost,
            }));
            toast(t('stats_update_failed_locally_updated'), {
              icon: '⚠️',
            });
          }
        } else {
          setUserStats((prevStats) => ({
            ...prevStats,
            points: prevStats.points - itemCost,
          }));
        }

        await refreshItems();
      } else {
        console.log('Purchase failed with response:', {
          status: response?.status,
          data: response?.data,
        });
        const errorMessage = response?.data?.message || t('failed_to_purchase_item');
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error buying item:', error);

      let errorMessage = t('failed_to_purchase_item');
      if (error.response) {
        const status = error.response.status;
        const dataMessage = error.response.data?.message;

        if (status === 400 && dataMessage?.includes('id')) {
          errorMessage = t('invalid_item_id');
        } else if (status === 401) {
          errorMessage = t('unauthorized_purchase');
        } else if (status === 403) {
          errorMessage = t('forbidden_purchase');
        } else if (status === 404) {
          errorMessage = t('item_not_found');
        } else if (dataMessage) {
          errorMessage = dataMessage;
        }
      } else if (error.message?.includes('Network Error')) {
        errorMessage = t('network_error');
      }

      toast.error(errorMessage);
    } finally {
      setIsBuying(null);
    }
  };

  const renderContent = () => {
    if (shopItems.length === 0) {
      return Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          sx={{ width: '100%', height: { xxs: 90, xs: 100, sm: 150, md: 130 }, borderRadius: 0.5 }}
        />
      ));
    }

    if (filteredItems.length > 0) {
      return filteredItems.map((item) => (
        <ShopCard
          key={item._id}
          item={item}
          onBuy={handleBuyItem}
          isBuying={isBuying === item._id}
          userPoints={userPoints}
          userStats={userStats}
          setUserStats={setUserStats}
          onCardClick={() => handleCardClick(item)}
        />
      ));
    }

    return (
      <Typography
        variant="body1"
        sx={{
          color: '#E0E0E0',
          textAlign: 'center',
          width: '100%',
          gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 3' },
          fontSize: { xxs: 12, xs: 14, sm: 16 },
        }}
      >
        {t('no_items_available')}
      </Typography>
    );
  };

  return (
    <>
      <Stack sx={styles.container}>
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={styles.tabs}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              value="free-games"
              label={`Free Games ${
                shopItems.filter((item) => item.type_gift === 'free_spins').length
              }`}
            />
            <Tab
              value="cash-bonus"
              label={`Cash Bonus ${
                shopItems.filter((item) => item.type_gift === 'cash_bonus').length
              }`}
            />
            <Tab
              value="free-bet"
              label={`Free Bet ${shopItems.filter((item) => item.type_gift === 'free_bet').length}`}
            />
          </Tabs>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: { xxs: 0.8, xs: 1, sm: 2.5, md: 2, lg: 1.2, xl: 2 },
            mt: { xxs: 0.8, xs: 1, sm: 2 },
            pb: { xxs: 0.5, xs: 1, sm: 1, md: 0 },
          }}
        >
          {renderContent()}
        </Box>
      </Stack>
      <ShopItemPopup
        open={popupOpen}
        onClose={handleClosePopup}
        item={selectedItem}
        onBuy={handleBuyItem}
        isBuying={isBuying === selectedItem?._id}
        userPoints={userPoints}
        userStats={userStats}
        setUserStats={setUserStats}
      />
    </>
  );
}
