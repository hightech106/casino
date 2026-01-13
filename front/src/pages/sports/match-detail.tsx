import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import useApi from 'src/hooks/use-api';
import { useLocales } from 'src/locales';
import { useFavorites } from 'src/hooks/use-favorites';
import type { ISportsEvent } from 'src/types';
import BackButton from 'src/sections/sports/detail/components/BackButton';
import MatchHeader from 'src/sections/sports/detail/components/MatchHeader';
import InsightsSection from 'src/sections/sports/detail/components/InsightsSection';
import MarketsSection from 'src/sections/sports/detail/components/MarketsSection';
import barcel from '../../assets/sports/barcel.png';
import psg from '../../assets/sports/psg.png';

// ----------------------------------------------------------------------

export default function SportsMatchDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLang } = useLocales();
  const { get_sports_event, get_sports_odds } = useApi();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Get match data from navigation state (if available)
  const passedMatchData = location.state?.matchData as ISportsEvent | null;
  const passedLeagueInfo = location.state?.leagueInfo;

  const [event, setEvent] = useState<ISportsEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [oddsData, setOddsData] = useState<any>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [selectedOdds, setSelectedOdds] = useState<{ [key: string]: string }>({});
  const [activeMarketTab, setActiveMarketTab] = useState<string>('All markets');
  const [marketLang, setMarketLang] = useState<any>(null);

  // Memoized function to categorize markets dynamically
  const categorizeMarkets = useCallback((marketsList: any[]) => {
    const categories = {
      'All markets': marketsList.length,
      Total: 0,
      Handicap: 0,
      Popular: 0,
      Players: 0,
      Goals: 0,
      Intervals: 0,
    };

    marketsList.forEach((market: any) => {
      const marketName = market.name?.toLowerCase() || '';

      // Total markets (Over/Under)
      if (
        marketName.includes('total') ||
        marketName.includes('over') ||
        marketName.includes('under') ||
        marketName.includes('goals')
      ) {
        categories.Total += 1;
      }

      // Handicap markets
      if (
        marketName.includes('handicap') ||
        marketName.includes('asian handicap') ||
        marketName.includes('spread')
      ) {
        categories.Handicap += 1;
      }

      // Popular markets (common betting markets)
      if (
        marketName.includes('1x2') ||
        marketName.includes('match winner') ||
        marketName.includes('double chance') ||
        marketName.includes('both teams') ||
        marketName.includes('correct score')
      ) {
        categories.Popular += 1;
      }

      // Player markets
      if (
        marketName.includes('player') ||
        marketName.includes('scorer') ||
        marketName.includes('assist') ||
        marketName.includes('card') ||
        marketName.includes('foul')
      ) {
        categories.Players += 1;
      }

      // Goal markets
      if (
        marketName.includes('goal') ||
        marketName.includes('score') ||
        marketName.includes('corner') ||
        marketName.includes('shot') ||
        marketName.includes('possession')
      ) {
        categories.Goals += 1;
      }

      // Interval markets (half time, specific time periods)
      if (
        marketName.includes('half') ||
        marketName.includes('interval') ||
        marketName.includes('period') ||
        marketName.includes('minute') ||
        marketName.includes('time')
      ) {
        categories.Intervals += 1;
      }
    });

    return categories;
  }, []);

  // Memoize match status
  const matchStatus = useMemo(() => {
    if (event?.time_status === 1) return 'live';
    if (event?.time_status === 3) return 'finished';
    return 'upcoming';
  }, [event?.time_status]);

  // Memoize scores and match data
  const currentMinute = useMemo(() => event?.f_status?.elapsed || 0, [event?.f_status?.elapsed]);

  const homeScore = useMemo(
    () =>
      event?.scores?.home ?? (event?.ss?.split('-')[0] ? parseInt(event.ss.split('-')[0], 10) : 0),
    [event?.scores?.home, event?.ss]
  );

  const awayScore = useMemo(
    () =>
      event?.scores?.away ?? (event?.ss?.split('-')[1] ? parseInt(event.ss.split('-')[1], 10) : 0),
    [event?.scores?.away, event?.ss]
  );

  // Helper function to convert event type
  const getEventType = useCallback(
    (eventDetail: any): 'goal' | 'yellow_card' | 'red_card' | 'foul' => {
      if (eventDetail.type === 'Goal') {
        return 'goal';
      }
      if (eventDetail.detail === 'Yellow Card') {
        return 'yellow_card';
      }
      if (eventDetail.detail === 'Red Card') {
        return 'red_card';
      }
      return 'foul';
    },
    []
  );

  // Memoize converted match events
  const matchEvents = useMemo((): any[] => {
    const events = event?.events;
    if (!events || !Array.isArray(events)) return [];

    return events.map((eventDetail, index) => {
      const team: 'home' | 'away' = eventDetail.team?.id === event?.home?.id ? 'home' : 'away';
      return {
        id: `${eventDetail.player?.id || index}`,
        minute: eventDetail.time?.elapsed || 0,
        type: getEventType(eventDetail),
        player: eventDetail.player?.name || 'Unknown Player',
        team,
        description: eventDetail.type === 'Goal' ? 'Goal' : eventDetail.detail || eventDetail.type,
      };
    });
  }, [event?.events, event?.home?.id, getEventType]);

  const fetchEventData = useCallback(async () => {
    if (!id) return;

    // If we have passed match data, use it immediately
    if (passedMatchData) {
      setEvent(passedMatchData);
      setOddsData(passedMatchData.odds || []);

      // Set market language translations if needed
      if (currentLang.value !== 'en' && passedMatchData.odds) {
        const odds = passedMatchData.odds;
        const langs = odds.reduce(
          (ary: any, row: any) => (row?.name_en ? { ...ary, [row.name_en]: row.name } : ary),
          {}
        );
        setMarketLang(langs);
      } else {
        setMarketLang(null);
      }

      setLoading(false);
      return;
    }

    // Otherwise, fetch from API (fallback for direct URL access)
    setLoading(true);
    try {
      // Fetch event details and odds
      const [eventRes, oddsRes] = await Promise.all([
        get_sports_event(Number(id)),
        get_sports_odds(Number(id), currentLang.value),
      ]);

      let eventData = null;
      let oddsArray = [];

      // Handle the new API response format
      if (oddsRes?.data?.events) {
        // Find the specific event by ID
        const foundEvent = oddsRes.data.events.find(
          (eventItem: any) => eventItem.id === Number(id)
        );
        if (foundEvent) {
          eventData = foundEvent;
          oddsArray = foundEvent.odds || [];
        }
      } else if (eventRes?.data?.result) {
        eventData = eventRes.data.result;
        oddsArray = eventRes.data.result.odds || [];
      } else if (oddsRes?.data?.event) {
        eventData = oddsRes.data.event;
        oddsArray = oddsRes.data.event.odds || [];
      }

      if (eventData) {
        setEvent(eventData);
        setOddsData(oddsArray);

        // Set market language translations if needed
        if (currentLang.value !== 'en' && oddsArray.length > 0) {
          const langs = oddsArray.reduce(
            (ary: any, row: any) => (row?.name_en ? { ...ary, [row.name_en]: row.name } : ary),
            {}
          );
          setMarketLang(langs);
        } else {
          setMarketLang(null);
        }
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
    } finally {
      setLoading(false);
    }
  }, [id, currentLang.value, get_sports_event, get_sports_odds, passedMatchData]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleOddSelect = (market: string, odd: string) => {
    setSelectedOdds((prev) => ({
      ...prev,
      [market]: prev[market] === odd ? '' : odd,
    }));
  };

  // Memoize processed markets
  const realMarkets = useMemo(() => {
    if (!oddsData || oddsData.length === 0) return [];

    // Check if oddsData is wrapped in a provider object (e.g., Bet365)
    if (oddsData[0]?.bets && Array.isArray(oddsData[0].bets)) {
      // Flatten the provider structure and get the markets from bets array
      return oddsData[0].bets.map((market: any) => ({
        id: market.id,
        name: market.name,
        values: market.values || [],
      }));
    }

    // Otherwise, oddsData is already an array of markets
    return oddsData.map((market: any) => ({
      id: market.id,
      name: market.name,
      values: market.values || [],
    }));
  }, [oddsData]);

  // Memoize filtered markets
  const filteredMarkets = useMemo(() => {
    if (activeMarketTab === 'All markets') {
      return realMarkets;
    }

    return realMarkets.filter((market: any) => {
      const marketName = market.name?.toLowerCase() || '';

      switch (activeMarketTab) {
        case 'Total':
          return (
            marketName.includes('total') ||
            marketName.includes('over') ||
            marketName.includes('under') ||
            marketName.includes('goals')
          );
        case 'Handicap':
          return (
            marketName.includes('handicap') ||
            marketName.includes('asian handicap') ||
            marketName.includes('spread')
          );
        case 'Popular':
          return (
            marketName.includes('1x2') ||
            marketName.includes('match winner') ||
            marketName.includes('double chance') ||
            marketName.includes('both teams') ||
            marketName.includes('correct score')
          );
        case 'Players':
          return (
            marketName.includes('player') ||
            marketName.includes('scorer') ||
            marketName.includes('assist') ||
            marketName.includes('card') ||
            marketName.includes('foul')
          );
        case 'Goals':
          return (
            marketName.includes('goal') ||
            marketName.includes('score') ||
            marketName.includes('corner') ||
            marketName.includes('shot') ||
            marketName.includes('possession')
          );
        case 'Intervals':
          return (
            marketName.includes('half') ||
            marketName.includes('interval') ||
            marketName.includes('period') ||
            marketName.includes('minute') ||
            marketName.includes('time')
          );
        default:
          return true;
      }
    });
  }, [realMarkets, activeMarketTab]);

  // Memoize market categories
  const marketCategories = useMemo(
    () => categorizeMarkets(realMarkets),
    [realMarkets, categorizeMarkets]
  );

  const handleImageError = useCallback((imageId: string) => {
    setImageErrors((prev) => new Set(Array.from(prev).concat(imageId)));
  }, []);

  // Memoize team crests
  const homeCrest = useMemo(() => {
    const homeLogo = event?.home?.logo;
    const homeLogoId = `home-${event?.id}`;
    if (homeLogo && !imageErrors.has(homeLogoId)) {
      return homeLogo;
    }
    return barcel;
  }, [event?.home?.logo, event?.id, imageErrors]);

  const awayCrest = useMemo(() => {
    const awayLogo = event?.away?.logo;
    const awayLogoId = `away-${event?.id}`;
    if (awayLogo && !imageErrors.has(awayLogoId)) {
      return awayLogo;
    }
    return psg;
  }, [event?.away?.logo, event?.id, imageErrors]);

  // Memoize fallback statistics (avoid random on every render)
  const fallbackStats = useMemo(
    () => ({
      homeAttacks: 25,
      awayAttacks: 25,
      homePossession: 50,
      awayPossession: 50,
    }),
    []
  );

  // Memoize insights generation
  const insights = useMemo(() => {
    if (!event) return [];

    const insightsList = [];
    const homeTeam = event.home?.name || 'Home Team';
    const awayTeam = event.away?.name || 'Away Team';
    const leagueName = event.league?.name || 'League';
    const isLive = event.time_status === 1;
    const matchMinute = event.f_status?.elapsed || 0;

    // Insight 1: Match Status & Timing
    if (isLive && matchMinute > 0) {
      insightsList.push({
        title: 'Live Match Status',
        description: `${homeTeam} vs ${awayTeam} is currently live in the ${
          matchMinute <= 45 ? 'first' : 'second'
        } half (${matchMinute}')`,
        odds: ['Live', 'Live', 'Live'],
        selected: 'Live',
        type: 'status',
      });
    }

    // Insight 2: Score Analysis
    if (homeScore !== undefined && awayScore !== undefined) {
      const totalGoals = homeScore + awayScore;
      const goalDifference = Math.abs(homeScore - awayScore);

      if (isLive) {
        insightsList.push({
          title: 'Current Score Analysis',
          description:
            totalGoals === 0
              ? `${homeTeam} and ${awayTeam} are yet to score in this ${leagueName} match`
              : `${totalGoals} goal${totalGoals > 1 ? 's' : ''} scored so far. ${
                  goalDifference === 0
                    ? 'The match is currently tied'
                    : `${
                        homeScore > awayScore ? homeTeam : awayTeam
                      } is leading by ${goalDifference} goal${goalDifference > 1 ? 's' : ''}`
                }`,
          odds:
            totalGoals === 0
              ? ['Under 0.5', 'Under 1.5', 'Under 2.5']
              : [`Over ${totalGoals}.5`, `Over ${totalGoals + 1}.5`, `Over ${totalGoals + 2}.5`],
          selected: totalGoals === 0 ? 'Under 0.5' : `Over ${totalGoals}.5`,
          type: 'score',
        });
      }
    }

    // Insight 3: Team Performance (based on match data)
    insightsList.push({
      title: 'Team Performance',
      description: `${homeTeam} and ${awayTeam} are competing in ${leagueName}. ${
        isLive ? 'The match is currently in progress' : 'This match will start soon'
      }`,
      odds: [`${homeTeam} Win`, 'Draw', `${awayTeam} Win`],
      selected: '',
      type: 'performance',
    });

    // Insight 4: League Context
    insightsList.push({
      title: 'League Context',
      description: `This ${leagueName} match ${
        isLive ? 'is currently being played' : 'will be played'
      } between two competitive teams`,
      odds: ['Home Win', 'Draw', 'Away Win'],
      selected: '',
      type: 'league',
    });

    // Insight 5: Match Timing (if not live)
    if (!isLive && event.time) {
      const matchTime = new Date(event.time * 1000);
      const now = new Date();
      const timeDiff = matchTime.getTime() - now.getTime();

      if (timeDiff > 0) {
        const hoursUntilMatch = Math.floor(timeDiff / (1000 * 60 * 60));
        insightsList.push({
          title: 'Match Timing',
          description: `The match starts in ${hoursUntilMatch} hour${
            hoursUntilMatch !== 1 ? 's' : ''
          }. Get ready for an exciting ${leagueName} encounter!`,
          odds: ['Pre-Match', 'Pre-Match', 'Pre-Match'],
          selected: 'Pre-Match',
          type: 'timing',
        });
      }
    }

    // Insight 6: Betting Market Analysis (if odds data available)
    if (realMarkets.length > 0) {
      const matchWinnerMarket = realMarkets.find(
        (market: any) => market.name === 'Match Winner' || market.name === '1X2'
      );

      if (matchWinnerMarket && matchWinnerMarket.values?.length > 0) {
        const homeOdd = matchWinnerMarket.values.find(
          (odd: any) => odd.value === homeTeam || odd.value === 'Home' || odd.value === '1'
        );
        const awayOdd = matchWinnerMarket.values.find(
          (odd: any) => odd.value === awayTeam || odd.value === 'Away' || odd.value === '2'
        );

        if (homeOdd && awayOdd) {
          insightsList.push({
            title: 'Market Analysis',
            description: `Current odds suggest ${
              parseFloat(homeOdd.odd) < parseFloat(awayOdd.odd) ? homeTeam : awayTeam
            } as the favorite with odds of ${
              parseFloat(homeOdd.odd) < parseFloat(awayOdd.odd) ? homeOdd.odd : awayOdd.odd
            }`,
            odds: [`${homeTeam} ${homeOdd.odd}`, `Draw`, `${awayTeam} ${awayOdd.odd}`],
            selected:
              parseFloat(homeOdd.odd) < parseFloat(awayOdd.odd)
                ? `${homeTeam} ${homeOdd.odd}`
                : `${awayTeam} ${awayOdd.odd}`,
            type: 'market',
          });
        }
      }
    }

    // Insight 7: Team Statistics Analysis (if stats available)
    if (event.stats?.statistics && Array.isArray(event.stats.statistics)) {
      const stats = event.stats.statistics;

      // Find possession stats
      const possessionStat = stats.find(
        (stat: any) => stat.name === 'Ball Possession' || stat.name === 'Possession'
      );

      if (possessionStat && possessionStat.home && possessionStat.away) {
        const homePossession = parseFloat(possessionStat.home);
        const awayPossession = parseFloat(possessionStat.away);

        insightsList.push({
          title: 'Possession Analysis',
          description: `${homeTeam} controls ${homePossession}% possession while ${awayTeam} has ${awayPossession}% in this ${leagueName} match`,
          odds: [`${homeTeam} ${homePossession}%`, `Draw`, `${awayTeam} ${awayPossession}%`],
          selected:
            homePossession > awayPossession
              ? `${homeTeam} ${homePossession}%`
              : `${awayTeam} ${awayPossession}%`,
          type: 'possession',
        });
      }
    }

    // Insight 8: Match Prediction (fallback)
    if (insightsList.length < 6) {
      insightsList.push({
        title: 'Match Prediction',
        description: `Based on current form and league standings, this ${leagueName} match promises to be an exciting encounter between ${homeTeam} and ${awayTeam}`,
        odds: ['1X2', 'Over/Under', 'Both Teams Score'],
        selected: '',
        type: 'prediction',
      });
    }

    return insightsList.slice(0, 6); // Limit to 6 insights
  }, [event, homeScore, awayScore, realMarkets]);


  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#232626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ color: 'white' }}>
          Loading match details...
        </Typography>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#232626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ color: 'white' }}>
          Match not found
        </Typography>
        <Button variant="contained" onClick={handleBack}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#232626',
        width: '100%',
        overflow: 'auto',
        py: { xs: 1, sm: 1, md: 1, lg: 1 },
        pr: { xs: 1, sm: 1, md: 1, lg: 1 },
      }}
    >
      {/* Back Button */}
      <BackButton onClick={handleBack} />

      {/* Match Detail Card */}
      <Box
        sx={{
          bgcolor: 'transparent',
          overflow: 'hidden',
          px: { xs: 1, sm: 1, md: 0, lg: 0 },
        }}
      >
        {/* Match Header */}
        {event && (
          <MatchHeader
            event={event}
            matchStatus={matchStatus}
            homeScore={homeScore}
            awayScore={awayScore}
            homeCrest={homeCrest}
            awayCrest={awayCrest}
            currentMinute={currentMinute}
            matchEvents={matchEvents}
            fallbackStats={fallbackStats}
            passedLeagueInfo={passedLeagueInfo}
            handleImageError={handleImageError}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        )}

        {/* Insights Section */}
        <InsightsSection insights={insights} />

        {/* Betting Markets */}
        <MarketsSection
          realMarkets={realMarkets}
          filteredMarkets={filteredMarkets}
          marketCategories={marketCategories}
          activeMarketTab={activeMarketTab}
          onTabChange={setActiveMarketTab}
          event={event}
          marketLang={marketLang}
        />
      </Box>
    </Box>
  );
}
