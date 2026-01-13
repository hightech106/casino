import { Box, Stack, Typography, Chip, IconButton, Button } from '@mui/material';
import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { paths } from 'src/routes/paths';
import type { ISportsEvent } from 'src/types';
import Iconify from 'src/components/iconify';
import { useFavorites } from 'src/hooks/use-favorites';
import { useSelector } from 'src/store';
import { updateBetSlip } from 'src/store/reducers/sports';
import { convertSoccerBetslipData, addRemoveBetslip } from 'src/utils/sports';
import engPremier from '../../../../assets/sports/england premier.png';
import mc from '../../../../assets/sports/mc.png';
import psg from '../../../../assets/sports/psg.png';

// ----------------------------------------------------------------------

type FeaturedMatchCardProps = {
  match: ISportsEvent & {
    leagueInfo?: {
      id: number;
      name: string;
      logo: string;
    };
  };
};

function FeaturedMatchCard({ match }: FeaturedMatchCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const { isFavorite, toggleFavorite } = useFavorites();
  const { bet_slips, sports_list } = useSelector((store: any) => store.sports);

  const handleCardClick = useCallback(() => {
    navigate(`match/${match.id}`, {
      state: {
        matchData: match,
        leagueInfo: match.leagueInfo,
      },
    });
  }, [navigate, match]);

  const handleImageError = useCallback((imageId: string) => {
    setImageErrors((prev) => new Set(Array.from(prev).concat(imageId)));
  }, []);

  const handleFavoriteToggle = useCallback((event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    toggleFavorite(match.id);
  }, [toggleFavorite, match.id]);

  const handleAddBet = useCallback(
    (event: React.MouseEvent, odd: any) => {
      event.stopPropagation(); // Prevent card click

      if (!match?.odds) return;
      const sports = sports_list.find((e: any) => e.SportId === 1); // Football sport_id = 1
      if (!sports) return;

      const betslip = convertSoccerBetslipData({
        event: match,
        odd,
        sports,
      });
      dispatch(updateBetSlip(addRemoveBetslip(bet_slips, betslip)));
    },
    [match, sports_list, bet_slips, dispatch]
  );

  // Check if an odd is active in the bet slip
  const isOddActive = useCallback(
    (oddType: string, marketId: any) =>
      bet_slips.some(
        (slip: any) =>
          slip.eventId === match.id &&
          slip.marketId === marketId?.toString() &&
          slip.oddType === oddType
      ),
    [match.id, bet_slips]
  );

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        minWidth: { xs: '90%', lg: 400 },
        p: 2,
        bgcolor: '#2B2F3D',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          borderColor: '#24ee89',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(138, 43, 226, 0.1)',
        },
        transition: 'all 0.3s ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 8,
          right: 8,
          width: 60,
          height: 60,
          background:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='20' cy='20' r='3' fill='%23ffffff' opacity='0.1'/%3E%3Ccircle cx='80' cy='20' r='3' fill='%23ffffff' opacity='0.1'/%3E%3Ccircle cx='50' cy='50' r='3' fill='%23ffffff' opacity='0.1'/%3E%3Ccircle cx='20' cy='80' r='3' fill='%23ffffff' opacity='0.1'/%3E%3Ccircle cx='80' cy='80' r='3' fill='%23ffffff' opacity='0.1'/%3E%3C/svg%3E\")",
          opacity: 0.1,
          pointerEvents: 'none',
        },
      }}
    >
      {/* Header Section */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        {(() => {
          const leagueLogo = match.leagueInfo?.logo;
          const leagueLogoId = `league-${match.id}`;

          if (leagueLogo && !imageErrors.has(leagueLogoId)) {
            return (
              <Box
                component="img"
                src={leagueLogo}
                onError={() => handleImageError(leagueLogoId)}
                sx={{
                  width: 16,
                  height: 16,
                  objectFit: 'contain',
                }}
              />
            );
          }

          return (
            <Box
              component="img"
              src={engPremier}
              sx={{
                width: 16,
                height: 16,
                filter: 'brightness(0) invert(1)',
              }}
            />
          );
        })()}
        <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
          {match.leagueInfo?.name || match.league?.name}
        </Typography>
        <Chip
          label={(() => {
            if (match.time_status === 1) return 'LIVE';
            if (match.time_status === 3) return 'FINISHED';
            return 'UPCOMING';
          })()}
          size="small"
          sx={{
            bgcolor: match.time_status === 1 ? '#24ee89' : '#5A5D68',
            color: match.time_status === 1 ? '#232626' : 'white',
            fontSize: '0.65rem',
            height: 14,
            fontWeight: 400,
            fontFamily: 'Poppins',
            py: 1,
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          size="small"
          sx={{ p: 0.5, width: 48, height: 48 }}
          onClick={handleFavoriteToggle}
        >
          <Iconify
            icon={isFavorite(match.id) ? 'material-symbols:star' : 'material-symbols:star-outline'}
            sx={{
              width: 16,
              height: 16,
              color: isFavorite(match.id) ? '#24ee89' : 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#24ee89',
                transform: 'scale(1.1)',
              },
            }}
          />
        </IconButton>
      </Stack>

      {/* Teams Section */}
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {/* Home Team */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {(() => {
            const homeTeamLogo = match.home?.logo;
            const homeLogoId = `home-${match.id}`;

            if (homeTeamLogo && !imageErrors.has(homeLogoId)) {
              return (
                <Box
                  component="img"
                  src={homeTeamLogo}
                  onError={() => handleImageError(homeLogoId)}
                  alt={match.home?.name}
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    objectFit: 'contain',
                  }}
                />
              );
            }

            return (
              <Box
                component="img"
                src={mc}
                alt={match.home?.name}
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                }}
              />
            );
          })()}
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, flex: 1 }}>
            {match.home?.name}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'white', fontWeight: 700, minWidth: 20, textAlign: 'center' }}
          >
            {match.scores?.home ?? (match.ss ? match.ss.split('-')[0] : '0')}
          </Typography>
        </Stack>

        {/* Away Team */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {(() => {
            const awayTeamLogo = match.away?.logo;
            const awayLogoId = `away-${match.id}`;

            if (awayTeamLogo && !imageErrors.has(awayLogoId)) {
              return (
                <Box
                  component="img"
                  src={awayTeamLogo}
                  onError={() => handleImageError(awayLogoId)}
                  alt={match.away?.name}
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    objectFit: 'contain',
                  }}
                />
              );
            }

            return (
              <Box
                component="img"
                src={psg}
                alt={match.away?.name}
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                }}
              />
            );
          })()}
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, flex: 1 }}>
            {match.away?.name}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'white', fontWeight: 700, minWidth: 20, textAlign: 'center' }}
          >
            {match.scores?.away ?? (match.ss ? match.ss.split('-')[1] : '0')}
          </Typography>
        </Stack>
      </Stack>

      {/* Match Status */}
      <Typography variant="caption" sx={{ color: 'white', display: 'block', mb: 1.5 }}>
        {(() => {
          if (match.f_status?.elapsed) {
            return `${match.f_status.elapsed}' ${match.f_status.short}`;
          }
          if (match.time) {
            return new Date(match.time * 1000).toLocaleTimeString();
          }
          return 'Match Time';
        })()}
      </Typography>

      {/* Progress Bar */}
      <Box
        sx={{
          width: '100%',
          height: 8,
          position: 'relative',
          mb: 2,
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Filled Progress Bar */}
        <Box
          sx={{
            width: '28%',
            height: '100%',
            background: 'linear-gradient(135deg, #24ee89 0%, #FFD700 100%)',
            position: 'relative',
            clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.2) 100%)',
              clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
            },
          }}
        />

        {/* Unfilled Progress Bar */}
        <Box
          sx={{
            width: '72%',
            height: '100%',
            background: 'linear-gradient(135deg, #4A4D5A 0%, #3A3D4A 100%)',
            position: 'absolute',
            top: 0,
            right: 0,
            clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.4)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.3) 100%)',
              clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
            },
          }}
        />
      </Box>

      {/* Betting Odds */}
      <Stack direction="row" spacing={1}>
        {(() => {
          // Backend now normalizes odds to direct array format (no bookmaker wrapper)
          // Find Match Winner market (id: 1 or 59)
          const matchWinner = match.odds?.find(
            (market: any) =>
              market.id === 1 ||
              market.id === 59 ||
              market.name === 'Match Winner' ||
              market.name === 'Fulltime Result'
          );

          // Find Over/Under market (id: 5, 25, 36, 50)
          const overUnder = match.odds?.find(
            (market: any) =>
              market.id === 5 ||
              market.id === 25 ||
              market.id === 36 ||
              market.id === 50 ||
              market.name === 'Goals Over/Under' ||
              market.name === 'Goal Line' ||
              market.name === 'Match Goals' ||
              market.name === 'Over/Under Line'
          );

          // Extract odds with suspension check
          const homeOddObj = matchWinner?.values?.find(
            (v: any) => v.value === 'Home' || v.value === '1'
          );
          const drawOddObj = matchWinner?.values?.find(
            (v: any) => v.value === 'Draw' || v.value === 'X'
          );
          const awayOddObj = matchWinner?.values?.find(
            (v: any) => v.value === 'Away' || v.value === '2'
          );
          const over25OddObj = overUnder?.values?.find(
            (v: any) =>
              v.value === 'Over 2.5' ||
              (v.value === 'Over' &&
                (v.handicap === '2.5' || v.handicap === 2.5 || v.handicap === null))
          );

          const homeOdd = homeOddObj && !homeOddObj.suspended ? homeOddObj.odd : 'Unknown';
          const drawOdd = drawOddObj && !drawOddObj.suspended ? drawOddObj.odd : 'Unknown';
          const awayOdd = awayOddObj && !awayOddObj.suspended ? awayOddObj.odd : 'Unknown';
          const over25Odd = over25OddObj && !over25OddObj.suspended ? over25OddObj.odd : 'Unknown';

          return (
            <>
              {/* Home Win */}
              <Button
                variant="outlined"
                size="small"
                disabled={homeOdd === 'Unknown'}
                onClick={(e) => {
                  console.log(e, "===>homeOddObj", homeOddObj);
                  if (homeOdd !== 'Unknown') {
                    handleAddBet(e, {
                      ...homeOddObj,
                      marketId: matchWinner?.id,
                      marketName: matchWinner?.name,
                      oddType: 'home',
                      home_od: homeOdd,
                      odds: homeOdd,
                    })
                  }
                }}
                sx={(() => {
                  const isActive = isOddActive('home', matchWinner?.id);
                  const isDisabled = homeOdd === 'Unknown';

                  let bgColor = '#5A5D68';
                  let borderCol = '#5A5D68';
                  let textColor = 'white';

                  if (isDisabled) {
                    bgColor = '#3A3D45';
                    borderCol = '#2A2D35';
                    textColor = '#555';
                  } else if (isActive) {
                    bgColor = '#24ee89';
                    borderCol = '#24ee89';
                    textColor = '#232626';
                  }

                  return {
                    flex: 1,
                    bgcolor: bgColor,
                    borderColor: borderCol,
                    color: textColor,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    height: 32,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    '&:hover': {
                      bgcolor: isDisabled ? '#3A3D45' : '#FFD700',
                      borderColor: isDisabled ? '#2A2D35' : '#FFD700',
                      color: isDisabled ? '#555' : '#232626',
                    },
                    '&.Mui-disabled': {
                      bgcolor: '#3A3D45',
                      borderColor: '#2A2D35',
                      color: '#555',
                    },
                  };
                })()}
              >
                {homeOdd === 'Unknown' ? '-' : homeOdd}
              </Button>

              {/* Draw */}
              <Button
                variant="outlined"
                size="small"
                disabled={drawOdd === 'Unknown'}
                onClick={(e) =>
                  drawOdd !== 'Unknown' &&
                  handleAddBet(e, {
                    ...drawOddObj,
                    marketId: matchWinner?.id,
                    marketName: matchWinner?.name,
                    oddType: 'draw',
                    draw_od: drawOdd,
                    odds: drawOdd,
                  })
                }
                sx={(() => {
                  const isActive = isOddActive('draw', matchWinner?.id);
                  const isDisabled = drawOdd === 'Unknown';

                  let bgColor = '#5A5D68';
                  let borderCol = '#5A5D68';
                  let textColor = 'white';

                  if (isDisabled) {
                    bgColor = '#3A3D45';
                    borderCol = '#2A2D35';
                    textColor = '#555';
                  } else if (isActive) {
                    bgColor = '#24ee89';
                    borderCol = '#24ee89';
                    textColor = '#232626';
                  }

                  return {
                    flex: 1,
                    bgcolor: bgColor,
                    borderColor: borderCol,
                    color: textColor,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    height: 32,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    '&:hover': {
                      bgcolor: isDisabled ? '#3A3D45' : '#FFD700',
                      borderColor: isDisabled ? '#2A2D35' : '#FFD700',
                      color: isDisabled ? '#555' : '#232626',
                    },
                    '&.Mui-disabled': {
                      bgcolor: '#3A3D45',
                      borderColor: '#2A2D35',
                      color: '#555',
                    },
                  };
                })()}
              >
                {drawOdd === 'Unknown' ? '-' : drawOdd}
              </Button>

              {/* Away Win */}
              <Button
                variant="outlined"
                size="small"
                disabled={awayOdd === 'Unknown'}
                onClick={(e) =>
                  awayOdd !== 'Unknown' &&
                  handleAddBet(e, {
                    ...awayOddObj,
                    marketId: matchWinner?.id,
                    marketName: matchWinner?.name,
                    oddType: 'away',
                    away_od: awayOdd,
                    odds: awayOdd,
                  })
                }
                sx={(() => {
                  const isActive = isOddActive('away', matchWinner?.id);
                  const isDisabled = awayOdd === 'Unknown';

                  let bgColor = '#5A5D68';
                  let borderCol = '#5A5D68';
                  let textColor = 'white';

                  if (isDisabled) {
                    bgColor = '#3A3D45';
                    borderCol = '#2A2D35';
                    textColor = '#555';
                  } else if (isActive) {
                    bgColor = '#24ee89';
                    borderCol = '#24ee89';
                    textColor = '#232626';
                  }

                  return {
                    flex: 1,
                    bgcolor: bgColor,
                    borderColor: borderCol,
                    color: textColor,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    height: 32,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    '&:hover': {
                      bgcolor: isDisabled ? '#3A3D45' : '#FFD700',
                      borderColor: isDisabled ? '#2A2D35' : '#FFD700',
                      color: isDisabled ? '#555' : '#232626',
                    },
                    '&.Mui-disabled': {
                      bgcolor: '#3A3D45',
                      borderColor: '#2A2D35',
                      color: '#555',
                    },
                  };
                })()}
              >
                {awayOdd === 'Unknown' ? '-' : awayOdd}
              </Button>

              {/* Over 2.5 */}
              {/* <Button
                variant="outlined"
                size="small"
                disabled={over25Odd === 'Unknown'}
                onClick={(e) =>
                  over25Odd !== 'Unknown' &&
                  handleAddBet(e, {
                    ...over25OddObj,
                    marketId: overUnder?.id,
                    marketName: overUnder?.name,
                    oddType: 'over',
                    over_od: over25Odd,
                    odds: over25Odd,
                    handicap: '2.5',
                  })
                }
                sx={(() => {
                  const isActive = isOddActive('over', overUnder?.id);
                  const isDisabled = over25Odd === 'Unknown';

                  let bgColor = '#5A5D68';
                  let borderCol = '#5A5D68';
                  let textColor = 'white';

                  if (isDisabled) {
                    bgColor = '#3A3D45';
                    borderCol = '#2A2D35';
                    textColor = '#555';
                  } else if (isActive) {
                    bgColor = '#24ee89';
                    borderCol = '#24ee89';
                    textColor = '#232626';
                  }

                  return {
                    flex: 1,
                    bgcolor: bgColor,
                    borderColor: borderCol,
                    color: textColor,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    height: 32,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    '&:hover': {
                      bgcolor: isDisabled ? '#3A3D45' : '#FFD700',
                      borderColor: isDisabled ? '#2A2D35' : '#FFD700',
                      color: isDisabled ? '#555' : '#232626',
                    },
                    '&.Mui-disabled': {
                      bgcolor: '#3A3D45',
                      borderColor: '#2A2D35',
                      color: '#555',
                    },
                  };
                })()}
              >
                {over25Odd === 'Unknown' ? '-' : over25Odd}
              </Button> */}
            </>
          );
        })()}
      </Stack>
    </Box>
  );
}

export default memo(FeaturedMatchCard);
