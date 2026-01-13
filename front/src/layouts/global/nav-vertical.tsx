import { useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { useMediaQuery, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import Scrollbar from 'src/components/scrollbar';
import { usePathname, useRouter } from 'src/routes/hooks';
import { NavSectionVertical } from 'src/components/nav-section';
import { useSelector, useDispatch } from 'src/store';
import { ChangePage } from 'src/store/reducers/menu';
import { useLocales } from 'src/locales';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
//
import { HEADER, NAV } from '../config-layout';
//
import SportsCasinoBtnGroup from './sports-casino-btngroup';
//
import themeVars from 'src/assets/scss/_themes-vars.module.scss';
// ----------------------------------------------------------------------

type Props = {
  navData: any;
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, navData, onCloseNav }: Props) {
  const { user } = useMockedUser();
  const { t, currentLang } = useLocales();
  const isSmMobile = useMediaQuery('(max-width:520px)');
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((store) => store.auth);
  const lgUp = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Не показываем дефолтный сайдбар на всех страницах пользователя
  if (pathname.startsWith('/user/')) {
    return null;
  }

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: themeVars.bgMain,
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#24ee89',
          borderRadius: '3px',
        },
      }}
    >
      <Stack sx={{ px: 1, my: 1, gap: 1, alignItems: 'center' }}>
        {isSmMobile && <SportsCasinoBtnGroup fullWidth />}
      </Stack>

      <NavSectionVertical
        data={navData}
        config={{
          currentRole: user?.role || 'admin',
        }}
        sx={{
          px: 1,
        }}
      />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  const renderMobileContent = (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        bgcolor: themeVars.bgMain,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header with close button and logo */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          p: 2,
          borderBottom: '1px solid #2B2F3D',
        }}
      >
        <IconButton
          onClick={onCloseNav}
          sx={{
            color: 'white',
            mr: 2,
          }}
        >
          <Iconify icon="eva:close-fill" width={24} />
        </IconButton>
        
        <Box
          component="img"
          src="/logo/logo.png"
          alt="LuckVerse777"
          sx={{
            height: 40,
            width: 'auto',
          }}
        />
      </Stack>

      {/* Sports/Casino toggle */}
      <Box sx={{ px: 2, py: 2 }}>
        <SportsCasinoBtnGroup fullWidth />
      </Box>

      {/* Navigation sections */}
      <Scrollbar
        sx={{
          flex: 1,
          '& .simplebar-content': {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: themeVars.bgMain,
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#24ee89',
            borderRadius: '3px',
          },
        }}
      >
        <NavSectionVertical
          data={navData}
          config={{
            currentRole: user?.role || 'admin',
          }}
          sx={{
            px: 0,
          }}
        />
      </Scrollbar>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: 120 },
      }}
    >
      {lgUp ? (
        <Stack
          sx={{
            position: 'fixed',
            top: HEADER.H_DESKTOP,
            width: 120,
            height: `calc(100vh - ${HEADER.H_DESKTOP}px)`,
            bgcolor: '#292d2e !important',
            borderRight: '1px solid #2B2F3D',
            zIndex: 1001, // Выше правого меню
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: isSmMobile ? '100vw' : 120,
              height: isSmMobile ? '100vh' : 'auto',
              bgcolor: '#292d2e !important',
              border: 'none',
              zIndex: 1300, // Убеждаемся, что навигационное меню поверх мобильного меню
            },
          }}
          sx={{
            zIndex: 1300, // Убеждаемся, что навигационное меню поверх мобильного меню
            '& .MuiDrawer-paper': {
              width: isSmMobile ? '100vw' : 120,
              height: isSmMobile ? '100vh' : 'auto',
            },
          }}
        >
          {isSmMobile ? renderMobileContent : renderContent}
        </Drawer>
      )}
    </Box>
  );
}
