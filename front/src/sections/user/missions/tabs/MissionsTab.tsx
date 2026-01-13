/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type { SyntheticEvent } from 'react';
import {
  Typography,
  Box,
  Stack,
  Tabs,
  Tab,
  Grid,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { useLocales } from 'src/locales';
import { useResponsive } from 'src/hooks/use-responsive';
import useApi from 'src/hooks/use-api';
import type { Mission } from 'src/types/mission';
import { API_URL } from 'src/config-global';
import { useSelector } from 'src/store';
import toast from 'react-hot-toast';
import { cardStyles } from 'src/styles/cardStyles';
import BackendMissionDetails from './MissionDetails';

type TabValue = 'overview' | 'available' | 'locked' | 'completed' | 'skipped';
type FilterValue = 'all' | 'progress' | 'completed' | 'not_started' | 'expired';

interface MissionDetailsProps {
  image: string;
  title: string;
  description: string | string[];
  progress: number;
  reward: number;
  onViewDetails: () => void;
  isLocked?: boolean;
  status: string;
}

interface MissionsTabProps {
  missions: Mission[];
  userLevel?: number;
  refreshUserStats?: () => Promise<void>;
}

const styles = {
  container: {
    px: 3,
    py: 1.8,
    width: 1,
    height: 1,
    gap: 2,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  tabs: {
    overflowY: 'visible !important',
    '& .MuiTabScrollButton-root': { width: 22 },
    '& .MuiTabs-scroller': { overflowY: 'visible !important' },
    '& .MuiTabs-flexContainer': {
      justifyContent: 'space-between',
      borderBottom: '1px solid #2B2F3D',
    },
    '& .MuiTab-root': {
      fontSize: 18,
      fontWeight: 400,
      color: '#FFF',
      fontFamily: 'Impact, sans-serif',
      textTransform: 'uppercase',
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
      height: 5,
      bgcolor: '#24ee89',
      borderRadius: 0.6,
      zIndex: 1,
    },
  },
  missionCard: {
    p: { xs: 1, sm: 1, md: 2, lg: 2 },
    ...cardStyles.missionCard,
    position: 'relative',
    gap: 0.5,
    width: '100%',
    minHeight: { xs: 'auto', sm: 195, md: 195, lg: 195, xl: 195 },
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer',
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
  joinButton: {
    px: 1,
    py: 0.6,
    borderRadius: 0.2,
    bgcolor: '#232626',
    border: '1px solid #24ee89',
    fontSize: { xs: 12, sm: 13, md: 14 },
    fontWeight: 700,
    fontFamily: 'Cera Pro, sans-serif',
    textTransform: 'uppercase',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    color: '#24ee89',
  },
  missionTitle: {
    color: '#FFF',
    fontWeight: 700,
    fontSize: 16,
    fontFamily: 'Geogrotesque Cyr, sans-serif',
    fontStyle: 'italic',
    lineHeight: 1,
    letterSpacing: 0,
    textAlign: 'center',
    textTransform: 'uppercase',
    transform: 'skewX(-5deg)',
  },
  missionDescription: {
    fontSize: { xs: 12, sm: 13, md: 14, lg: 14 },
    fontWeight: 700,
    fontFamily: 'Cera Pro, sans-serif',
    textTransform: 'uppercase',
    color: '#FFF',
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
    fontSize: { xs: 14, sm: 10, md: 10 },
    fontWeight: 400,
    fontFamily: 'Impact, sans-serif',
    textTransform: 'uppercase',
    color: '#24ee89',
  },
  detailsButton: {
    py: 1,
    px: 2,
    borderRadius: 50,
    border: '1px solid #24ee89',
    color: '#24ee89',
    fontWeight: 700,
    fontFamily: 'Cera Pro, sans-serif',
    textTransform: 'uppercase',
    fontSize: { xs: 12, sm: 13, md: 14 },
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(26, 29, 41, 0.8)',
    zIndex: 1000,
  },
};

const isSpecialMission = (mission: Mission) =>
  ['sport', 'login_daily', 'casino_daily'].includes(mission.type || '');

const MissionDetails: React.FC<MissionDetailsProps> = ({
  image,
  title,
  progress,
  reward,
  onViewDetails,
  isLocked = false,
  status,
}) => {
  const getStatusText = () => {
    if (status === 'completed') return 'COMPLETED';
    if (status === 'claimable') return 'Claim your reward';
    if (status === 'notcompleted') return progress > 0 ? 'You have joined' : 'Not started';
    return 'Unknown';
  };

  return (
    <Stack sx={styles.missionCard} alignItems="center" gap={2.5} onClick={onViewDetails}>
      <Typography
        sx={{
          fontSize: { xs: 12, sm: 10, md: 12 },
          fontWeight: 400,
          fontFamily: 'Cera Pro, sans-serif',
          textTransform: 'uppercase',
          color: '#FFF',
          background:
            'linear-gradient(90deg, rgba(138, 43, 226, 0.35) 0%, #24ee89 100%)',
          border: '1px solid #24ee89',
          px: 1,
          py: 0,
          mt: 0,
          borderRadius: 0.5,
          zIndex: 1,
        }}
      >
        {getStatusText()}
      </Typography>
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: { xs: 100, sm: 80, md: 90, lg: 100 },
          height: { xs: 100, sm: 80, md: 90, lg: 100 },
          objectFit: 'contain',
          borderRadius: image.includes('wheel') ? 50 : 0,
          zIndex: 1,
        }}
      />
      <Typography sx={{ ...styles.missionTitle, zIndex: 1 }}>{title}</Typography>
      {!isLocked && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            ...styles.progressBar,
            width: '100%',
            zIndex: 1,
          }}
        />
      )}
      <Stack direction="row" alignItems="center" justifyContent="center" gap={0.5} sx={{ zIndex: 1 }}>
        <Typography
          sx={{
            fontSize: { xs: 12, sm: 10, md: 11 },
            fontWeight: 500,
            fontFamily: 'Geogrotesque Cyr, sans-serif',
            textTransform: 'uppercase',
          }}
        >
          Reward:
        </Typography>
        <Typography sx={styles.pointsButton}>{reward} POINTS</Typography>
      </Stack>
      <Typography
        sx={{
          fontSize: { xs: 11, sm: 8, md: 10 },
          fontWeight: 700,
          fontFamily: 'Cera Pro, sans-serif',
          textTransform: 'uppercase',
          color: '#FFF',
          cursor: 'pointer',
          mt: 0,
          zIndex: 1,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails();
        }}
      >
        View Details →
      </Typography>
    </Stack>
  );
};

const SpecialMissionDetails: React.FC<MissionDetailsProps> = ({
  image,
  title,
  progress,
  reward,
  onViewDetails,
  isLocked = false,
  status,
}) => {
  const getStatusText = () => {
    if (status === 'completed') return 'COMPLETED';
    if (status === 'claimable') return 'Claim your reward';
    if (status === 'notcompleted') return progress > 0 ? 'You have joined' : 'Not started';
    return 'Unknown';
  };

  return (
    <Stack
      sx={{
        ...styles.missionCard,
        minHeight: { xs: 'auto', sm: 195, md: 195, lg: 195, xl: 195 },
        height: 'auto',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      onClick={onViewDetails}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={{ xs: 1, sm: 1, md: 1.5, lg: 2 }}
        sx={{ height: '100%', zIndex: 1 }}
      >
        <Stack alignItems="center" gap={0.5} sx={{ zIndex: 1 }}>
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: { xs: 120, sm: 80, md: 90, lg: 100 },
              height: { xs: 120, sm: 80, md: 90, lg: 100 },
              objectFit: 'contain',
              borderRadius: image.includes('wheel') ? 50 : 0,
            }}
          />
          <Stack direction="row" alignItems="center" justifyContent="center" gap={0.5}>
            <Typography
              sx={{
                fontSize: { xs: 14, sm: 12, md: 14 },
                fontWeight: 500,
                fontFamily: 'Geogrotesque Cyr, sans-serif',
                textTransform: 'uppercase',
              }}
            >
              Reward:
            </Typography>
            <Typography sx={styles.pointsButton}>{reward} POINTS</Typography>
          </Stack>
        </Stack>

        <Stack flex={1} gap={{ xs: 0.5, sm: 0.3, md: 0.5, lg: 0.5 }} sx={{ zIndex: 1 }}>
          <Stack direction="row" justifyContent="flex-end" sx={{ zIndex: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 10, md: 12 },
                fontWeight: 400,
                fontFamily: 'Cera Pro, sans-serif',
                textTransform: 'uppercase',
                color: '#FFF',
                background:
                  'linear-gradient(90deg, rgba(138, 43, 226, 0.35) 0%, #24ee89 100%)',
                border: '1px solid #24ee89',
                px: 1,
                py: 0.3,
                borderRadius: 0.5,
              }}
            >
              {getStatusText()}
            </Typography>
          </Stack>
          <Typography sx={{ ...styles.missionTitle, zIndex: 1 }}>{title}</Typography>
          {!isLocked && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                ...styles.progressBar,
                width: '100%',
                zIndex: 1,
              }}
            />
          )}
          <Typography
            sx={{
              fontSize: { xs: 12, sm: 10, md: 12 },
              fontWeight: 700,
              fontFamily: 'Cera Pro, sans-serif',
              textTransform: 'uppercase',
              color: '#FFF',
              cursor: 'pointer',
              textAlign: 'right',
              zIndex: 1,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
          >
            View Details →
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default function MissionsTab({
  missions: initialMissions,
  userLevel,
  refreshUserStats,
}: MissionsTabProps) {
  const { t } = useLocales();
  const smDown = useResponsive('down', 'sm');
  const { get_user_missions, get_user_one_mission, check_mission, claim_mission } = useApi();
  const { user } = useSelector((state) => state.auth);

  const [filter, setFilter] = useState<FilterValue>('all');
  const [tab, setTab] = useState<TabValue>('overview');
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [missionData, setMissionData] = useState<Mission | null>(null);
  const [missions, setMissions] = useState<Mission[]>(initialMissions || []);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const processingRef = useRef<string | null>(null);
  const isFetchingMissions = useRef(false);

  const fetchMissions = useCallback(async () => {
    if (isFetchingMissions.current) {
      return;
    }

    isFetchingMissions.current = true;
    try {
      const res = await get_user_missions();
      if (res?.data?.data) {
        setMissions(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch missions:', error);
      toast.error('Failed to fetch missions');
    } finally {
      isFetchingMissions.current = false;
    }
  }, [get_user_missions]);

  useEffect(() => {
    if (!initialMissions || initialMissions.length === 0) {
      fetchMissions();
    }
  }, [fetchMissions, initialMissions]);

  const handleCheckMission = useCallback(
    async (missionId: string, currentData: Mission) => {
      try {
        const res = await check_mission(missionId);
        if (res?.data?.data) {
          const previousProgress = currentData.progress || 0;
          const newProgress = res.data.data.progress;
          const updatedData = {
            ...currentData,
            progress: newProgress,
            status: res.data.data.status,
          };

          if (newProgress === previousProgress) {
            toast.error("You didn't complete this mission", {
              icon: '❌',
              duration: 3000,
            });
          } else {
            toast.success('Mission progress updated!', {
              duration: 3000,
            });
          }

          return updatedData;
        }
        if (res?.data?.message) {
          toast.error(res.data.message);
        }
      } catch (error: any) {
        console.error('Failed to check mission:', error);
        toast.error(error.message || 'Failed to check mission');
      }
      return currentData;
    },
    [check_mission]
  );

  const handleClaimReward = useCallback(
    async (missionId: string, currentData: Mission) => {
      try {
        const res = await claim_mission(missionId);
        if (res?.data?.data) {
          const updatedData = {
            ...currentData,
            status: res.data.data.status,
            progress: 100,
          };
          toast.success('Reward claimed successfully!', { duration: 3000 });
          return updatedData;
        }
        if (res?.data?.message) {
          toast.error(res.data.message);
        }
      } catch (error: any) {
        console.error('Failed to claim mission:', error);
        toast.error(error.message || 'Failed to claim reward');
      }
      return currentData;
    },
    [claim_mission]
  );

  const handleViewDetails = useCallback(
    async (missionId: string) => {
      if (processingRef.current === missionId) {
        return;
      }

      processingRef.current = missionId;
      setIsLoadingDetails(true);
      setSelectedMission(missionId);

      try {
        const res = await get_user_one_mission(missionId);
        if (res?.data?.data) {
          let updatedData = res.data.data;

          if (updatedData.status !== 'completed') {
            updatedData = await handleCheckMission(missionId, updatedData);
            if (updatedData.status === 'claimable') {
              updatedData = await handleClaimReward(missionId, updatedData);
            }
          }

          setMissionData(updatedData);
          setMissions((prev) => prev.map((m) => (m._id === missionId ? updatedData : m)));

          if (refreshUserStats) {
            await refreshUserStats();
            await fetchMissions();
          }
        } else if (res?.data?.message) {
          toast.error(res.data.message);
          setSelectedMission(null);
        } else {
          toast.error('Failed to load mission data');
          setSelectedMission(null);
        }
      } catch (error: any) {
        console.error('Failed to process mission:', error);
        toast.error(error.message || 'Error loading mission');
        setSelectedMission(null);
      } finally {
        setIsLoadingDetails(false);
        processingRef.current = null;
      }
    },
    [get_user_one_mission, handleCheckMission, handleClaimReward, refreshUserStats, fetchMissions]
  );

  const handleClosePopup = () => {
    setSelectedMission(null);
    setMissionData(null);
  };

  const isMissionAccessible = (mission: Mission) => {
    if (!userLevel) return false;
    const { min_level, eligible_users } = mission;
    if (min_level > userLevel) return false;
    if (!user || !user._id) return false;
    const userId = String(user._id);
    if (eligible_users !== 'ALL') {
      if (!Array.isArray(eligible_users)) return false;
      return eligible_users.includes(userId);
    }
    return true;
  };

  const filteredMissions = useMemo(
    () =>
      missions
        .filter((mission) => {
          const accessible = isMissionAccessible(mission);
          const isCompleted = mission.status === 'completed';
          const isInProgress = mission.progress > 0 && mission.progress < 100;
          const isNew = mission.progress === 0;

          if (tab === 'overview') {
            return !isCompleted && (isNew || isInProgress);
          }
          if (tab === 'available') {
            return accessible && !isCompleted;
          }
          if (tab === 'locked') {
            return !accessible;
          }
          if (tab === 'completed') {
            return isCompleted;
          }
          if (tab === 'skipped') {
            return false;
          }
          return true;
        })
        .filter((mission) => {
          if (filter === 'all') return true;
          const isNotStarted = mission.progress === 0;
          const isCompleted = mission.progress >= 100;
          const isInProgress = mission.progress > 0 && mission.progress < 100;
          const isExpired = mission.status === 'expired';
          if (filter === 'not_started') return isNotStarted;
          if (filter === 'progress') return isInProgress;
          if (filter === 'completed') return isCompleted;
          if (filter === 'expired') return isExpired;
          return true;
        }),
    [missions, filter, tab, userLevel, user]
  );

  const overviewCount = useMemo(() => {
    const count = missions.filter((mission) => {
      const isCompleted = mission.status === 'completed';
      const isInProgress = mission.progress > 0 && mission.progress < 100;
      const isNew = mission.progress === 0;
      return !isCompleted && (isNew || isInProgress);
    }).length;
    return count;
  }, [missions]);

  const availableCount = useMemo(() => {
    const count = missions.filter((mission) => {
      const accessible = isMissionAccessible(mission);
      const isCompleted = mission.status === 'completed';
      return accessible && !isCompleted;
    }).length;
    return count;
  }, [missions, userLevel, user]);

  const lockedCount = useMemo(() => {
    const count = missions.filter((mission) => !isMissionAccessible(mission)).length;
    return count;
  }, [missions, userLevel, user]);

  const completedCount = useMemo(() => {
    const count = missions.filter((mission) => mission.status === 'completed').length;
    return count;
  }, [missions]);

  const skippedCount = 0;

  const arrangedMissionRows = useMemo(() => {
    if (smDown) return null;

    const rows: Mission[][] = [];
    let currentRow: Mission[] = [];
    let columnsUsed = 0;
    const columnsPerRow = 5;

    const missionsCopy = [...filteredMissions];
    const regularMissions: Mission[] = [];
    const specialMissions: Mission[] = [];

    missionsCopy.forEach((mission) => {
      if (isSpecialMission(mission)) {
        specialMissions.push(mission);
      } else {
        regularMissions.push(mission);
      }
    });

    specialMissions.sort((a, b) => b.progress - a.progress);
    regularMissions.sort((a, b) => b.progress - a.progress);

    let specialIndex = 0;
    let regularIndex = 0;

    while (specialIndex < specialMissions.length || regularIndex < regularMissions.length) {
      if (columnsUsed === columnsPerRow) {
        rows.push(currentRow);
        currentRow = [];
        columnsUsed = 0;
      }

      const columnsRemaining = columnsPerRow - columnsUsed;

      if (columnsRemaining >= 2 && specialIndex < specialMissions.length) {
        currentRow.push(specialMissions[specialIndex]);
        specialIndex++;
        columnsUsed += 2;
      } else if (columnsRemaining >= 1 && regularIndex < regularMissions.length) {
        currentRow.push(regularMissions[regularIndex]);
        regularIndex++;
        columnsUsed += 1;
      } else if (columnsRemaining < 2 && specialIndex < specialMissions.length) {
        rows.push(currentRow);
        currentRow = [];
        columnsUsed = 0;
      } else {
        rows.push(currentRow);
        currentRow = [];
        columnsUsed = 0;
      }
    }

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  }, [filteredMissions, smDown]);

  const handleTabChange = (event: SyntheticEvent, newValue: TabValue) => {
    setTab(newValue);
  };

  return (
    <Stack sx={styles.container}>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        sx={styles.tabs}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab value="overview" label={`Overview ${overviewCount}`} />
        <Tab value="available" label={`Available ${availableCount}`} />
        <Tab value="locked" label={`Locked ${lockedCount}`} />
        <Tab value="completed" label={`Completed ${completedCount}`} />
        <Tab value="skipped" label={`Skipped ${skippedCount}`} />
      </Tabs>

      <Grid container spacing={{ xs: 1.5, sm: 2 }} mt={1}>
        {smDown ? (
          <Grid item xs={12}>
            {isLoadingDetails && (
              <Box sx={styles.loadingOverlay}>
                <CircularProgress sx={{ color: '#67F962' }} />
              </Box>
            )}
            <Stack direction="column" gap={1.5}>
              {filteredMissions.length > 0 ? (
                filteredMissions.map((mission) => (
                  <SpecialMissionDetails
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
                    onViewDetails={() => handleViewDetails(mission._id)}
                    isLocked={!isMissionAccessible(mission)}
                    status={mission.status}
                  />
                ))
              ) : (
                <Typography
                  variant="body1"
                  sx={{ color: '#E0E0E0', textAlign: 'center', width: '100%' }}
                >
                  {t('no_missions_available')}
                </Typography>
              )}
            </Stack>
          </Grid>
        ) : (
          <Grid item xs={12} sm={12} md={12}>
            {isLoadingDetails && (
              <Box sx={styles.loadingOverlay}>
                <CircularProgress sx={{ color: '#67F962' }} />
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                height: 1,
              }}
            >
              {arrangedMissionRows && arrangedMissionRows.length > 0 ? (
                arrangedMissionRows.map((row, rowIndex) => (
                  <Box
                    key={rowIndex}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: 1,
                      minHeight: { xs: 'auto', sm: 185, md: 185, lg: 185, xl: 185 },
                    }}
                  >
                    {row.map((mission) => {
                      const isSpecial = isSpecialMission(mission);
                      const accessible = isMissionAccessible(mission);
                      const CardComponent = isSpecial ? SpecialMissionDetails : MissionDetails;

                      return (
                        <Box
                          key={mission._id}
                          sx={{
                            ...(isSpecial && { gridColumn: 'span 2' }),
                          }}
                        >
                          <CardComponent
                            image={
                              mission.banner_path
                                ? `${API_URL}/${mission.banner_path}`
                                : '/assets/images/missions/default.png'
                            }
                            title={mission.title}
                            description={mission.description}
                            progress={mission.progress}
                            reward={mission.reward}
                            onViewDetails={() => handleViewDetails(mission._id)}
                            isLocked={!accessible}
                            status={mission.status}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body1"
                  sx={{ color: '#E0E0E0', textAlign: 'center', width: '100%' }}
                >
                  {t('no_missions_available')}
                </Typography>
              )}
            </Box>
          </Grid>
        )}
      </Grid>

      {selectedMission && (
        <BackendMissionDetails
          missionId={selectedMission}
          open={!!selectedMission}
          onClose={handleClosePopup}
          userLevel={userLevel}
          missionData={missionData}
        />
      )}
    </Stack>
  );
}
