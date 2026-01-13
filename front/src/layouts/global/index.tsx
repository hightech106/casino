import { isMobile } from 'react-device-detect';

// components
import Scrollbar from 'src/components/scrollbar';
//
import Main from './main';
import Header from './header';
import Footer from './footer';
import Auth from '../auth';
import MobileMenu from './mobile-menu';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GlobalLayout({ children }: Props) {

  // const isHorizontal = settings.themeLayout === 'horizontal';

  // const isMini = settings.themeLayout === 'mini';

  return (
    <>
      <Header />
      <Auth />
      <Main sx={{ width: 1 }}>{children}</Main>
      <Footer />
      {isMobile && <MobileMenu />}
    </>
  );
}
