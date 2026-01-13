import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
// @mui
import Box from '@mui/material/Box';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSelector } from 'src/store';
// components
import { useSettingsContext } from 'src/components/settings';
import Scrollbar from 'src/components/scrollbar';

//
import Main from '../global/main';
import Header from '../global/header';
import Footer from '../global/footer';
import NavMini from '../global/nav-mini';
import NavVertical from '../global/nav-vertical';
import NavVerticalRight from '../global/nav-vertical-right';
import NavHorizontal from '../global/nav-horizontal';
import Auth from '../auth';
import { useNavData } from './casino-navigation';
import MobileMenu from '../global/mobile-menu';

//
import themeVars from 'src/assets/scss/_themes-vars.module.scss';
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function CasinoLayout({ children }: Props) {
  const settings = useSettingsContext();

  const { isLoggedIn } = useSelector((store) => store.auth);

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const navData = useNavData();

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini navData={navData} />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = (
    <NavVertical navData={navData} openNav={nav.value} onCloseNav={nav.onFalse} />
  );

  const renderNavVerticalRight = <NavVerticalRight />;

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}
        {lgUp && renderNavVerticalRight}

        <Main sx={{ backgroundColor: themeVars.bgSite }}>{children}</Main>
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            backgroundColor: '#040807',
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}
          <Main>{children}</Main>
          {lgUp && renderNavVerticalRight}
        </Box>
        <Footer />
        {isMobile && <MobileMenu />}
      </>
    );
  }

  return (
    <>
      <Scrollbar>
        <Header onOpenNav={nav.onTrue} />
        <Auth />
        <Box
          sx={{
            minHeight: 1,
            backgroundColor: '#040807',
          }}
        >
          {renderNavVertical}
          <Main>{children}</Main>
          {lgUp && renderNavVerticalRight}
        </Box>
        <Footer />
        {isMobile && <MobileMenu />}
      </Scrollbar>
    </>
  );
}
