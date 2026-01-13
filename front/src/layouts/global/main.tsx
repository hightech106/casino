import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import { Badge, IconButton, Stack } from '@mui/material';
// hooks
import { useSelector } from 'src/store';
import { useRouter, usePathname } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import { useLocales } from 'src/locales';
// components
import Image from 'src/components/image';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
//
import { paths } from 'src/routes/paths';
import { HEADER, NAV } from '../config-layout';
//
import themeVars from 'src/assets/scss/_themes-vars.module.scss';
// ----------------------------------------------------------------------

const SPACING = 8;

type Props = BoxProps;

export default function Main({ children, sx, ...other }: Props) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');
  const router = useRouter();
  const pathname = usePathname();
  const { currentLang } = useLocales();
  const [unReadNoti, setUnReadNoti] = useState<number>(0);
  const { notification, isLoggedIn } = useSelector((store) => store.auth);
  const { headerHide } = useSelector((store) => store.menu);

  const isNavHorizontal = settings.themeLayout === 'horizontal';
  const isNavMini = settings.themeLayout === 'mini';
  
  // Проверяем если это страница профиля
  const isProfilePage = pathname.startsWith('/user/');

  useEffect(() => {
    if (!isLoggedIn || !notification || !notification.length) return;
    const noti = notification.filter((e) => e.isUnRead).length;
    setUnReadNoti(noti);
  }, [isLoggedIn, notification]);

  if (isNavHorizontal) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: 'column',
          pt: `${HEADER.H_MOBILE + 24}px`,
          pb: 10,
          ...(lgUp && {
            pt: `${HEADER.H_MOBILE * 2 + 40}px`,
            pb: 15,
          }),
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        pb: 2,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: themeVars.bgSite,
        pt: headerHide ? 1 : `${HEADER.H_DESKTOP + SPACING}px`,
        height: `fit-content`,
        ...(lgUp && !isProfilePage && {
          // Для обычных страниц - стандартные отступы под левый и правый сайдбар
          width: `calc(100% - ${120 + NAV.W_VERTICAL}px)`, // 120px левый + 380px правый
          marginLeft: '120px', // Отступ для левого сайдбара
          marginRight: `${NAV.W_VERTICAL}px`, // Отступ для правого сайдбара
          paddingLeft: '20px',
          paddingRight: '0px',
        }),
        ...(isNavMini && !isProfilePage && {
          width: `calc(100% - ${NAV.W_MINI + NAV.W_VERTICAL}px)`,
          marginLeft: `${NAV.W_MINI}px`,
          marginRight: `${NAV.W_VERTICAL}px`,
          paddingLeft: '300px',
          paddingRight: '0px',
        }),
        ...sx,
      }}
      {...other}
    >
      {unReadNoti > 0 && (
        <Stack
          sx={{
            p: 0,
            borderRadius: 1.5,
            border: '1px solid #24ee89',
            position: 'sticky',
            bgcolor: themeVars.bgSite,
            top: 150,
            left: '100%',
            width: 'fit-content',
            zIndex: 1101,
          }}
          className="heartbeat"
        >
          <IconButton
            sx={{ p: 0.4 }}
            onClick={() => {
              router.push(`/${currentLang.value}${paths.user.notification}`);
            }}
          >
            <Badge badgeContent={unReadNoti} color="primary">
              <Image src="/assets/images/casino/box.png" width={40} />
            </Badge>
          </IconButton>
        </Stack>
      )}
      <Box mt={unReadNoti > 0 ? -4 : 0}>{children}</Box>
    </Box>
  );
}
