/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Stack,
  Typography,
  LinearProgress,
  Button,
} from '@mui/material';
import { useLocales } from 'src/locales';
import Iconify from 'src/components/iconify';
import toast from 'react-hot-toast';
import { API_URL } from 'src/config-global';
import { useSelector } from 'src/store';
import type { Mission } from 'src/types/mission';
import useApi from 'src/hooks/use-api';

// Types
interface BackendMissionDetailsProps {
  missionId: string;
  open: boolean;
  onClose: () => void;
  userLevel?: number;
  missionData: Mission | null;
}

const styles = {
  dialog: {
    '& .MuiDialog-container': {
      overflow: 'visible !important',
      '& .MuiPaper-root': {
        overflow: 'visible !important',
      },
    },
    '& .MuiDialog-paper': {
      background: '#232626',
      borderRadius: '4px',
      width: '300px',
      maxWidth: '280px',
      border: '1px solid #24ee89',
      margin: '0',
      boxSizing: 'border-box',
      overflow: 'visible !important',
      minHeight: '250px',
      maxHeight: '80vh',
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
  dialogContent: {
    p: 2,
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
    zIndex: 1,
  },
  closeButtonWrapper: {
    position: 'absolute !important',
    top: '-20px !important',
    right: '-20px !important',
    zIndex: 9999,
    width: '40px',
    height: '40px',
  },
  closeButton: {
    width: '100%',
    height: '100%',
    minWidth: '40px',
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
  },
  dialogTitle: {
    color: '#FFF',
    fontFamily: 'Impact',
    fontWeight: 400,
    fontSize: 24,
    lineHeight: '24px',
    letterSpacing: 0,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  dialogStatus: {
    color: '#24ee89',
    fontSize: 12,
    fontFamily: 'Cera Pro, sans-serif',
    fontWeight: 400,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  dialogStatusLocked: {
    color: '#E0E0E0',
    fontSize: 12,
    fontFamily: 'Cera Pro, sans-serif',
    fontWeight: 400,
    textTransform: 'uppercase',
    textAlign: 'center',
    background: 'transparent',
    border: '1px solid #24ee89',
    px: 1,
    py: 0.5,
  },
  dialogImage: {
    width: '100%',
    maxWidth: 150,
    height: 'auto',
    margin: '0 auto',
    display: 'block',
    borderRadius: 50,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTouchCallout: 'none',
    pointerEvents: 'none',
    cursor: 'default',
  },
  dialogImageLocked: {
    width: '100%',
    maxWidth: 150,
    height: 'auto',
    margin: '0 auto',
    display: 'block',
    borderRadius: 50,
    filter: 'brightness(30%)',
  },
  dialogLockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 0,
    zIndex: 0,
  },
  dialogLockedText: {
    color: '#E0E0E0',
    fontSize: 14,
    fontFamily: 'Cera Pro, sans-serif',
    fontWeight: 400,
    textTransform: 'uppercase',
    textAlign: 'center',
    mt: 1,
  },
  dialogTextBlock: {
    width: 248,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  dialogCondition: {
    color: '#FFF',
    fontFamily: 'Cera Pro',
    fontWeight: 400,
    fontSize: 12,
    lineHeight: 1,
    letterSpacing: 0,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  dialogProgressBar: {
    height: 12,
    width: 200,
    borderRadius: 5,
    bgcolor: '#A0A3A7',
    '& .MuiLinearProgress-bar': {
      bgcolor: '#24ee89',
      backgroundImage: 'none',
      transition: 'transform 0.3s ease-in-out',
    },
  },
  dialogMissionDescription: {
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'Geogrotesque Cyr, sans-serif',
    textTransform: 'uppercase',
    color: '#FFF',
    textAlign: 'center',
  },
  rewardText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Impact, sans-serif',
    fontWeight: 400,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  rewardValue: {
    background: 'linear-gradient(90deg, rgba(138, 43, 226, 0.35) 0%, #24ee89 100%)',
    borderRadius: '0.5 !important',
    border: '1px solid #24ee89',
    px: 0.7,
    py: 0.3,
    fontSize: 16,
    fontWeight: 400,
    fontFamily: 'Impact, sans-serif',
    textTransform: 'uppercase',
    color: '#24ee89',
    textAlign: 'center',
  },
  optInButton: {
    background: 'transparent',
    borderRadius: 0.5,
    border: '1px solid #24ee89',
    px: 2,
    py: 0.5,
    fontSize: 14,
    fontWeight: 400,
    fontFamily: 'Cera Pro, sans-serif',
    textTransform: 'uppercase',
    color: '#24ee89',
    '&:hover': {
      background: 'rgba(138, 43, 226, 0.08)',
    },
  },
  playButton: {
    background: 'transparent',
    borderRadius: 0.5,
    border: '1px solid #24ee89',
    px: 2,
    py: 0.5,
    fontSize: 14,
    fontWeight: 700,
    fontFamily: 'Cera Pro, sans-serif',
    textTransform: 'uppercase',
    color: '#24ee89',
    '&:hover': {
      background: 'rgba(138, 43, 226, 0.08)',
    },
  },
};

const BackendMissionDetails: React.FC<BackendMissionDetailsProps> = ({
  missionId,
  open,
  onClose,
  userLevel,
  missionData,
}) => {
  const { t, currentLang } = useLocales();
  const { user } = useSelector((state) => state.auth);
  const { optInMission } = useApi();
  const [isOptedIn, setIsOptedIn] = useState(false);

  const isMissionAccessible = useCallback(() => {
    if (!missionData || userLevel === undefined || !user?._id) return false;

    const { min_level, eligible_users } = missionData;
    const currentLevel = userLevel || 0;

    if (min_level > currentLevel) return false;
    if (eligible_users !== 'ALL' && !eligible_users.includes(user._id)) return false;

    return true;
  }, [missionData, userLevel, user?._id]);

  const getStatus = useCallback(() => {
    if (!isMissionAccessible()) return 'LOCKED';
    if (!missionData) return 'LOADING';
    if (missionData.status === 'completed') return 'COMPLETED';
    if (missionData.status === 'claimable') return 'CLAIMABLE';
    if (missionData.progress > 0 && missionData.progress < 100) return 'IN PROGRESS';
    return 'NOT COMPLETED';
  }, [isMissionAccessible, missionData]);

  const handleOptIn = async () => {
  try {
    const response = await optInMission(missionId);
    if (response?.data?.message === 'Successfully opted in') {
      setIsOptedIn(true);
      toast.success('Successfully opted in!', { duration: 3000 });
    } else {
      toast.error('Failed to opt in');
    }
  } catch (error: any) {
    console.error('Failed to opt in:', error);
    toast.error(error.message || 'Failed to opt in');
  }
};

  const handlePlayClick = () => {
    if (missionData?.type === 'shop') {
      onClose();
    }
  };

  if (!missionData) {
    return (
      <Dialog open={open} onClose={onClose} sx={styles.dialog}>
        <DialogContent sx={styles.dialogContent}>
          <Typography sx={styles.dialogTitle}>Loading...</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  const status = getStatus();
  const statusStyle = status === 'LOCKED' ? styles.dialogStatusLocked : styles.dialogStatus;
  const imageUrl = missionData.banner_path
    ? `${API_URL}/${missionData.banner_path}`
    : '/assets/images/missions/default.png';

  const renderImageOrIcon = () => {
    if (status === 'COMPLETED') {
      return (
        <Box
          component="img"
          src="/assets/images/missions/completed.png"
          alt="Completed"
          sx={{
            width: 120,
            margin: '0 auto',
            display: 'block',
          }}
        />
      );
    }

    if (!missionData.banner_path) {
      return (
        <Typography sx={{ color: '#FFF', textAlign: 'center' }}>No image available</Typography>
      );
    }

    return (
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 150, margin: '0 auto' }}>
        <Box
          component="img"
          src={imageUrl}
          alt={missionData.title}
          sx={status === 'LOCKED' ? styles.dialogImageLocked : styles.dialogImage}
          onError={(e) => console.error('Image failed to load:', imageUrl)}
        />
        {status === 'LOCKED' && <Box sx={styles.dialogLockedOverlay} />}
        {status === 'LOCKED' && (
          <Box
            component="img"
            src="/assets/images/missions/lock.png"
            alt="Locked"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 60,
              height: 60,
              zIndex: 1,
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} sx={styles.dialog}>
      <Box sx={styles.closeButtonWrapper}>
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <Iconify icon="mdi:close" sx={{ width: 20, height: 20 }} />
        </IconButton>
      </Box>
      <DialogContent sx={styles.dialogContent}>
        <Stack direction="column" alignItems="center" justifyContent="center" spacing={1}>
          <Typography sx={styles.dialogTitle}>{missionData.title}</Typography>
          <Typography sx={statusStyle}>{status}</Typography>
          {renderImageOrIcon()}
          {status === 'LOCKED' && (
            <Typography sx={styles.dialogLockedText}>
              Available from Level {missionData.min_level}
            </Typography>
          )}
          <Box sx={styles.dialogTextBlock}>
            <Typography sx={styles.dialogCondition}>
              {typeof missionData.description === 'string'
                ? missionData.description
                : Array.isArray(missionData.description)
                ? missionData.description.join(', ')
                : 'No description available'}
            </Typography>
            {status !== 'LOCKED' && (
              <>
                {missionData.steps && missionData.steps.length > 0 && (
                  <Stack direction="column" alignItems="center" spacing={1}>
                    {missionData.steps.map((step, index) => (
                      <Typography key={index} sx={styles.dialogMissionDescription}>
                        {step}
                      </Typography>
                    ))}
                  </Stack>
                )}
                {status === 'COMPLETED' && (
                  <Typography sx={styles.dialogMissionDescription}>
                    You have already claimed your reward
                  </Typography>
                )}
                {status !== 'COMPLETED' && (
                  <Stack direction="column" alignItems="center" justifyContent="center" spacing={2}>
                    {status === 'NOT COMPLETED' && !isOptedIn && !missionData.optIn ? (
                    <Button sx={styles.optInButton} onClick={handleOptIn}>
                      OPT-IN
                    </Button>
                    ) : (
                      <>
                        {missionData.url && (
                          <Button
                            sx={styles.playButton}
                            onClick={handlePlayClick}
                            startIcon={<Iconify icon="mdi:play" />}
                            href={`/${currentLang.value}/${missionData.url}`}
                            target="_blank"
                          >
                            Play
                          </Button>
                        )}
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={missionData.progress}
                            sx={styles.dialogProgressBar}
                          />
                          <Typography sx={styles.dialogMissionDescription}>
                            {missionData.progress}%
                          </Typography>
                        </Stack>
                      </>
                    )}
                  </Stack>
                )}
              </>
            )}
            <Typography sx={styles.rewardText}>
              Reward:{' '}
              <Typography component="span" sx={styles.rewardValue}>
                {missionData.reward} Points
              </Typography>
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default BackendMissionDetails;