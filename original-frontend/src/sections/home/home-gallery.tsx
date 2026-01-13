// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// config

// components
import Image from 'src/components/image';
import { useResponsive } from 'src/hooks/use-responsive';
import Carousel, { CarouselDots, CarouselArrows, useCarousel } from 'src/components/carousel';

// apis

const ASSETS_API = "http://82.197.92.104:2025";

const HomeGallery = () => {
    const mdUp = useResponsive('up', 'md');

    const carousel = useCarousel({
        autoplay: true,
        slidesToShow: 2,
        ...CarouselDots({
            rounded: true,
            sx: {
                mt: {
                    xs: 1,
                    md: 3
                }
            }
        })
    });

    const games = [
        "http://82.197.92.104:2025/home/casino/desktop/9198.webp",
        "http://82.197.92.104:2025/home/casino/desktop/9200.webp",
        "https://mediumrare.imgix.net/5cbb2498c956527e6584c6af216489b85bbb7a909c7d3c4e131a3be9bd1cc6bf?&dpr=1&format=auto&auto=format&q=50",
        "https://mediumrare.imgix.net/11caec5df20098884ae9071848e1951b8b34e5ec84a7241f2e7c5afd4b323dfd?&dpr=1&format=auto&auto=format&q=50",
    ]

    if (!mdUp) {
        return (
            <Stack
                spacing={2}
                sx={{
                    p: (theme) => theme.spacing(1)
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant='h6' fontWeight="Bold" >
                        Games
                    </Typography>
                    <Button>See All</Button>
                </Stack>
                <Box position="relative">
                    <CarouselArrows filled shape="rounded" onNext={carousel.onNext} onPrev={carousel.onPrev}>
                        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
                            {games.map((e, index: number) => (
                                <Box key={index} >
                                    <Image
                                        alt={e}
                                        src={e}
                                        sx={{
                                            borderRadius: 1,
                                            mr: 1,
                                            cursor: 'pointer'
                                        }}
                                    />
                                </Box>
                            ))}

                        </Carousel>
                    </CarouselArrows>
                </Box>
            </Stack>
        );
    }

    return (
        <Stack
            sx={{
                p: (theme) => theme.spacing(5, 1, 5, 1)
            }}
        >
            <Box
                sx={{
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    alignSelf: 'flex-start',
                    px: 3,
                    py: 1,
                    boxShadow: 'inset 0px 0px 20px 10px rgba(0, 0, 0, 0.3)',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                }}
            >
                <Typography variant="h3">
                    👍 TOP
                    <Typography variant="h3" component="span" ml={1} color="primary">
                        CASINO GAMES
                    </Typography>
                </Typography>
            </Box>
            <Stack
                spacing={1.5}
                direction="row"
                sx={{
                    borderRadius: 3,
                    borderTopLeftRadius: 0,
                    p: 3,
                    bgcolor: 'background.default',
                    boxShadow: 'inset 0px 0px 20px 10px rgba(0, 0, 0, 0.3)'
                }}
            >
                <Stack spacing={1.5}>
                    <Image
                        alt="game1"
                        src={`${ASSETS_API}/home/gallery/desktop/home_img/10.png`}
                        sx={{ borderRadius: 2, width: 1, height: 255, cursor: 'pointer' }}
                    />
                    <Image
                        alt="game1"
                        src={`${ASSETS_API}/home/gallery/desktop/home_img/9.jpg`}
                        sx={{ borderRadius: 2, width: 1, height: 255, cursor: 'pointer' }}
                    />
                </Stack>
            </Stack>
        </Stack>
    );
};

export default HomeGallery;
