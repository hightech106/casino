import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
import { isMobile } from 'react-device-detect';
import { useTheme, styled } from '@mui/material/styles';

import {
  Box,
  Stack,
  Button,
  AppBar,
  Typography,
  IconButton,
  Toolbar,
  ButtonBase,
  ButtonGroup,
  useMediaQuery,
  Divider,
  LinearProgress,
  Tooltip,
  tooltipClasses,
  type TooltipProps,
  Modal,
} from '@mui/material';

import useApi from 'src/hooks/use-api';
import { useBoolean } from 'src/hooks/use-boolean';
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { dispatch, useSelector } from 'src/store';
import { ChangePage, hideHeader } from 'src/store/reducers/menu';
import { updateBanners } from 'src/store/reducers/config';
import {
  Logout,
  UpdateActiveBonus,
  UpdateBalance,
  UpdateBonus,
  UpdateNotification,
  UpdateUnreadSupport,
} from 'src/store/reducers/auth';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { AnimateButton } from 'src/components/animate';
import { useSettingsContext } from 'src/components/settings';
import { useRouter } from 'src/routes/hooks';

import { bgBlur } from 'src/theme/css';
import { useLocales } from 'src/locales';
import { fCurrency, fPercent, fShortNumber } from 'src/utils/format-number';
import { chatSocket, mainSocket, journeySocket } from 'src/utils/socket';
import { paths } from 'src/routes/paths';
import DepositOptions from 'src/sections/user/wallet/deposit-options';

import type { INotification, IPopup, ISupportChatMessage, IBonus } from 'src/types';
import { ChatWidget } from './chat/chat-widget';
import { HEADER } from '../config-layout';
import { AccountPopover } from '../_common';
import { FreeSpinDialog } from './free-spin-dialog';
import { PopupDialog } from './popup-dialog';

import themeVars from 'src/assets/scss/_themes-vars.module.scss';

const getBonusCurrencyData = (bonus: IBonus | null, userCurrencySymbol: string) => {
  if (!bonus || !bonus.currencies || bonus.currencies.length === 0) {
    return null;
  }

  const currencyData = bonus.currencies.find(
    (currency) => currency.currency === userCurrencySymbol
  );

  return currencyData || bonus.currencies[0];
};

type Props = {
  onOpenNav?: VoidFunction;
};

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

export default function Header({ onOpenNav }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, currentLang } = useLocales();
  const settings = useSettingsContext();
  const [isJourney, setIsJourney] = useState(false);
  const isSmMobile = useMediaQuery('(max-width:520px)');

  const { signout, get_notification, get_unread_supports, get_banners } = useApi();

  const { isLoggedIn, balance, bonus, currency, user, notification, unreadSupport, activeBonus } =
    useSelector((store) => store.auth);
  const { headerHide } = useSelector((store) => store.menu);

  const spinModal = useBoolean(false);

  const depositOpen = useBoolean();
  const [popup, setPopup] = useState<IPopup | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [ratingPoints, setRatingPoints] = useState<number>(0);

  const isNavHorizontal = settings.themeLayout === 'horizontal';
  const lgUp = useResponsive('up', 'lg');
  const offset = useOffSetTop(HEADER.H_DESKTOP);
  const offsetTop = offset && !isNavHorizontal;

  useEffect(() => {
    if (!isLoggedIn) {
      return () => {};
    }

    const updateBalance = (data: any) => {
      if (data.balance !== balance) {
        const newBalance: number = fShortNumber(data.balance, 2);
        console.log('[BALANCE] ✅ Updating balance from', balance, 'to', newBalance);
        dispatch(UpdateBalance(newBalance));
      }
      if (data?.bonus && data.bonus !== bonus) {
        const newBonus: number = fShortNumber(data.bonus, 2);
        console.log('[BALANCE] ✅ Updating bonus from', bonus, 'to', newBonus);
        dispatch(UpdateBonus(newBonus));
      }
      if (data?.activeBonus) {
        dispatch(UpdateActiveBonus(data.activeBonus));
      } else if (activeBonus) {
        // @ts-ignore
        dispatch(UpdateActiveBonus(null));
        dispatch(UpdateBonus(0));
      }
    };

    const updateNotification = (data: INotification[]) => {
      if (isLoggedIn) {
        if (!notification.length) {
          // @ts-ignore
          dispatch(UpdateNotification(data));
          return;
        }
        const updated = notification.map((e) => {
          const item = data.find((r) => r._id === e._id);
          return item || e;
        });
        const newdata = data.filter((e) => e.createdAt > notification[0].createdAt);

        // @ts-ignore
        dispatch(UpdateNotification([...newdata, ...updated]));
      }
    };

    const updateAlert = ({
      msg,
      type,
    }: {
      msg: string;
      type: 'default' | 'error' | 'success' | 'warning' | 'info';
    }) => {
      if (type === 'success') toast.success(msg, { duration: 100000 });
      else if (type === 'error') toast.error(msg, { duration: 100000 });
      else if (type === 'warning') toast(msg, { icon: '⚠️', duration: 100000 });
      else toast(msg, { duration: 100000 });
    };

    const openSpin = (data: { journey?: boolean }) => {
      console.log('Received give_mini_game event:', data);
      setIsJourney(data.journey || false);
      spinModal.onTrue();
    };

    const openPopop = (data: any) => {
      console.log('🚀 ~ openPopop ~ data:', data);
      setPopup(data);
    };

    mainSocket.on('alert', updateAlert);
    mainSocket.on('balance', updateBalance);
    mainSocket.on('give_mini_game', openSpin);
    mainSocket.on('popup', openPopop);
    journeySocket.on('popup', openPopop);
    mainSocket.on('logout', async () => {
      await signout();
      dispatch(Logout());
    });
    mainSocket.on('reload', () => {
      window.location.reload();
    });

    const getNewMessage = (newMsg: ISupportChatMessage) => {
      // @ts-ignore
      dispatch(UpdateUnreadSupport(unreadSupport + 1));
    };

    chatSocket.on('support', getNewMessage);

    return () => {
      mainSocket.off('balance', updateBalance);
      mainSocket.off('alert', updateAlert);
      mainSocket.off('notification', updateNotification);
      mainSocket.off('logout');
      mainSocket.off('reload');
      mainSocket.off('give_mini_game');
      mainSocket.off('popup');

      journeySocket.off('popup');
      chatSocket.off('support', getNewMessage);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, balance, notification, unreadSupport]);

  useEffect(() => {
    if (!isLoggedIn || !mainSocket?.connected) return;
    mainSocket.emit('path', location.pathname);
  }, [location.pathname, isLoggedIn]);

  const getNotification = async () => {
    const res = await get_notification();
    if (!res?.data) return;
    dispatch(UpdateNotification(res.data));
  };

  const getUnreadSupports = async () => {
    const res = await get_unread_supports();
    if (!res?.data) return;
    dispatch(UpdateUnreadSupport(res.data));
  };

  const getBanners = async () => {
    const res = await get_banners();
    if (!res?.data) return;
    dispatch(updateBanners(res.data));
  };

  const handleSpinModalClose = () => {
    spinModal.onFalse();
    setIsJourney(false);
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    getUnreadSupports();
    getNotification();
    // generate random rating 0-1000 on mount/login
    setRatingPoints(Math.floor(Math.random() * 1001));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    getBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateToWallet = () => {
    navigate(`/${currentLang.value}${paths.user.wallet}`);
  };

  const setHide = () => {
    dispatch(hideHeader(!headerHide));
  };

  const activeBonusCurrencyData = activeBonus?.bonusId
    ? getBonusCurrencyData(activeBonus.bonusId, currency?.symbol || '')
    : null;

  const bonusProgress =
    activeBonus && activeBonusCurrencyData
      ? (activeBonus.wager_amount /
          ((activeBonus.amount || bonus) * (activeBonusCurrencyData.wager || 0))) *
        100
      : 0;

  // Определяем активный раздел на основе текущего пути
  const isOnCasinoSection = location.pathname.includes('/casino');
  const isOnSportsSection = location.pathname.includes('/sports');

  // const renderSpinner = (
  //   <>
  //     <Box
  //       alt="spin-round"
  //       component="img"
  //       src="/assets/images/spin/spin-round.png"
  //       sx={{
  //         position: 'absolute',
  //         height: 40,
  //         width: 40,
  //         left: 6,
  //         animation: 'rotate linear 2s infinite',
  //         borderRadius: '50%',
  //         '@keyframes rotate': {
  //           '0%': {
  //             transform: 'rotate(0)',
  //           },
  //           '100%': {
  //             transform: 'rotate(360deg)',
  //           },
  //         },
  //       }}
  //     />
  //     {/* <Box
  //       alt="spin"
  //       component="img"
  //       src="/assets/images/spin/spin.png"
  //       sx={{
  //         position: 'absolute',
  //         height: 'auto',
  //         width: 18,
  //         left: 14,
  //         top: -3
  //       }}
  //     /> */}
  //   </>
  // );

  const renderSpinner = (
    <Box
      alt="spin-round"
      component="img"
      src="/assets/images/spin/spinwin.png"
      sx={{
        position: 'absolute',
        height: isMobile ? 28 : 40,
        width: isMobile ? 68 : 96,
        top: 1,
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    />
  );

  const renderContent = (
    <>
      {/* Бургер меню для всех пользователей на мобильных */}
      {!lgUp && (
        <IconButton onClick={() => onOpenNav?.()}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      {/* Логотип для неавторизованных на мобильных */}
      {isMobile && !isLoggedIn && (
        <Box
          component="img"
          src="/logo/logo_icon.svg"
          alt="LuckVerse777"
          sx={{
            height: 32,
            width: 'auto',
            mr: 1,
          }}
        />
      )}

      {/* Логотип скрыт на мобильных для авторизованных */}
      {!isMobile && <Logo sx={{ mr: { xs: 1.5, sm: 2.5 }, minWidth: 40, alignSelf: 'center' }} />}

      {/* Sports / Casino переключатель скрыт на мобильных */}
      {!isMobile && (
        <Box sx={{ mx: { xs: 1, sm: 2 } }}>
          <ButtonGroup
            disableElevation
            variant="text"
            sx={{
              width: 180,
              height: 40,
              borderRadius: '4px',
              bgcolor: 'transparent',
              boxShadow: 'none',
              border: '1px solid themeVars.btnColor',
              '& .MuiButton-root': {
                margin: 0,
                border: 'none !important',
              },
              '& .MuiButtonGroup-grouped': {
                '&:not(:last-child)': {
                  borderRight: '1px solid themeVars.btnColor !important',
                },
              },
            }}
          >
            <Button
              onClick={() => {
                try {
                  localStorage.setItem('sectionTab', 'casino');
                } catch (e) {
                  console.debug('localStorage unavailable', e);
                }
                navigate(`/${currentLang.value}${paths.casino.root}`);
              }}
              sx={{
                width: 93,
                height: 40,
                borderTopLeftRadius: '4px',
                borderBottomLeftRadius: '4px',
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                paddingTop: '14px',
                paddingRight: '24px',
                paddingBottom: '14px',
                paddingLeft: '24px',
                gap: '10px',
                opacity: 1,
                background: isOnCasinoSection 
                  ? '#24ee89' 
                  : 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
                color: isOnCasinoSection ? '#141722' : '#24ee89',
                fontFamily: 'FONTSPRING DEMO - Blunt Con It',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '100%',
                textAlign: 'center',
                textTransform: 'uppercase',
                '&:hover': {
                  background: isOnCasinoSection
                    ? '#24ee89'
                    : 'linear-gradient(180deg, #8A7D05 20.69%, rgba(25, 25, 55, 0.1) 79.31%)',
                  opacity: isOnCasinoSection ? 0.9 : 1,
                },
              }}
            >
              <span
                style={{
                  transform: 'skew(-15deg)',
                  display: 'inline-block',
                  fontFamily: 'FONTSPRING DEMO - Blunt Con It',
                  fontWeight: 400,
                  fontStyle: 'Italic',
                  fontSize: '18px',
                  lineHeight: '100%',
                  letterSpacing: '5%',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  /* leading-trim: CAP_HEIGHT; - not supported yet */
                }}
              >
                Casino
              </span>
            </Button>
            <Button
              onClick={() => {
                try {
                  localStorage.setItem('sectionTab', 'sports');
                } catch (e) {
                  console.debug('localStorage unavailable', e);
                }
                navigate(`/${currentLang.value}${paths.sports.root}`);
              }}
              sx={{
                width: 87,
                height: 40,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px',
                paddingTop: '14px',
                paddingRight: '24px',
                paddingBottom: '14px',
                paddingLeft: '24px',
                gap: '10px',
                opacity: 1,
                background: isOnSportsSection 
                  ? '#24ee89' 
                  : 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
                color: isOnSportsSection ? '#141722' : '#24ee89',
                fontFamily: 'FONTSPRING DEMO - Blunt Con It',
                fontWeight: 400,
                fontStyle: 'Italic',
                fontSize: '18px',
                lineHeight: '100%',
                letterSpacing: '5%',
                textAlign: 'center',
                textTransform: 'uppercase',
                '&:hover': {
                  background: isOnSportsSection
                    ? '#24ee89'
                    : 'linear-gradient(180deg, #8A7D05 20.69%, rgba(25, 25, 55, 0.1) 79.31%)',
                  opacity: isOnSportsSection ? 0.9 : 1,
                },
              }}
            >
              <span
                style={{
                  transform: 'skew(-15deg)',
                  display: 'inline-block',
                  fontFamily: 'FONTSPRING DEMO - Blunt Con It',
                  fontWeight: 400,
                  fontStyle: 'Italic',
                  fontSize: '18px',
                  lineHeight: '100%',
                  letterSpacing: '5%',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  /* leading-trim: CAP_HEIGHT; - not supported yet */
                }}
              >
                Sport
              </span>
            </Button>
          </ButtonGroup>
        </Box>
      )}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.3, sm: 1 }}
      >
        {/* Показываем спин только если пользователь еще не крутил обычный спин */}
        {(!isLoggedIn || !user?.last_spin) && (
          <>
            {!isMobile ? (
              <ButtonBase
                color="primary"
                sx={{
                  width: 96,
                  height: 42,
                  borderRadius: 0.5,
                  position: 'relative',
                  background: 'transparent',
                }}
                onClick={spinModal.onTrue}
              >
                {renderSpinner}
              </ButtonBase>
            ) : (
              <Box
                onClick={spinModal.onTrue}
                sx={{
                  position: 'relative',
                  width: 70,
                  height: 30,
                  borderRadius: 0.5,
                  background: 'transparent',
                }}
              >
                {renderSpinner}
              </Box>
            )}
          </>
        )}

        {isLoggedIn ? (
          <>
            {!isMobile && (
              <AnimateButton>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={depositOpen.onTrue}
                  sx={{
                    width: 98,
                    height: 40,
                    paddingTop: '14px',
                    paddingRight: '24px',
                    paddingBottom: '14px',
                    paddingLeft: '24px',
                    gap: '10px',
                    opacity: 1,
                    borderRadius: '4px',
                    color: '#141722',
                    fontWeight: 600,
                    fontSize: 16,
                    lineHeight: 1.5,
                    whiteSpace: 'nowrap',
                    bgcolor: '#24ee89',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: '#24ee89',
                      opacity: 0.9,
                    },
                  }}
                >
                  <span
                    style={{
                      transform: 'skew(-15deg)',
                      display: 'inline-block',
                      fontFamily: 'FONTSPRING DEMO - Blunt Con It',
                      fontWeight: 400,
                      fontStyle: 'Italic',
                      fontSize: '18px',
                      lineHeight: '100%',
                      letterSpacing: '5%',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t('deposit')}
                  </span>
                </Button>
              </AnimateButton>
            )}
            <Stack direction="row" spacing={isMobile ? 0.5 : 1} sx={{ position: 'relative' }}>
              <Button
                variant="contained"
                color="info"
                onClick={navigateToWallet}
                sx={{
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 0.5,
                  color: '#24ee89',
                  fontWeight: 600,
                  fontSize: isMobile ? 11 : 16,
                  lineHeight: 1.5,
                  px: isMobile ? 0.6 : 2,
                  py: isMobile ? 0.4 : 1,
                  '&:hover': {
                    background: 'transparent',
                    opacity: 0.8,
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Box
                    width={18}
                    height={18}
                    component="img"
                    src={isLoggedIn && currency ? currency.icon : `/assets/icons/coin/usdt.png`}
                    alt="icon"
                    sx={{
                      borderRadius: '1px',
                      opacity: 1,
                    }}
                  />
                  <Typography
                    className="text-ellipse"
                    sx={{
                      width: 53,
                      height: 12,
                      opacity: 1,
                      fontFamily: 'Geogrotesque Cyr',
                      fontWeight: 700,
                      fontStyle: 'Bold',
                      fontSize: '18.18px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      textTransform: 'uppercase',
                      color: '#FFFFFF',
                      transform: 'skew(-5deg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      maxWidth: '100px',
                      '@media (max-width: 319px)': {
                        maxWidth: '75px',
                      },
                    }}
                  >
                    {balance ? fCurrency(balance, false) : '0.00'}
                  </Typography>
                  {bonus > 0 && (
                    <>
                      <Divider
                        orientation="vertical"
                        sx={{ width: 2, height: 18, borderColor: '#5eff00' }}
                      />
                      <Typography
                        className="text-ellipse"
                        sx={{
                          color: '#caff00',
                          fontSize: 14,
                          lineHeight: '100%',
                          maxWidth: '100px',
                          paddingLeft: '2%',
                          '@media (max-width: 319px)': {
                            maxWidth: '75px',
                          },
                        }}
                      >
                        {fCurrency(bonus, false)}
                      </Typography>
                      <Iconify minWidth={16} icon="fluent-emoji-flat:star" />
                    </>
                  )}
                </Stack>
              </Button>
              <Button
                color="info"
                variant="contained"
                onClick={navigateToWallet}
                sx={{
                  width: isMobile ? 60 : 91,
                  height: isMobile ? 32 : 40,
                  paddingTop: isMobile ? '8px' : '14px',
                  paddingRight: isMobile ? '12px' : '24px',
                  paddingBottom: isMobile ? '8px' : '14px',
                  paddingLeft: isMobile ? '12px' : '24px',
                  gap: '10px',
                  opacity: 1,
                  borderWidth: '1px',
                  borderRadius: '4px',
                  color: '#24ee89',
                  fontWeight: 600,
                  fontSize: isMobile ? 11 : 16,
                  lineHeight: 1.5,
                  whiteSpace: 'nowrap',
                  background: 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
                  border: '1px solid #24ee89',
                  minWidth: isMobile ? 30 : 'auto',
                  '&:hover': {
                    background:
                      'linear-gradient(180deg, #8A7D05 20.69%, rgba(25, 25, 55, 0.1) 79.31%)',
                  },
                }}
              >
                {isMobile ? (
                  <Iconify icon="mdi:wallet" width={16} />
                ) : (
                  <span
                    style={{
                      transform: 'skew(-15deg)',
                      display: 'inline-block',
                      fontFamily: 'FONTSPRING DEMO - Blunt Con It',
                      fontWeight: 400,
                      fontStyle: 'Italic',
                      fontSize: '18px',
                      lineHeight: '100%',
                      letterSpacing: '5%',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t('wallet')}
                  </span>
                )}
              </Button>

              {bonusProgress > 0 && (
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    bottom: -5,
                    position: 'absolute',
                    width: 1,
                    cursor: 'pointer',
                  }}
                >
                  <CustomTooltip title={`${t('bonus')}(${fPercent(bonusProgress)})`} arrow>
                    <LinearProgress
                      value={bonusProgress}
                      variant="determinate"
                      color={
                        (bonusProgress < 30 && 'error') ||
                        (bonusProgress > 30 && bonusProgress < 70 && 'warning') ||
                        'success'
                      }
                      sx={{ width: 1, height: 3 }}
                    />
                  </CustomTooltip>
                </Stack>
              )}
            </Stack>

            <AccountPopover />

            {/* Chat Button */}
            <IconButton
              onClick={() => setChatOpen(true)}
              sx={{
                width: isMobile ? 36 : 40,
                height: isMobile ? 36 : 40,
                borderRadius: 0.5,
                color: '#24ee89',
                background: 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
                border: '1px solid #24ee89',
                flexShrink: 0,
                '&:hover': {
                  background:
                    'linear-gradient(180deg, #8A7D05 20.69%, rgba(25, 25, 55, 0.1) 79.31%)',
                },
              }}
            >
              <Iconify icon="mdi:message" width={isMobile ? 18 : 20} />
            </IconButton>
          </>
        ) : (
          <>
            <AnimateButton>
              <Button
                color="primary"
                variant="contained"
                sx={{
                  px: isMobile ? 1.2 : 2,
                  py: isMobile ? 0.8 : 1,
                  color: '#24ee89',
                  fontWeight: 600,
                  fontSize: isMobile ? 14 : 16,
                  lineHeight: 1.5,
                  borderRadius: 0.5,
                  whiteSpace: 'nowrap',
                  background: 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
                  border: '1px solid #24ee89',
                  minWidth: isMobile ? 65 : 'auto',
                  '&:hover': {
                    background:
                      'linear-gradient(180deg, #8A7D05 20.69%, rgba(25, 25, 55, 0.1) 79.31%)',
                  },
                }}
                onClick={() => {
                  router.push(`/${currentLang.value}${paths.casino.signin}`);
                }}
              >
                {t('login')}
              </Button>
            </AnimateButton>

            <AnimateButton>
              <Button
                color="primary"
                variant="contained"
                sx={{
                  px: isMobile ? 1.2 : 2,
                  py: isMobile ? 0.8 : 1,
                  minWidth: isMobile ? 65 : 76,
                  color: '#141722',
                  fontWeight: 600,
                  fontSize: isMobile ? 14 : 16,
                  lineHeight: 1.5,
                  borderRadius: 0.5,
                  whiteSpace: 'nowrap',
                  bgcolor: '#24ee89',
                  border: 'none',
                  '&:hover': {
                    bgcolor: '#E6D017',
                  },
                }}
                onClick={() => {
                  router.push(`/${currentLang.value}${paths.casino.signup}`);
                }}
              >
                {t('sign_up')}
              </Button>
            </AnimateButton>
          </>
        )}
      </Stack>
    </>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        width: 1,
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        bgcolor: themeVars.bgMain,
        boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.05)',
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          height: HEADER.H_DESKTOP,
          // ...(offsetTop && {
          //   height: HEADER.H_DESKTOP_OFFSET,
          // }),
          ...(isNavHorizontal && {
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
        }),
        ...(headerHide && {
          height: '5px',
        }),
      }}
    >
      {!headerHide && (
        <Toolbar
          sx={{
            height: 1,
            px: { lg: 5 },
            position: 'relative',
          }}
        >
          {/* Center Rating (only when logged in and not mobile) */}
          {isLoggedIn && !isMobile && (
            <Stack
              direction="column"
              alignItems="center"
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                minWidth: 240,
                pointerEvents: 'none',
              }}
            >
              {/* Top dashed line with fading dashes and label */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 0.5,
                  userSelect: 'none',
                }}
              >
                <Box
                  sx={{
                    height: 2,
                    width: 70,
                    background: `linear-gradient(90deg, #24ee89 0%, rgba(255,231,26,0) 100%)`,
                  }}
                />
                <Typography
                  sx={{
                    color: '#24ee89',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: 14,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Rating: {ratingPoints}
                </Typography>
                <Box
                  sx={{
                    height: 2,
                    width: 70,
                    background: `linear-gradient(270deg, #24ee89 0%, rgba(255,231,26,0) 100%)`,
                  }}
                />
              </Box>

              {/* Progress bar */}
              <Box
                sx={{
                  position: 'relative',
                  width: 260,
                  height: 8,
                  bgcolor: '#313545',
                  borderRadius: 4,
                }}
              >
                {(() => {
                  const percent = Math.min(100, Math.max(0, (ratingPoints / 1000) * 100));
                  return (
                    <>
                      <Box
                        sx={{
                          width: `${percent}%`,
                          height: '100%',
                          bgcolor: '#24ee89',
                          borderRadius: 4,
                          transition: 'width 0.3s ease',
                        }}
                      />
                      {/* White arrow at the end of yellow bar */}
                      <Box
                        sx={{
                          position: 'absolute',
                          left: `calc(${percent}% - 6px)`,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 0,
                          height: 0,
                          borderLeft: '6px solid #FFFFFF',
                          borderTop: '6px solid transparent',
                          borderBottom: '6px solid transparent',
                          filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.4))',
                        }}
                      />
                    </>
                  );
                })()}
              </Box>
            </Stack>
          )}

          {renderContent}
        </Toolbar>
      )}
      {isMobile && setHide && (
        <IconButton
          size="small"
          onClick={setHide}
          sx={{
            position: 'absolute',
            left: '50%',
            bottom: -15,
            zIndex: theme.zIndex.appBar + 1,
            border: `dashed 1px ${theme.palette.divider}`,
            ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
            '&:hover': {
              bgcolor: 'background.default',
            },
          }}
        >
          <Iconify width={16} icon={`icon-park-outline:${headerHide ? 'down' : 'up'}`} />
        </IconButton>
      )}

      <FreeSpinDialog open={spinModal.value} onClose={handleSpinModalClose} isJourney={isJourney} />
      <PopupDialog open={!!popup} data={popup} onClose={() => setPopup(null)} />

      <Modal
        open={depositOpen.value}
        onClose={depositOpen.onFalse}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          },
        }}
        sx={{
          '& .MuiModal-root': {
            bgcolor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <DepositOptions onClose={depositOpen.onFalse} />
      </Modal>

      {/* Chat Widget */}
      {chatOpen && <ChatWidget onClose={() => setChatOpen(false)} />}
    </AppBar>
  );
}
