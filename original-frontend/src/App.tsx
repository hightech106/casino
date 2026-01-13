/**
 * Root application component that wraps the entire app with providers and routing.
 * Manages socket connections, authentication state, and global UI settings.
 * Note: Socket connections are authenticated when user logs in and cleaned up on unmount.
 */
// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

// // carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import 'src/assets/css/main.css';
import 'src/assets/css/games.scss';

// ----------------------------------------------------------------------

import { Toaster } from 'react-hot-toast';

// routes
import Router from 'src/routes/sections';
// theme
import ThemeProvider from 'src/theme';
// hooks
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
// components
import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsProvider, SettingsDrawer } from 'src/components/settings';

import { ApiProvider } from './contexts/ApiContext';
import { AuthConsumer } from './utils/authcheck';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <SettingsProvider
      defaultSettings={{
        themeMode: 'dark', // 'light' | 'dark'
        themeDirection: 'ltr', //  'rtl' | 'ltr'
        themeContrast: 'default', // 'default' | 'bold'
        themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
        themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
        themeStretch: false,
      }}
    >
      <ThemeProvider>
        <MotionLazy>
          <SettingsDrawer />
          <ProgressBar />
          <ApiProvider>
            <AuthConsumer>
              <Router />
            </AuthConsumer>
          </ApiProvider>
        </MotionLazy>
      </ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </SettingsProvider>
  );
}
