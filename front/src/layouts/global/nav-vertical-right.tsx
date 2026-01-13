import { useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
// hooks
import { usePathname, useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { useLocales } from 'src/locales';
import { useSelector } from 'src/store';
import { API_URL } from 'src/config-global';
import VIPProgressBox from 'src/sections/casino/home/Vip-progress-box';
//
import { MissionModal } from 'src/sections/user/missions';
import { HEADER, NAV } from '../config-layout';
import { PermanentSpinDialog } from './daily-spin-dialog';
// auth & missions

import themeVars from 'src/assets/scss/_themes-vars.module.scss';

// ----------------------------------------------------------------------

export default function NavVerticalRight() {
  const { t, currentLang } = useLocales();
  const router = useRouter();
  const pathname = usePathname();
  const permanentSpinModal = useBoolean(false);
  const missionsModal = useBoolean(false);

  // Получаем баннеры из состояния
  const banners = useSelector((store) => store.config.banners);
  const { isLoggedIn } = useSelector((store) => store.auth);

  // Show only on casino and sports; hide on /user
  const isCasinoRoute = pathname.startsWith(`/${currentLang.value}${paths.casino.root}`);
  const isSportsRoute = pathname.startsWith(`/${currentLang.value}${paths.sports.root}`);
  const isUserRoute = pathname.startsWith(`/${currentLang.value}${paths.user.root}`);
  if ((!isCasinoRoute && !isSportsRoute) || isUserRoute) {
    return null;
  }

  // Функция для обработки title (второе слово желтым)
  const formatTitle = (title: string) => {
    const words = title.split(' ');
    if (words.length < 2) {
      return <span>{title}</span>;
    }

    return (
      <span>
        {words[0]}{' '}
        <span style={{ color: '#24ee89' }}>{words[1]}</span>
        {words.length > 2 && ` ${words.slice(2).join(' ')}`}
      </span>
    );
  };

  // Фильтруем баннеры для сайдбара (casino-sidebar-right-1 до casino-sidebar-right-6)
  const sidebarBanners = banners
    .filter(
      (banner) => banner.type && banner.type.startsWith('casino-sidebar-right') && banner.status
    )
    .sort((a, b) => {
      // Сортируем по номеру в конце типа
      const getNumber = (type: string) => {
        const match = type.match(/casino-sidebar-right-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      };
      return getNumber(a.type) - getNumber(b.type);
    })
    .slice(0, 6); // Берем только первые 6

  const PROMOTION_MAIN = {
    title: t('promotions'),
    path: `/${currentLang.value}${paths.casino.promotion}`,
    icon: '/assets/images/nav/promotions.png',
  };

  const PROMOTION_ITEMS = [
    [
      {
        title: t('daily_wheel'),
        onClick: () => permanentSpinModal.onTrue(),
        icon: '/assets/images/nav/daily.png',
      },
      {
        title: t('uni_games'),
        path: `/${currentLang.value}${paths.casino.original}`,
        icon: '/assets/images/nav/unigames.png',
      },
    ],
    [
      {
        title: 'Gamification', // Добавьте в локализацию если нужно
        onClick: () => {
          if (isLoggedIn) {
            missionsModal.onTrue();
          } else {
            router.push(`/${currentLang.value}${paths.casino.signin}`);
          }
        },
        icon: '/assets/images/nav/gamification.png',
      },
      {
        title: t('our_sports'),
        path: `/${currentLang.value}${paths.sports.root}`,
        icon: '/assets/images/nav/sports.png',
      },
    ],
  ];

  const renderPromotionSection = (
    <Stack sx={{ mb: 2, '& .MuiTypography-root': { transform: 'skewX(-5deg)', transformOrigin: 'left center' } }}>
      {/* Main Promotions Header - тонкий блок с фиолетовым градиентом */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        onClick={() => {
          if (PROMOTION_MAIN.path) router.push(PROMOTION_MAIN.path);
        }}
        sx={{
          p: 1,
          backgroundColor: '#2B2F3D',
          mb: 1,
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
          position: 'relative',
          background: 'linear-gradient(180deg, #51019B 0%, #2B2F3D 100%)',
          borderRadius: '20px !important',
          border: '2px solid #24ee89',
          height: 80,

          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 20px rgba(81, 1, 155, 0.3)',
            '&::before': {
              background:
                'linear-gradient(135deg, rgba(81, 1, 155, 0.9) 0%, rgba(81, 1, 155, 0.5) 100%)',
            },
          },
        }}
      >
        <Box
          component="img"
          alt={PROMOTION_MAIN.title}
          src={PROMOTION_MAIN.icon}
          sx={{
            width: 80,
            height: 70,
            mr: 1,
            position: 'relative',
            zIndex: 2,
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: '#FFF !important',
            fontSize: '24px !important',
            fontWeight: '700 !important', // Делаем bold для Impact
            fontStyle: 'italic !important',
            textTransform: 'uppercase !important',
            position: 'relative',
            zIndex: 2,
            lineHeight: '38px !important',
            letterSpacing: '0.05em !important', // 5%
            fontFamily: '"Impact", "CircularStd", sans-serif !important',
            transform: 'skewX(-5deg)', // Легкий наклон вправо
            transformOrigin: 'left center',
          }}
        >
          {PROMOTION_MAIN.title}
        </Typography>
      </Stack>

      {/* Первая строка: Daily Wheel + Uni Games */}
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        {PROMOTION_ITEMS[0].map((item, itemIndex) => {
          const isActive = pathname === item.path;
          return (
            <Box
              key={itemIndex}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (item.path) {
                  router.push(item.path);
                }
              }}
              sx={{
                flex: 1,
                p: 1,
                border: isActive ? '2px solid #24ee89' : '2px solid transparent',
                backgroundColor: '#2B2F3D',
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                minHeight: 70,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                '&:hover': {
                  border: '2px solid #24ee89',
                  '&::before': {
                    opacity: 1,
                  },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(138, 43, 226, 0.1) 100%)',
                  borderRadius: '6px',
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                },
              }}
            >
              <Box
                component="img"
                alt={item.title}
                src={item.icon}
                sx={{
                  width: 40,
                  height: 40,
                  mr: 1,
                  position: 'relative',
                  zIndex: 2,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: '#FFF',
                  textAlign: 'left',
                  fontSize: 14,
                  fontWeight: 700,
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  position: 'relative',
                  zIndex: 2,
                  lineHeight: 0.95, // 95%
                  letterSpacing: 0, // 0%
                  fontFamily: '"CircularStd", "Public Sans", sans-serif !important',
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                }}
              >
                {item.title}
              </Typography>
            </Box>
          );
        })}
      </Stack>

      {/* Вторая строка: Gamification + Our Sports */}
      <Stack direction="row" spacing={1}>
        {PROMOTION_ITEMS[1].map((item, itemIndex) => {
          const isActive = pathname === item.path;
          return (
            <Box
              key={itemIndex}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (item.path) {
                  router.push(item.path);
                }
              }}
              sx={{
                flex: 1,
                p: 1,
                border: isActive ? '2px solid #24ee89' : '2px solid transparent',
                backgroundColor: '#2B2F3D',
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                minHeight: 70,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                '&:hover': {
                  border: '2px solid #24ee89',
                  '&::before': {
                    opacity: 1,
                  },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(138, 43, 226, 0.1) 100%)',
                  borderRadius: '6px',
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                },
              }}
            >
              <Box
                component="img"
                alt={item.title}
                src={item.icon}
                sx={{
                  width: 40,
                  height: 40,
                  mr: 1,
                  position: 'relative',
                  zIndex: 2,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: '#FFF',
                  textAlign: 'left',
                  fontSize: item.title === 'Gamification' ? 13 : 14,
                  fontWeight: 700,
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  position: 'relative',
                  zIndex: 2,
                  lineHeight: 0.95, // 95%
                  letterSpacing: 0, // 0%
                  fontFamily: '"CircularStd", "Public Sans", sans-serif !important',
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                }}
              >
                {item.title}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );

  const renderBannersSection = (
    <Box
      sx={{
        border: `2px solid #2B2F3D`,
        borderRadius: 2,
        backgroundColor: 'transparent',
        p: 2,
      }}
    >
      <Stack spacing={2}>
        {sidebarBanners.map((banner) => (
          <Box
            key={banner._id}
            sx={{
              position: 'relative',
              height: 160,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              backgroundImage: banner.image ? `url(${API_URL}/${banner.image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: banner.image ? 'transparent' : '#222532',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: banner.image ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
                zIndex: 1,
              },
              '&:hover': {
                transform: 'translateY(-2px)',
                backgroundColor: banner.image ? 'transparent' : '#2A2D3A',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                '&::before': {
                  background: banner.image ? 'rgba(0, 0, 0, 0.4)' : 'transparent',
                },
              },
            }}
          >
            {/* Контент баннера */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              {/* Заголовок, описание и ссылка */}
              <Box sx={{ width: '60%', textAlign: 'left !important' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#FFFFFF !important',
                    fontSize: '28px !important',
                    fontWeight: '400 !important',
                    fontStyle: 'italic !important',
                    fontFamily: '"Impact", "CircularStd", sans-serif !important',
                    mb: '6px !important',
                    textTransform: 'uppercase !important',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.8) !important',
                    lineHeight: '1 !important', // 100%
                    letterSpacing: '0.05em !important', // 5%
                    wordWrap: 'break-word !important',
                    textAlign: 'left !important',
                    transform: 'skewX(-5deg)',
                    transformOrigin: 'left center',
                  }}
                >
                  {formatTitle(banner.title)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#FFFFFF !important',
                    fontSize: '14px !important', // Увеличили с 10px до 14px
                    fontWeight: '500 !important',
                    fontFamily: '"CircularStd", "Public Sans", sans-serif !important',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8) !important',
                    lineHeight: '1.2 !important', // Чуть больше для читаемости
                    letterSpacing: '0 !important', // 0%
                    wordWrap: 'break-word !important',
                    textAlign: 'left !important',
                    mb: '8px !important',
                  }}
                >
                  {banner.description}
                </Typography>

                {/* Text Link сразу после description */}
                {banner.text_link_name && banner.text_link_url && (
                  <Link
                    href={banner.text_link_url}
                    underline="none"
                    sx={{
                      color: '#24ee89 !important',
                      fontSize: '16px !important',
                      fontWeight: '400 !important',
                      fontStyle: 'italic !important',
                      fontFamily: '"Impact", "CircularStd", sans-serif !important',
                      textDecoration: 'none !important',
                      textShadow: 'none !important',
                      textTransform: 'uppercase !important',
                      lineHeight: '1 !important', // 100%
                      letterSpacing: '0.05em !important', // 5%
                      textAlign: 'left !important',
                      display: 'block !important',
                      '&:hover': {
                        color: '#FFF !important',
                        textDecoration: 'none !important',
                      },
                    }}
                  >
                    {banner.text_link_name}
                  </Link>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: HEADER.H_DESKTOP,
        right: 0,
        width: NAV.W_VERTICAL,
        height: `calc(100vh - ${HEADER.H_DESKTOP}px)`,
        backgroundColor: themeVars.bgMain,
        zIndex: 1000, // Правое меню должно быть видно поверх контента
        overflowY: 'auto',
        p: 2,
        display: { xs: 'none', lg: 'block' }, // Скрываем на мобильных устройствах
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

      <VIPProgressBox isLoggedIn={isLoggedIn} />
      {renderPromotionSection}
      {renderBannersSection}

      <PermanentSpinDialog open={permanentSpinModal.value} onClose={permanentSpinModal.onFalse} />
      <MissionModal open={missionsModal.value} onClose={missionsModal.onFalse} />
    </Box>
  );
}
