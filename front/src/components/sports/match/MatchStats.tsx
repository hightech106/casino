import { Box, Stack, Typography } from '@mui/material';
import { MatchStatsData, AdditionalStats } from './types';
import corner from '../../../assets/sports/corner.png';
import redCard from '../../../assets/sports/redCard.png';
import yellowCard from '../../../assets/sports/yellowCard.png';
import forward from '../../../assets/sports/forward.png';
import doubleForward from '../../../assets/sports/doubleForward.png';

interface MatchStatsProps {
  stats: MatchStatsData;
  additionalStats?: AdditionalStats | null;
}

export default function MatchStats({ stats, additionalStats }: MatchStatsProps) {
  return (
    <Box sx={{ p: 3 }}>
      {/* Top Row - Main Statistics */}
      <Stack direction="row" spacing={{ xs: 0, sm: 2 }} sx={{ mb: 4 }}>
        {/* Attacks */}
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              mb: 2,
              fontWeight: 600,
              fontSize: { xs: '0.6rem', lg: '0.875rem' },
            }}
          >
            Off Target
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems="center"
            justifyContent="center"
            spacing={{ xs: 1, sm: 2 }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              {stats.attacks.home}
            </Typography>
            <Box sx={{ position: 'relative', width: 40, height: 40 }}>
              <Box
                sx={{
                  position: 'absolute',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '3px solid #FF0000',
                  borderTop: '3px solid transparent',
                  borderRight: '3px solid transparent',
                  transform: 'rotate(-45deg)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '3px solid #00FF00',
                  borderBottom: '3px solid transparent',
                  borderLeft: '3px solid transparent',
                  transform: 'rotate(-45deg)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                <Box component="img" src={forward} sx={{ width: 18, height: 18 }} />
              </Box>
            </Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              {stats.attacks.away}
            </Typography>
          </Stack>
        </Box>

        {/* Dangerous Attacks */}
        <Box
          sx={{
            flex: 1,
            textAlign: 'center',
            borderLeft: { xs: '0px', sm: '1px solid rgb(72, 72, 73)' },
            borderRight: { xs: '0px', sm: '1px solid rgb(72, 72, 73)' },
            minWidth: { xs: '180px', sm: 'auto' },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              mb: 2,
              fontWeight: 600,
              fontSize: { xs: '0.6rem', lg: '0.875rem' },
            }}
          >
            On Target
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems="center"
            justifyContent="center"
            spacing={{ xs: 1, sm: 2 }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              {stats.dangerousAttacks.home}
            </Typography>
            <Box
              sx={{
                position: 'relative',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '3px solid #FF0000',
                  borderTop: '3px solid transparent',
                  borderRight: '3px solid transparent',
                  transform: 'rotate(-45deg)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '3px solid #00FF00',
                  borderBottom: '3px solid transparent',
                  borderLeft: '3px solid transparent',
                  transform: 'rotate(-45deg)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                <Box component="img" src={doubleForward} sx={{ width: 18, height: 18 }} />
              </Box>
            </Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              {stats.dangerousAttacks.away}
            </Typography>
          </Stack>
        </Box>

        {/* Possession */}
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              mb: 2,
              fontWeight: 600,
              fontSize: { xs: '0.6rem', lg: '0.875rem' },
            }}
          >
            POSSESSION %
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems="center"
            justifyContent="center"
            spacing={{ xs: 1, sm: 2 }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              {stats.possession.home}
            </Typography>
            <Box
              sx={{
                position: 'relative',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '3px solid #FF0000',
                  borderTop: '3px solid transparent',
                  borderRight: '3px solid transparent',
                  transform: 'rotate(-45deg)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '3px solid #00FF00',
                  borderBottom: '3px solid transparent',
                  borderLeft: '3px solid transparent',
                  transform: 'rotate(-45deg)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                %
              </Box>
            </Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              {stats.possession.away}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      {/* Bottom Row - Detailed Statistics */}
      <Stack direction="row" spacing={{ xs: 3, sm: 3 }} alignItems="center">
        {/* Left Cards */}
        <Stack
          direction="row"
          spacing={1}
          flex={1}
          justifyContent={{ xs: 'center', sm: 'flex-end' }}
        >
          <Stack alignItems="center" spacing={0.5}>
            <Box component="img" src={corner} sx={{ width: 16, height: 24 }} />
            <Typography variant="caption" sx={{ color: 'white', fontSize: '12px' }}>
              {stats.corners.home}
            </Typography>
          </Stack>
          <Stack alignItems="center" spacing={0.5}>
            <Box component="img" src={redCard} sx={{ width: 16, height: 24 }} />
            <Typography variant="caption" sx={{ color: 'white', fontSize: '12px' }}>
              {stats.redCards.home}
            </Typography>
          </Stack>
          <Stack alignItems="center" spacing={0.5}>
            <Box component="img" src={yellowCard} sx={{ width: 16, height: 24 }} />
            <Typography variant="caption" sx={{ color: 'white', fontSize: '12px' }}>
              {stats.yellowCards.home}
            </Typography>
          </Stack>
        </Stack>

        {/* Right Cards */}
        <Stack
          direction="row"
          spacing={1}
          flex={1}
          justifyContent={{ xs: 'center', sm: 'flex-start' }}
        >
          <Stack alignItems="center" spacing={0.5}>
            <Box component="img" src={corner} sx={{ width: 16, height: 24 }} />
            <Typography variant="caption" sx={{ color: 'white', fontSize: '12px' }}>
              {stats.corners.away}
            </Typography>
          </Stack>
          <Stack alignItems="center" spacing={0.5}>
            <Box component="img" src={redCard} sx={{ width: 16, height: 24 }} />
            <Typography variant="caption" sx={{ color: 'white', fontSize: '12px' }}>
              {stats.redCards.away}
            </Typography>
          </Stack>
          <Stack alignItems="center" spacing={0.5}>
            <Box component="img" src={yellowCard} sx={{ width: 16, height: 24 }} />
            <Typography variant="caption" sx={{ color: 'white', fontSize: '12px' }}>
              {stats.yellowCards.away}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* Additional Statistics Section */}
      {additionalStats && (
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgb(72, 72, 73)' }}>
          {/* Row 1: Shots Statistics */}
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ mb: 2 }}>
            {/* Shots Off Goal */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'grey',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', lg: '0.875rem' },
                }}
              >
                SHOTS OFF GOAL
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.shotsOffGoal.home}
                </Typography>
                <Box
                  sx={{
                    flex:1,
                    width: 80,
                    height: 6,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${
                        (additionalStats.shotsOffGoal.home /
                          (additionalStats.shotsOffGoal.home + additionalStats.shotsOffGoal.away ||
                            1)) *
                        100
                      }%`,
                      height: '100%',
                      bgcolor: '#FF0000',
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.shotsOffGoal.away}
                </Typography>
              </Stack>
            </Box>

            {/* Blocked Shots */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'grey',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', lg: '0.875rem' },
                }}
              >
                BLOCKED SHOTS
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.blockedShots.home}
                </Typography>
                <Box
                  sx={{
                    flex:1,
                    width: 80,
                    height: 6,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${
                        (additionalStats.blockedShots.home /
                          (additionalStats.blockedShots.home + additionalStats.blockedShots.away ||
                            1)) *
                        100
                      }%`,
                      height: '100%',
                      bgcolor: '#FF0000',
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.blockedShots.away}
                </Typography>
              </Stack>
            </Box>

            {/* Goalkeeper Saves */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'grey',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', lg: '0.875rem' },
                }}
              >
                GOALKEEPER SAVES
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.goalkeeperSaves.home}
                </Typography>
                <Box
                  sx={{
                    flex:1,
                    width: 80,
                    height: 6,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${
                        (additionalStats.goalkeeperSaves.home /
                          (additionalStats.goalkeeperSaves.home +
                            additionalStats.goalkeeperSaves.away || 1)) *
                        100
                      }%`,
                      height: '100%',
                      bgcolor: '#00FF00',
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.goalkeeperSaves.away}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {/* Row 2: Shot Location Statistics */}
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ mb: 2 }}>
            {/* Shots Inside Box */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'grey',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', lg: '0.875rem' },
                }}
              >
                SHOTS INSIDE BOX
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.shotsInsideBox.home}
                </Typography>
                <Box
                  sx={{
                    flex:1,
                    width: 80,
                    height: 6,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${
                        (additionalStats.shotsInsideBox.home /
                          (additionalStats.shotsInsideBox.home +
                            additionalStats.shotsInsideBox.away || 1)) *
                        100
                      }%`,
                      height: '100%',
                      bgcolor: '#FF0000',
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.shotsInsideBox.away}
                </Typography>
              </Stack>
            </Box>

            {/* Shots Outside Box */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'grey',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', lg: '0.875rem' },
                }}
              >
                SHOTS OUTSIDE BOX
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.shotsOutsideBox.home}
                </Typography>
                <Box
                  sx={{
                    flex:1,
                    width: 80,
                    height: 6,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${
                        (additionalStats.shotsOutsideBox.home /
                          (additionalStats.shotsOutsideBox.home +
                            additionalStats.shotsOutsideBox.away || 1)) *
                        100
                      }%`,
                      height: '100%',
                      bgcolor: '#FF0000',
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.shotsOutsideBox.away}
                </Typography>
              </Stack>
            </Box>

            {/* Expected Goals */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'grey',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', lg: '0.875rem' },
                }}
              >
                EXPECTED GOALS (xG)
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="h6" sx={{ color: '#24ee89', fontWeight: 700 }}>
                  {additionalStats.expectedGoals.home.toFixed(2)}
                </Typography>
                <Box
                  sx={{
                    flex:1,
                    width: 80,
                    height: 6,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${
                        (additionalStats.expectedGoals.home /
                          (additionalStats.expectedGoals.home +
                            additionalStats.expectedGoals.away || 1)) *
                        100
                      }%`,
                      height: '100%',
                      bgcolor: '#24ee89',
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: '#24ee89', fontWeight: 700 }}>
                  {additionalStats.expectedGoals.away.toFixed(2)}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {/* Row 3: Fouls, Offsides */}
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ mb: 2 }}>
            {/* Fouls */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'grey',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', lg: '0.875rem' },
                }}
              >
                FOULS
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.fouls.home}
                </Typography>
                <Box
                  sx={{
                    flex:1,
                    width: 80,
                    height: 6,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${
                        (additionalStats.fouls.home /
                          (additionalStats.fouls.home + additionalStats.fouls.away || 1)) *
                        100
                      }%`,
                      height: '100%',
                      bgcolor: '#FF6B6B',
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.fouls.away}
                </Typography>
              </Stack>
            </Box>

            {/* Offsides */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'grey',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', lg: '0.875rem' },
                }}
              >
                OFFSIDES
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.offsides.home}
                </Typography>
                <Box
                  sx={{
                    flex:1,
                    width: 80,
                    height: 6,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${
                        (additionalStats.offsides.home /
                          (additionalStats.offsides.home + additionalStats.offsides.away || 1)) *
                        100
                      }%`,
                      height: '100%',
                      bgcolor: '#FFA500',
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.offsides.away}
                </Typography>
              </Stack>
            </Box>

            {/* Goals Prevented */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'grey',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', lg: '0.875rem' },
                }}
              >
                GOALS PREVENTED
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.goalsPrevented.home}
                </Typography>
                <Box
                  sx={{
                    flex:1,
                    width: 80,
                    height: 6,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${
                        (additionalStats.goalsPrevented.home /
                          (additionalStats.goalsPrevented.home +
                            additionalStats.goalsPrevented.away || 1)) *
                        100
                      }%`,
                      height: '100%',
                      bgcolor: '#00FF00',
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.goalsPrevented.away}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {/* Row 4: Passing Statistics */}
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
            {/* Total Passes */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'grey',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', lg: '0.875rem' },
                }}
              >
                TOTAL PASSES
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.totalPasses.home}
                </Typography>
                <Box
                  sx={{
                    flex:1,
                    width: 80,
                    height: 6,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${
                        (additionalStats.totalPasses.home /
                          (additionalStats.totalPasses.home + additionalStats.totalPasses.away ||
                            1)) *
                        100
                      }%`,
                      height: '100%',
                      bgcolor: '#4A90E2',
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.totalPasses.away}
                </Typography>
              </Stack>
            </Box>

            {/* Passes Accurate */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'grey',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', lg: '0.875rem' },
                }}
              >
                PASSES ACCURATE
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.passesAccurate.home}
                </Typography>
                <Box
                  sx={{
                    flex:1,
                    width: 80,
                    height: 6,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${
                        (additionalStats.passesAccurate.home /
                          (additionalStats.passesAccurate.home +
                            additionalStats.passesAccurate.away || 1)) *
                        100
                      }%`,
                      height: '100%',
                      bgcolor: '#4CAF50',
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  {additionalStats.passesAccurate.away}
                </Typography>
              </Stack>
            </Box>

            {/* Passes Percentage */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'grey',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', lg: '0.875rem' },
                }}
              >
                PASS ACCURACY
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                  {additionalStats.passesPercentage.home}%
                </Typography>
                <Box
                  sx={{
                    flex:1,
                    width: 80,
                    height: 6,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 0,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: `${
                        (additionalStats.passesPercentage.home /
                          (additionalStats.passesPercentage.home +
                            additionalStats.passesPercentage.away || 1)) *
                        100
                      }%`,
                      height: '100%',
                      bgcolor: '#4CAF50',
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                  {additionalStats.passesPercentage.away}%
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
