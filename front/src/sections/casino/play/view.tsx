import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Box, Button, Card, IconButton, Stack, styled, keyframes } from '@mui/material';
import { useLocales } from 'src/locales';
import useApi from 'src/hooks/use-api';
import { dispatch, useSelector } from 'src/store';
import { ChangePage, hideHeader } from 'src/store/reducers/menu';
import { HEADER } from 'src/layouts/config-layout';
import { useParams } from 'src/routes/hooks';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { LoadingScreen, SplashScreen } from 'src/components/loading-screen';
import Iconify from 'src/components/iconify';

// Анимации
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(138, 43, 226, 0.7); }
  50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(138, 43, 226, 0.3); }
  100% { transform: scale(1); box-shadow: 0 0 0 20px #24ee89; }
`;

const glitch = keyframes`
  0%, 100% { transform: translate(0); }
  10% { transform: translate(-2px, 2px); }
  20% { transform: translate(2px, -2px); }
  30% { transform: translate(-2px, -2px); }
  40% { transform: translate(2px, 2px); }
  50% { transform: translate(-2px, 2px); }
  60% { transform: translate(2px, -2px); }
  70% { transform: translate(-2px, -2px); }
  80% { transform: translate(2px, 2px); }
  90% { transform: translate(-2px, 2px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const borderGlow = keyframes`
  0%, 100% { border-color: #24ee89; box-shadow: 0 0 5px #24ee89; }
  50% { border-color: #FF6B35; box-shadow: 0 0 20px #FF6B35, 0 0 30px #FF6B35; }
`;

// Футуристические кнопки
const FuturisticPlayButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  background: `linear-gradient(45deg, #24ee89 0%, #FFF700 50%, #24ee89 100%)`,
  color: '#050514',
  border: '2px solid transparent',
  borderRadius: '12px',
  padding: '16px 32px',
  fontSize: '18px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  animation: `${pulse} 2s infinite`,
  fontFamily: '"Impact", "CircularStd", sans-serif',
  transform: 'skewX(-5deg)',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
    transition: 'left 0.5s',
  },
  
  '&:hover': {
    transform: 'skewX(-5deg) scale(1.1)',
    background: `linear-gradient(45deg, #24ee89 0%, #FF6B35 50%, #24ee89 100%)`,
    animation: `${glitch} 0.3s ease-in-out, ${pulse} 1s infinite`,
    boxShadow: `
      0 0 20px rgba(138, 43, 226, 0.8),
      0 0 40px rgba(138, 43, 226, 0.6),
      0 0 60px rgba(138, 43, 226, 0.4),
      inset 0 0 10px rgba(0,0,0,0.1)
    `,
    
    '&::before': {
      left: '100%',
    },
  },
  
  '&:active': {
    transform: 'skewX(-5deg) scale(0.98)',
  },
}));

const FuturisticDemoButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  background: `linear-gradient(45deg, #2B2F3D 0%, #232626 50%, #2B2F3D 100%)`,
  color: '#24ee89',
  border: '2px solid #24ee89',
  borderRadius: '12px',
  padding: '16px 32px',
  fontSize: '18px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  fontFamily: '"Impact", "CircularStd", sans-serif',
  transform: 'skewX(-5deg)',
  animation: `${borderGlow} 3s infinite`,
  
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, transparent 30%, rgba(255,231,26,0.1) 50%, transparent 70%)`,
    backgroundSize: '200% 200%',
    animation: `${shimmer} 2s infinite`,
    pointerEvents: 'none',
  },
  
  '&:hover': {
    transform: 'skewX(-5deg) scale(1.1)',
    background: `linear-gradient(45deg, #24ee89 0%, #FFF700 50%, #24ee89 100%)`,
    color: '#050514',
    borderColor: '#FF6B35',
    boxShadow: `
      0 0 20px rgba(138, 43, 226, 0.8),
      0 0 40px rgba(255, 107, 53, 0.6)
    `,
  },
  
  '&:disabled': {
    background: `linear-gradient(45deg, #555 0%, #333 50%, #555 100%)`,
    color: '#888',
    border: '2px solid #555',
    animation: 'none',
    transform: 'skewX(-5deg) scale(0.9)',
    opacity: 0.5,
    
    '&::after': {
      display: 'none',
    },
  },
}));

// Анимированный фон
const AnimatedBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `
    radial-gradient(circle at 20% 50%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 20%, rgba(25, 25, 55, 0.8) 0%, transparent 50%)
  `,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(138, 43, 226, 0.03) 2px,
        rgba(138, 43, 226, 0.03) 4px
      )
    `,
    animation: `${shimmer} 4s linear infinite`,
  },
});

export default function CasinoPlayView() {
  useScrollToTop();
  const { t } = useLocales();
  const { get_casino_game, get_casino_url, get_casino_demo_url } = useApi();
  const { isLoggedIn, currency } = useSelector((store) => store.auth);
  const headerHide = useSelector((store) => store.menu.headerHide);
  const { provider_code, game_code } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);
  const [gameUrl, setGameUrl] = useState<string>('');
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [isDisableFunMode, setIsDisableFunMode] = useState<boolean>(false);

  const playGame = async () => {
    if (!isLoggedIn) {
      dispatch(ChangePage('login'));
      return;
    }
    if (!provider_code || !game_code) return;
    setLoading(true);
    setSelected(true);
    const res = await get_casino_url({ provider_code, game_code, currency: currency.symbol });
    setLoading(false);
    if (!res?.data) return;
    setGameUrl(res.data);
  };

  const playDemoGame = async () => {
    if (!provider_code || !game_code) return;
    setLoading(true);
    setSelected(true);
    const res = await get_casino_demo_url(game_code);
    setLoading(false);
    if (!res?.data) return;
    setGameUrl(res.data);
  };

  const getGame = useCallback(async () => {
    if (!game_code) return;
    setLoading(true);
    const res = await get_casino_game(game_code);
    setLoading(false);
    if (!res?.data) return;
    setIsDisableFunMode(!res.data.details.fun_mode);
  }, [game_code, get_casino_game]);

  useEffect(() => {
    getGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game_code]);

  // Обработчик клавиши Escape для выхода из полноэкранного режима
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullScreen) {
        setFullScreen(false);
        dispatch(hideHeader(false));
      }
    };

    if (fullScreen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Предотвращаем скролл страницы в полноэкранном режиме
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [fullScreen]);

  const onChangeScreen = () => {
    const newFullScreenState = !fullScreen;
    setFullScreen(newFullScreenState);
    
    // Управление заголовком для всех устройств
    dispatch(hideHeader(newFullScreenState));
  };

  if (loading) return <LoadingScreen sx={{ height: '70vh' }} />;

  const height = headerHide ? '83vh' : '64vh';

  return (
    <Stack justifyContent="center" alignItems="center" position="relative">
      {!selected ? (
        <Stack
          component={Card}
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="center"
          alignItems="center"
          sx={{
            width: 1,
            height: { xs: '77vh', sm: isMobile ? height : `80vh` },
            border: '2px solid #24ee89',
            borderRadius: 2,
            gap: { xs: 3, sm: 4 },
            bgcolor: '#232626',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `
              0 0 30px rgba(138, 43, 226, 0.3),
              inset 0 0 50px rgba(138, 43, 226, 0.1)
            `,
          }}
        >
          <AnimatedBackground />
          
          {/* Декоративные элементы */}
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              width: 60,
              height: 60,
              border: '2px solid #24ee89',
              borderRadius: '50%',
              opacity: 0.3,
              animation: `${pulse} 3s infinite`,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              width: 40,
              height: 40,
              border: '2px solid #FF6B35',
              transform: 'rotate(45deg)',
              opacity: 0.3,
              animation: `${borderGlow} 2s infinite`,
            }}
          />
          
          {/* Gaming Mode Header */}
          <Box
            sx={{
              position: 'absolute',
              top: 30,
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#24ee89',
              fontSize: { xs: '18px', sm: '24px' },
              fontWeight: 'bold',
              fontFamily: '"Impact", "CircularStd", sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: '0 0 10px rgba(138, 43, 226, 0.8)',
              animation: `${shimmer} 2s infinite`,
            }}
          >
            ⚡ SELECT GAME MODE ⚡
          </Box>
          
          <FuturisticPlayButton
            startIcon={
              <Iconify 
                icon="ph:play-fill" 
                sx={{ 
                  fontSize: 24,
                  filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))',
                }} 
              />
            }
            onClick={playGame}
          >
            {t('real_play')}
          </FuturisticPlayButton>
          
          <FuturisticDemoButton
            startIcon={
              <Iconify 
                icon="solar:emoji-funny-circle-bold" 
                sx={{ 
                  fontSize: 24,
                  filter: 'drop-shadow(0 0 5px rgba(138, 43, 226, 0.8))',
                }} 
              />
            }
            onClick={playDemoGame}
            disabled={isDisableFunMode}
          >
            🎮 {t('demo_play')}
          </FuturisticDemoButton>
        </Stack>
      ) : (
        <Box
          sx={{
            width: 1,
            height: { xs: '77vh', sm: isMobile ? height : `80vh` },
            ...(fullScreen && {
              position: 'fixed',
              width: '100vw',
              height: '100vh',
              left: 0,
              top: 0,
              zIndex: 1300,
              backgroundColor: '#000',
            }),
          }}
        >
          <Stack
            sx={{
              top: fullScreen ? 16 : 0,
              right: fullScreen ? 16 : 'auto',
              left: fullScreen ? 'auto' : 0,
              zIndex: 1301,
              position: 'absolute',
            }}
          >
            <IconButton
              onClick={onChangeScreen}
              sx={{
                background: fullScreen 
                  ? `linear-gradient(45deg, #FF6B35 0%, #24ee89 100%)`
                  : `linear-gradient(45deg, #24ee89 0%, #FFF700 100%)`,
                color: '#050514',
                border: '2px solid #FF6B35',
                borderRadius: '12px',
                width: 56,
                height: 56,
                boxShadow: fullScreen 
                  ? '0 0 30px rgba(255, 107, 53, 0.8)'
                  : '0 0 20px rgba(138, 43, 226, 0.6)',
                transition: 'all 0.3s ease',
                animation: fullScreen ? 'none' : `${pulse} 3s infinite`,
                
                '&:hover': {
                  transform: 'scale(1.1) rotate(5deg)',
                  background: `linear-gradient(45deg, #FF6B35 0%, #24ee89 100%)`,
                  boxShadow: '0 0 30px rgba(255, 107, 53, 0.8)',
                  animation: `${glitch} 0.2s ease-in-out`,
                },
              }}
            >
              <Iconify
                icon={fullScreen ? 'ant-design:fullscreen-exit-outlined' : 'tdesign:fullscreen-2'}
                sx={{ 
                  fontSize: 28,
                  filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.8))',
                }}
              />
            </IconButton>
          </Stack>
          {!gameUrl && (
            <SplashScreen
              sx={{
                position: 'absolute',
                background: `linear-gradient(135deg, #232626 0%, #2B2F3D 50%, #232626 100%)`,
                borderRadius: fullScreen ? 0 : 2,
                border: fullScreen ? 'none' : '2px solid #24ee89',
                boxShadow: fullScreen ? 'none' : '0 0 40px rgba(138, 43, 226, 0.4)',
                
                '& .MuiCircularProgress-root': {
                  color: '#24ee89',
                  filter: 'drop-shadow(0 0 10px rgba(138, 43, 226, 0.8))',
                },
                
                '& .MuiTypography-root': {
                  color: '#24ee89',
                  fontFamily: '"Impact", "CircularStd", sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  textShadow: '0 0 10px rgba(138, 43, 226, 0.8)',
                },
              }}
            />
          )}
          <Box
            component="iframe"
            src={gameUrl}
            allow="autoplay ; screen-wake-lock ; fullscreen *;"
            sx={{
              position: 'relative',
              width: 1,
              height: 1,
              border: fullScreen ? 'none' : '3px solid #24ee89',
              zIndex: 1000,
              borderRadius: fullScreen ? 0 : 2,
              boxShadow: fullScreen ? 'none' : `
                0 0 30px rgba(138, 43, 226, 0.5),
                inset 0 0 20px rgba(138, 43, 226, 0.1)
              `,
              transition: 'all 0.3s ease',
              
              ...(!fullScreen && {
                '&:hover': {
                  boxShadow: `
                    0 0 40px rgba(138, 43, 226, 0.7),
                    inset 0 0 30px rgba(138, 43, 226, 0.2)
                  `,
                },
              }),
            }}
          />
        </Box>
      )}
    </Stack>
  );
}
