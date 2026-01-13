import { useState } from 'react';
import { Box, Stack, Typography, Button, Chip } from '@mui/material';
import { Team, LineupData, Player } from './types';
import PlayerCard, { getPositionColor } from './PlayerCard';

interface MatchLineupsProps {
  homeTeamLineup: Team;
  awayTeamLineup: Team;
  apiLineups?: LineupData | null;
}

export default function MatchLineups({
  homeTeamLineup,
  awayTeamLineup,
  apiLineups,
}: MatchLineupsProps) {
  const [showMorePlayers, setShowMorePlayers] = useState(false);

  const homeStartingXI =
    apiLineups?.homeStartingXI ||
    homeTeamLineup.players.filter((p) => p.position !== 'SUB').slice(0, 11);
  const homeSubs =
    apiLineups?.homeSubs || homeTeamLineup.players.filter((p) => p.position === 'SUB');
  const awayStartingXI =
    apiLineups?.awayStartingXI ||
    awayTeamLineup.players.filter((p) => p.position !== 'SUB').slice(0, 11);
  const awaySubs =
    apiLineups?.awaySubs || awayTeamLineup.players.filter((p) => p.position === 'SUB');

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
        {/* Home Team Lineup */}
        <Box sx={{ flex: 1 }}>
          {/* Team Header */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              mb: 2,
              pb: 2,
              borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box component="img" src={homeTeamLineup.crest} sx={{ width: 32, height: 32 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                {homeTeamLineup.name}
              </Typography>
              {apiLineups?.homeFormation && (
                <Chip
                  label={`Formation: ${apiLineups.homeFormation}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(138,43, 226, 0.2)',
                    color: '#FFD700',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 20,
                    mt: 0.5,
                  }}
                />
              )}
            </Box>
          </Stack>

          {/* Starting XI */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: '#FFD700',
                mb: 1.5,
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: 1,
              }}
            >
              STARTING XI ({homeStartingXI.length})
            </Typography>
            <Box>
              {homeStartingXI.length > 0 ? (
                homeStartingXI.map((player, index) => (
                  <PlayerCard key={index} player={player} index={index} />
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#A0A3A7', textAlign: 'center', py: 2 }}>
                  No starting lineup available
                </Typography>
              )}
            </Box>
          </Box>

          {/* Substitutes */}
          {homeSubs.length > 0 && (
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#A0A3A7',
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: 1,
                }}
              >
                SUBSTITUTES ({homeSubs.length})
              </Typography>
              <Box>
                {homeSubs.map((player, index) => (
                  <PlayerCard key={index} player={player} index={index} />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Away Team Lineup */}
        <Box sx={{ flex: 1 }}>
          {/* Team Header */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              mb: 2,
              pb: 2,
              borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box component="img" src={awayTeamLineup.crest} sx={{ width: 32, height: 32 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                {awayTeamLineup.name}
              </Typography>
              {apiLineups?.awayFormation && (
                <Chip
                  label={`Formation: ${apiLineups.awayFormation}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(138,43, 226, 0.2)',
                    color: '#FFD700',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 20,
                    mt: 0.5,
                  }}
                />
              )}
            </Box>
          </Stack>

          {/* Starting XI */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: '#FFD700',
                mb: 1.5,
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: 1,
              }}
            >
              STARTING XI ({awayStartingXI.length})
            </Typography>
            <Box>
              {awayStartingXI.length > 0 ? (
                awayStartingXI.map((player, index) => (
                  <PlayerCard key={index} player={player} index={index} />
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#A0A3A7', textAlign: 'center', py: 2 }}>
                  No starting lineup available
                </Typography>
              )}
            </Box>
          </Box>

          {/* Substitutes */}
          {awaySubs.length > 0 && (
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#A0A3A7',
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: 1,
                }}
              >
                SUBSTITUTES ({awaySubs.length})
              </Typography>
              <Box>
                {awaySubs.map((player, index) => (
                  <PlayerCard key={index} player={player} index={index} />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Stack>
      {/* Position Legend */}
      <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography
          variant="caption"
          sx={{ color: '#A0A3A7', mb: 2, display: 'block', textAlign: 'center' }}
        >
          POSITION LEGEND
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          {[
            { label: 'Goalkeeper', pos: 'G' },
            { label: 'Defender', pos: 'D' },
            { label: 'Midfielder', pos: 'M' },
            { label: 'Forward', pos: 'F' },
          ].map((item) => (
            <Stack key={item.pos} direction="row" alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: getPositionColor(item.pos),
                }}
              />
              <Typography variant="caption" sx={{ color: '#A0A3A7', fontSize: '0.7rem' }}>
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

