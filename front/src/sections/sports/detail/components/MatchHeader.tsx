import { Box, Stack, Typography, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import LiveMatch from 'src/components/sports/LiveMatch';
import type { ISportsEvent } from 'src/types';
import bgHeader from '../../../../assets/sports/bgHeader.png';
import ball from '../../../../assets/sports/ball.png';
import pin from '../../../../assets/sports/pin.png';
import SoccerLiveStream from '../soccer-live-stream';

// ----------------------------------------------------------------------

interface MatchHeaderProps {
  event: ISportsEvent;
  matchStatus: 'live' | 'finished' | 'upcoming';
  homeScore: number;
  awayScore: number;
  homeCrest: string;
  awayCrest: string;
  currentMinute: number;
  matchEvents: any[];
  fallbackStats: {
    homeAttacks: number;
    awayAttacks: number;
    homePossession: number;
    awayPossession: number;
  };
  passedLeagueInfo?: any;
  handleImageError: (imageId: string) => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

export default function MatchHeader({
  event,
  matchStatus,
  homeScore,
  awayScore,
  homeCrest,
  awayCrest,
  currentMinute,
  matchEvents,
  fallbackStats,
  passedLeagueInfo,
  handleImageError,
  isFavorite,
  toggleFavorite,
}: MatchHeaderProps) {
  if (matchStatus === 'live') {
    return (
      <LiveMatch
        homeTeam={event.home?.name?.toUpperCase() || 'HOME'}
        awayTeam={event.away?.name?.toUpperCase() || 'AWAY'}
        homeScore={homeScore}
        awayScore={awayScore}
        homeCrest={homeCrest}
        awayCrest={awayCrest}
        currentMinute={currentMinute}
        isLive
        statistics={event.stats?.statistics}
        lineups={event.stats?.lineups}
        timeline={event.events}
        players={event.stats?.players}
        homeAttacks={fallbackStats.homeAttacks}
        awayAttacks={fallbackStats.awayAttacks}
        homePossession={fallbackStats.homePossession}
        awayPossession={fallbackStats.awayPossession}
        leagueName={event.league?.name}
        matchEvents={matchEvents}
        gameId={event.id.toString()}
        sport={event.sport_id.toString()}
      />
    );
  }

  // Original match header for upcoming matches
  return (
    <Box
      sx={{
        background: `url("${bgHeader}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: 1,
        p: 3,
        mb: 2,
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2, gap: '30px' }}
      >
        <Stack alignItems="center" justifyContent="flex-end" spacing={1} direction="row" flex={1}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 'semibold',
              letterSpacing: 1,
              fontSize: '24px !important',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {event.home?.name?.toUpperCase() || 'HOME'}
          </Typography>
          <Box
            component="img"
            src={homeCrest}
            onError={() => handleImageError(`home-${event.id}`)}
            sx={{ width: 64, height: 64, objectFit: 'contain' }}
          />
        </Stack>

        <Stack alignItems="center" spacing={1}>
          <Typography
            variant="h1"
            sx={{ color: '#24ee89', fontWeight: 'semibold', fontSize: '48px !important' }}
          >
            {homeScore}:{awayScore}
          </Typography>
        </Stack>

        <Stack alignItems="center" spacing={1} direction="row" flex={1}>
          <Box
            component="img"
            src={awayCrest}
            onError={() => handleImageError(`away-${event.id}`)}
            sx={{ width: 64, height: 64, objectFit: 'contain' }}
          />
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 'semibold',
              letterSpacing: 1,
              fontSize: '24px !important',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {event.away?.name?.toUpperCase() || 'AWAY'}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
        <Box component="img" src={ball} sx={{ width: 16, height: 16 }} />
        <Typography variant="body1" sx={{ color: '#A0A3A7', fontSize: '0.9rem' }}>
          {passedLeagueInfo?.name ||
            (event.league as any)?.name ||
            event.league?.name ||
            'League'}
        </Typography>
      </Stack>

      {/* Countdown Timer for upcoming matches */}
      {matchStatus === 'upcoming' && event.time && (
        <Stack alignItems="center" spacing={1} sx={{ mb: 2, mt: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {(() => {
              const matchTime = new Date(event.time * 1000);
              const now = new Date();
              const diff = matchTime.getTime() - now.getTime();

              if (diff <= 0) {
                return (
                  <Typography variant="h6" sx={{ color: '#24ee89', fontWeight: 700 }}>
                    Match Starting Soon
                  </Typography>
                );
              }

              const hours = Math.floor(diff / (1000 * 60 * 60));
              const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((diff % (1000 * 60)) / 1000);

              return (
                <>
                  <Stack alignItems="center">
                    <Box
                      sx={{
                        bgcolor: '#5A5D68',
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        minWidth: 60,
                        textAlign: 'center',
                        border: '1px solid #5A5D68',
                      }}
                    >
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                        {hours.toString().padStart(2, '0')}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ color: '#A0A3A7', fontSize: '0.7rem', mt: 0.5 }}
                    >
                      HOURS
                    </Typography>
                  </Stack>
                  <Typography variant="h4" sx={{ color: '#A0A3A7', fontWeight: 700 }}>
                    :
                  </Typography>
                  <Stack alignItems="center">
                    <Box
                      sx={{
                        bgcolor: '#5A5D68',
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        minWidth: 60,
                        textAlign: 'center',
                        border: '1px solid #5A5D68',
                      }}
                    >
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                        {minutes.toString().padStart(2, '0')}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ color: '#A0A3A7', fontSize: '0.7rem', mt: 0.5 }}
                    >
                      MINUTES
                    </Typography>
                  </Stack>
                  <Typography variant="h4" sx={{ color: '#A0A3A7', fontWeight: 700 }}>
                    :
                  </Typography>
                  <Stack alignItems="center">
                    <Box
                      sx={{
                        bgcolor: '#5A5D68',
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        minWidth: 60,
                        textAlign: 'center',
                        border: '1px solid #5A5D68',
                      }}
                    >
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                        {seconds.toString().padStart(2, '0')}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ color: '#A0A3A7', fontSize: '0.7rem', mt: 0.5 }}
                    >
                      SECONDS
                    </Typography>
                  </Stack>
                </>
              );
            })()}
          </Stack>
        </Stack>
      )}

      {/* Pushpin, Star and Time */}
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
        <Box component="img" src={pin} sx={{ width: 16, height: 16 }} />
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            if (event.id) toggleFavorite(event.id);
          }}
          sx={{ p: 0.5 }}
        >
          <Iconify
            icon={
              isFavorite(event.id || 0)
                ? 'material-symbols:star'
                : 'material-symbols:star-outline'
            }
            sx={{
              width: 16,
              height: 16,
              color: isFavorite(event.id || 0) ? '#24ee89' : 'white',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#24ee89',
                transform: 'scale(1.1)',
              },
            }}
          />
        </IconButton>
        <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem' }}>
          {(() => {
            if (event.f_status?.elapsed) {
              return `${event.f_status.elapsed}' ${event.f_status.short}`;
            }
            if (event.time) {
              return new Date(event.time * 1000).toLocaleTimeString();
            }
            return 'Match Time';
          })()}
        </Typography>
      </Stack>
    </Box>
  );
}
