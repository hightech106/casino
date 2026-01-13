import { useEffect } from 'react';
// @mui
import { List, Paper, Stack, useMediaQuery, useTheme } from '@mui/material';
import Container from '@mui/material/Container';
import { useLocales } from 'src/locales';
import useApi from 'src/hooks/use-api';
import { dispatch, useSelector } from 'src/store';
import { UpdateNotification } from 'src/store/reducers/auth';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';
import NotificationItem from 'src/layouts/_common/notifications-popover/notification-item';

// ----------------------------------------------------------------------

export default function NotificationView() {
  const { t } = useLocales();
  const settings = useSettingsContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { read_notification } = useApi();

  const { notification } = useSelector((store) => store.auth);
  const renderNotificationList = () => {
    if (!notification.length) {
      return (
        <EmptyContent
          title={t('no_data')}
          sx={{
            py: 10,
          }}
        />
      );
    }

    // Both mobile and desktop use the same layout now
    return (
      <Stack spacing={2}>
        {notification.map((row, index) => (
          <Paper key={index} sx={{ bgcolor: '#2B2F3D' }}>
            <NotificationItem notification={row} />
          </Paper>
        ))}
      </Stack>
    );
  };

  const renderList = (
    <Scrollbar>
      {renderNotificationList()}
    </Scrollbar>
  );

  const handleRead = async () => {
    // if (!notification.isUnRead) return;
    const data: any = notification.map((e) => ({ ...e, isUnRead: false }));
    dispatch(UpdateNotification(data));
    await read_notification('all');
  };

  useEffect(() => {
    if (notification.length && notification.some((n) => n.isUnRead === true)) handleRead();
    // eslint-disable-next-line
  }, [notification]);

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <CustomBreadcrumbs
        heading={t('notification')}
        links={[
          {
            name: t('user'),
          },
          {
            name: t('notification'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Stack>
        {renderList}
      </Stack>
    </Container>
  );
}
