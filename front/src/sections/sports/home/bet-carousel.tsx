// @mui
import { Box, Stack, Typography } from '@mui/material';

// components
import Carousel, { CarouselDots, CarouselArrows, useCarousel } from 'src/components/carousel';
import { useLocales } from 'src/locales';
import { useResponsive } from 'src/hooks/use-responsive';
import type { ISportsEvent, ISportsMatch } from 'src/types';
import BetCard from './bet-card';
import { BetCardSkeleton } from './skeleton';

// ------------------./bet-card-------------------------------------------
type Props = {
  sportId: number;
  data: ISportsMatch[];
  loading: boolean;
};

const BetCarousel = ({ sportId, data, loading }: Props) => {
  const { t } = useLocales();
  const isMobile = useResponsive('down', 'md');

  const carousel = useCarousel({
    // autoplay: true,
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

  if (!data.length)
    return (
      <Typography variant="h6" textAlign="center">
        {t("events_not_available")}
      </Typography>
    );

  let list = data.reduce((acc, row, i) => {
    const _e = row.events.map((e) => ({
      ...e,
    }));
    acc = [...acc, ..._e];
    return acc;
  }, [] as any[]);

  if (!isMobile) {
    list = list.reduce((acc, obj, i) => {
      if (i % 2 === 0) {
        acc.push([obj]);
      } else {
        acc[acc.length - 1].push(obj);
      }
      return acc;
    }, [] as any[]);
  }

  return (
    <Box
      sx={{
        position: 'relative',
        '& .component-image.MuiBox-root': {
          width: 1,
          borderRadius: 0.5,
          height: { xs: 150, sm: 300, md: 400 },
        },
      }}
    >
      <CarouselArrows filled shape="rounded" onNext={carousel.onNext} onPrev={carousel.onPrev}>
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {loading
            ? [...Array(5)].map((_, index) => <CarouselItemSkeleton key={index} />)
            : list
              .slice(0, 10)
              .map((item, index: number) => (
                <CarouselItem key={index} item={isMobile ? [item] : item} sportId={sportId} />
              ))}
        </Carousel>
      </CarouselArrows>
    </Box>
  );
};

export default BetCarousel;

const CarouselItem = ({ item, sportId }: { item: ISportsEvent[]; sportId: number }) => {
  const isMobile = useResponsive('down', 'md');

  return (
    <Stack direction="row" gap={1}>
      {item.map((row, index: number) => (
        <BetCard key={index} data={row} sportId={sportId} />
      ))}
      {!isMobile && item.length === 1 && <Box width={1} />}
    </Stack>
  );
};

const CarouselItemSkeleton = () => {
  const isMobile = useResponsive('down', 'md');

  return (
    <Stack flexDirection="row" gap={1}>
      <BetCardSkeleton />
      {!isMobile && <BetCardSkeleton />}
    </Stack>
  );
};
