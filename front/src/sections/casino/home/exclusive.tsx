// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// config
import { ASSETS_API } from 'src/config-global';

// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Carousel, { useCarousel } from 'src/components/carousel';

import { useResponsive } from 'src/hooks/use-responsive';

// apis

const imgList = [
    `assets/images/casino/exclusive/desktop/9069.gif`,
    `assets/images/casino/exclusive/desktop/9056.gif`,
    `assets/images/casino/exclusive/desktop/9054.gif`,
    `assets/images/casino/exclusive/desktop/9051.gif`
];

const Exclusive = () => {
    const isMobile = useResponsive('down', 'md');

    const carousel = useCarousel({
        autoplay: true,
        dots: false,
        autoplaySpeed: 1000,
        slidesToShow: 1,
        pauseOnHover: true,
        slidesPerRow: 1,
        centerMode: true
    });
    return (
        <Box
            pt={2}
            sx={{
                '& .slick-current.slick-active': {
                    transform: isMobile ? 'scale(1.3)' : 'scale(1)'
                }
            }}
        >
            <Stack p={1} direction="row" py={{ xs: 4 }} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <Iconify icon="material-symbols-light:bomb-sharp" fontSize={30} />
                <Typography fontSize={16} fontWeight={700}>
                    Exclusive
                </Typography>
            </Stack>
            {!isMobile ? (
                <Grid container spacing={2}>
                    {imgList.map((item, index) => (
                        <Grid item md={3} key={index}>
                            <Image src={item} sx={{ borderRadius: 1 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
                    {imgList.map((item, index) => (
                        <Box p={3} key={index}>
                            <Image src={item} sx={{ borderRadius: 1 }} />
                        </Box>
                    ))}
                </Carousel>
            )}
        </Box>
    );
};

export default Exclusive;
