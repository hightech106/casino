import { Box, Stack, Typography, IconButton } from '@mui/material';
import bgBall1 from '../../../assets/sports/bgBall1.png';
import bgBall2 from '../../../assets/sports/bgBall2.png';
import play from '../../../assets/sports/play.png';
import ground from '../../../assets/sports/ground.png';

interface MatchHeaderProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeCrest: string;
  awayCrest: string;
  children?: React.ReactNode;
}

export default function MatchHeader({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  homeCrest,
  awayCrest,
  children,
}: MatchHeaderProps) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, rgb(124 113 12 / 22%) 0%, transparent)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: 1,
        py: 3,
        mb: 2,
        minHeight: '310px',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0,
        },
      }}
    >
      {/* Background Images */}
      <Box
        component="img"
        src={bgBall1}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: { xs: 120, sm: 150, md: 180 },
          height: 'auto',
          opacity: 0.3,
          zIndex: 0,
        }}
      />
      <Box
        component="img"
        src={bgBall2}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: { xs: 100, sm: 120, md: 140 },
          height: 'auto',
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      {/* Match Info */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pb: 2, gap: { xs: '10px', lg: '30px' }, borderBottom: '1px solid #3A3D4A' }}
      >
        {/* Home Team */}
        <Stack alignItems="center" justifyContent="flex-end" spacing={1} direction="row" flex={1}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 'semibold',
              letterSpacing: 1,
              fontSize: { xs: '12px !important', lg: '24px !important' },
            }}
          >
            {homeTeam}
          </Typography>
          <Box
            component="img"
            src={homeCrest}
            sx={{
              width: { xs: '32px !important', lg: '64px !important' },
              height: { xs: '32px !important', lg: '64px !important' },
              objectFit: 'contain',
            }}
          />
        </Stack>

        {/* Score */}
        <Stack alignItems="center" spacing={1}>
          <Typography
            variant="h1"
            sx={{
              color: '#24ee89',
              fontWeight: 'semibold',
              fontSize: { xs: '24px !important', lg: '48px !important' },
            }}
          >
            {homeScore}:{awayScore}
          </Typography>
        </Stack>

        {/* Away Team */}
        <Stack alignItems="center" spacing={1} direction="row" flex={1}>
          <Box
            component="img"
            src={awayCrest}
            sx={{
              width: { xs: '32px !important', lg: '64px !important' },
              height: { xs: '32px !important', lg: '64px !important' },
              objectFit: 'contain',
            }}
          />
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 'semibold',
              letterSpacing: 1,
              fontSize: { xs: '12px !important', lg: '24px !important' },
            }}
          >
            {awayTeam}
          </Typography>
        </Stack>
      </Stack>

      {/* Action Buttons */}
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mt={2}>
        <IconButton sx={{ color: '#A0A3A7' }}>
          <Box component="img" src={play} sx={{ height: 17 }} />
        </IconButton>
        <IconButton sx={{ color: '#A0A3A7' }}>
          <Box component="img" src={ground} sx={{ height: 17 }} />
        </IconButton>
      </Stack>

      {/* Children (Tabs and Content) */}
      {children}
    </Box>
  );
}

