import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { useMediaQuery, IconButton, Typography, Collapse, TextField, InputAdornment } from '@mui/material';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import Scrollbar from 'src/components/scrollbar';
import { usePathname, useRouter } from 'src/routes/hooks';
import { useLocales } from 'src/locales';
import Iconify from 'src/components/iconify';
//
import { HEADER, NAV } from '../config-layout';
//
import SportsCasinoBtnGroup from '../global/sports-casino-btngroup';

// ----------------------------------------------------------------------

type ProfileNavItem = {
  title: string;
  path: string;
  icon: string;
  active?: boolean;
  children?: ProfileNavItem[];
};

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function ProfileNavVertical({ openNav, onCloseNav }: Props) {
  const { user } = useMockedUser();
  const { t, currentLang } = useLocales();
  const isSmMobile = useMediaQuery('(max-width:520px)');
  const isMobile = useMediaQuery('(max-width:768px)');
  const pathname = usePathname();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [expandedBets, setExpandedBets] = useState(false);

  const lgUp = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Проверяем если текущий путь в подменю MY BETS
  useEffect(() => {
    const isBetsPath = pathname.includes('/user/my-bets');
    setExpandedBets(isBetsPath);
  }, [pathname]);

  // На мобильных устройствах не показываем вертикальное меню для страниц /user/
  if (isMobile && pathname.startsWith('/user/')) {
    return null;
  }

  // Profile navigation items - основные разделы в правильном порядке
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
      title: 'CHANGE PASSWORD',
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
          title: 'BETS CASINO',
          path: `/${currentLang.value}/user/my-bets/casino`,
          icon: '/assets/icons/leftbar-profile/mybets.svg',
        },
        {
          title: 'BETS SPORTS',
          path: `/${currentLang.value}/user/my-bets/sports`,
          icon: '/assets/icons/leftbar-profile/mybets.svg',
        },
      ],
    },
  ];

  // Объединяем все для поиска
  const allNavItems = [...mainNavItems, ...betNavItems];

  // Фильтрация по поиску
  const filteredMainItems = mainNavItems.filter(item => 
    item.title.toLowerCase().includes(searchValue.toLowerCase())
  );
  const filteredBetItems = betNavItems.filter(item => 
    item.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleBetsClick = () => {
    setExpandedBets(!expandedBets);
  };

  const renderNavItem = (item: ProfileNavItem, index: number = 0, isChild = false) => {
    const isActive = pathname === item.path;
    const hasBetsChildren = item.children && item.children.length > 0;
    
    return (
      <Box key={`${item.path}-${index}`}>
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
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            p: 1.5,
            mb: 1,
            ml: 0, // Убираем левые отступы для единого выравнивания
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            bgcolor: '#2B2F3D',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '12px', // Закругленные границы
            border: isActive ? '1px solid #24ee89' : '1px solid transparent',
            // Градиент для активного элемента
            background: isActive ? 
              'linear-gradient(to bottom, #24ee8930 0%, #24ee891A 50%, #2B2F3D 50%, #2B2F3D 100%)' : 
              '#2B2F3D',
            '&:hover': {
              bgcolor: '#24ee8914',
              border: '1px solid #24ee89',
              '& .nav-icon': {
                backgroundColor: '#24ee89 !important',
              },
              '& .nav-text': {
                color: '#24ee89 !important',
              },
              '& .expand-icon': {
                color: '#24ee89 !important',
              },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              className="nav-icon"
              sx={{
                width: 20,
                height: 20,
                backgroundColor: isActive ? '#24ee89' : '#A0A3A7',
                mask: `url(${item.icon}) no-repeat center / contain`,
                WebkitMask: `url(${item.icon}) no-repeat center / contain`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                transition: 'background-color 0.2s ease-in-out',
              }}
            />
            <Typography
              className="nav-text"
              sx={{
                color: isActive ? '#24ee89' : '#A0A3A7',
                fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", serif',
                fontWeight: 'bold',
                fontSize: '12px',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease-in-out',
              }}
            >
              {item.title}
            </Typography>
          </Box>
          
          {hasBetsChildren && (
            <Iconify
              icon={expandedBets ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'}
              className="expand-icon"
              sx={{
                color: isActive ? '#24ee89' : '#A0A3A7',
                transition: 'color 0.2s ease-in-out',
              }}
            />
          )}
        </Box>

        {/* Подменю для MY BETS */}
        {hasBetsChildren && (
          <Collapse in={expandedBets}>
            <Box sx={{ pl: 2 }}>
              {item.children?.map((child, childIndex) => renderNavItem(child, childIndex, true))}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  const renderSearchField = () => (
    <Box sx={{ px: 2, pb: 2, pt: 3 }}>
      <TextField
        fullWidth
        size="small"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="SEARCH..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: '#A0A3A7' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: '#2B2F3D',
            borderRadius: '12px',
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(138, 43, 226, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#24ee89',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#A0A3A7',
            fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", serif',
            fontWeight: 'bold',
            fontSize: '12px',
            textTransform: 'uppercase',
            '&::placeholder': {
              color: '#A0A3A7',
              opacity: 1,
            },
          },
        }}
      />
    </Box>
  );

  const renderHeader = () => (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Typography
        variant="h6"
        sx={{
          color: '#A0A3A7',
          fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", serif',
          fontWeight: 'bold',
          letterSpacing: '0.1em',
          fontSize: '14px',
          transform: 'skew(-5deg)',
          textTransform: 'uppercase',
        }}
      >
        ACCOUNT
      </Typography>
    </Box>
  );

  const renderBetSection = () => (
    <Box sx={{ p: 2, textAlign: 'center', mt: 2 }}>
      <Typography
        variant="h6"
        sx={{
          color: '#A0A3A7',
          fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", serif',
          fontWeight: 'bold',
          letterSpacing: '0.1em',
          fontSize: '12px',
          transform: 'skew(-5deg)',
          textTransform: 'uppercase',
        }}
      >
        BET
      </Typography>
    </Box>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#232626',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#24ee89',
          borderRadius: '3px',
        },
      }}
    >
      {/* Sports/Casino toggle - только на мобильных */}
      {isMobile && (
        <Box sx={{ px: 2, py: 2 }}>
          <SportsCasinoBtnGroup fullWidth />
        </Box>
      )}

      {/* Поиск перед ACCOUNT разделом */}
      {renderSearchField()}
      
      {/* Заголовок ACCOUNT */}
      {renderHeader()}
      
      <Box sx={{ px: 2, flex: 1 }}>
        {/* Основные разделы */}
        <Stack spacing={1}>
          {(searchValue ? filteredMainItems : mainNavItems).map((item, index) => renderNavItem(item, index, false))}
        </Stack>
        
        {/* BET секция */}
        {(searchValue ? filteredBetItems : betNavItems).length > 0 && (
          <>
            {renderBetSection()}
            <Stack spacing={1}>
              {(searchValue ? filteredBetItems : betNavItems).map((item, index) => renderNavItem(item, index, false))}
            </Stack>
          </>
        )}
      </Box>

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  const renderMobileContent = (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        bgcolor: '#232626',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header with close button */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          p: 2,
          borderBottom: '1px solid #2B2F3D',
        }}
      >
        <IconButton
          onClick={onCloseNav}
          sx={{
            color: 'white',
            mr: 2,
          }}
        >
          <Iconify icon="eva:close-fill" width={24} />
        </IconButton>
        
        <Box
          component="img"
          src="/logo/logo.png"
          alt="LuckVerse777"
          sx={{
            height: 40,
            width: 'auto',
          }}
        />
      </Stack>

      {/* Sports/Casino toggle */}
      <Box sx={{ px: 2, py: 2 }}>
        <SportsCasinoBtnGroup fullWidth />
      </Box>

      {/* Navigation sections */}
      <Scrollbar
        sx={{
          flex: 1,
          '& .simplebar-content': {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#232626',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#24ee89',
            borderRadius: '3px',
          },
        }}
      >


        {/* Поиск перед ACCOUNT разделом */}
        {renderSearchField()}
        
        {/* Заголовок ACCOUNT */}
        {renderHeader()}
        
        <Box sx={{ px: 2, flex: 1 }}>
          {/* Основные разделы */}
          <Stack spacing={1}>
            {(searchValue ? filteredMainItems : mainNavItems).map((item, index) => renderNavItem(item, index, false))}
          </Stack>
          
          {/* BET секция */}
          {(searchValue ? filteredBetItems : betNavItems).length > 0 && (
            <>
              {renderBetSection()}
              <Stack spacing={1}>
                {(searchValue ? filteredBetItems : betNavItems).map((item, index) => renderNavItem(item, index, false))}
              </Stack>
            </>
          )}
        </Box>
      </Scrollbar>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: 240 }, // Увеличили ширину сайдбара
      }}
    >
      {lgUp ? (
        <Stack
          sx={{
            position: 'fixed',
            top: HEADER.H_DESKTOP,
            left: 0,
            width: 300, // Увеличили ширину сайдбара
            height: `calc(100vh - ${HEADER.H_DESKTOP}px)`,
            bgcolor: '#232626 !important',
            borderRight: '1px solid #2B2F3D',
            zIndex: 1001,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: isSmMobile ? '100vw' : 300,
              height: isSmMobile ? '100vh' : 'auto',
              bgcolor: '#232626 !important',
              border: 'none',
            },
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: isSmMobile ? '100vw' : 300,
              height: isSmMobile ? '100vh' : 'auto',
            },
          }}
        >
          {isSmMobile ? renderMobileContent : renderContent}
        </Drawer>
      )}
    </Box>
  );
}