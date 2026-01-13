// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Typography, useMediaQuery } from '@mui/material';
// components
import Image from 'src/components/image';
import Carousel, { CarouselDots, useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------
import ProvidersAry from "./payment-providers.json"

const FooterSlide = () => {
  const isMobile = useMediaQuery('(max-width:520px)');


  const splitImages = (images: string[], chunkSize: number) => {
    const result = [];
    for (let i = 0; i < images.length; i += chunkSize) {
      result.push({ img: images.slice(i, i + chunkSize) });
    }
    return result;
  };

  const carousel = useCarousel({
    autoplay: true,
    dots: false,
    autoplaySpeed: 3000,
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
    ? ProvidersAry
    : splitImages(ProvidersAry, 4);

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
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {!isMobile
          ? _carousels.map((item: any) => <CarouselItem key={item} item={item} />)
          : _carousels.map((item: any) => <CarouselMobileItem key={item} item={item.img} />)}
      </Carousel>
    </Box>
  );
};

export default FooterSlide;

// ----------------------------------------------------------------------

function CarouselItem({ item }: { item: string }) {
  return (
    <Box p={1}>
      <Image
        alt={item}
        src={item}
        sx={{
          borderRadius: 1,
          border: "1px solid rgb(255 255 255/9%)",
          height: { xs: 60, sm: 60, md: 80 },
          // padding: "3px 20px",
          bgcolor: "background.neutral",
          '& img': {
            borderRadius: 1, maxWidth: 1,
            maxHeight: 1,
            objectFit: "contain"
          },
          "& .component-image-wrapper": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
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
              height: 60,
              borderRadius: 1,
              border: "1px solid rgb(255 255 255/9%)",
              bgcolor: "background.neutral",
              '& img': {
                borderRadius: 1, maxWidth: 1,
                maxHeight: 1,
                objectFit: "contain"
              },
              "& .component-image-wrapper": {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
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
