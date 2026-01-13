// @mui
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
// config
import { useResponsive } from 'src/hooks/use-responsive';
// components

import Image from 'src/components/image';
import Carousel, { useCarousel } from 'src/components/carousel';

export const _carousels = [
    { name: 'Pragmatic Play', img: `https://tuniwin.com/home/nav/desktop/1.svg`, service: 'vip-casino' },
    { name: 'Netent', img: `https://tuniwin.com/home/nav/desktop/2.svg`, service: 'vip-casino' },
    { name: 'Habanero', img: `https://tuniwin.com/home/nav/desktop/3.svg`, service: 'vip-casino' },
    { name: 'Evolution', img: `https://tuniwin.com/home/nav/desktop/4.svg`, service: 'live-casino' },
    { name: 'EGT', img: `https://tuniwin.com/home/nav/desktop/5.svg`, service: 'vip-casino' },
];

export const _carouselMobiles = [
    { name: 'Pragmatic Play', img: `https://tuniwin.com/casino/providers/pragmatic-play-live.png`, service: 'vip-casino' },
    { name: 'Netent', img: `https://tuniwin.com/casino/providers/netent.png`, service: 'vip-casino' },
    { name: 'Habanero', img: `https://tuniwin.com/casino/providers/habanero.png`, service: 'vip-casino' },
    { name: 'Evolution', img: `https://tuniwin.com/casino/providers/evolution-live.png`, service: 'live-casino' },
    { name: 'EGT', img: `https://tuniwin.com/casino/providers/egt.png`, service: 'vip-casino' },
];

// const homeBanners = [
//     `https://tuniwin.com/home/carousel/mobile/home_sport.png`,
//     `https://tuniwin.com/home/carousel/mobile/home_casino.png`
// ];


const HomeNav = () => {
    const isMobile = useResponsive('down', 'md');

    const carousel = useCarousel({
        autoplay: true,
        slidesToShow: 10,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 5
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 5
                }
            }
        ]
    });


    const onchangeprovider = (data: any) => {
        console.log(data);
    };

    return (
        <>
            {!isMobile ? (
                <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
                    {_carousels.map((item, index: number) => (
                        <CarouselItem key={item.name} item={item} selectProvider={onchangeprovider} />
                    ))}
                </Carousel>
            ) : (
                <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
                    {_carouselMobiles.map((item, index: number) => (
                        <CarouselMobileItem key={item.name} item={item} selectProvider={onchangeprovider} />
                    ))}
                </Carousel>
            )}

            <video
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: 'auto', borderRadius: 5, marginTop: 10 }} // Optional styling  
            >
                <source src="https://uiparadox.co.uk/templates/jackpot/assets/media/casino-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </>
    );
};

export default HomeNav;

function CarouselItem({ item, selectProvider }: { item: any; selectProvider: any }) {
    return (
        <Stack
            sx={{ maxHeight: 500, mr: 1, alignItems: 'center' }}
            pt={{ xs: 2, md: 4 }}
        >
            <Image alt={item.img} src={item.img} />
        </Stack>
    );
}

function CarouselMobileItem({ item, selectProvider }: { item: any; selectProvider: any }) {
    return (
        <Stack
            sx={{ maxHeight: 500, mr: 1, alignItems: 'center', bgcolor: '#192333' }}
            p={{ xs: 1 }}
            pt={{ md: 4 }}
            gap={0.5}
            borderRadius="10px"
            maxWidth={70}
            onClick={() => {
                selectProvider(item);
            }}
        >
            <Image alt={item} src={item.img} width={27} />
            <Typography fontSize={10} whiteSpace="nowrap">
                {item.name}
            </Typography>
        </Stack>
    );
}
