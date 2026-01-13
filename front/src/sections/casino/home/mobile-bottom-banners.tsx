import { useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useMediaQuery } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';
// hooks
import { usePathname } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useLocales } from 'src/locales';
import { useSelector } from 'src/store';
import { API_URL } from 'src/config-global';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// ----------------------------------------------------------------------

export default function MobileBottomBanners() {
  const { currentLang } = useLocales();
  const pathname = usePathname();
  const isSmMobile = useMediaQuery('(max-width:520px)');

  // Получаем баннеры из состояния
  const banners = useSelector((store) => store.config.banners);

  // Показываем только на страницах казино для мобильных
  const isCasinoRoute = pathname.startsWith(`/${currentLang.value}${paths.casino.root}`);
  const isUserRoute = pathname.startsWith(`/${currentLang.value}${paths.user.root}`);
  
  if (!isSmMobile || !isCasinoRoute || isUserRoute) {
    return null;
  }

  // Фильтруем баннеры для сайдбара (casino-sidebar-right-1 до casino-sidebar-right-6)
  const sidebarBanners = banners
    .filter(
      (banner) => banner.type && banner.type.startsWith('casino-sidebar-right') && banner.status
    )
    .sort((a, b) => {
      // Сортируем по номеру в конце типа
      const getNumber = (type: string) => {
        const match = type.match(/casino-sidebar-right-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      };
      return getNumber(a.type) - getNumber(b.type);
    })
    .slice(0, 6); // Берем только первые 6

  if (sidebarBanners.length === 0) {
    return null;
  }

  // Функция для обработки title (второе слово желтым)
  const formatTitle = (title: string) => {
    const words = title.split(' ');
    if (words.length < 2) {
      return <span>{title}</span>;
    }
    
    return (
      <span>
        {words[0]}{' '}
        <span style={{ color: '#24ee89' }}>{words[1]}</span>
        {words.length > 2 && ` ${words.slice(2).join(' ')}`}
      </span>
    );
  };

  return (
    <Box
      sx={{
        position: 'static', // Изменили на static
        mt: 3, // Отступ сверху
        mb: 2, // Отступ снизу перед футером
        px: 2,
      }}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={10}
        slidesPerView={2}
        centeredSlides={false}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
      >
        {sidebarBanners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <Box
              sx={{
                position: 'relative',
                height: 120,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                backgroundImage: banner.image ? `url(${API_URL}/${banner.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: banner.image ? 'transparent' : '#222532',
                overflow: 'hidden',
                border: '1px solid #2B2F3D',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: banner.image ? 'rgba(0, 0, 0, 0.4)' : 'transparent',
                  zIndex: 1,
                },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  backgroundColor: banner.image ? 'transparent' : '#2A2D3A',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  '&::before': {
                    background: banner.image ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                  },
                },
              }}
            >
              {/* Контент баннера */}
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 2,
                  p: 1.5,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{
                    color: '#FFFFFF',
                    fontFamily: '"Impact", "CircularStd", sans-serif',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    fontSize: '16px',
                    lineHeight: 1.2,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    mb: 0.5,
                    textAlign: 'left',
                  }}
                >
                  {formatTitle(banner.title)}
                </Typography>

                {/* Description */}
                {banner.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#CCCCCC',
                      fontSize: '12px',
                      lineHeight: 1.3,
                      textAlign: 'left',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 0.5,
                    }}
                  >
                    {banner.description}
                  </Typography>
                )}

                {/* Text Link */}
                {banner.text_link_name && banner.text_link_url && (
                  <Link
                    href={banner.text_link_url}
                    underline="none"
                    sx={{
                      color: '#24ee89 !important',
                      fontSize: '12px !important',
                      fontWeight: '400 !important',
                      fontStyle: 'italic !important',
                      fontFamily: '"Impact", "CircularStd", sans-serif !important',
                      textDecoration: 'none !important',
                      textShadow: 'none !important',
                      textTransform: 'uppercase !important',
                      lineHeight: '1 !important',
                      letterSpacing: '0.05em !important',
                      textAlign: 'left !important',
                      display: 'block !important',
                      '&:hover': {
                        color: '#FFF !important',
                        textDecoration: 'none !important',
                      },
                    }}
                  >
                    {banner.text_link_name}
                  </Link>
                )}
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}