import { m } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Portal from '@mui/material/Portal';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _notifications } from 'src/_mock';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';
import type { INotification } from 'src/types';
//
import NotificationItem from './notification-item';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'all',
    label: 'All',
    count: 22,
  },
  {
    value: 'unread',
    label: 'Unread',
    count: 12,
  },
  {
    value: 'archived',
    label: 'Archived',
    count: 10,
  },
];

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const drawer = useBoolean();

  const smUp = useResponsive('up', 'sm');

  const [currentTab, setCurrentTab] = useState('all');
  const [scrollY, setScrollY] = useState(0);

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  useEffect(() => {
    const updateScrollY = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', updateScrollY, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollY);
  }, []);


  const [notifications, setNotifications] = useState<INotification[]>([]);

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {!!totalUnRead && (
        <Tooltip title="Mark all as read">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderTabs = (
    <Tabs value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
              color={
                (tab.value === 'unread' && 'warning') ||
                (tab.value === 'archived' && 'info') ||
                'default'
              }
              sx={{
                bgcolor: tab.value === currentTab ? '#24ee89' : 'transparent',
                color: tab.value === currentTab ? '#000' : 'inherit',
              }}
            >
              {tab.count}
            </Label>
          }
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
            color: tab.value === currentTab ? '#24ee89' : 'inherit',
          }}
        />
      ))}
    </Tabs>
  );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {notifications.map((notification, index) => (
          <NotificationItem key={index} notification={notification} />
        ))}
      </List>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Portal>
        {drawer.value && (
          <Box
            sx={{
              position: 'absolute',
              right: '20px',
              top: `${80 + scrollY}px`,
              width: 420,
              maxWidth: '90vw',
              height: 'fit-content',
              maxHeight: '80vh',
              bgcolor: '#232626',
              color: '#FFFFFF',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '1px solid #2B2F3D',
              borderRadius: '8px 0 0 8px',
              zIndex: 1200,
              overflow: 'hidden',
              transform: drawer.value ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            {renderHead}

            <Divider sx={{ borderColor: '#2B2F3D' }} />

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ pl: 2.5, pr: 1 }}
            >
              {renderTabs}
              <IconButton 
                onClick={handleMarkAllAsRead}
                sx={{
                  color: '#24ee89',
                  '&:hover': {
                    bgcolor: '#24ee89',
                    color: '#000',
                  },
                }}
              >
                <Iconify icon="solar:settings-bold-duotone" />
              </IconButton>
            </Stack>

            <Divider sx={{ borderColor: '#2B2F3D' }} />

            {renderList}

            <Box sx={{ p: 1 }}>
              <Button 
                fullWidth 
                size="large"
                sx={{
                  bgcolor: '#24ee89',
                  color: '#000',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(180deg, transparent 0%, #24ee89 100%)',
                  },
                }}
              >
                View All
              </Button>
            </Box>
          </Box>
        )}
      </Portal>
    </>
  );
}
