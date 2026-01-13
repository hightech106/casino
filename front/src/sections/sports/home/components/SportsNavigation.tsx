import { useSelector } from 'src/store';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import {
  Box,
  Button,
  Stack,
  Skeleton,
  Typography,
} from '@mui/material';
import Image from 'src/components/image';
import { API_URL } from 'src/config-global';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface SportsNavigationProps {
  activeSport: number;
  onSportChange: (sportId: number) => void;
  isMobile: boolean;
}

export default function SportsNavigation({ activeSport, onSportChange, isMobile }: SportsNavigationProps) {
  const { sports_list } = useSelector((store) => store.sports);

  if (isMobile) {
    return (
      <Stack sx={{
        "& .swiper-button-prev:after, & .swiper-button-next:after": {
          fontSize: 18,
          fontWeight: 900
        },
        "& .swiper-button-prev": {
          color: "white",
          left: -8,
        },
        "& .swiper-button-next": {
          color: "white",
          right: -8,
        }
      }}>
        <Swiper
          slidesPerView="auto"
          spaceBetween={2}
          navigation
          modules={[Navigation]}
          className="mySwiper"
          style={{
            marginTop: 10,
            padding: "0 15px",
          }}
        >
          {sports_list.map((item) => (
            <SwiperSlide key={item.SportId} style={{ background: "transparent", width: "fit-content" }}>
              <Button
                onClick={() => onSportChange(item.SportId)}
                color={activeSport === item.SportId ? 'primary' : 'inherit'}
                sx={{ bgcolor: "background.paper", borderRadius: 1 }}
              >
                <Stack gap={1} alignItems="center">
                  {item.img ? (
                    <Image src={`${API_URL}/${item.img}`} alt={item.SportName} width={25} height={25} />
                  ) : (
                    <Box
                      component="i"
                      className={`sportsicons sportsicon-${item.SportId}`}
                      sx={{ color: item.color, fontSize: 25 }}
                    />
                  )}
                  <Typography fontSize={11}>
                    {item.SportName}
                  </Typography>
                </Stack>
              </Button>
            </SwiperSlide>
          ))}
        </Swiper>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        py: 2,
        px: 2.5,
        gap: 1.25,
        height: 160,
        borderRadius: 0.5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        bgcolor: 'background.paper',
        '& button, .MuiSkeleton-root': {
          width: '11.1111111111%',
          textAlign: 'center',
          height: '100%',
          p: '18px 4px 13px',
          transition: 'all 0.3s',
          borderRadius: '5px',
          display: 'block',
          minWidth: '90px',
        },
        '& i, svg': {
          width: 50,
          height: 50,
          fontSize: 50,
        },
      }}
    >
      <Stack direction="row" overflow="auto" gap={1}>
        {!sports_list.length
          ? [...Array(8)].map((_, index) => <Skeleton key={index} />)
          : sports_list.slice(0, 9).map((item) => (
            <Button
              key={item.SportId}
              sx={{
                minWidth: `110px !important`,
              }}
              onClick={() => onSportChange(item.SportId)}
              variant={activeSport === item.SportId ? 'outlined' : 'text'}
              color={activeSport === item.SportId ? 'primary' : 'inherit'}
            >
              {item.img ? (
                <Image src={`${API_URL}/${item.img}`} alt={item.SportName} width={50} height={52} />
              ) : (
                <Box
                  component="i"
                  className={`sportsicons sportsicon-${item.SportId}`}
                  sx={{ color: item.color }}
                />
              )}
              <Typography fontWeight={activeSport === item.SportId ? 700 : 400}>
                {item.SportName}
              </Typography>
            </Button>
          ))}
      </Stack>
    </Stack>
  );
} 