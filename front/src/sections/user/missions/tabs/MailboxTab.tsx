import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Stack,
  Grid,
  CardMedia,
  Button,
  Badge,
  IconButton,
} from '@mui/material';
import { useResponsive } from 'src/hooks/use-responsive';
import useApi from 'src/hooks/use-api';
import { useSelector, dispatch } from 'src/store';
import { UpdateMissionNotification } from 'src/store/reducers/auth';
import type { INotificationMission } from 'src/types';
import { API_URL } from 'src/config-global';
import Iconify from 'src/components/iconify';

const styles = {
  container: {
    px: { xs: 2, md: 3 },
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    width: 1,
    height: 0.84,
    bgcolor: '#232626',
    // Hide unwanted Box by class (temporary override)
    '& .css-1154ke9': { display: 'none !important' },
    '& .MuiBox-root.css-1154ke9': { display: 'none !important' },
  },
  tabs: {
    overflow: 'visible !important',
    '& .MuiTabs-scroller': {
      overflow: 'visible !important',
    },
    '& .MuiTabs-flexContainer': {
      borderBottom: '1px solid #2B2F3D',
    },
    '& .MuiTab-root': {
      fontSize: { xs: 18, md: 20 },
      fontWeight: 400,
      color: '#A0A3A7',
      fontFamily: 'Impact, sans-serif',
      textTransform: 'uppercase',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
    },
    '& .MuiTab-root.Mui-selected': {
      color: '#24ee89',
    },
    '& .MuiTabs-indicator': {
      mb: -0.25,
      height: 5,
      bgcolor: '#24ee89',
      borderRadius: 0.6,
    },
  },
  badge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#FF0000',
      color: '#FFF',
      fontSize: 10,
      height: 16,
      minWidth: 16,
      borderRadius: '50%',
      padding: '0 4px',
    },
  },
  imageRead: {
    filter: 'grayscale(100%)',
    opacity: 0.6,
  },
  imageUnread: {
    filter: 'none',
    opacity: 1,
  },
  noMessagesContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    px: 2,
    py: 4,
  },
  noMessagesBox: {
    background: 'linear-gradient(90deg, #142214 0%, #2B2004 100%)',
    border: '1px solid #786023',
    borderRadius: 0.6,
    boxShadow: '0 0 10px rgba(202, 174, 81, 0.2)',
    px: 3,
    py: 2,
    textAlign: 'center',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  noMessagesText: {
    color: '#CAAE51',
    fontFamily: 'Impact, sans-serif',
    fontSize: { xs: 18, md: 20 }, // Increased font size for no messages text
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: 1,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  messagesCount: {
    color: '#FFF',
    fontSize: { xs: 20, md: 22 }, // Increased font size for messages count
    fontWeight: 700,
    fontFamily: 'Cera Pro, sans-serif',
  },
};

const preventDefaultInteractions = (e: React.SyntheticEvent) => {
  e.preventDefault();
};

export default function MailboxTab() {
  // Changed breakpoint from 960 to 1024 to extend mobile layout up to 1024px
  const tabletDown = useResponsive('down', 1024);
  const { get_notification_mission, read_notification_mission } = useApi();
  const { missionNotifications } = useSelector((store) => store.auth);
  const [tab, setTab] = useState<'all'>('all');
  const [activeMail, setActiveMail] = useState<string>('');

  const unreadCount = missionNotifications?.filter((item) => item.isUnRead).length || 0;

  const handleTabChange = (event: SyntheticEvent, newValue: 'all') => {
    setTab(newValue);
  };

  const handleOpenNotification = async (id: string) => {
    setActiveMail(id);
    const notificationItem = missionNotifications?.find((n) => n._id === id);
    if (notificationItem && notificationItem.isUnRead) {
      try {
        await read_notification_mission(id);
        const updatedNotifications =
          missionNotifications?.map((n) => (n._id === id ? { ...n, isUnRead: false } : n)) || [];
        // @ts-ignore
        dispatch(UpdateMissionNotification(updatedNotifications));
      } catch (error) {
        console.error('Failed to mark mission notification as read:', error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await read_notification_mission('all');
      const updatedNotifications =
        missionNotifications?.map((n) => ({ ...n, isUnRead: false })) || [];
      // @ts-ignore
      dispatch(UpdateMissionNotification(updatedNotifications));
    } catch (error) {
      console.error('Failed to mark all mission notifications as read:', error);
    }
  };

  const handleRefreshNotifications = async () => {
    try {
      const res = await get_notification_mission();
      if (res?.data) {
        const sortedNotifications = res.data.sort(
          (a: INotificationMission, b: INotificationMission) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // @ts-ignore
        dispatch(UpdateMissionNotification(sortedNotifications));
      }
    } catch (error) {
      console.error('Failed to refresh mission notifications:', error);
    }
  };

  const handleBackToList = () => {
    setActiveMail('');
  };

  const renderNav = (
    <Stack borderRight={{ xs: 'none', lg: '1px solid #2B2F3D' }} height={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
        <Badge badgeContent={unreadCount} sx={styles.badge} showZero />
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton
            onClick={handleRefreshNotifications}
            sx={{ color: '#24ee89', width: 48, height: 48 }}
          >
            <Iconify icon="mdi:refresh" width={24} height={24} />
          </IconButton>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleMarkAllAsRead}
            sx={{ borderColor: '#24ee89', color: '#24ee89', ml: 2, px: { xs: 1, md: 2 } }}
          >
            Mark all as read
          </Button>
        </Stack>
      </Stack>
      {missionNotifications && missionNotifications.length > 0 ? (
        missionNotifications.map((item) => (
          <Stack
            key={item._id}
            direction="row"
            alignItems="center"
            gap={1}
            py={2}
            borderBottom="1px solid #2B2F3D"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleOpenNotification(item._id)}
          >
            <Box p={1.3} borderRadius={0.6} bgcolor="#2B2F3D" border="1px solid #232626">
              <CardMedia
                component="img"
                image={
                  item.banner_path
                    ? `${API_URL}/${item.banner_path}`
                    : '/assets/icons/missions/h-missions.png'
                }
                alt="mission"
                sx={{
                  width: { xs: 36, lg: 41 },
                  aspectRatio: '1/1',
                  objectFit: 'contain',
                  ...(item.isUnRead ? styles.imageUnread : styles.imageRead),
                }}
              />
            </Box>
            <Stack>
              <Typography
                sx={{
                  color: '#A0A3A7',
                  fontSize: { xs: 12, lg: 14 },
                  fontFamily: 'Cera Pro, sans-serif',
                  fontWeight: 400,
                }}
              >
                {new Date(item.createdAt).toLocaleDateString()}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 14, lg: 16 },
                  fontFamily: 'Cera Pro, sans-serif',
                  fontWeight: 400,
                  color: item.isUnRead ? '#FFF' : '#A0A3A7',
                }}
              >
                {item.title}
              </Typography>
            </Stack>
          </Stack>
        ))
      ) : null}
    </Stack>
  );

  const renderContent = (
    <Stack>
      {tabletDown && (
        <Stack direction="row" alignItems="center" p={1} pl={0.5}>
          <IconButton
            onClick={handleBackToList}
            sx={{
              color: '#24ee89',
              width: 48,
              height: 48,
              ml: -0.5,
            }}
          >
            <Iconify icon="mdi:arrow-left" width={24} height={24} />
          </IconButton>
          <Typography
            sx={{
              color: '#24ee89',
              fontSize: { xs: 16, lg: 18 },
              fontFamily: 'Impact, sans-serif',
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Back to List
          </Typography>
        </Stack>
      )}
      {missionNotifications && missionNotifications.length > 0 ? (
        missionNotifications
          .filter((item) => item._id === activeMail)
          .map((item) => (
            <Stack key={item._id}>
              <Stack direction="row" alignItems="center" gap={1}>
                <Box p={1.3} borderRadius={0.6} bgcolor="#2B2F3D" border="1px solid #232626">
                  <CardMedia
                    component="img"
                    image={
                      item.banner_path
                        ? `${API_URL}/${item.banner_path}`
                        : '/assets/icons/missions/h-missions.png'
                    }
                    alt="mission"
                    sx={{
                      width: { xs: 36, lg: 41 },
                      aspectRatio: '1/1',
                      objectFit: 'contain',
                      ...(item.isUnRead ? styles.imageUnread : styles.imageRead),
                    }}
                  />
                </Box>
                <Stack>
                  <Typography
                    sx={{
                      color: '#A0A3A7',
                      fontSize: { xs: 12, lg: 14 },
                      fontFamily: 'Cera Pro, sans-serif',
                      fontWeight: 400,
                    }}
                  >
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: 14, lg: 16 },
                      fontFamily: 'Cera Pro, sans-serif',
                      fontWeight: 400,
                      color: item.isUnRead ? '#FFF' : '#A0A3A7',
                    }}
                  >
                    {item.title}
                  </Typography>
                </Stack>
              </Stack>
              <Stack py={2} borderBottom="1px solid #2B2F3D">
                <Typography
                  sx={{
                    fontSize: { xs: 14, lg: 16 },
                    fontFamily: 'Cera Pro, sans-serif',
                    fontWeight: 400,
                    maxWidth: { xs: '100%', lg: 500 },
                    color: item.isUnRead ? '#FFF' : '#A0A3A7',
                  }}
                >
                  {item.description}
                </Typography>
              </Stack>
            </Stack>
          ))
      ) : (
        <Typography sx={{ p: 2, color: '#A0A3A7', fontSize: { xs: 14, lg: 16 } }}>
          Select a notification to view details
        </Typography>
      )}
    </Stack>
  );

  return (
    <Stack sx={styles.container}>
      <Grid container>
        <Grid item xs={12} lg={4}>
          <Tabs value={tab} onChange={handleTabChange} sx={styles.tabs}>
            <Tab value="all" label="All" />
          </Tabs>
        </Grid>
      </Grid>

      {!tabletDown && (
        <Grid container height={0.92}>
          <Grid item xs={12} lg={4}>
            {renderNav}
          </Grid>
          <Grid item xs={12} lg={8} p={2} bgcolor="#232626">
            {activeMail ? (
              renderContent
            ) : (
              <Typography sx={{ fontSize: { xs: 14, lg: 16 }, color: '#A0A3A7' }}>
                Select a notification to view details
              </Typography>
            )}
          </Grid>
        </Grid>
      )}

      {tabletDown && <Stack py={1}>{activeMail ? renderContent : renderNav}</Stack>}
    </Stack>
  );
}