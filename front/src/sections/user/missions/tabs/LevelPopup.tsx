/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Stack,
  Typography,
  LinearProgress,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { API_URL } from 'src/config-global';
import type { UserStats, Level } from 'src/types/mission';
import { useResponsive } from 'src/hooks/use-responsive';

interface LevelPopupProps {
  open: boolean;
  onClose: () => void;
  level: Level | null;
  userStats: UserStats;
}

const styles = {
  dialog: {
    '& .MuiDialog-container': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& .MuiDialog-paper': {
      background: '#142214',
      borderRadius: '4px',
      width: { xxs: '80vw', xs: '80vw', sm: '300px' },
      maxWidth: { xxs: '200px', xs: '240px', sm: '300px' },
      border: '1px solid #67F962',
      margin: '0',
      boxSizing: 'border-box',
      overflow: 'visible !important',
      minHeight: { xxs: '180px', xs: '200px', sm: '250px' },
      maxHeight: { xxs: '70vh', sm: '80vh' },
      position: 'relative',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
    },
  },
  dialogContent: {
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
  },
  closeButtonWrapper: {
  position: 'absolute !important',
  top: { xs: '-15px !important', sm: '-20px !important' },
  right: { xs: '-15px !important', sm: '-20px !important' },
  left: 'auto !important',
  zIndex: 9999,
  width: { xs: '25px', sm: '40px' },
  height: { xs: '25px', sm: '40px' },
},
  closeButton: {
    width: '100%',
    height: '100%',
    minWidth: { xxs: '25px', sm: '40px' },
    p: 0,
    borderRadius: '50%',
    border: '1px solid #67F962',
    background: 'linear-gradient(90deg, #142214 0%, #357035 100%)',
    color: '#FFF',
    '&:hover': {
      bgcolor: '#E0E0E0',
      color: '#000',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(103, 249, 98, 0.8)',
  },
  dialogTitle: {
    color: '#FFF',
    fontFamily: 'Impact',
    fontWeight: 400,
    fontSize: { xxs: 16, xs: 18, sm: 24 },
    lineHeight: { xxs: '16px', xs: '18px', sm: '24px' },
    letterSpacing: 0,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  dialogImage: {
    width: '100%',
    maxWidth: { xxs: 100, xs: 120, sm: 150 },
    height: 'auto',
    margin: '0 auto',
    display: 'block',
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
  },
  dialogText: {
    color: '#FFF',
    fontSize: { xxs: 12, xs: 14, sm: 16 },
    fontFamily: 'Impact, sans-serif',
    fontWeight: 400,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  dialogStatus: {
    color: '#E0E0E0',
    fontSize: { xxs: 10, sm: 14 },
    fontFamily: 'Cera Pro, sans-serif',
    fontWeight: 400,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  progressBar: {
    height: { xxs: 8, sm: 12 },
    width: { xxs: 140, xs: 160, sm: 200 },
    borderRadius: 5,
    bgcolor: '#324532',
    '& .MuiLinearProgress-bar': {
      bgcolor: '#40B13C',
      backgroundImage:
        'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
      backgroundSize: '1rem 1rem',
    },
  },
  dialogPoints: {
    color: '#FFF',
    fontSize: { xxs: 10, sm: 14 },
    fontFamily: 'Cera Pro, sans-serif',
    fontWeight: 400,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
};

const LevelPopup: React.FC<LevelPopupProps> = ({ open, onClose, level, userStats }) => {
  if (!level) {
    return null;
  }

  const imageUrl = level.banner_path
    ? `${API_URL}/${level.banner_path}`
    : '/assets/images/missions/flag.png';

  const pointsRequired = level.min_points || 0;
  const currentPoints = userStats.points || 0;
  const progress = userStats.levelProgress || 0;
  const isUnlocked = level.have;

  return (
    <Dialog open={open} onClose={onClose} sx={styles.dialog}>
      <Box sx={styles.closeButtonWrapper}>
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <Iconify
            icon="mdi:close"
            sx={{ width: { xxs: 16, sm: 20 }, height: { xxs: 16, sm: 20 } }}
          />
        </IconButton>
      </Box>
      <DialogContent sx={styles.dialogContent}>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={{ xxs: 0.5, sm: 1 }}
        >
          <Typography sx={styles.dialogTitle}>Level {level.num}</Typography>
          <Typography sx={styles.dialogStatus}>{isUnlocked ? 'Unlocked' : 'Locked'}</Typography>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: styles.dialogImage.maxWidth,
              margin: '0 auto',
            }}
          >
            <Box
              component="img"
              src={imageUrl}
              alt={`Level ${level.num}`}
              sx={styles.dialogImage}
              onError={(e) => console.error('Image failed to load:', imageUrl)}
            />
          </Box>
          <Box sx={styles.dialogTextBlock}>
            {!isUnlocked && (
              <>
                <Typography sx={styles.dialogText}>Points Required: {pointsRequired}</Typography>
                <LinearProgress variant="determinate" value={progress} sx={styles.progressBar} />
                <Typography sx={styles.dialogPoints}>
                  {currentPoints}/{pointsRequired} Points
                </Typography>
              </>
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default LevelPopup;
