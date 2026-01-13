import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'src/store';
import useApi from 'src/hooks/use-api';
import { useLocales } from 'src/locales';
import { sportsSocket } from 'src/utils/socket';
import { 
  setSportsLoading, 
  updateSportsMatches, 
  updateLiveMatches, 
  setLiveFilter 
} from 'src/store/reducers/sports';
import type { ISportsEvent, ISportsMatch } from 'src/types';

export const useSportsData = () => {
  const dispatch = useDispatch();
  const { get_sports_matchs } = useApi();
  const { currentLang } = useLocales();
  
  // Redux state
  const {
    matches,
    leagues,
    liveMatches,
    upcomingMatches,
    loading,
    lastUpdated,
    liveToggle
  } = useSelector((state) => state.sports);

  // Fetch initial sports data with all statuses
  const fetchSportsData = useCallback(async () => {
    dispatch(setSportsLoading(true));
    try {
      // Fetch data for different event statuses
      const [liveRes, upcomingRes] = await Promise.all([
        get_sports_matchs({ SportId: '1', EventStatus: 'LIVE', lang: currentLang.value }),
        get_sports_matchs({ SportId: '1', EventStatus: 'PRE', lang: currentLang.value }),
      ]);

      // Optimize odds structure transformation
      if (upcomingRes?.data) {
        upcomingRes.data.forEach((league: ISportsMatch) => {
          if (league.events) {
            league.events.forEach((event: ISportsEvent) => {
              if (event.time_status === 0 && event.odds?.[0]?.bets?.length > 0) {
                event.odds = event.odds[0].bets;
              }
            });
          }
        });
      }
      
      const allResponses = [liveRes, upcomingRes].filter(res => res?.data);
      const allMatches: ISportsEvent[] = [];
      const leagueMap = new Map<number, {id: number, name: string, logo?: string, events: ISportsEvent[]}>();
      
      // Process each response
      allResponses.forEach(response => {
        response.data.forEach((league: ISportsMatch) => {
          if (league.events && league.events.length > 0) {
            const leagueKey = league.LeagueId;
            
            // Add or update league in map
            if (leagueMap.has(leagueKey)) {
              const existingLeague = leagueMap.get(leagueKey)!;
              existingLeague.events.push(...league.events);
            } else {
              leagueMap.set(leagueKey, {
                id: league.LeagueId,
                name: league.LeagueName,
                logo: league.LeagueLogo,
                events: [...league.events]
              });
            }
            
            allMatches.push(...league.events);
          }
        });
      });
      
      const processedLeagues = Array.from(leagueMap.values());
      
      dispatch(updateSportsMatches({
        matches: allMatches,
        leagues: processedLeagues
      }));
    } catch (error) {
      console.error('Error fetching sports data:', error);
    } finally {
      dispatch(setSportsLoading(false));
    }
  }, [get_sports_matchs, currentLang.value, dispatch]);

  // Initial data fetch on mount
  useEffect(() => {
    fetchSportsData();
  }, [fetchSportsData]);

  // Socket listener for live match updates
  useEffect(() => {
    const handleLiveMatchUpdates = (updatedLiveMatches: ISportsEvent[]) => {
      dispatch(updateLiveMatches(updatedLiveMatches));
    };

    const handleMatchChanges = (changedMatches: ISportsEvent[]) => {
      dispatch(updateLiveMatches(changedMatches));
    };

    // Listen for live match updates
    sportsSocket.on('live-matches-update', handleLiveMatchUpdates);
    sportsSocket.on('changed-matches', handleMatchChanges);

    return () => {
      sportsSocket.off('live-matches-update', handleLiveMatchUpdates);
      sportsSocket.off('changed-matches', handleMatchChanges);
    };
  }, [dispatch]);

  // Note: Auto-refresh removed in favor of real-time socket updates

  // Memoize filtered matches based on live toggle
  const filteredMatches = useMemo(() => {
    if (liveToggle) {
      return liveMatches;
    }
    return matches;
  }, [liveToggle, liveMatches, matches]);

  // Get matches by status
  const getMatchesByStatus = useCallback((status: number) => 
    matches.filter(match => match.time_status === status), [matches]);

  // Memoize filtered leagues based on live toggle
  const filteredLeagues = useMemo(() => {
    if (liveToggle) {
      return leagues.map(league => ({
        ...league,
        events: league.events.filter(event => event.time_status === 1)
      })).filter(league => league.events.length > 0);
    }
    return leagues;
  }, [liveToggle, leagues]);

  return {
    // Data
    matches: filteredMatches,
    leagues: filteredLeagues,
    liveMatches,
    upcomingMatches,
    
    // State
    loading,
    lastUpdated,
    liveToggle,
    
    // Actions
    setLiveFilter: (toggle: boolean) => dispatch(setLiveFilter(toggle)),
    
    // Stats
    totalMatches: matches.length,
    totalLiveMatches: liveMatches.length,
    totalUpcomingMatches: upcomingMatches.length,
    
    // Helper functions
    getMatchesByStatus,
  };
};
