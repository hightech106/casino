import { useMemo } from 'react';
// @mui
import { Button, Link, Typography, CardContent, Card, Stack } from '@mui/material';
import Box from '@mui/material/Box';

import { useRouter } from 'src/routes/hooks';
// components
import Image from 'src/components/image';
import Carousel, { CarouselDots, useCarousel } from 'src/components/carousel';
import { useResponsive } from 'src/hooks/use-responsive';
import { API_URL, APP_NAME } from 'src/config-global';
import { useSelector } from 'src/store';
import type { IBanner } from 'src/types';

// ----------------------------------------------------------------------

const MiddleCarousel = () => {
  const smDown = useResponsive('down', 'sm');
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

  const filterBanners = useMemo(() => banners.filter((e) => e.type === 'casino_middle'), [banners]);

  const renderContent = useMemo(() => {
    if (!filterBanners.length) {
      return (
        <Stack
          sx={{
            mt: 2,
            pt: 5,
            position: 'relative',
          }}
        >
          <Card
            sx={{
              bgcolor: '#2B562A',
              position: 'static',
            }}
          >
            <CardContent sx={{ p: { xs: '16px !important', sm: '40px !important' } }}>
              <Stack gap={1} zIndex={2}>
                <Typography variant="body1" fontSize={{ xs: 14, sm: 16 }} fontWeight={600}>
                  <Box component="span" sx={{ color: 'secondary.main', fontSize: 20 }}>
                    YOUR VIP WAY:
                  </Box>{' '}
                  THE LOYALTY PROGRAE
                  <br /> LAKI WORLD CASINO
                </Typography>
                <Typography variant="body2" fontSize={{ xs: 12, sm: 14 }}>
                  Go from to VIP: over 10 level <br /> with unique privileges including
                  <br /> super high cacheback, prize for switching
                </Typography>
                <Box>
                  <Button variant="contained" color="secondary" sx={{ borderRadius: 20 }}>
                    Learn More
                  </Button>
                </Box>
              </Stack>
              <Image
                src="/assets/images/casino/box2.png"
                sx={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 0,
                  ...(smDown && { width: 73, left: '46%' }),
                }}
              />
              <Image
                src="/assets/images/casino/dealer4.png"
                sx={{
                  position: 'absolute',
                  right: '10%',
                  bottom: 0,
                  ...(smDown && { width: 133, right: 0 }),
                }}
              />
            </CardContent>
          </Card>
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
  }, [filterBanners, carousel.carouselSettings, carousel.carouselRef, smDown]);

  return <>{renderContent}</>;
};

export default MiddleCarousel;

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