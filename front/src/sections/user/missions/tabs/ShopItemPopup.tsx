/* eslint-disable react/prop-types */
import { Dialog, DialogContent, IconButton, Box, Stack, Typography, Button } from '@mui/material';
import Iconify from 'src/components/iconify';
import { API_URL } from 'src/config-global';
import type { ShopItem, UserStats } from 'src/types/mission';
import { useResponsive } from 'src/hooks/use-responsive';

interface ShopItemPopupProps {
  open: boolean;
  onClose: () => void;
  item: ShopItem | null;
  onBuy: (id: string) => Promise<void>;
  isBuying: boolean;
  userPoints: number;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

const styles = {
  dialog: {
    '& .MuiDialog-container': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible !important',
    },
    '& .MuiDialog-paper': {
      background: '#232626',
      borderRadius: '4px',
      width: { xxs: '80vw', xs: '80vw', sm: '300px' },
      maxWidth: { xxs: '200px', xs: '240px', sm: '300px' },
      border: '1px solid #24ee89',
      margin: '0',
      boxSizing: 'border-box',
      overflow: 'visible !important',
      minHeight: { xxs: '220px', xs: '240px', sm: '300px' },
      maxHeight: { xxs: '70vh', sm: '80vh' },
      position: 'relative',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle at top left, rgba(138, 43, 226, 0.3) 0%, rgba(138, 43, 226, 0.15) 40%, #24ee89 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        borderTopLeftRadius: '4px',
      },
    },
  },
  dialogContent: (theme: { hasEnoughPoints: any; }) => ({
    p: { xxs: 1.5, xs: 1.8, sm: 2 },
    bgcolor: 'transparent',
    position: 'relative',
    display: 'flex',
    overflow: 'visible',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    overflowY: 'hidden',
    overflowX: 'hidden',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    filter: !theme.hasEnoughPoints ? 'brightness(70%)' : 'none',
    zIndex: 1,
  }),
  closeButtonWrapper: {
    position: 'absolute !important',
    top: { xs: '-15px !important', sm: '-20px !important' },
    right: { xs: '-15px !important', sm: '-20px !important' },
    left: 'auto !important',
    zIndex: 9999,
    width: { xxs: '25px', sm: '40px' },
    height: { xxs: '25px', sm: '40px' },
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  closeButton: {
    width: '100%',
    height: '100%',
    minWidth: { xxs: '25px', sm: '40px' },
    p: 0,
    borderRadius: '50%',
    border: '1px solid #24ee89',
    background: 'linear-gradient(90deg, #232626 0%, #2B2F3D 100%)',
    color: '#FFF',
    '&:hover': {
      bgcolor: '#2B2F3D',
      color: '#FFF',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(138, 43, 226, 0.4)',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  dialogTitle: {
    background: 'linear-gradient(90deg, rgba(138, 43, 226, 0.35) 0%, #24ee89 100%)',
    border: '1px solid #24ee89',
    borderRadius: 4,
    px: { xxs: 0.8, xs: 1, sm: 1.2 },
    py: { xxs: 0.3, xs: 0.4, sm: 0.5 },
    color: '#24ee89',
    fontFamily: 'Impact',
    fontWeight: 400,
    fontSize: { xxs: 16, xs: 18, sm: 24 },
    lineHeight: { xxs: '16px', xs: '18px', sm: '24px' },
    letterSpacing: 0,
    textTransform: 'uppercase',
    textAlign: 'center',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  dialogImageContainer: {
    width: '100%',
    maxWidth: { xxs: 100, xs: 120, sm: 150 },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  dialogImage: {
    width: '100%',
    maxWidth: { xxs: 100, xs: 120, sm: 150 },
    height: 'auto',
    maxHeight: { xxs: '100px', xs: '120px', sm: '150px' },
    objectFit: 'contain',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTouchCallout: 'none',
    pointerEvents: 'none',
    cursor: 'default',
  },
  dialogTextBlock: {
    width: { xxs: '90%', xs: 220, sm: 248 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: { xxs: '8px', sm: '12px' },
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  dialogName: {
    color: '#FFF',
    fontFamily: 'Impact',
    fontWeight: 400,
    fontSize: { xxs: 14, xs: 16, sm: 20 },
    textTransform: 'uppercase',
    textAlign: 'center',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  dialogDescription: {
    color: '#E0E0E0',
    fontSize: { xxs: 12, xs: 14, sm: 14 },
    fontFamily: 'Cera Pro, sans-serif',
    fontWeight: 400,
    textTransform: 'uppercase',
    textAlign: 'center',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  dialogPrice: {
    color: '#FFF',
    fontSize: { xxs: 14, xs: 16, sm: 18 },
    fontFamily: 'Impact, sans-serif',
    fontWeight: 400,
    textTransform: 'uppercase',
    textAlign: 'center',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  buyButton: {
    bgcolor: 'transparent',
    color: '#24ee89',
    borderRadius: 50,
    border: '1px solid #24ee89',
    fontSize: { xxs: 12, xs: 14, sm: 16 },
    fontWeight: 800,
    fontFamily: 'Cera Pro, sans-serif',
    textTransform: 'uppercase',
    py: { xxs: 1, xs: 1.2, sm: 1.5 },
    px: { xxs: 2, xs: 2.5, sm: 3 },
    gap: 1,
    whiteSpace: 'nowrap',
    '&:disabled': {
      bgcolor: 'transparent',
      color: '#A0A3A7',
      borderColor: '#3B3F4A',
    },
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
};

const preventDefaultInteractions = (e: React.SyntheticEvent) => {
  e.preventDefault();
};

const ShopItemPopup: React.FC<ShopItemPopupProps> = ({
  open,
  onClose,
  item,
  onBuy,
  isBuying,
  userPoints,
}) => {
  const smDown = useResponsive('down', 'sm');
  if (!item) {
    return null;
  }

  let imageUrl = '/assets/images/missions/coin_by.png';
  if (item.banner_path) {
    imageUrl = `${API_URL}/${item.banner_path}`;
  } else if (item.type_gift === 'free_spins') {
    imageUrl = '/assets/images/missions/wheel.png';
  }

  const formattedPayout = item.type_gift === 'free_spins'
    ? Math.floor(Number(item.payout))
    : Number(item.payout).toFixed(2);
  const suffix = item.type_gift === 'free_spins' ? 'FS' : item.currencySymbol || '';
  const displayText = `${formattedPayout} ${suffix}`;
  const itemCost = Number(item.cost) || 0;
  const hasEnoughPoints = userPoints >= itemCost;
  const buttonText = `buy ${itemCost} points`; // New button text format

  const handleBuyClick = async () => {
    await onBuy(item._id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} sx={styles.dialog} onDragStart={preventDefaultInteractions}
      onTouchStart={preventDefaultInteractions}
      onTouchMove={preventDefaultInteractions}>
      <Box sx={styles.closeButtonWrapper}>
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <Iconify icon="mdi:close" sx={{ width: 20, height: 20 }} />
        </IconButton>
      </Box>
      <DialogContent sx={styles.dialogContent({ hasEnoughPoints })}>
        <Stack direction="column" alignItems="center" justifyContent="space-between" spacing={2} sx={{ height: '100%' }}>
          <Typography sx={styles.dialogTitle}>
            {displayText}
          </Typography>
          <Box sx={styles.dialogImageContainer}>
            <Box
              component="img"
              src={imageUrl}
              alt={item.name}
              sx={styles.dialogImage}
              onError={(e) => console.error('Image failed to load:', imageUrl)}
            />
          </Box>
          <Box sx={styles.dialogTextBlock}>
            <Typography sx={styles.dialogName}>{item.name}</Typography>
            <Typography sx={styles.dialogDescription}>{item.desc}</Typography>
          </Box>
          <Button
            sx={styles.buyButton}
            onClick={handleBuyClick}
            disabled={isBuying || !hasEnoughPoints}
          >
            {buttonText}
            {isBuying && <Iconify icon="mdi:loading" sx={{ width: 20, height: 20, ml: 1 }} />}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ShopItemPopup;