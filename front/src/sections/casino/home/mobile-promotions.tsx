import { useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';
// hooks
import { usePathname, useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { useLocales } from 'src/locales';
import { useSelector } from 'src/store';
import { API_URL } from 'src/config-global';
import { PermanentSpinDialog } from 'src/layouts/global/daily-spin-dialog';
// missions
import { MissionModal } from 'src/sections/user/missions';

// ----------------------------------------------------------------------

export default function MobilePromotions() {
  const { t, currentLang } = useLocales();
  const router = useRouter();
  const pathname = usePathname();
  const permanentSpinModal = useBoolean(false);
  const missionsModal = useBoolean(false);
  const isSmMobile = useMediaQuery('(max-width:520px)');
  
  // Добавляем проверку авторизации для диагностики
  const { isLoggedIn } = useSelector((store) => store.auth);

  // Получаем баннеры из состояния
  const banners = useSelector((store) => store.config.banners);

  // Показываем только на главной странице казино для мобильных
  const isCasinoHome = pathname === `/${currentLang.value}${paths.casino.root}`;
  
  
  // Временно отключаем условие для тестирования
  // if (!isSmMobile || !isCasinoHome) {
  //   return null;
  // }
  
  // Показываем компонент только на мобильных устройствах для диагностики
  if (!isSmMobile) {
    return null;
  }

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
        title: 'Gamification',
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
    <Box sx={{ mb: 3, px: 2, mt: 3 }}>
      {/* Debug info
      <Box sx={{ 
        mb: 1, 
        p: 1, 
        backgroundColor: isLoggedIn ? '#4CAF50' : '#FF9800', 
        borderRadius: 1,
        color: 'white',
        fontSize: 12,
        textAlign: 'center'
      }}>
        DEBUG: {isLoggedIn ? 'LOGGED IN' : 'NOT LOGGED IN'} | Path: {pathname}
      </Box> */}
      
      {/* Main Promotions Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        onClick={() => {
          if (PROMOTION_MAIN.path) router.push(PROMOTION_MAIN.path);
        }}
        sx={{
          p: 2,
          backgroundColor: '#2B2F3D',
          mb: 2,
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
          },
        }}
      >
        <Box
          component="img"
          alt={PROMOTION_MAIN.title}
          src={PROMOTION_MAIN.icon}
          sx={{
            width: 60,
            height: 50,
            mr: 2,
            position: 'relative',
            zIndex: 2,
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: '#FFF !important',
            fontSize: '20px !important',
            fontWeight: '700 !important',
            fontStyle: 'italic !important',
            textTransform: 'uppercase !important',
            position: 'relative',
            zIndex: 2,
            lineHeight: '24px !important',
            letterSpacing: '0.05em !important',
            fontFamily: '"Impact", "CircularStd", sans-serif !important',
          }}
        >
          {PROMOTION_MAIN.title}
        </Typography>
      </Stack>

      {/* Все промо-элементы в один ряд */}
      <Stack direction="row" spacing={1}>
        {[...PROMOTION_ITEMS[0], ...PROMOTION_ITEMS[1]].map((item, itemIndex) => {
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
                minHeight: 80,
                display: 'flex',
                flexDirection: 'column', // Изменили на column для иконки сверху, текста снизу
                alignItems: 'center',
                justifyContent: 'center',
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
                  width: 32, // Уменьшили размер иконки
                  height: 32,
                  mb: 0.5, // Отступ между иконкой и текстом
                  position: 'relative',
                  zIndex: 2,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: '#FFF',
                  textAlign: 'center',
                  fontSize: item.title === 'Gamification' ? 8 : 10, // Еще меньше для Gamification
                  fontWeight: 700,
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  position: 'relative',
                  zIndex: 2,
                  lineHeight: 1,
                  letterSpacing: 0,
                  fontFamily: '"CircularStd", "Public Sans", sans-serif !important',
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
    </Box>
  );

  return (
    <>
      {renderPromotionSection}
      <PermanentSpinDialog open={permanentSpinModal.value} onClose={permanentSpinModal.onFalse} />
      <MissionModal open={missionsModal.value} onClose={missionsModal.onFalse} />
    </>
  );
}