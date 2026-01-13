// @mui
import Box from '@mui/material/Box';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSettingsContext } from 'src/components/settings';
import Scrollbar from 'src/components/scrollbar';
//
import { NAV } from '../config-layout';
import Auth from '../auth';
import Main from '../global/main';
import Header from '../global/header';
import Footer from '../global/footer';
import NavMini from '../global/nav-mini';
import NavVertical from '../global/nav-vertical';
import NavHorizontal from '../global/nav-horizontal';
import { useNavData } from './user-navigation';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ProfileLayout({ children }: Props) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const navData = useNavData();

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  // @ts-ignore
  const renderNavMini = <NavMini navData={navData} />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = (
    <NavVertical navData={navData} openNav={nav.value} onCloseNav={nav.onFalse} />
  );

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main sx={{ width: `calc(100% - 300px)`, marginLeft: '300px' }}>{children}</Main>
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
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main
            sx={{
              width: `calc(100% - 300px)`,
              marginLeft: '300px',
            }}
          >
            {children}
          </Main>
        </Box>
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
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {renderNavVertical}

          <Main
            sx={{
              width: `calc(100% - 300px)`,
              marginLeft: '300px',
            }}
          >
            {children}
          </Main>
        </Box>
        <Footer />
      </Scrollbar>
    </>
  );
}
