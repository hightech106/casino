// react
import { useMemo } from 'react';
// @mui
import { Typography, Stack, Grid, Box, Button, Link } from '@mui/material';
import { useSelector } from 'src/store';
import { API_URL } from 'src/config-global';
import VIPProgressBox from './Vip-progress-box';
// Функция для выделения цифр, процентов и определенных слов желтым цветом
const highlightText = (text: string) => {
  const parts = text.split(/(\d+%?|\b(?:luckverse777|casino|bonus|register|500)\b)/gi);

  return parts.map((part, index) => {
    const isHighlight =
      /^\d+%?$/.test(part) || /^(?:luckverse777|casino|bonus||register|deposit)$/i.test(part);

    return (
      <Box
        component="span"
        key={index}
        sx={{
          color: isHighlight ? '#24ee89' : 'inherit',
          fontWeight: isHighlight ? 'bold' : 'inherit',
        }}
      >
        {part}
      </Box>
    );
  });
};
// ----------------------------------------------------------------------
interface Props {
  second?: boolean;
  openDailyWheel?: () => void;
}
const HomeBanner = ({ openDailyWheel, second }: Props) => {
  const banners = useSelector((store) => store.config.banners);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const filterBanners = useMemo(() => banners.filter((e) => e.type === 'casino'), [banners]);
  const renderMainBanner = () => {
    if (filterBanners.length) {
      const banner = filterBanners[0]; // Берем первый баннер

      // Определяем адаптивное изображение
      const getAdaptiveImage = () => {
        if (banner.adaptiveImage) {
          return banner.adaptiveImage;
        }
        // Fallback к старому полю image
        return banner.image;
      };

      return (
        <Stack
          sx={{
            position: 'relative',
            height: { xs: 500, sm: 450, md: 350 },
            minHeight: { xs: 500, sm: 450, md: 350 },
            borderRadius: 1,
            overflow: 'hidden',
            backgroundImage: `url(${API_URL}/${getAdaptiveImage()})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Контент в нижней части баннера */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              top: { xs: '50%', sm: '45%', md: '25%', lg: '25%', xl: '20%' }, // Подняли текст выше для md (ноутбук) до 25%, оставили lg+ как есть для стабильного позиционирования текста на ПК
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between', // Распределяем контент: текст сверху, кнопка снизу
              alignItems: { xs: 'center', md: 'flex-start' },
              px: { xs: 3, sm: 4, md: 5 },
              py: { xs: 2, sm: 3, md: 1.2 }, // Уменьшили py на md+ для компактности и предотвращения выхода за пределы
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: { md: '40%', lg: '35%' }, // Чуть шире на md для меньшего сжатия текста
            }}
          >
            {/* Контейнер для текста */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              {/* Title */}
              <Typography
                variant="h2"
                sx={{
                  color: '#FFFFFF',
                  fontFamily: '"Impact", "CircularStd", "Oswald", sans-serif',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: { xs: '28px', sm: '32px', md: '20px', lg: '26px', xl: '30px' }, // Меньше на md (ноутбук), плавный рост на lg/xl без сильного сжатия
                  lineHeight: 1.2, // Увеличили lineHeight для меньшего сжатия
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  mb: { xs: 1.5, md: 0.8 }, // Уменьшили mb на md+ для подъема кнопки ближе к тексту
                  wordWrap: 'break-word',
                  hyphens: 'none', // Убрали hyphens для меньшего "сжатия" текста
                  transform: 'skewX(-5deg)', // Легкий наклон вправо
                  transformOrigin: 'left center',
                }}
              >
                {highlightText(banner.title)}
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Geogrotesque Cyr, sans-serif !important',
                  fontWeight: '500 !important',
                  fontSize: '14px !important',
                  lineHeight: '100% !important',
                  letterSpacing: '0% !important',
                  textAlign: { xs: 'center', md: 'left' },
                  mb: { xs: 1, md: 0.3 },
                  wordWrap: 'break-word',
                  hyphens: 'none',
                  transform: 'skewX(-5deg)', // Легкий наклон текста вправо
                  transformOrigin: 'left center',
                }}
              >
                {highlightText(banner.description)}
              </Typography>
            </Box>
          </Box>

          {/* Кнопка */}
          {banner.button && (
            <Link href={banner.link} style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                sx={{
                  position: 'absolute',
                  // Для мобильных - по центру, для ПК - справа, но выше
                  right: { xs: '50%', md: 16 },
                  bottom: { xs: 60, md: 60 }, // Подняли кнопку выше
                  transform: { xs: 'translateX(50%) skewX(-5deg)', md: 'skewX(-5deg)' },
                  backgroundColor: '#24ee89',
                  color: '#050514',
                  fontFamily: '"Impact", "CircularStd", "Oswald", sans-serif',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  letterSpacing: '0.05rem',
                  fontSize: {
                    xs: '13px',
                    sm: '14px',
                    md: '11px',
                    lg: '13px',
                    xl: '15px',
                  },
                  px: { xs: 2.5, sm: 3, md: 2, lg: 3, xl: 4 },
                  py: { xs: 1.2, sm: 1.3, md: 0.6, lg: 1.0, xl: 1.2 },
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  transformOrigin: 'left center',
                  '&:hover': {
                    backgroundColor: '#E6D017',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
                  },
                }}
              >
                {banner.button_name}
              </Button>
            </Link>
          )}
        </Stack>
      );
    }

    // Дефолтный баннер если нет баннера из БД
    return (
      <Stack
        sx={{
          backgroundImage: `url(/assets/banners/home/main.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          p: { xs: 3.5, sm: 4 },
          borderRadius: 1,
          height: { xs: 500, sm: 'auto' },
          minHeight: { xs: 500, sm: 300 },
        }}
      />
    );
  };
  return (
    <>
      <Stack position="relative"  overflow="hidden">
        <Grid container spacing={2} sx={{ mt: -4 }}>
          {/* Main Banner with VIP Progress */}
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                {renderMainBanner()}
              </Grid>
              <Grid item xs={12} md={3}>
                <VIPProgressBox isLoggedIn={isLoggedIn} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};
export default HomeBanner;
