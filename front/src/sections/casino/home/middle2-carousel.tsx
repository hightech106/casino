import { useMemo } from 'react';
// @mui
import { Button, Link, Typography, Stack } from '@mui/material';
import Box from '@mui/material/Box';

import { useRouter } from 'src/routes/hooks';
// components
import Image from 'src/components/image';
import Carousel, { CarouselDots, useCarousel } from 'src/components/carousel';
import { API_URL, APP_NAME } from 'src/config-global';
import { useLocales } from 'src/locales';
import { useSelector } from 'src/store';
import type { IBanner } from 'src/types';

// ----------------------------------------------------------------------

const Middle2Carousel = () => {
  const { t } = useLocales();
  const banners = useSelector((store) => store.config.banners);

  const carousel = useCarousel({
    autoplay: true,
    ...CarouselDots({
      rounded: true,
      sx: {
        mt: { xs: 1, md: 3 },
      },
    }),
  });

  const filterBanners = useMemo(() => banners.filter((e) => e.type === 'casino_middle0'), [banners]);

  const renderContent = useMemo(() => {
    if (!filterBanners.length) {
      return (
        <Stack
          sx={{
            mt: 1,
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0), #232626), url(/assets/images/casino/home/jackpot.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: 0.5,
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: { xs: 205, sm: 300, md: 400 },
            mx: 0,
            px: 0,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: 0.5,
              zIndex: 1,
            }}
          />
          <Stack
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              textAlign: 'center',
              width: '100%',
            }}
          >
            <Typography
              variant="h1"
              fontFamily="Impact"
              fontWeight={400}
              fontSize={{ xs: 36, sm: 65.3 }}
              lineHeight={1}
              letterSpacing={0}
              textAlign="center"
              textTransform="uppercase"
              color="#FFFFFF"
              sx={{ textShadow: '0 0 10px #00FF00, 0 0 20px #00FF00, 0 0 30px #00FF00' }}
            >
              {t('jackpot')}
            </Typography>
            <Typography
              variant="h2"
              fontFamily="Impact"
              fontWeight={400}
              fontSize={{ xs: 32, sm: 65.3 }}
              lineHeight={1}
              letterSpacing={0}
              textAlign="center"
              textTransform="uppercase"
              color="#FFFFFF"
              sx={{ mt: { xs: 1, sm: 2 } }}
            >
              {t('coming_soon')}
            </Typography>
          </Stack>
          <Image
            src="/assets/images/casino/home/angle_right.png"
            alt="angle_right"
            sx={{
              position: 'absolute',
              top: 52,
              right: 0,
              width: { xs: 80, sm: 120, md: 150 },
              maxWidth: '30%',
              zIndex: 2,
            }}
          />
        </Stack>
      );
    }
    return (
      <Box
        sx={{
          position: 'relative',
          '& .component-image.MuiBox-root': {
            width: 1,
            borderRadius: 1,
            height: { xs: 205, sm: 300, md: 400 },
          },
        }}
        mt={3}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {filterBanners.map((banner, index: number) => (
            <CarouselItem key={index} banner={banner} />
          ))}
        </Carousel>
      </Box>
    );
  }, [filterBanners, carousel.carouselSettings, carousel.carouselRef, t]);

  return <>{renderContent}</>;
};

export default Middle2Carousel;

// ----------------------------------------------------------------------

function CarouselItem({ banner }: { banner: IBanner }) {
  const router = useRouter();

  return (
    <Box position="relative">
      <Image
        alt={banner.image}
        src={`${API_URL}/${banner.image}`}
        sx={{
          '& img': {
            minHeight: 200,
            objectFit: 'fill !important',
          },
        }}
      />
      {banner.button && (
        <Box
          sx={{
            position: 'absolute',
            left: { xs: '4%', md: '7%' },
            bottom: { xs: '5%', md: '10%' },
          }}
        >
          <Link href={banner.link} style={{ textDecoration: 'none' }}>
            <Button
              color="primary"
              variant="contained"
              disabled={!banner.link}
              className="bold-font"
              sx={{
                pt: { xs: 0.5, md: 1.25 },
                pb: { xs: 0.5, md: 1 },
                px: { xs: 1, md: 3.7 },
                fontSize: { xs: 11, md: 18 },
                backgroundColor: '#24ee89',
                borderRadius: 1,
                color: '#FFFFFF',
              }}
            >
              {banner?.button_name || APP_NAME}
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
}