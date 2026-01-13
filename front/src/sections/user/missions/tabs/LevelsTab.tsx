import { Typography, Box, Stack, CardMedia, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import type { SvgIconProps } from '@mui/material/SvgIcon';

import { useLocales } from 'src/locales';
import { ShineIcon } from 'src/assets/icons';
import { API_URL } from 'src/config-global';
import Iconify from 'src/components/iconify';
import { useState } from 'react';

import type { Level, UserStats } from 'src/types/mission';
import { cardStyles } from 'src/styles/cardStyles';
import LevelPopup from './LevelPopup';

interface LevelCardProps {
  level: Level;
  isUnlocked: boolean;
  onCardClick: () => void;
}

interface ArrowIconProps extends SvgIconProps {
  isLeftSide?: boolean;
  pointToLeft?: boolean;
}

const LevelCardWrapper = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  width: '160px',
  height: '180px',
  alignItems: 'center',
  position: 'relative',
  cursor: 'pointer',
  transform: 'rotate(0deg)',
  opacity: 1,
  background: '#2B2F3D',
  borderRadius: '12px',
  overflow: 'hidden',
  borderLeft: '3px solid transparent',
  backgroundImage: 'linear-gradient(#2B2F3D, #2B2F3D), linear-gradient(180deg, #24ee89 0%, #FFA800 100%)',
  backgroundOrigin: 'border-box',
  backgroundClip: 'padding-box, border-box',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #232626 0%, #232626 50%, transparent 50%)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderRadius: '20%',
    borderTop: '0px solid transparent',
    borderLeft: '0px solid transparent',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100px',
    height: '120px',
  },
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
}));

const LevelNumber = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '70%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  marginTop: 0,
  marginLeft: 0,
  color: 'transparent',
  WebkitTextStrokeWidth: '1px',
  WebkitTextStrokeColor: '#24ee89',
  fontFamily: 'Impact, sans-serif',
  fontSize: 40,
  fontWeight: 400,
  textTransform: 'uppercase',
  zIndex: 3,
  pointerEvents: 'none',
  [theme.breakpoints.down('sm')]: {
    fontSize: 16,
    top: '70%',
  },
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
}));

const LevelRow = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  position: 'relative',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    py: 0.3,
  },
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
}));

const ArrowIcon = styled('svg')<ArrowIconProps>(({ theme, isLeftSide, pointToLeft }) => ({
  position: 'absolute',
  width: '50vw',
  height: '50vw',
  fill: 'none',
  stroke: '#24ee89',
  strokeWidth: 3,
  strokeDasharray: '6 6',
  filter: 'drop-shadow(10px 10px 7px rgba(0, 0, 0, 0.5))',
  [theme.breakpoints.down('sm')]: {
    width: '50vw',
    height: '50vw',
    strokeWidth: 3,
    strokeDasharray: '6 6',
    right: isLeftSide ? '30%' : 'auto',
    left: isLeftSide ? 'auto' : '30%',
    top: '25%',
    transform: pointToLeft
      ? 'rotate(-45deg) rotateY(180deg) scale(0.8)'
      : 'rotate(45deg) rotateY(0deg) scale(0.8)',
  },
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
}));

const preventDefaultInteractions = (e: React.SyntheticEvent) => {
  e.preventDefault();
};

const LevelCard = ({ level, isUnlocked, onCardClick }: LevelCardProps) => {
  const { t } = useLocales();

  return (
    <LevelCardWrapper
      sx={{
        filter: !isUnlocked ? 'grayscale(100%)' : 'none',
      }}
      onClick={onCardClick}
      onDragStart={preventDefaultInteractions}
      onTouchStart={preventDefaultInteractions}
      onTouchMove={preventDefaultInteractions}
    >
      <Stack alignItems="center" justifyContent="center" position="relative" sx={{ zIndex: 1 }}>
        <CardMedia
          component="img"
          src={level.banner_path ? `${level.banner_path}` : '/assets/images/missions/flag.png'}
          alt={`flag ${level.num}`}
          sx={{
            width: { xs: 40, sm: 100, md: 80 },
            zIndex: 2,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitTouchCallout: 'none',
            pointerEvents: 'none',
            cursor: 'default',
          }}
          draggable={false}
          onDragStart={preventDefaultInteractions}
          onTouchStart={preventDefaultInteractions}
          onTouchMove={preventDefaultInteractions}
        />
        <ShineIcon
          width={{ xs: 40, sm: 100, md: 80 }}
          height={{ xs: 48, sm: 119, md: 95 }}
          sx={{
            position: 'absolute',
            mt: 5,
            zIndex: 2,
          }}
        />
        <LevelNumber>{level.num}</LevelNumber>
      </Stack>
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 500,
          fontFamily: 'Geogrotesque Cyr, sans-serif',
          textTransform: 'uppercase',
          zIndex: 1,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        {t('level')}{' '}
        <Typography
          component="span"
          sx={{
            color: '#24ee89',
            fontSize: 18,
            fontWeight: 500,
            fontFamily: 'Geogrotesque Cyr, sans-serif',
            textTransform: 'uppercase',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
          }}
        >
          {level.num}
        </Typography>
      </Typography>
    </LevelCardWrapper>
  );
};

// LevelsTab Component
type LevelsTabProps = {
  levels: Level[];
  userStats: UserStats;
};

export default function LevelsTab({ levels, userStats }: LevelsTabProps) {
  const { t } = useLocales();

  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  console.log('Levels in LevelsTab:', levels);

  const handleCardClick = (level: Level) => {
    setSelectedLevel(level);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedLevel(null);
  };

  if (!levels.length) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ p: 3 }}>
        <Typography color="error">{t('no_levels_available')}</Typography>
      </Stack>
    );
  }

  return (
    <>
      <Stack
        sx={{
          px: 3,
          py: 1.8,
          width: 1,
          height: 1,
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Geogrotesque Cyr, sans-serif',
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: '28px',
            lineHeight: '100%',
            letterSpacing: '0%',
            textTransform: 'uppercase',
            transform: 'skew(-5deg)',
            color: '#A0A3A7',
            pt: { xs: 2, sm: 0 },
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {t('levels')}
        </Typography>

        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <Stack sx={{ gap: 1 }}>
            {levels.map((level, index) => {
              const isLeftSide = index % 2 === 0;
              const showArrow = index < levels.length - 1;
              const nextIsLeftSide = (index + 1) % 2 === 0;

              return (
                <LevelRow
                  key={index}
                  sx={{
                    justifyContent: isLeftSide ? 'flex-start' : 'flex-end',
                    ml: isLeftSide ? 3 : 0,
                    mr: isLeftSide ? 0 : 2,
                  }}
                >
                  <LevelCard
                    level={level}
                    isUnlocked={level.have}
                    onCardClick={() => handleCardClick(level)}
                  />
                  {showArrow && (
                    <ArrowIcon
                      viewBox="0 0 24 24"
                      isLeftSide={isLeftSide}
                      pointToLeft={nextIsLeftSide}
                    >
                      <path
                        d="M4 12H16M16 12L12 8M16 12L12 16"
                        stroke="#24ee89"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </ArrowIcon>
                  )}
                </LevelRow>
              );
            })}
          </Stack>
        </Box>

        <Box
          sx={{
            display: { xs: 'none', sm: 'grid' },
            gridTemplateColumns: { sm: 'repeat(auto-fit, 160px)', md: 'repeat(5, 160px)' },
            gap: 2,
            justifyContent: 'start',
          }}
        >
          {levels.map((level, index) => (
            <LevelCard
              key={index}
              level={level}
              isUnlocked={level.have}
              onCardClick={() => handleCardClick(level)}
            />
          ))}
        </Box>
      </Stack>

      <LevelPopup
        open={popupOpen}
        onClose={handleClosePopup}
        level={selectedLevel}
        userStats={userStats}
      />
    </>
  );
}
