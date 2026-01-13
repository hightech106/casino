// @mui
import Box from '@mui/material/Box';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSettingsContext } from 'src/components/settings';
import Scrollbar from 'src/components/scrollbar';
//
import Auth from '../auth';
import Main from '../global/main';
import Header from '../global/header';
import Footer from '../global/footer';
import NavVerticalRight from '../global/nav-vertical-right';
import { ProfileNavVertical, ProfileNavHorizontal } from '../profile';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function UserLayout({ children }: Props) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderProfileNavVertical = (
    <ProfileNavVertical openNav={nav.value} onCloseNav={nav.onFalse} />
  );

  const renderNavVerticalRight = <NavVerticalRight />;

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />
        <ProfileNavHorizontal />

        {renderProfileNavVertical}

        <Main sx={{ 
          ...(lgUp && {
            width: 'auto',
            marginLeft: '100px', // 300px ширина сайдбара + 20px отступ
            marginRight: '10px', 
            paddingLeft: '20px',
            paddingRight: '10px',
          }),
          // На мобильных экранах контент должен начинаться сразу без отступов
          ...(!lgUp && {
            marginLeft: 0,
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '80px', // Отступ для горизонтального меню
          }),
        }}>{children}</Main>
        <Box sx={{ 
          ...(lgUp && {
            marginLeft: '100px', // 300px ширина сайдбара + 20px отступ
            marginRight: '10px', 
            paddingLeft: '0px',
            paddingRight: '10px',
          }),
          ...(!lgUp && {
            marginLeft: 0,
            paddingLeft: '16px',
            paddingRight: '16px',
          }),
        }}>
          <Footer />
        </Box>
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />
        <ProfileNavHorizontal />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {renderProfileNavVertical}
          {lgUp && renderNavVerticalRight}

          <Main sx={{ 
            ...(lgUp && {
              width: 'auto',
              marginLeft: '100px', // 300px ширина сайдбара + 20px отступ
              marginRight: '10px', 
              paddingLeft: '20px',
              paddingRight: '10px',
            }),
            // На мобильных экранах контент должен начинаться сразу без отступов
            ...(!lgUp && {
              marginLeft: 0,
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingTop: '80px', // Отступ для горизонтального меню
            }),
          }}>{children}</Main>
        </Box>
        <Box sx={{ 
          ...(lgUp && {
            marginLeft: '100px', // 300px ширина сайдбара + 20px отступ
            marginRight: '10px', 
            paddingLeft: '20px',
            paddingRight: '10px',
          }),
          ...(!lgUp && {
            marginLeft: 0,
            paddingLeft: '16px',
            paddingRight: '16px',
          }),
        }}>
          <Footer />
        </Box>
      </>
    );
  }

  return (
    <>
      <Scrollbar>
        <Header onOpenNav={nav.onTrue} />
        <ProfileNavHorizontal />
        <Auth />
        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {renderProfileNavVertical}
          {lgUp && renderNavVerticalRight}

          <Main sx={{ 
            ...(lgUp && {
              width: 'auto',
              marginLeft: '100px', // 300px ширина сайдбара + 20px отступ
              marginRight: '10px', 
              paddingLeft: '20px',
              paddingRight: '10px',
            }),
            // На мобильных экранах контент должен начинаться сразу без отступов
            ...(!lgUp && {
              marginLeft: 0,
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingTop: '80px', // Отступ для горизонтального меню
            }),
          }}>{children}</Main>
        </Box>
        <Box sx={{ 
          ...(lgUp && {
            marginLeft: '100px', // 300px ширина сайдбара + 20px отступ
            marginRight: '10px', 
            paddingLeft: '20px',
            paddingRight: '10px',
          }),
          ...(!lgUp && {
            marginLeft: 0,
            paddingLeft: '16px',
            paddingRight: '16px',
          }),
        }}>
          <Footer />
        </Box>
      </Scrollbar>
    </>
  );
}
