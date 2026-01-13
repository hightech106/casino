import { matchPath, useLocation } from 'react-router';
import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Badge, ListItemIcon, ListItemText, MenuList } from '@mui/material';
// routes
import useApi from 'src/hooks/use-api';
import { useRouter } from 'src/routes/hooks';
import { useLocales } from 'src/locales';
// store
import { useSelector, useDispatch } from 'src/store';
import { Logout } from 'src/store/reducers/auth';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// routes
import { paths } from 'src/routes/paths';
import { API_URL } from 'src/config-global';
// missions
import { MissionModal } from 'src/sections/user/missions'; // Импортируем MissionsDialog

// ----------------------------------------------------------------------

interface Option {
  label: string;
  icon: string;
  linkTo?: string;
  onClick?: () => void;
  count?: number;
}

export default function AccountPopover() {
  const { t, currentLang } = useLocales();
  const { signout } = useApi();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, unreadSupport, notification } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const isSportsLink = !!matchPath({ path: 'sports' }, pathname);

  const missionsModal = useBoolean(false);
  const popover = usePopover();
  const unReadNote = notification.filter((e) => e.isUnRead).length;

  const OPTIONS: Option[] = [
    {
      label: t('missions'),
      icon: 'mdi:flag-checkered',
      onClick: () => missionsModal.onTrue(),
    },
    {
      label: t('account'),
      linkTo: paths.user.account,
      icon: 'mdi:account-outline',
    },
    {
      label: t('wallet'),
      linkTo: paths.user.wallet,
      icon: 'solar:wallet-outline',
    },
    {
      label: t('myshares'),
      linkTo: paths.user.myshares,
      icon: 'mdi:gift',
    },
    //  {
    //   label: t('mypurchases'),
    //   linkTo: paths.user.mypurchases,
    //   icon: 'mdi:shopping-outline',
    // },
    {
      label: t('notification'),
      linkTo: paths.user.notification,
      icon: 'fluent:alert-snooze-12-filled',
      count: unReadNote,
    },
    {
      label: t('support'),
      linkTo: paths.user.support,
      icon: 'material-symbols:support-agent-sharp',
      count: unreadSupport,
    },
    {
      label: t('my_bets'),
      linkTo: isSportsLink ? paths.user.mybets_sports : paths.user.mybets_casino,
      icon: 'tabler:receipt',
    },
    {
      label: t('ticket'),
      linkTo: paths.user.ticket,
      icon: 'heroicons:ticket-20-solid',
    },
  ];

  const handleLogout = async () => {
    try {
      await signout();
      dispatch(Logout());
      popover.onClose();
      router.replace('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickItem = (path: string) => {
    popover.onClose();
    router.push(`/${currentLang.value}${path}`);
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={
            user.avatar
              ? `${API_URL}/${user.avatar}`
              : 'https://cdn-icons-png.flaticon.com/512/219/219983.png'
          }
          alt={user.username}
          sx={{
            width: 36,
            height: 36,
            border: '0.68px solid #24ee89',
          }}
        >
          {user.username.toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{
          width: 200,
          p: 0,
          bgcolor: '#2B2F3D',
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap sx={{ color: 'white' }}>
            {`${user.username}`}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          <MenuList>
            {OPTIONS.map((option: Option) => {
              const isSelected = option.linkTo && pathname === option.linkTo;
              return (
                <MenuItem
                  key={option.label}
                  onClick={() => {
                    if (option.onClick) {
                      option.onClick();
                      popover.onClose();
                    } else {
                      handleClickItem(option.linkTo!);
                    }
                  }}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      color: '#e7d195',
                      bgcolor: 'transparent',
                    },
                    ...(isSelected && {
                      color: '#e7d195',
                      bgcolor: 'transparent',
                    }),
                    textTransform: 'capitalize',
                  }}
                >
                  <ListItemIcon sx={{ mr: 0 }}>
                    <Iconify icon={option.icon} sx={{ color: isSelected ? '#e7d195' : 'white' }} />
                  </ListItemIcon>
                  <ListItemText>
                    {option.label}{' '}
                    {typeof option.count === 'number' && option.count > 0 && (
                      <Badge badgeContent={option.count} color="error" sx={{ ml: 1.5 }} />
                    )}
                  </ListItemText>
                </MenuItem>
              );
            })}
          </MenuList>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            m: 1,
            fontWeight: 'fontWeightBold',
            color: 'error.main',
            '&:hover': {
              color: '#e7d195',
              bgcolor: 'transparent',
            },
          }}
        >
          {t('logout')}
        </MenuItem>
      </CustomPopover>

      <MissionModal open={missionsModal.value} onClose={missionsModal.onFalse} />
    </>
  );
}
