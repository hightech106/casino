import { useEffect, useState } from 'react';
// @mui
import { 
  Box, 
  Stack, 
  Typography, 
  useMediaQuery,
  Collapse,
} from '@mui/material';
// hooks
import { usePathname, useRouter } from 'src/routes/hooks';
import { useLocales } from 'src/locales';
import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type ProfileNavItem = {
  title: string;
  path: string;
  icon: string;
  active?: boolean;
  children?: ProfileNavItem[];
};

export default function ProfileNavHorizontal() {
  const { currentLang } = useLocales();
  const pathname = usePathname();
  const router = useRouter();
  const [expandedBets, setExpandedBets] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  // Проверяем если текущий путь в подменю MY BETS
  useEffect(() => {
    const isBetsPath = pathname.includes('/user/my-bets');
    setExpandedBets(isBetsPath);
  }, [pathname]);

  // Показываем только на мобильных устройствах и только на страницах /user/
  if (!isMobile || !pathname.startsWith('/user/')) {
    return null;
  }

  // Profile navigation items - основные разделы
  const mainNavItems: ProfileNavItem[] = [
    {
      title: 'ACCOUNT',
      path: `/${currentLang.value}/user/account`,
      icon: '/assets/icons/leftbar-profile/account.svg',
    },
    {
      title: 'WALLET',
      path: `/${currentLang.value}/user/wallet`,
      icon: '/assets/icons/leftbar-profile/wallet.svg',
    },
    {
      title: 'MISSIONS',
      path: `/${currentLang.value}/user/missions`,
      icon: '/assets/icons/leftbar-profile/missions.svg',
    },
    {
      title: 'NOTIFICATIONS',
      path: `/${currentLang.value}/user/notification`,
      icon: '/assets/icons/leftbar-profile/notifications.svg',
    },
    {
      title: 'MY SHARES',
      path: `/${currentLang.value}/user/my-shares`,
      icon: '/assets/icons/leftbar-profile/myshares.svg',
    },
    {
      title: 'PASSWORD',
      path: `/${currentLang.value}/user/password`,
      icon: '/assets/icons/leftbar-profile/changepassword.svg',
    },
    {
      title: 'REFERRAL',
      path: `/${currentLang.value}/user/referral`,
      icon: '/assets/icons/leftbar-profile/referral.svg',
    },
    {
      title: 'SUPPORT',
      path: `/${currentLang.value}/user/support`,
      icon: '/assets/icons/leftbar-profile/support.svg',
    },
    {
      title: 'TICKET',
      path: `/${currentLang.value}/user/ticket`,
      icon: '/assets/icons/leftbar-profile/ticket.svg',
    },
  ];

  // BET section с выпадающим меню
  const betNavItems: ProfileNavItem[] = [
    {
      title: 'MY BETS',
      path: `/${currentLang.value}/user/my-bets`,
      icon: '/assets/icons/leftbar-profile/mybets.svg',
      children: [
        {
          title: 'CASINO',
          path: `/${currentLang.value}/user/my-bets/casino`,
          icon: '/assets/icons/leftbar-profile/mybets.svg',
        },
        {
          title: 'SPORTS',
          path: `/${currentLang.value}/user/my-bets/sports`,
          icon: '/assets/icons/leftbar-profile/mybets.svg',
        },
      ],
    },
  ];

  // Объединяем все элементы для горизонтального отображения
  const allNavItems = [...mainNavItems, ...betNavItems];

  const handleBetsClick = () => {
    setExpandedBets(!expandedBets);
  };

  const renderNavItem = (item: ProfileNavItem) => {
    const isActive = pathname === item.path;
    const hasBetsChildren = item.children && item.children.length > 0;
    
    return (
      <Box key={item.path}>
        <Box
          onClick={() => {
            if (hasBetsChildren) {
              handleBetsClick();
            } else {
              router.push(item.path);
            }
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '75px',
            height: '65px',
            p: 1,
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            bgcolor: isActive ? '#2B2F3D' : 'transparent',
            borderRadius: '12px',
            border: isActive ? '1px solid #24ee89' : '1px solid transparent',
            background: isActive ? 
              'linear-gradient(to bottom, #24ee8930 0%, #24ee891A 50%, #2B2F3D 50%, #2B2F3D 100%)' : 
              'transparent',
            '&:hover': {
              bgcolor: '#24ee8914',
              border: '1px solid #24ee8980',
              '& .nav-icon': {
                backgroundColor: '#24ee89',
              },
              '& .nav-text': {
                color: '#24ee89 !important',
              },
            },
          }}
        >
          {/* Icon */}
          <Box
            className="nav-icon"
            sx={{
              width: 24,
              height: 24,
              backgroundColor: isActive ? '#24ee89' : '#A0A3A7',
              mask: `url(${item.icon}) no-repeat center / contain`,
              WebkitMask: `url(${item.icon}) no-repeat center / contain`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              transition: 'background-color 0.2s ease-in-out',
              mb: 0.5,
            }}
          />
          
          {/* Text */}
          <Typography
            className="nav-text"
            sx={{
              color: isActive ? '#24ee89' : '#A0A3A7',
              fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", serif',
              fontWeight: 'bold',
              fontSize: '8px',
              textTransform: 'uppercase',
              textAlign: 'center',
              lineHeight: 1.1,
              transition: 'color 0.2s ease-in-out',
              maxWidth: '70px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.title}
          </Typography>

          {/* Expand icon for MY BETS */}
          {hasBetsChildren && (
            <Iconify
              icon={expandedBets ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'}
              sx={{
                color: isActive ? '#24ee89' : '#A0A3A7',
                fontSize: '12px',
                mt: 0.25,
              }}
            />
          )}
        </Box>
      </Box>
    );
  };

  const renderBetSubItems = () => {
    if (!expandedBets || !betNavItems[0]?.children) return null;

    return (
      <Collapse in={expandedBets}>
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            bgcolor: '#232626',
            borderTop: '1px solid #2B2F3D',
            zIndex: 1000,
            py: 1,
          }}
        >
          <Scrollbar>
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                px: 2,
                justifyContent: 'flex-start',
              }}
            >
              {betNavItems[0].children.map((child) => {
                const isActive = pathname === child.path;
                return (
                  <Box
                    key={child.path}
                    onClick={() => router.push(child.path)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '70px',
                      height: '60px',
                      p: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      bgcolor: isActive ? '#2B2F3D' : 'transparent',
                      borderRadius: '8px',
                      border: isActive ? '1px solid #24ee89' : '1px solid transparent',
                      '&:hover': {
                        bgcolor: '#24ee8914',
                        border: '1px solid #24ee8980',
                        '& .nav-icon': {
                          backgroundColor: '#24ee89',
                        },
                        '& .nav-text': {
                          color: '#24ee89 !important',
                        },
                      },
                    }}
                  >
                    <Box
                      className="nav-icon"
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: isActive ? '#24ee89' : '#A0A3A7',
                        mask: `url(${child.icon}) no-repeat center / contain`,
                        WebkitMask: `url(${child.icon}) no-repeat center / contain`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        transition: 'background-color 0.2s ease-in-out',
                        mb: 0.5,
                      }}
                    />
                    <Typography
                      className="nav-text"
                      sx={{
                        color: isActive ? '#24ee89' : '#A0A3A7',
                        fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", serif',
                        fontWeight: 'bold',
                        fontSize: '8px',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        lineHeight: 1.1,
                        transition: 'color 0.2s ease-in-out',
                      }}
                    >
                      {child.title}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Scrollbar>
        </Box>
      </Collapse>
    );
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64, // Высота хедера
        left: 0,
        right: 0,
        bgcolor: '#232626',
        borderBottom: '1px solid #2B2F3D',
        zIndex: 1000,
        width: '100%',
      }}
    >
      <Scrollbar>
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            px: 2, 
            py: 1,
            minWidth: 'max-content',
            justifyContent: 'flex-start',
          }}
        >
          {allNavItems.map((item) => renderNavItem(item))}
        </Stack>
      </Scrollbar>
      
      {/* Submenu for MY BETS */}
      {renderBetSubItems()}
    </Box>
  );
}