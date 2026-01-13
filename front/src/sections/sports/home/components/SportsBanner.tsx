// react
import { useMemo } from 'react';
// @mui
import { Typography, Stack, Box, Button, Link } from '@mui/material';
import { useSelector } from 'src/store';
import banner from '../../../../assets/sports/banner/banner1.png';
import m_banner from '../../../../assets/sports/banner/m_bg.png';

// ----------------------------------------------------------------------
interface Props {
  second?: boolean;
}

const SportsBanner = ({ second }: Props) => {
  const banners = useSelector((store) => store.config.banners);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const filterBanners = useMemo(() => banners.filter((e) => e.type === 'sports'), [banners]);

  const renderMainBanner = () => (
    <Stack
      sx={{
        position: 'relative',
        height: { xs: '500px', sm: 450, md: 350 },
        minHeight: { xs: '500px', sm: 450, md: 350 },
        borderRadius: 1,
        overflow: 'hidden',
        backgroundSize: '100% 100%',
        backgroundImage: { xs: `url(${m_banner})`, md: `url(${banner})` },
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Кнопка */}
      <Button
        variant="contained"
        sx={{
          height: { xs: '5vh', md: 'auto' },
          top: { xs: '400px', md: 'auto' },
          width: { xs: '80%', md: 'auto' },
          position: 'absolute',
          right: { xs: '50%', md: 36 },
          bottom: { xs: 20, md: 30 },
          transform: { xs: 'translateX(50%) skewX(-5deg)', md: 'skewX(-5deg)' },
          backgroundColor: '#24ee89',
          color: '#050514',
          fontFamily: '"Impact", "CircularStd", "Oswald", sans-serif',
          fontWeight: 'bold',
          fontStyle: 'italic',
          letterSpacing: '0.05rem',
          fontSize: {
            xs: '13px',
            sm: '14px',
            md: '11px',
            lg: '13px',
            xl: '15px',
          },
          px: { xs: 2.5, sm: 3, md: 2, lg: 3, xl: 4 },
          py: { xs: 1.2, sm: 1.3, md: 0.6, lg: 1.0, xl: 1.2 },
          borderRadius: '4px',
          textTransform: 'uppercase',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          transformOrigin: 'left center',
          '&:hover': {
            backgroundColor: '#E6D017',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        REGISTER
      </Button>
    </Stack>
  );

  return (
    <Stack position="relative" overflow="hidden" sx={{ mb: 3 }}>
      {renderMainBanner()}
    </Stack>
  );
};

export default SportsBanner;
