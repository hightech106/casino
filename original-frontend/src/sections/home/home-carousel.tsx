// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// components
import Image from 'src/components/image';
// import Carousel, { CarouselDots, CarouselArrows, useCarousel } from 'src/components/carousel';

import { useResponsive } from 'src/hooks/use-responsive';
// ----------------------------------------------------------------------

const HomeCarousel = () => {
    const isMobile = useResponsive('down', 'md');

    // const carousel = useCarousel({
    //     autoplay: true,
    //     ...CarouselDots({
    //         rounded: true,
    //         sx: {
    //             mt: {
    //                 xs: 1,
    //                 md: 3
    //             }
    //         }
    //     })
    // });

    const _carousels = [`https://uiparadox.co.uk/templates/jackpot/assets/media/banner/banner.png`];

    return (
        <Box
            sx={{
                position: 'relative',
                '& .component-image.MuiBox-root': {
                    width: '100%'
                }
            }}
        >
            {!isMobile
                ? _carousels.map((item) => <CarouselItem key={item} item={item} />)
                : _carousels.map((item) => <CarouselMobileItem key={item} item={item} />)}
        </Box>
    );
};

export default HomeCarousel;

// ----------------------------------------------------------------------

function CarouselItem({ item }: { item: string }) {
    const handleClick = () => {
        document.getElementById('clickId')?.click();
    }
    return (
        <Box onClick={handleClick}>
            <Image
                alt={item}
                src={item}
                sx={{
                    borderRadius: 0,
                    '& img': { minHeight: 200, maxHeight: 480, objectFit: 'unset' }
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    gap: 2,
                    position: 'absolute',
                    top: 30,
                    left: 50
                }}
                p={5}
            >
                <Stack direction="row" spacing={2}>
                    <Typography
                        variant="h1"
                        color="#D9B80B"
                        className="bannerBigText"
                        sx={{ textShadow: '0 0 3px rgba(0, 0, 0, 0.75), 0 0 10px rgba(0, 0, 0, 0.75)' }}
                    >
                        Casino
                    </Typography>
                    <Typography
                        variant="h1"
                        className="bannerBigText"
                        sx={{ textShadow: '0 0 3px rgba(0, 0, 0, 0.75), 0 0 10px rgba(0, 0, 0, 0.75)' }}
                    >
                        Bonus
                    </Typography>
                </Stack>

                <Stack>
                    <Typography
                        variant="h3"
                        className="bannerSmallText"
                        sx={{ textShadow: '0 0 3px rgba(0, 0, 0, 0.7), 0 0 5px rgba(0, 0, 0, 0.7)' }}
                    >
                        telegram mini app
                    </Typography>
                    <Typography
                        variant="h3"
                        className="bannerSmallText"
                        sx={{ textShadow: '0 0 3px rgba(0, 0, 0, 0.7), 0 0 5px rgba(0, 0, 0, 0.7)' }}
                    >
                        Sahara365 avec votre shop de confiance
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
}

function CarouselMobileItem({ item }: { item: string }) {
    return (
        <Box mb={2} sx={{
            backgroundImage: `linear-gradient(160deg, rgb(46, 112, 81), transparent 40%), url("	https://bc.game/assets/bg_m-DZarrOoR.svg")`
        }}>
            <Image
                alt={item}
                src={item}
                sx={{
                    borderRadius: 0,
                    "& .component-image-wrapper": {
                        display: "flex !important",
                        justifyContent: "flex-end"
                    },
                    '& img': { minHeight: 136, maxHeight: 480, width: 235, objectFit: 'unset' }
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    position: 'absolute',
                    gap: 2,
                    top: 10,
                    left: 15,
                    width: 0.5
                }}
            >
                <Stack direction="row" spacing={1}>
                    <Typography
                        variant="h3"
                        color="#D9B80B"
                        sx={{ textShadow: '0 0 3px rgba(0, 0, 0, 0.75), 0 0 10px rgba(0, 0, 0, 0.75)' }}
                    >
                        Telegram
                    </Typography>
                    <Typography
                        variant="h3"
                        sx={{ textShadow: '0 0 3px rgba(0, 0, 0, 0.75), 0 0 10px rgba(0, 0, 0, 0.75)' }}
                    >
                        Game
                    </Typography>
                </Stack>

                <Stack>
                    <Typography
                        fontSize="13px"
                        color="#FFFFFF"
                        fontWeight={500}
                        lineHeight="15.23px"
                    // sx={{ textShadow: '0 0 3px rgba(0, 0, 0, 0.7), 0 0 5px rgba(0, 0, 0, 0.7)' }}
                    >
                        Telegram with our mini-app featuring original games: Crash, Coinflip, and Plinko. Simple to use.
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{
                            px: 3,
                            borderRadius: '3px',
                            bgcolor: '#D9B80B',
                            whiteSpace: 'nowrap',
                            fontSize: '12px',
                            fontWeight: 700,
                            height: '25px'
                        }}
                    >
                        Play
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}
