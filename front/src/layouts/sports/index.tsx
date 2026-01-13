import { memo, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { matchPath, useLocation } from 'react-router';
// @mui
import Box from '@mui/material/Box';
// hooks
import { useSelector } from 'src/store';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSettingsContext } from 'src/components/settings';
import { useLocales } from 'src/locales';
//
import Main from '../global/main';
import Header from '../global/header';
import Footer from '../global/footer';
import NavMini from '../global/nav-mini';
import NavVertical from '../global/nav-vertical';
import NavVerticalRight from '../global/nav-vertical-right';
import NavHorizontal from '../global/nav-horizontal';
import NavBetSlip from './betslip';
import Auth from '../auth';
import { useNavData } from './sports-navigation';
import MobileMenu from '../global/mobile-menu';
import SportsLeftbar from './sports-leftbar';
import MobileBetSlipButton from './components/MobileBetSlipButton';

// ----------------------------------------------------------------------

const RootStyle = {
  minHeight: 1,
  display: 'flex',
  flexDirection: { xs: 'column', lg: 'row' },
  bgcolor: "background.default",
};

// ----------------------------------------------------------------------

interface SportsLayoutProps {
  children: React.ReactNode;
}

const SportsLayout = ({ children }: SportsLayoutProps) => {
  const settings = useSettingsContext();
  const lgUp = useResponsive('up', 'lg');
  const { pathname } = useLocation();
  const { currentLang } = useLocales();
  const nav = useBoolean();
  const betSlipNav = useBoolean();
  const navData = useNavData();
  const { bet_slips } = useSelector((store) => store.sports);

  const isSportsLink = useMemo(
    () => !!matchPath({ path: `${currentLang.value}/sports`, end: false }, pathname),
    [currentLang.value, pathname]
  );

  const layoutConfig = useMemo(
    () => ({
      isHorizontal: settings.themeLayout === 'horizontal',
      isMini: settings.themeLayout === 'mini',
      showBetSlip: isSportsLink, // Always show bet slip on sports pages
    }),
    [settings.themeLayout, isSportsLink]
  );

  const renderNavigation = useMemo(() => {
    if (layoutConfig.isHorizontal) {
      return lgUp ? <NavHorizontal /> : <NavVertical navData={navData} openNav={nav.value} onCloseNav={nav.onFalse} />;
    }

    if (layoutConfig.isMini) {
      return lgUp ? <NavMini navData={navData} /> : <NavVertical navData={navData} openNav={nav.value} onCloseNav={nav.onFalse} />;
    }

    // Use the new sports leftbar for sports pages
    if (isSportsLink) {
      return lgUp ? <SportsLeftbar /> : <SportsLeftbar openNav={nav.value} onCloseNav={nav.onFalse} />;
    }

    return <NavVertical navData={navData} openNav={nav.value} onCloseNav={nav.onFalse} />;
  }, [layoutConfig.isHorizontal, layoutConfig.isMini, lgUp, navData, nav.value, nav.onFalse, isSportsLink]);

  const renderRightNavigation = useMemo(() => {
    // For sports pages, always show bet slip instead of regular right navigation
    if (isSportsLink) {
      return <NavBetSlip openNav={betSlipNav.value} onCloseNav={betSlipNav.onFalse} />;
    }
    return lgUp ? <NavVerticalRight /> : null;
  }, [lgUp, isSportsLink, betSlipNav.value, betSlipNav.onFalse]);

  const renderContent = () => {
    if (layoutConfig.isHorizontal) {
      return (
        <>
          <Header onOpenNav={nav.onTrue} />
          {renderNavigation}
          <Main sx={{ 
            ml: { xs: 0, lg: lgUp && isSportsLink ? '280px' : 0 },
            mr: { xs: 0, lg: lgUp && isSportsLink ? '400px' : 0 },
            transition: 'margin-left 0.3s ease, margin-right 0.3s ease',
            minHeight: { xs: 'calc(100vh - 160px)', lg: 'calc(100vh - 80px)' }, // Account for mobile menu
            bgcolor: 'background.default',
            width: { 
              xs: '100%', 
              lg: lgUp && isSportsLink ? 'calc(100vw - 280px - 400px)' : '100%' 
            },
            // Better mobile spacing
            pb: { xs: 0, lg: 0 }, // Space for mobile menu
            overflow: { xs: 'auto', lg: 'visible' },
            // Smooth scrolling on mobile
            WebkitOverflowScrolling: 'touch',
          }}>{children}</Main>
          {renderRightNavigation}
          <Footer />
        </>
      );
    }

    return (
      <>
        <Header onOpenNav={nav.onTrue} />
        <Auth />
        <Box sx={RootStyle} >
          {renderNavigation}
          <Main sx={{ 
            ml: { xs: 0, lg: lgUp && isSportsLink ? '280px' : 0 },
            mr: { xs: 0, lg: lgUp && isSportsLink ? '400px' : 0 },
            transition: 'margin-left 0.3s ease, margin-right 0.3s ease',
            minHeight: { xs: 'calc(100vh - 160px)', lg: 'calc(100vh - 80px)' }, // Account for mobile menu
            bgcolor: 'background.default',
            width: { 
              xs: '100%', 
              lg: lgUp && isSportsLink ? 'calc(100vw - 280px - 400px)' : '100%' 
            },
            // Better mobile spacing
            pb: { xs: 0, lg: 0 }, // Space for mobile menu
            overflow: { xs: 'auto', lg: 'visible' },
            // Smooth scrolling on mobile
            WebkitOverflowScrolling: 'touch',
          }}>{children}</Main>
          {renderRightNavigation}
        </Box>
        <Footer />
        {isMobile && <MobileMenu />}
        {isMobile && isSportsLink && <MobileBetSlipButton onOpenBetSlip={betSlipNav.onTrue} />}
      </>
    );
  };

  return renderContent();
};

export default memo(SportsLayout);
