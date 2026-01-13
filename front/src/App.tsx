/**
 * Main application component that wraps the entire app with providers and handles routing.
 * Manages URL parameter parsing for affiliate tracking, bet IDs, and authentication flows.
 * Note: Socket connections are authenticated when user logs in, and URL params can trigger navigation changes.
 */
import Box from '@mui/material/Box';
// i18n
import 'src/locales/i18n';

// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// lightbox
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

import 'src/assets/css/main.css';
import 'src/assets/scss/sportsicon.scss';

// ----------------------------------------------------------------------
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Toaster } from 'react-hot-toast';
// routes
import Router from 'src/routes/sections';
// theme
import ThemeProvider from 'src/theme';
// locales
import { LocalizationProvider } from 'src/locales';
// hooks
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
// store
import { useDispatch, useSelector } from 'src/store';
import { ChangePage } from 'src/store/reducers/menu';
import { SetBetsId, SetClickId, SetCode, SetUsernameAffiliate } from 'src/store/reducers/auth';

// components
import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsProvider, SettingsDrawer } from 'src/components/settings';
import { ApiProvider } from 'src/contexts/ApiContext';
import { AuthConsumer } from 'src/utils/authcheck';
import { authenticateSockets, sockets } from 'src/utils/socket';
import axios from 'src/utils/axios';
import { API_PATH } from './config-global';

//
import themeVars from 'src/assets/scss/_themes-vars.module.scss';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isLoggedIn, token } = useSelector((store) => store.auth);

  const openSms = async (id: string) => {
    await axios.post(API_PATH.OPEN_SMS, { id });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!isLoggedIn) {
      const c: any = params.get('c');
      if (c) {
        dispatch(SetCode(c));
        dispatch(ChangePage('register'));
        return;
      }

      const signup: any = params.get('sign');
      if (signup) {
        dispatch(ChangePage('register'));
        return;
      }
    }

    const b: any = params.get('b');
    if (b) {
      dispatch(SetBetsId(b));
      dispatch(ChangePage('bets'));
    }

    const sms: any = params.get('sms');
    if (sms)
      openSms(sms);

    // affiliate
    const clickid: any = params.get('clickid');
    if (clickid) {
      dispatch(SetClickId(clickid));
    }

    const username_affiliate: any = params.get('username_affiliate');
    if (username_affiliate) {
      dispatch(SetUsernameAffiliate(username_affiliate));
    }
  }, [pathname, isLoggedIn, dispatch]);

  /* eslint-disable */
  useEffect(() => {
    if (!sockets.length) return;

    // Set up connection/disconnection listeners (only once)
    sockets.forEach((socket, index) => {
      // Remove existing listeners to avoid duplicates
      socket.off('connect');
      socket.off('disconnect');
      
      socket.on('connect', () => {
        console.log('Socket server connected...', index);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket server disconnected from client', index, 'reason:', reason);
      });
    });

    // Don't close sockets on cleanup - Socket.IO handles reconnection automatically
    // Only close on actual app unmount (which shouldn't happen in SPA)
    return () => {
      // Only close if we're actually unmounting the entire app
      // Socket.IO will handle reconnection automatically
      console.log('[App] Cleanup: Keeping sockets alive for reconnection');
    };
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    if (isLoggedIn && token) authenticateSockets(token);
  }, [isLoggedIn, token]);

  /* eslint-enable */

  return (
    <Box sx={{ backgroundColor: themeVars.bgSite, minHeight: '100vh' }}>
      <LocalizationProvider>
        <SettingsProvider
          defaultSettings={{
            themeMode: 'dark',
            themeDirection: 'ltr',
            themeContrast: 'default',
            themeLayout: 'vertical',
            themeColorPresets: 'default',
            themeStretch: false,
          }}
        >
          <ThemeProvider>
            <MotionLazy>
              <SnackbarProvider>
                <SettingsDrawer />
                <ProgressBar />
                <ApiProvider>
                  <AuthConsumer>
                    <Router />
                  </AuthConsumer>
                </ApiProvider>
              </SnackbarProvider>
            </MotionLazy>
          </ThemeProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
          />
        </SettingsProvider>
      </LocalizationProvider>
    </Box>
  );
}