import { memo, useMemo } from 'react';
import Iconify from 'src/components/iconify';
import { AnimateButton } from 'src/components/animate';
import { useLocales } from 'src/locales';
import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'src/store';

import { paths } from 'src/routes/paths';

const MobileMenu = () => {
  const router = useRouter();
  const location = useLocation();

  const { currentLang } = useLocales();

  const { footerHide } = useSelector((store) => store.menu);

  const MOBILEMENU = useMemo(
    () => [
      {
        url: `/${currentLang.value}${paths.sports.root}`,
        label: 'Sports',
        icon: 'sports',
      },
      {
        url: `/${currentLang.value}${paths.sports.live}`,
        label: 'Sports',
        icon: 'live-sports',
      },
      {
        url: `/${currentLang.value}${paths.casino.live}`,
        label: 'Live Casino',
        icon: 'live-casino',
      },
      {
        url: `/${currentLang.value}${paths.casino.root}`,
        label: 'Casino',
        icon: 'casino',
      },
      {
        url: `/${currentLang.value}${paths.casino.promotion}`,
        label: 'VIP Club',
        icon: 'vipclub',
      },
    ],
    [currentLang]
  );

  const handleClick = (url: string) => {
    router.push(url);
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-around"
      sx={{
        bottom: 0,
        zIndex: 10,
        width: '100vw',
        height: '80px',
        position: 'fixed',
        alignItems: 'center',
        borderTop: '1px solid #24ee89',
        bgcolor: '#232626',
        px: 1,
        py: 1,
        ...(footerHide && {
          display: "none",
        })
      }}
    >
      {MOBILEMENU.map((menu, key) => {
        const isActive = location.pathname === menu.url;
        
        return (
          <AnimateButton key={key}>
            <Box
              onClick={() => handleClick(menu.url)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                bgcolor: '#2B2F3D',
                border: isActive ? '2px solid #24ee89' : '2px solid transparent',
                background: isActive 
                  ? 'linear-gradient(180deg, #24ee89 0%, rgba(138, 43, 226, 0.3) 100%)'
                  : '#2B2F3D',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              {/* SVG Icon */}
              <Box
                component="img"
                src={`/assets/icons/mobile-menu/${menu.icon}.svg`}
                alt={menu.label}
                sx={{
                  width: '24px',
                  height: '24px',
                  filter: isActive 
                    ? 'brightness(0)'
                    : 'brightness(0) saturate(100%) invert(62%) sepia(8%) saturate(563%) hue-rotate(173deg) brightness(95%) contrast(89%)',
                  mb: 0.5,
                }}
              />
              
              {/* Label */}
              <Typography 
                sx={{ 
                  fontSize: '10px', 
                  color: isActive ? '#000' : '#A0A3A7',
                  fontFamily: '"Geogrotesque Cyr", sans-serif',
                  fontWeight: 500,
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {menu.label}
              </Typography>
            </Box>
          </AnimateButton>
        );
      })}
    </Stack>
  );
};

export default memo(MobileMenu);
