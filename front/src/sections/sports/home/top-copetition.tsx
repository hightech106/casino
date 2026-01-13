// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Typography, useMediaQuery } from '@mui/material';
import { useLocales } from 'src/locales';
// components
import Image from 'src/components/image';
import Carousel, { CarouselDots, useCarousel } from 'src/components/carousel';

import { useResponsive } from 'src/hooks/use-responsive';
// ----------------------------------------------------------------------

const TopCompetition = () => {
  const { t } = useLocales();
  const isMobile = useMediaQuery('(max-width:520px)');

  const carousel = useCarousel({
    autoplay: true,
    dots: false,
    autoplaySpeed: 2000,
    slidesToShow: 8,
    pauseOnHover: true,
    slidesPerRow: 1,
    centerMode: true,
    ...CarouselDots({
      rounded: true,
      sx: {
        mt: {
          xs: 1,
          md: 3,
        },
      },
    }),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  const _carousels: any = !isMobile
    ? [
      `assets/images/casino/copetition/desktop/7588.webp`,
      `assets/images/casino/copetition/desktop/7594.webp`,
      `assets/images/casino/copetition/desktop/9007.webp`,
      `assets/images/casino/copetition/desktop/9008.webp`,
      `assets/images/casino/copetition/desktop/9009.webp`,
      `assets/images/casino/copetition/desktop/9010.webp`,
      `assets/images/casino/copetition/desktop/9011.webp`,
      `assets/images/casino/copetition/desktop/9012.webp`,
      `assets/images/casino/copetition/desktop/9013.webp`,
      `assets/images/casino/copetition/desktop/9014.webp`,
      `assets/images/casino/copetition/desktop/9015.webp`,
      `assets/images/casino/copetition/desktop/9016.webp`,
    ]
    : [
      {
        img: [
          `assets/images/casino/copetition/desktop/7588.webp`,
          `assets/images/casino/copetition/desktop/7594.webp`,
          `assets/images/casino/copetition/desktop/9007.webp`,
          `assets/images/casino/copetition/desktop/9008.webp`,
        ],
      },
      {
        img: [
          `assets/images/casino/copetition/desktop/9009.webp`,
          `assets/images/casino/copetition/desktop/9010.webp`,
          `assets/images/casino/copetition/desktop/9011.webp`,
          `assets/images/casino/copetition/desktop/9012.webp`,
        ],
      },
      {
        img: [
          `assets/images/casino/copetition/desktop/9013.webp`,
          `assets/images/casino/copetition/desktop/9014.webp`,
          `assets/images/casino/copetition/desktop/9015.webp`,
          `assets/images/casino/copetition/desktop/9016.webp`,
        ],
      },
    ];

  return (
    <Box
      sx={{
        width: 1,
        position: 'relative',
        '& .component-image.MuiBox-root': {
          width: 1,
        },
        '& .slick-current.slick-active': {
          transform: isMobile ? 'scale(1.3)' : 'scale(1)',
        },
      }}
      pt={2}
    >
      <Typography variant='h5' mb={2}> {t("providers")}</Typography>
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {!isMobile
          ? _carousels.map((item: any) => <CarouselItem key={item} item={item} />)
          : _carousels.map((item: any) => <CarouselMobileItem key={item} item={item.img} />)}
      </Carousel>
    </Box>
  );
};

export default TopCompetition;

// ----------------------------------------------------------------------

function CarouselItem({ item }: { item: string }) {
  return (
    <Box p={1}>
      <Image
        alt={item}
        src={item}
        sx={{
          borderRadius: 0,
          '& img': { objectFit: 'unset', borderRadius: 1 },
          transition: 'transform 0.5s ease',
          '&:hover': { transform: 'scale(1.04)' },
          cursor: 'pointer',
        }}
      />
    </Box>
  );
}

function CarouselMobileItem({ item }: { item: any }) {
  return (
    <Grid container spacing={0.75} p={3} mr="-30px">
      {item.map((list: string) => (
        <Grid key={list} item xs={6}>
          <Image
            alt={list}
            src={list}
            sx={{
              borderRadius: 0,
              '& img': { objectFit: 'unset', borderRadius: 1 },
              transition: 'transform 0.5s ease',
              '&:hover': { transform: 'scale(1.04)' },
              cursor: 'pointer',
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
