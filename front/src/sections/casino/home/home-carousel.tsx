import { useState } from 'react';
// @mui
import { Button, Skeleton, Link } from '@mui/material';
import Box from '@mui/material/Box';

import { useRouter } from 'src/routes/hooks';
// components
import Image from 'src/components/image';
import Carousel, { CarouselDots, CarouselArrows, useCarousel } from 'src/components/carousel';
import { useResponsive } from 'src/hooks/use-responsive';
import { API_URL, APP_NAME } from 'src/config-global';
import { useSelector } from 'src/store';
import type { IBanner } from 'src/types';

// ----------------------------------------------------------------------

const HomeCarousel = () => {
  const banners = useSelector((store) => store.config.banners);
  const [loading, setLoading] = useState<boolean>(false);

  const mdDown = useResponsive('down', 'sm');
  const carousel = useCarousel({
    autoplay: true,
    ...CarouselDots({
      rounded: true,
      sx: {
        mt: { xs: 0, md: 3 }, 
      },
    }),
  });

  const filterBanners = banners.filter((e) => e.type === 'casino');

  return (
    <Box
      sx={{
        position: 'relative',
        mt: 0,
        '& .component-image.MuiBox-root': {
          width: 1,
          borderRadius: 1,
          height: { xs: 280, sm: 300, md: 400 }, 
        },
        "& ul": {
          mt: "0 !important", 
        },
      }}
    >
      {loading && (
        <Skeleton height={400} />
      )}
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {filterBanners.map((banner, index: number) => (
          <CarouselItem key={index} banner={banner} />
        ))}
      </Carousel>
    </Box>
  );
};

export default HomeCarousel;

// ----------------------------------------------------------------------

function CarouselItem({ banner }: { banner: IBanner }) {
  const router = useRouter();
  /* eslint-disable */
  const link = location.origin;
  const isDevLink = link.includes("http://");
  /* eslint-enable */

  return (
    <Box position="relative">
      <Image
        alt={banner.image}
        src={`${API_URL}/${banner.image}`}
        sx={{
          '& img': {
            minHeight: 200,
            objectFit: "fill !important",
            ...(isDevLink && {
              // filter: "blur(25px)"
            }),
          },
        }}
      />
      {banner.button && (
        <Box
          sx={{
            position: "absolute",
            left: { xs: "4%", md: "7%" },
            bottom: { xs: "5%", md: "10%" },
          }}
        >
          <Link href={banner.link} style={{ textDecoration: 'none' }}>
            <Button
              color='primary'
              variant='contained'
              disabled={!banner.link}
              className="bold-font"
              sx={{
                pt: { xs: 0.5, md: 1.25 },
                pb: { xs: 0.5, md: 1 },
                px: { xs: 1, md: 3.7 },
                fontSize: { xs: 11, md: 18 },
                backgroundColor: '#CAAE51',
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