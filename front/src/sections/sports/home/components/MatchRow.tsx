import { Box, Stack, Typography, Button, IconButton, Card } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useCallback, memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Iconify from 'src/components/iconify';
import type { ISportsEvent } from 'src/types';
import { useSelector } from 'src/store';
import { updateBetSlip } from 'src/store/reducers/sports';
import { convertSoccerBetslipData, addRemoveBetslip } from 'src/utils/sports';

// ----------------------------------------------------------------------

type MatchRowProps = {
  match: ISportsEvent;
  oddsData?: any; // Optional odds data from API
};

function MatchRow({ match, oddsData }: MatchRowProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bet_slips, sports_list } = useSelector((store: any) => store.sports);

  // Memoize extracted data
  const homeTeam = useMemo(() => match.home?.name || 'Home Team', [match.home?.name]);
  const awayTeam = useMemo(() => match.away?.name || 'Away Team', [match.away?.name]);
  const homeScore = useMemo(() => match.scores?.home || match.f_score?.fulltime?.home || '0', [match.scores?.home, match.f_score?.fulltime?.home]);
  const awayScore = useMemo(() => match.scores?.away || match.f_score?.fulltime?.away || '0', [match.scores?.away, match.f_score?.fulltime?.away]);
  const matchTime = useMemo(() => match.f_status?.long || match.f_status?.short || 'Match', [match.f_status?.long, match.f_status?.short]);
  const isLive = useMemo(() => match.time_status === 1, [match.time_status]);

  // Handle match row click
  const handleMatchClick = useCallback(() => {
    navigate(`match/${match.id}`, {
      state: {
        matchData: match,
      },
    });
  }, [navigate, match]);

  // Handle betting button click (prevent navigation)
  const handleBettingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Just prevent navigation - actual betting is handled by individual buttons
  };

  // Add bet to slip
  const handleAddBet = useCallback(
    (event: React.MouseEvent, odd: any) => {
      event.stopPropagation(); // Prevent card click
      console.log(odd, '===>odd', sports_list);
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

  // Extract odds from API data (now normalized by backend)
  const getOddsData = () => {
    if (!oddsData || oddsData.length === 0) {
      return {
        homeWin: 'Unknown',
        draw: 'Unknown',
        awayWin: 'Unknown',
        over25: 'Unknown',
        under25: 'Unknown',
        btts: 'Unknown',
        bttsNo: 'Unknown',
        homeOddObj: null,
        drawOddObj: null,
        awayOddObj: null,
        over25OddObj: null,
        under25OddObj: null,
        bttsYesObj: null,
        bttsNoObj: null,
        matchWinnerMarket: null,
        overUnderMarket: null,
        bttsMarket: null,
      };
    }

    const odds = {
      homeWin: 'Unknown' as string,
      draw: 'Unknown' as string,
      awayWin: 'Unknown' as string,
      over25: 'Unknown' as string,
      under25: 'Unknown' as string,
      btts: 'Unknown' as string,
      bttsNo: 'Unknown' as string,
      homeOddObj: null as any,
      drawOddObj: null as any,
      awayOddObj: null as any,
      over25OddObj: null as any,
      under25OddObj: null as any,
      bttsYesObj: null as any,
      bttsNoObj: null as any,
      matchWinnerMarket: null as any,
      overUnderMarket: null as any,
      bttsMarket: null as any,
    };

    // Backend now normalizes odds to direct array format
    // Find Match Winner market (id: 1 or 59, name: "Match Winner" or "Fulltime Result")
    const matchWinnerMarket = oddsData.find(
      (market: any) =>
        market.id === 1 ||
        market.id === 59 ||
        market.name === 'Match Winner' ||
        market.name === 'Fulltime Result'
    );
    odds.matchWinnerMarket = matchWinnerMarket;

    // Find Goals Over/Under market (id: 5, 25, 36, 50, name: "Goals Over/Under" or "Goal Line" or "Match Goals")
    const overUnderMarket = oddsData.find(
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
    odds.overUnderMarket = overUnderMarket;

    // Find Both Teams To Score market (id: 69)
    const bttsMarket = oddsData.find(
      (market: any) =>
        market.id === 69 ||
        market.name === 'Both Teams To Score' ||
        market.name === 'Both Teams to Score'
    );
    odds.bttsMarket = bttsMarket;

    // Extract Match Winner odds (1X2)
    if (matchWinnerMarket?.values) {
      const homeOdd = matchWinnerMarket.values.find(
        (odd: any) => odd.value === 'Home' || odd.value === '1'
      );
      const drawOdd = matchWinnerMarket.values.find(
        (odd: any) => odd.value === 'Draw' || odd.value === 'X'
      );
      const awayOdd = matchWinnerMarket.values.find(
        (odd: any) => odd.value === 'Away' || odd.value === '2'
      );

      if (homeOdd && !homeOdd.suspended) {
        odds.homeWin = homeOdd.odd;
        odds.homeOddObj = homeOdd;
      }
      if (drawOdd && !drawOdd.suspended) {
        odds.draw = drawOdd.odd;
        odds.drawOddObj = drawOdd;
      }
      if (awayOdd && !awayOdd.suspended) {
        odds.awayWin = awayOdd.odd;
        odds.awayOddObj = awayOdd;
      }
    }

    // Extract Over/Under 2.5 odds (check both formats)
    if (overUnderMarket?.values) {
      const overOdd = overUnderMarket.values.find(
        (odd: any) =>
          odd.value === 'Over 2.5' ||
          (odd.value === 'Over' &&
            (odd.handicap === '2.5' || odd.handicap === 2.5 || odd.handicap === null))
      );
      const underOdd = overUnderMarket.values.find(
        (odd: any) =>
          odd.value === 'Under 2.5' ||
          (odd.value === 'Under' &&
            (odd.handicap === '2.5' || odd.handicap === 2.5 || odd.handicap === null))
      );

      if (overOdd && !overOdd.suspended) {
        odds.over25 = overOdd.odd;
        odds.over25OddObj = overOdd;
      }
      if (underOdd && !underOdd.suspended) {
        odds.under25 = underOdd.odd;
        odds.under25OddObj = underOdd;
      }
    }

    // Extract BTTS odds
    if (bttsMarket?.values) {
      const bttsYes = bttsMarket.values.find((odd: any) => odd.value === 'Yes');
      const bttsNo = bttsMarket.values.find((odd: any) => odd.value === 'No');

      if (bttsYes && !bttsYes.suspended) {
        odds.btts = bttsYes.odd;
        odds.bttsYesObj = bttsYes;
      }
      if (bttsNo && !bttsNo.suspended) {
        odds.bttsNo = bttsNo.odd;
        odds.bttsNoObj = bttsNo;
      }
    }

    return odds;
  };

  const odds = getOddsData();
  return (
    <Card
      onClick={handleMatchClick}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        p: 2,
        alignItems: 'center',
        bgcolor: '#2B2F3D',
        borderRadius: 0,
        border: 'none',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: alpha('#24ee89', 0.05),
        },
        transition: 'all 0.2s ease',
      }}
    >
      <Stack
        direction="row"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        flexGrow={1}
      >
        <Stack gap={1}>
          {/* Team 1 */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
            <Box
              component="img"
              src={match.home?.logo || '/assets/sports/default-team.png'}
              sx={{ width: 20, height: 20 }}
              onError={(e) => {
                e.currentTarget.src = '/assets/sports/default-team.png';
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: 'text.primary', fontWeight: 500, minWidth: 200 }}
            >
              {homeTeam}
            </Typography>
            <Typography variant="body2" sx={{ color: '#24ee89', fontWeight: 700 }}>
              {homeScore}
            </Typography>
          </Stack>
          {/* Team 2 */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
            <Box
              component="img"
              src={match.away?.logo || '/assets/sports/default-team.png'}
              sx={{ width: 20, height: 20 }}
              onError={(e) => {
                e.currentTarget.src = '/assets/sports/default-team.png';
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: 'text.primary', fontWeight: 500, minWidth: 200 }}
            >
              {awayTeam}
            </Typography>
            <Typography variant="body2" sx={{ color: '#24ee89', fontWeight: 700 }}>
              {awayScore}
            </Typography>
          </Stack>
          {/* Match Info */}
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flex: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {matchTime}
            </Typography>
            {/* Action Icons */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 2 }}>
              <IconButton size="small" onClick={handleBettingClick} sx={{ color: '#5A5D68' }}>
                <Iconify icon="material-symbols:play-arrow" sx={{ width: 16, height: 16 }} />
              </IconButton>
              <IconButton size="small" onClick={handleBettingClick} sx={{ color: '#5A5D68' }}>
                <Iconify icon="material-symbols:bar-chart" sx={{ width: 16, height: 16 }} />
              </IconButton>
              <IconButton size="small" onClick={handleBettingClick} sx={{ color: '#5A5D68' }}>
                <Iconify icon="material-symbols:show-chart" sx={{ width: 16, height: 16 }} />
              </IconButton>
              <IconButton size="small" onClick={handleBettingClick} sx={{ color: '#5A5D68' }}>
                <Iconify icon="material-symbols:list" sx={{ width: 16, height: 16 }} />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* Dynamic Betting Odds */}
      <Stack direction="row" spacing={{ xs: 1, md: 2 }} sx={{ justifyContent: 'flex-end' }}>
        {/* Home Win */}
        <Button
          size="small"
          onClick={(e) => {
            if (odds.homeWin !== 'Unknown') {
              console.log(e, '===>odds.homeWin', odds.homeWin);
              handleAddBet(e, {
                ...odds.homeOddObj,
                marketId: odds.matchWinnerMarket?.id,
                marketName: odds.matchWinnerMarket?.name,
                oddType: 'home',
                home_od: odds.homeWin,
                odds: odds.homeWin,
              });
            }
          }}
          disabled={odds.homeWin === 'Unknown'}
          sx={(() => {
            const isActive = isOddActive('home', odds.matchWinnerMarket?.id);
            const isDisabled = odds.homeWin === 'Unknown';

            let bgColor = 'transparent';
            let borderCol = '#404040';
            let textColor = 'text.secondary';
            let hoverBg = alpha('#24ee89', 0.2);
            let hoverBorder = '#24ee89';

            if (isDisabled) {
              borderCol = '#2A2D35';
              textColor = '#3A3D45';
              hoverBg = 'transparent';
              hoverBorder = '#404040';
            } else if (isActive) {
              bgColor = '#24ee89';
              borderCol = '#24ee89';
              textColor = '#232626';
            }

            return {
              minWidth: 50,
              height: 32,
              bgcolor: bgColor,
              color: textColor,
              border: '1px solid',
              borderColor: borderCol,
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 400,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              '&:hover': {
                bgcolor: hoverBg,
                borderColor: hoverBorder,
              },
              '&.Mui-disabled': {
                color: '#3A3D45',
                border: '1px solid #2A2D35',
              },
            };
          })()}
        >
          {odds.homeWin === 'Unknown' ? '-' : odds.homeWin}
        </Button>

        {/* Draw */}
        <Button
          size="small"
          onClick={(e) =>
            odds.draw !== 'Unknown' &&
            handleAddBet(e, {
              ...odds.drawOddObj,
              marketId: odds.matchWinnerMarket?.id,
              marketName: odds.matchWinnerMarket?.name,
              oddType: 'draw',
              draw_od: odds.draw,
              odds: odds.draw,
            })
          }
          disabled={odds.draw === 'Unknown'}
          sx={(() => {
            const isActive = isOddActive('draw', odds.matchWinnerMarket?.id);
            const isDisabled = odds.draw === 'Unknown';

            let bgColor = 'transparent';
            let borderCol = '#404040';
            let textColor = 'text.secondary';
            let hoverBg = alpha('#24ee89', 0.2);
            let hoverBorder = '#24ee89';

            if (isDisabled) {
              borderCol = '#2A2D35';
              textColor = '#3A3D45';
              hoverBg = 'transparent';
              hoverBorder = '#404040';
            } else if (isActive) {
              bgColor = '#24ee89';
              borderCol = '#24ee89';
              textColor = '#232626';
            }

            return {
              minWidth: 50,
              height: 32,
              bgcolor: bgColor,
              color: textColor,
              border: '1px solid',
              borderColor: borderCol,
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 400,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              '&:hover': {
                bgcolor: hoverBg,
                borderColor: hoverBorder,
              },
              '&.Mui-disabled': {
                color: '#3A3D45',
                border: '1px solid #2A2D35',
              },
            };
          })()}
        >
          {odds.draw === 'Unknown' ? '-' : odds.draw}
        </Button>

        {/* Away Win */}
        <Button
          size="small"
          onClick={(e) =>
            odds.awayWin !== 'Unknown' &&
            handleAddBet(e, {
              ...odds.awayOddObj,
              marketId: odds.matchWinnerMarket?.id,
              marketName: odds.matchWinnerMarket?.name,
              oddType: 'away',
              away_od: odds.awayWin,
              odds: odds.awayWin,
            })
          }
          disabled={odds.awayWin === 'Unknown'}
          sx={(() => {
            const isActive = isOddActive('away', odds.matchWinnerMarket?.id);
            const isDisabled = odds.awayWin === 'Unknown';

            let bgColor = 'transparent';
            let borderCol = '#404040';
            let textColor = 'text.secondary';
            let hoverBg = alpha('#24ee89', 0.2);
            let hoverBorder = '#24ee89';

            if (isDisabled) {
              borderCol = '#2A2D35';
              textColor = '#3A3D45';
              hoverBg = 'transparent';
              hoverBorder = '#404040';
            } else if (isActive) {
              bgColor = '#24ee89';
              borderCol = '#24ee89';
              textColor = '#232626';
            }

            return {
              minWidth: 50,
              height: 32,
              bgcolor: bgColor,
              color: textColor,
              border: '1px solid',
              borderColor: borderCol,
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 400,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              '&:hover': {
                bgcolor: hoverBg,
                borderColor: hoverBorder,
              },
              '&.Mui-disabled': {
                color: '#3A3D45',
                border: '1px solid #2A2D35',
              },
            };
          })()}
        >
          {odds.awayWin === 'Unknown' ? '-' : odds.awayWin}
        </Button>

        {/* Over 2.5 */}
        <Button
          size="small"
          onClick={(e) =>
            odds.over25 !== 'Unknown' &&
            handleAddBet(e, {
              ...odds.over25OddObj,
              marketId: odds.overUnderMarket?.id,
              marketName: odds.overUnderMarket?.name,
              oddType: 'over',
              over_od: odds.over25,
              odds: odds.over25,
              handicap: '2.5',
            })
          }
          disabled={odds.over25 === 'Unknown'}
          sx={(() => {
            const isActive = isOddActive('over', odds.overUnderMarket?.id);
            const isDisabled = odds.over25 === 'Unknown';

            let bgColor = 'transparent';
            let borderCol = '#404040';
            let textColor = 'text.secondary';
            let hoverBg = alpha('#24ee89', 0.2);
            let hoverBorder = '#24ee89';

            if (isDisabled) {
              borderCol = '#2A2D35';
              textColor = '#3A3D45';
              hoverBg = 'transparent';
              hoverBorder = '#404040';
            } else if (isActive) {
              bgColor = '#24ee89';
              borderCol = '#24ee89';
              textColor = '#232626';
            }

            return {
              minWidth: 50,
              height: 32,
              bgcolor: bgColor,
              color: textColor,
              border: '1px solid',
              borderColor: borderCol,
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              '&:hover': {
                bgcolor: hoverBg,
                borderColor: hoverBorder,
              },
              '&.Mui-disabled': {
                color: '#3A3D45',
                border: '1px solid #2A2D35',
              },
            };
          })()}
        >
          {odds.over25 === 'Unknown' ? '-' : odds.over25}
        </Button>

        {/* Under 2.5 */}
        <Button
          size="small"
          onClick={(e) =>
            odds.under25 !== 'Unknown' &&
            handleAddBet(e, {
              ...odds.under25OddObj,
              marketId: odds.overUnderMarket?.id,
              marketName: odds.overUnderMarket?.name,
              oddType: 'under',
              under_od: odds.under25,
              odds: odds.under25,
              handicap: '2.5',
            })
          }
          disabled={odds.under25 === 'Unknown'}
          sx={(() => {
            const isActive = isOddActive('under', odds.overUnderMarket?.id);
            const isDisabled = odds.under25 === 'Unknown';

            let bgColor = 'transparent';
            let borderCol = '#404040';
            let textColor = 'text.secondary';
            let hoverBg = alpha('#24ee89', 0.2);
            let hoverBorder = '#24ee89';

            if (isDisabled) {
              borderCol = '#2A2D35';
              textColor = '#3A3D45';
              hoverBg = 'transparent';
              hoverBorder = '#404040';
            } else if (isActive) {
              bgColor = '#24ee89';
              borderCol = '#24ee89';
              textColor = '#232626';
            }

            return {
              minWidth: 50,
              height: 32,
              bgcolor: bgColor,
              color: textColor,
              border: '1px solid',
              borderColor: borderCol,
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 400,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              '&:hover': {
                bgcolor: hoverBg,
                borderColor: hoverBorder,
              },
              '&.Mui-disabled': {
                color: '#3A3D45',
                border: '1px solid #2A2D35',
              },
            };
          })()}
        >
          {odds.under25 === 'Unknown' ? '-' : odds.under25}
        </Button>
      </Stack>
    </Card>
  );
}

export default memo(MatchRow);
