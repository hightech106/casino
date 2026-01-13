// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// components
import Image from 'src/components/image';
import { useResponsive } from 'src/hooks/use-responsive';
import Carousel, { CarouselDots, CarouselArrows, useCarousel } from 'src/components/carousel';
import toast from 'react-hot-toast';
import type { ICasinoData } from 'src/types';

interface Props {
    data: ICasinoData;
}

const CasinoGroup = ({ data }: Props) => {
    const mdUp = useResponsive('up', 'md');

    const carousel = useCarousel({
        autoplay: true,
        slidesToShow: 2,
        ...CarouselDots({
            rounded: true,
            sx: {
                mt: {
                    xs: 1,
                    md: 3,
                },
            },
        }),
    });


    // if (!mdUp) {
    //     return (
    //         <Stack
    //             spacing={2}
    //             sx={{
    //                 p: (theme) => theme.spacing(1),
    //             }}
    //         >
    //             <Stack direction="row" alignItems="center" justifyContent="space-between">
    //                 <Typography>
    //                     {data.label}
    //                 </Typography>
    //                 <Button>See All</Button>
    //             </Stack>
    //             <Box position="relative">
    //                 <CarouselArrows filled shape="rounded" onNext={carousel.onNext} onPrev={carousel.onPrev}>
    //                     <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
    //                         <Box>
    //                             <Image
    //                                 alt="assets/images/casino/gallery/mobile/1.jpg"
    //                                 src="assets/images/casino/gallery/mobile/1.jpg"
    //                                 sx={{
    //                                     borderRadius: 1,
    //                                     mr: 1,
    //                                     cursor: 'pointer',
    //                                 }}
    //                                 onClick={() => {
    //                                     openGamePlay('1234');
    //                                 }}
    //                             />
    //                         </Box>
    //                         <Box>
    //                             <Image
    //                                 alt="assets/images/casino/gallery/mobile/2.jpg"
    //                                 src="assets/images/casino/gallery/mobile/2.jpg"
    //                                 sx={{
    //                                     borderRadius: 1,
    //                                     mr: 1,
    //                                 }}
    //                             />
    //                         </Box>
    //                         <Box>
    //                             <Image
    //                                 alt="assets/images/casino/gallery/mobile/3.jpg"
    //                                 src="assets/images/casino/gallery/mobile/3.jpg"
    //                                 sx={{
    //                                     borderRadius: 1,
    //                                     mr: 1,
    //                                 }}
    //                             />
    //                         </Box>
    //                         <Box>
    //                             <Image
    //                                 alt="assets/images/casino/gallery/mobile/4.jpg"
    //                                 src="assets/images/casino/gallery/mobile/4.jpg"
    //                                 sx={{
    //                                     borderRadius: 1,
    //                                     mr: 1,
    //                                 }}
    //                             />
    //                         </Box>
    //                         <Box>
    //                             <Image
    //                                 alt="assets/images/casino/gallery/mobile/5.jpg"
    //                                 src="assets/images/casino/gallery/mobile/5.jpg"
    //                                 sx={{
    //                                     borderRadius: 1,
    //                                     mr: 1,
    //                                 }}
    //                             />
    //                         </Box>
    //                         <Box>
    //                             <Image
    //                                 alt="assets/images/casino/gallery/mobile/6.jpg"
    //                                 src="assets/images/casino/gallery/mobile/6.jpg"
    //                                 sx={{
    //                                     borderRadius: 1,
    //                                     mr: 1,
    //                                 }}
    //                             />
    //                         </Box>
    //                         <Box>
    //                             <Image
    //                                 alt="assets/images/casino/gallery/mobile/7.jpg"
    //                                 src="assets/images/casino/gallery/mobile/7.jpg"
    //                                 sx={{
    //                                     borderRadius: 1,
    //                                     mr: 1,
    //                                 }}
    //                             />
    //                         </Box>
    //                         <Box>
    //                             <Image
    //                                 alt="assets/images/casino/gallery/mobile/8.jpg"
    //                                 src="assets/images/casino/gallery/mobile/8.jpg"
    //                                 sx={{
    //                                     borderRadius: 1,
    //                                     mr: 1,
    //                                 }}
    //                             />
    //                         </Box>
    //                     </Carousel>
    //                 </CarouselArrows>
    //             </Box>
    //         </Stack>
    //     );
    // }

    return (
        <Stack
            sx={{
                p: (theme) => theme.spacing(5, 1, 5, 1),
            }}
        >
            <Box
                sx={{
                    bgcolor: '#232626',
                    borderRadius: 0.5,
                    alignSelf: 'flex-start',
                    px: 3,
                    py: 1,
                    boxShadow: 'inset 0px 0px 10px 7px rgba(0, 0, 0, 0.3)',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                }}
            >
                <Typography variant="h4" textTransform="capitalize">
                    {data.label}
                </Typography>
            </Box>
            <Stack
                spacing={1.5}
                sx={{
                    borderRadius: 1,
                    borderTopLeftRadius: 0,
                    p: 2,
                    bgcolor: '#232626',
                    boxShadow: 'inset 0px 0px 10px 7px rgba(0, 0, 0, 0.3)',
                }}
            >
                {/* {data.items.slice(0, 10).map((row, index) => (
                    <TopCasino key={index} games={row} />
                ))} */}
            </Stack>
        </Stack>
    );
};

export default CasinoGroup;
