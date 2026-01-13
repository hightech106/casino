import { useState } from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import type { MatchEvent } from './types';
import ball from '../../../assets/sports/ball.png';
import yellowCard from '../../../assets/sports/yellowCard.png';
import redCard from '../../../assets/sports/redCard.png';
import corner from '../../../assets/sports/corner.png';
import penalty from '../../../assets/sports/penalty.png';
import out from '../../../assets/sports/out.png';

interface MatchTimelineProps {
  matchEvents: MatchEvent[];
  currentMinute: number;
  homeScore: number;
  awayScore: number;
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'goal':
      return <Box component="img" src={ball} sx={{ width: 20, height: 20 }} />;
    case 'yellow_card':
      return <Box component="img" src={yellowCard} sx={{ width: 18, height: 18 }} />;
    case 'red_card':
      return <Box component="img" src={redCard} sx={{ width: 18, height: 18 }} />;
    case 'foul':
      return <Box component="img" src={penalty} sx={{ width: 18, height: 18 }} />;
    case 'corner':
      return <Box component="img" src={corner} sx={{ width: 18, height: 18 }} />;
    case 'substitution':
      return <Box component="img" src={out} sx={{ width: 20, height: 20 }} />;
    case 'double_substitution':
      return <Box component="img" src={out} sx={{ width: 20, height: 20 }} />;
    default:
      return <Box sx={{ width: 18, height: 18, bgcolor: '#A0A3A7', borderRadius: 0.5 }} />;
  }
};

export default function MatchTimeline({
  matchEvents,
  currentMinute,
  homeScore,
  awayScore,
}: MatchTimelineProps) {
  const [showMoreEvents, setShowMoreEvents] = useState(false);
  const maxMinute = 90;
  const matchCurrentMinute = currentMinute || 45;

  // Calculate progress percentage
  const progressPercentage = Math.min((matchCurrentMinute / maxMinute) * 100, 100);

  // Get events for the progress bar
  const eventsForBar = matchEvents.filter((event) => event.minute <= matchCurrentMinute);

  return (
    <Box sx={{ p: 3 }}>
      {/* Match Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ position: 'relative', height: 60 }}>
          {/* Progress Bar Background */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 8,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 4,
              transform: 'translateY(-50%)',
            }}
          />

          {/* Progress Bar Fill */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              height: 8,
              width: `${progressPercentage}%`,
              bgcolor: '#15FF00',
              borderRadius: 4,
              transform: 'translateY(-50%)',
            }}
          />

          {/* Current Position Indicator */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: `${progressPercentage}%`,
              width: 16,
              height: 16,
              bgcolor: '#15FF00',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              border: '2px solid white',
              zIndex: 2,
            }}
          />

          {/* Minute Markers */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%' }}>
            <Typography
              variant="caption"
              sx={{ color: 'white', position: 'absolute', left: 0, top: 35 }}
            >
              0
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                position: 'absolute',
                left: '50%',
                top: 35,
                transform: 'translateX(-50%)',
              }}
            >
              45
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'white', position: 'absolute', right: 0, top: 35 }}
            >
              90
            </Typography>
          </Box>

          {/* Event Icons on Progress Bar */}
          {eventsForBar.map((event) => {
            const positionPercentage = (event.minute / maxMinute) * 100;
            return (
              <Box
                key={`bar-${event.id}`}
                sx={{
                  position: 'absolute',
                  top: '10px',
                  left: `${positionPercentage}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3,
                }}
              >
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getEventIcon(event.type)}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Separator Line */}
      <Box sx={{ height: 1, bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 4 }} />

      {/* Match Events List */}
      {matchEvents.length > 0 ? (
        <Box sx={{ position: 'relative' }}>
          {/* Events List */}
          <Stack
            spacing={2}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {(showMoreEvents ? matchEvents : matchEvents.slice(0, 6)).map((event) => (
              <Box
                key={event.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {/* Event Icon */}
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                  }}
                >
                  {getEventIcon(event.type)}
                </Box>

                {/* Event Player */}
                <Typography
                  variant="body2"
                  sx={{
                    color: event.team === 'home' ? '#F1292C' : '#13DE5A',
                    fontSize: '0.875rem',
                    fontWeight: 400,
                  }}
                >
                  {event.player}
                </Typography>

                {/* Event Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: event.team === 'home' ? '#F1292C' : '#13DE5A',
                    fontSize: '0.875rem',
                    fontWeight: 400,
                  }}
                >
                  {event.description}
                </Typography>

                {/* Minute Marker */}
                <Typography
                  variant="body2"
                  sx={{
                    color: event.team === 'home' ? '#F1292C' : '#13DE5A',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {event.minute}&apos;
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* Show More Button */}
          {matchEvents.length > 6 && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                sx={{
                  color: 'white',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                onClick={() => setShowMoreEvents(!showMoreEvents)}
              >
                {showMoreEvents ? 'Show Less' : 'Show More'}
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" sx={{ color: '#A0A3A7' }}>
            No match events available yet.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
