import { Typography, Box, Stack, CardMedia, Skeleton } from '@mui/material';
import { API_URL } from 'src/config-global';
import { useLocales } from 'src/locales';
import { useResponsive } from 'src/hooks/use-responsive';
import type { Badge } from 'src/types/mission';

const BADGES = [
  { id: 1, image: '/assets/images/badges/1.png' },
  { id: 2, image: '/assets/images/badges/2.png' },
  { id: 3, image: '/assets/images/badges/3.png' },
  { id: 4, image: '/assets/images/badges/4.png' },
  { id: 5, image: '/assets/images/badges/5.png' },
  { id: 6, image: '/assets/images/badges/6.png' },
];

const styles = {
  container: {
    px: 3,
    py: 2,
    width: 1,
    height: 1,
    gap: 2.5,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  title: {
    fontFamily: 'Geogrotesque Cyr, sans-serif',
    fontWeight: 700,
    fontStyle: 'italic',
    fontSize: '28px',
    lineHeight: '100%',
    letterSpacing: '0%',
    verticalAlign: 'middle',
    textTransform: 'uppercase',
    color: '#A0A3A7',
    transform: 'skew(-5deg)',
    opacity: 1,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    alignSelf: 'flex-start',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(3, 1fr)',
      sm: 'repeat(4, 1fr)',
      customSm: 'repeat(4, 1fr)',
      md: 'repeat(6, 1fr)',
    },
    gap: { xs: 2, sm: 2.5, customSm: 3, md: 2 },
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  },
  badgeImage: {
    width: { xs: 100, sm: 180, customSm: 200, md: 120 },
    aspectRatio: '1/1',
    mx: 'auto',
    objectFit: 'contain',
    borderRadius: 50,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTouchCallout: 'none',
    pointerEvents: 'none',
    cursor: 'default',
  },
  badgeText: {
    fontSize: { xs: 16, sm: 18, customSm: 20, md: 15 },
    fontWeight: 400,
    fontFamily: 'Impact, sans-serif',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  badgeLevel: {
    fontSize: { xs: 16, sm: 18, customSm: 20, md: 15 },
    fontWeight: 400,
    fontFamily: 'Impact, sans-serif',
    textTransform: 'uppercase',
    color: '#ffffffff',
  },
  noBadgesText: {
    color: '#E0E0E0',
    textAlign: 'center',
    width: '100%',
    fontSize: { xs: 16, sm: 18, customSm: 20, md: 15 },
  },
  badgeCount: {
    color: '#FFF',
    fontSize: { xs: 16, sm: 18, customSm: 20, md: 15 },
    fontWeight: 400,
    fontFamily: 'Impact, sans-serif',
    textTransform: 'none',
  },
  badgeCountLabel: {
    color: '#FFF',
    fontSize: { xs: 16, sm: 18, customSm: 20, md: 15 },
    fontWeight: 400,
    fontFamily: 'Impact, sans-serif',
    textTransform: 'none',
  },
};

interface BadgeCardProps {
  badge: Badge;
  isLocked?: boolean;
}

const BadgeCard = ({ badge, isLocked = false }: BadgeCardProps) => {
  const { t } = useLocales();

  return (
    <Stack gap={1}>
      <Box
        sx={{
          position: 'relative',
          width: { xs: 100, sm: 180, customSm: 200, md: 161 },
          height: { xs: 120, sm: 200, customSm: 220, md: 187 },
          mx: 'auto',
          borderRadius: '2px',
          background: '#2B2F3D',
          border: badge.have ? '1px solid' : 'none',
          borderImage: badge.have
            ? 'linear-gradient(306.71deg, #24ee89 44.31%, #24ee89 87.71%) 1'
            : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px',
          opacity: 1,
        }}
      >
        <CardMedia
          component="img"
          src={`${API_URL}/${badge.banner_path}`}
          alt={badge.name}
          sx={{
            width: '80%',
            height: '70%',
            objectFit: 'contain',
            filter: badge.have ? 'none' : 'grayscale(100%)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitTouchCallout: 'none',
            pointerEvents: 'none',
            cursor: 'default',
          }}
        />
        <Typography
          sx={{
            fontFamily: 'Geogrotesque Cyr, sans-serif',
            fontWeight: 500,
            fontStyle: 'normal',
            fontSize: '16px',
            lineHeight: '100%',
            letterSpacing: '0%',
            textAlign: 'center',
            verticalAlign: 'middle',
            textTransform: 'uppercase',
            color: '#A0A3A7',
            whiteSpace: 'nowrap',
            transform: 'skew(-5deg)',
            opacity: 1,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
          }}
        >
          {badge.name}
        </Typography>
      </Box>
    </Stack>
  );
};

type BadgesTabProps = {
  badges: Badge[];
};

export default function BadgesTab({ badges }: BadgesTabProps) {
  const { t } = useLocales();
  const smDown = useResponsive('down', 'sm');
  const isLoading = false;

  const earnedBadges = badges.filter((badge) => badge.have).length;
  const totalBadges = badges.length;

  if (isLoading) {
    return (
      <Stack sx={styles.container}>
        <Skeleton variant="text" sx={styles.title} />
        <Box sx={styles.gridContainer}>
          {[...Array(6)].map((_, index) => (
            <Stack key={index} gap={1}>
              <Skeleton variant="rectangular" sx={styles.badgeImage} />
              <Skeleton variant="text" width="60%" />
            </Stack>
          ))}
        </Box>
      </Stack>
    );
  }

  return (
    <Stack sx={styles.container}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: 1 }}>
        <Typography sx={styles.title}>{t('badges')}</Typography>
        {smDown && (
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography sx={styles.badgeCount}>
              {earnedBadges}/{totalBadges}
            </Typography>
            <Typography sx={styles.badgeCountLabel}>{t('badges collected')}</Typography>
          </Stack>
        )}
      </Stack>

      <Box sx={styles.gridContainer}>
        {badges.length > 0 ? (
          badges.map((badge, index) => <BadgeCard key={index} badge={badge} />)
        ) : (
          <Typography variant="body1" sx={styles.noBadgesText}>
            {t('no_badges_available')}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
