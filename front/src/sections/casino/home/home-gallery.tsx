// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// store
import { dispatch, useSelector } from 'src/store';
import { ChangePage } from 'src/store/reducers/menu';
// hooks
import { useRouter } from 'src/routes/hooks';
// components
import Image from 'src/components/image';
import { useResponsive } from 'src/hooks/use-responsive';
import Carousel, { CarouselDots, CarouselArrows, useCarousel } from 'src/components/carousel';
import toast from 'react-hot-toast';

const HomeGallery = () => {
  const mdUp = useResponsive('up', 'md');
  const router = useRouter();
  const { isLoggedIn } = useSelector((store) => store.auth);

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

  const openGamePlay = async (link: string) => {
    if (!isLoggedIn)
      return dispatch(ChangePage("login"));
    return router.push(link);
  };


  if (!mdUp) {
    return (
      <Stack
        spacing={2}
        sx={{
          p: (theme) => theme.spacing(1),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography>
            Top
            <Typography component="span" ml={1} color="primary">
              Casino Games
            </Typography>
          </Typography>
          <Button>See All</Button>
        </Stack>
        <Box position="relative">
          <CarouselArrows filled shape="rounded" onNext={carousel.onNext} onPrev={carousel.onPrev}>
            <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
              <Box>
                <Image
                  alt="assets/images/casino/gallery/mobile/1.jpg"
                  src="assets/images/casino/gallery/mobile/1.jpg"
                  sx={{
                    borderRadius: 1,
                    mr: 1,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    openGamePlay('1234');
                  }}
                />
              </Box>
              <Box>
                <Image
                  alt="assets/images/casino/gallery/mobile/2.jpg"
                  src="assets/images/casino/gallery/mobile/2.jpg"
                  sx={{
                    borderRadius: 1,
                    mr: 1,
                  }}
                />
              </Box>
              <Box>
                <Image
                  alt="assets/images/casino/gallery/mobile/3.jpg"
                  src="assets/images/casino/gallery/mobile/3.jpg"
                  sx={{
                    borderRadius: 1,
                    mr: 1,
                  }}
                />
              </Box>
              <Box>
                <Image
                  alt="assets/images/casino/gallery/mobile/4.jpg"
                  src="assets/images/casino/gallery/mobile/4.jpg"
                  sx={{
                    borderRadius: 1,
                    mr: 1,
                  }}
                />
              </Box>
              <Box>
                <Image
                  alt="assets/images/casino/gallery/mobile/5.jpg"
                  src="assets/images/casino/gallery/mobile/5.jpg"
                  sx={{
                    borderRadius: 1,
                    mr: 1,
                  }}
                />
              </Box>
              <Box>
                <Image
                  alt="assets/images/casino/gallery/mobile/6.jpg"
                  src="assets/images/casino/gallery/mobile/6.jpg"
                  sx={{
                    borderRadius: 1,
                    mr: 1,
                  }}
                />
              </Box>
              <Box>
                <Image
                  alt="assets/images/casino/gallery/mobile/7.jpg"
                  src="assets/images/casino/gallery/mobile/7.jpg"
                  sx={{
                    borderRadius: 1,
                    mr: 1,
                  }}
                />
              </Box>
              <Box>
                <Image
                  alt="assets/images/casino/gallery/mobile/8.jpg"
                  src="assets/images/casino/gallery/mobile/8.jpg"
                  sx={{
                    borderRadius: 1,
                    mr: 1,
                  }}
                />
              </Box>
            </Carousel>
          </CarouselArrows>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        p: (theme) => theme.spacing(5, 1, 5, 1),
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
          borderBottomRightRadius: 0,
        }}
      >
        <Typography variant="h4">
          👍 TOP
          <Typography variant="h4" component="span" ml={1} color="primary">
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
          boxShadow: 'inset 0px 0px 20px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Stack spacing={1.5}>
          <Image
            alt="game1"
            src="https://static.cdneu-stat.com/resources/sitepicstbs/slgames/game_img_2/CowboysGold.jpg"
            sx={{ borderRadius: 2, width: 1, height: 255, cursor: 'pointer' }}
            onClick={() => {
              openGamePlay("/casino/slot/slot_pragmatic/7757/play");
            }}
          />
          <Image
            alt="game1"
            src="https://static.cdneu-stat.com/resources/sitepicstbs/slgames/game_img_2/PiratefromtheEast.jpg"
            sx={{ borderRadius: 2, width: 1, height: 255, cursor: 'pointer' }}
            onClick={() => {
              openGamePlay('/casino/slot/slot_NetEnt/7054/play');
            }}
          />
        </Stack>
        {/* <Stack spacing={1.5}>
          <Image
            alt="game1"
            src="assets/images/casino/gallery/desktop/home_img/8.jpg"
            sx={{ borderRadius: 2, width: 1, height: 255, cursor: 'pointer' }}
            onClick={() => {
              openGamePlay('441');
            }}
          />
          <Image
            alt="game1"
            src="assets/images/casino/gallery/desktop/home_img/7.jpg"
            sx={{ borderRadius: 2, width: 1, height: 255, cursor: 'pointer' }}
            onClick={() => {
              openGamePlay('476');
            }}
          />
        </Stack> */}
        <Stack flexGrow={1}>
          <Image
            alt="game1"
            src="assets/images/casino/gallery/desktop/home_img/1.jpg"
            sx={{ borderRadius: 2, height: 1, minWidth: 230, cursor: 'pointer' }}
            onClick={() => {
              openGamePlay('/casino/live/live_evolution/9682/play');
            }}
          />
        </Stack>
        <Stack spacing={1.5}>
          <Image
            alt="game1"
            src="https://api-2103.ppgames.net/game_pic/square/200/vs10spiritadv.png"
            sx={{ borderRadius: 2, width: 1, height: 255, cursor: 'pointer' }}
            onClick={() => {
              openGamePlay('/casino/slot/REELKINGDOM/vs10spiritadv/play');
            }}
          />
          <Image
            alt="game1"
            src="https://static.cdneu-stat.com/resources/sitepicstbs/evolution_slot_playson/game_img_2/HittheBankHoldandWin.jpg"
            sx={{ borderRadius: 2, width: 1, height: 255, cursor: 'pointer' }}
            onClick={() => {
              openGamePlay('/casino/slot/slot_playson/8209/play');
            }}
          />
        </Stack>
        <Stack spacing={1.5}>
          <Image
            alt="game1"
            src="https://static.cdneu-stat.com/resources/sitepicstbs/xgames/game_img_2/ShakeShakeChristmas.jpg"
            sx={{ borderRadius: 2, width: 1, height: 255, cursor: 'pointer' }}
            onClick={() => {
              openGamePlay('/casino/slot/slot_rubyplay/8380/play');
            }}
          />
          <Image
            alt="game1"
            src="https://static.cdneu-stat.com/resources/sitepicstbs/xgames/game_img_2/LadyRobinHood.jpg"
            sx={{ borderRadius: 2, width: 1, height: 255, cursor: 'pointer' }}
            onClick={() => {
              openGamePlay('/casino/slot/slot_scientific_games/6954/play');
            }}
          />
        </Stack>
        <Stack flexGrow={1}>
          <Image
            alt="game1"
            src="assets/images/casino/gallery/desktop/home_img/2.jpg"
            sx={{ borderRadius: 2, height: 1, minWidth: 230, cursor: 'pointer' }}
            onClick={() => {
              openGamePlay('/casino/live/live_evolution/9295/play');
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HomeGallery;
