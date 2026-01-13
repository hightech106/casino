import { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { toUpper } from 'lodash';
import {
  MatchHeader,
  MatchStats,
  MatchTimeline,
  MatchTable,
  MatchLineups,
  TabNavigation,
} from './match';
import type {
  MatchEvent,
  Player,
  Team,
  AdditionalStats,
  GroupTableRow,
  LineupData,
  MatchStatsData,
} from './match/types';

// ----------------------------------------------------------------------

interface LiveMatchProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeCrest: string;
  awayCrest: string;
  currentMinute: number;
  isLive: boolean;
  // Team IDs for widgets
  // Match statistics - optional, will use real data if available
  homeAttacks?: number;
  awayAttacks?: number;
  homeDangerousAttacks?: number;
  awayDangerousAttacks?: number;
  homePossession?: number;
  awayPossession?: number;
  homeShots?: number;
  awayShots?: number;
  homeShotsOnTarget?: number;
  awayShotsOnTarget?: number;
  homeCorners?: number;
  awayCorners?: number;
  homeYellowCards?: number;
  awayYellowCards?: number;
  homeRedCards?: number;
  awayRedCards?: number;
  // Match events
  matchEvents?: MatchEvent[];
  // Group/League data
  leagueName?: string;
  groupName?: string;
  groupTable?: GroupTableRow[];
  // Lineups
  homeLineup?: Player[];
  awayLineup?: Player[];
  // Real statistics data from API
  statistics?: any;
  lineups?: any[];
  players?: any[];
  timeline?: any[];
  gameId?: string;
  sport?: string;
}

export default function LiveMatch({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  homeCrest,
  awayCrest,
  currentMinute,
  isLive,
  // Team IDs for widgets
  gameId,
  sport,
  timeline,
  // Statistics - now optional and will use real data if provided
  homeAttacks,
  awayAttacks,
  homeDangerousAttacks,
  awayDangerousAttacks,
  homePossession,
  awayPossession,
  homeShots,
  awayShots,
  homeShotsOnTarget,
  awayShotsOnTarget,
  homeCorners,
  awayCorners,
  homeYellowCards,
  awayYellowCards,
  homeRedCards,
  awayRedCards,
  // Events and data
  matchEvents: propMatchEvents,
  leagueName,
  groupName,
  groupTable: propGroupTable,
  homeLineup: propHomeLineup,
  awayLineup: propAwayLineup,
  // Real statistics data from API
  statistics,
  lineups,
  players,
}: LiveMatchProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'timeline' | 'table' | 'lineups'>('stats');

  // Get real statistics or use provided/fallback values
  const stats = useMemo((): MatchStatsData => {
    console.log('===> Raw statistics:', statistics);

    // Extract real statistics from API data or use fallback values
    const getStatValue = (statName: string, homeValue?: number, awayValue?: number) => {
      if (statistics && Array.isArray(statistics) && statistics.length >= 2) {
        // Statistics structure: [{ team: {...}, statistics: [{type, value}] }, ...]
        const homeTeamStats = statistics[0]; // First team is home
        const awayTeamStats = statistics[1]; // Second team is away

        // Find the specific statistic by type
        const homeStat = homeTeamStats.statistics?.find((s: any) => s.type === statName);
        const awayStat = awayTeamStats.statistics?.find((s: any) => s.type === statName);

        // Parse values - handle both numbers and strings (e.g., "59%" for possession)
        const parseStatValue = (value: any): number => {
          if (value === null || value === undefined) return 0;
          if (typeof value === 'number') return value;
          if (typeof value === 'string') {
            // Remove % sign if present and parse as number
            const numValue = parseFloat(value.replace('%', ''));
            return Number.isNaN(numValue) ? 0 : numValue;
          }
          return 0;
        };

        return {
          home: homeStat ? parseStatValue(homeStat.value) : homeValue || 0,
          away: awayStat ? parseStatValue(awayStat.value) : awayValue || 0,
        };
      }

      return {
        home: homeValue || 0,
        away: awayValue || 0,
      };
    };

    const generateDefaultStats = (): MatchStatsData => ({
      attacks: { home: 0, away: 0 },
      dangerousAttacks: { home: 0, away: 0 },
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
      yellowCards: { home: 0, away: 0 },
      redCards: { home: 0, away: 0 },
    });

    const getProvidedStats = (): MatchStatsData => ({
      attacks: getStatValue('Total Shots', homeAttacks, awayAttacks),
      dangerousAttacks: getStatValue('Shots on Goal', homeDangerousAttacks, awayDangerousAttacks),
      possession: getStatValue('Ball Possession', homePossession, awayPossession),
      shots: getStatValue('Total Shots', homeShots, awayShots),
      shotsOnTarget: getStatValue('Shots on Goal', homeShotsOnTarget, awayShotsOnTarget),
      corners: getStatValue('Corner Kicks', homeCorners, awayCorners),
      yellowCards: getStatValue('Yellow Cards', homeYellowCards, awayYellowCards),
      redCards: getStatValue('Red Cards', homeRedCards, awayRedCards),
    });

    // Priority 1: Real API statistics
    if (statistics && Array.isArray(statistics) && statistics.length > 0) {
      const processedStats = getProvidedStats();
      console.log('===> Processed stats:', processedStats);
      return processedStats;
    }

    // Priority 2: Provided fallback values
    if (homeAttacks !== undefined) {
      const fallbackStats = getProvidedStats();
      console.log('===> Fallback stats:', fallbackStats);
      return fallbackStats;
    }

    // Priority 3: Default statistics (no mock data)
    console.log('===> Using default stats');
    return generateDefaultStats();
  }, [
    statistics,
    homeAttacks,
    awayAttacks,
    homeDangerousAttacks,
    awayDangerousAttacks,
    homePossession,
    awayPossession,
    homeShots,
    awayShots,
    homeShotsOnTarget,
    awayShotsOnTarget,
    homeCorners,
    awayCorners,
    homeYellowCards,
    awayYellowCards,
    homeRedCards,
    awayRedCards,
  ]);

  const additionalStats = useMemo((): AdditionalStats | null => {
    if (statistics && Array.isArray(statistics) && statistics.length >= 2) {
      // Extract real statistics from API data or use fallback values
      const getStatValue = (statName: string, homeValue?: number, awayValue?: number) => {
        if (statistics && Array.isArray(statistics) && statistics.length >= 2) {
          // Statistics structure: [{ team: {...}, statistics: [{type, value}] }, ...]
          const homeTeamStats = statistics[0]; // First team is home
          const awayTeamStats = statistics[1]; // Second team is away

          // Find the specific statistic by type
          const homeStat = homeTeamStats.statistics?.find((s: any) => s.type === statName);
          const awayStat = awayTeamStats.statistics?.find((s: any) => s.type === statName);

          // Parse values - handle both numbers and strings (e.g., "59%" for possession)
          const parseStatValue = (value: any): number => {
            if (value === null || value === undefined) return 0;
            if (typeof value === 'number') return value;
            if (typeof value === 'string') {
              // Remove % sign if present and parse as number
              const numValue = parseFloat(value.replace('%', ''));
              return Number.isNaN(numValue) ? 0 : numValue;
            }
            return 0;
          };

          return {
            home: homeStat ? parseStatValue(homeStat.value) : homeValue || 0,
            away: awayStat ? parseStatValue(awayStat.value) : awayValue || 0,
          };
        }

        return {
          home: homeValue || 0,
          away: awayValue || 0,
        };
      };

      return {
        shotsOffGoal: getStatValue('Shots off Goal'),
        blockedShots: getStatValue('Blocked Shots'),
        shotsInsideBox: getStatValue('Shots insidebox'),
        shotsOutsideBox: getStatValue('Shots outsidebox'),
        fouls: getStatValue('Fouls'),
        offsides: getStatValue('Offsides'),
        goalkeeperSaves: getStatValue('Goalkeeper Saves'),
        totalPasses: getStatValue('Total passes'),
        passesAccurate: getStatValue('Passes accurate'),
        passesPercentage: getStatValue('Passes %'),
        expectedGoals: getStatValue('expected_goals'),
        goalsPrevented: getStatValue('goals_prevented'),
      };
    }
    return null;
  }, [statistics]);

  // Use processed timeline or provided match events
  const matchEvents: MatchEvent[] = useMemo(() => {
    if (timeline && Array.isArray(timeline) && timeline.length > 0) {
      const processedEvents = timeline.map((event: any, index: number) => {
        // Determine event type and details
        let eventType: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'foul' = 'foul';
        let description = event.detail || '';

        if (event.type === 'Goal') {
          if (event.detail === 'Missed Penalty') {
            eventType = 'foul'; // Show missed penalty differently
            description = `Missed Penalty`;
          } else {
            eventType = 'goal';
            description = event.assist?.name ? `Assist: ${event.assist.name}` : 'Goal';
          }
        } else if (event.type === 'Card') {
          if (event.detail === 'Yellow Card') {
            eventType = 'yellow_card';
            description = 'Yellow Card';
          } else if (event.detail === 'Red Card') {
            eventType = 'red_card';
            description = 'Red Card';
          }
        } else if (event.type === 'subst') {
          eventType = 'substitution';
          description = `Out: ${event.assist?.name || 'Unknown'}`;
        }

        // Determine if it's home or away team
        const isHomeTeam = toUpper(event.team?.name) === homeTeam;
        console.log(homeTeam,'isHomeTeam======')
        const teamSide: 'home' | 'away' = isHomeTeam ? 'home' : 'away';

        return {
          id: `${index}`,
          minute: event.time?.elapsed || 0,
          type: eventType,
          player: event.player?.name || 'Unknown',
          team: teamSide,
          description,
        };
      });

      // Sort events by minute (chronological order)
      return processedEvents.sort((a, b) => a.minute - b.minute);
    }
    return propMatchEvents || [];
  }, [timeline, propMatchEvents, homeTeam]);

  // Use provided group table or template data for demonstration
  const groupTable = propGroupTable || [];

  // Get lineups from API or use fallback
  const apiLineups = useMemo((): LineupData | null => {
    if (lineups && Array.isArray(lineups) && lineups.length >= 2) {
      const homeLineupData = lineups[0];
      const awayLineupData = lineups[1];

      // Process home lineup
      const homePlayers: Player[] = [];
      const homeStartingXI: Player[] = [];
      const homeSubs: Player[] = [];

      // Add starting XI
      if (homeLineupData.startXI && Array.isArray(homeLineupData.startXI)) {
        homeLineupData.startXI.forEach((item: any) => {
          const player = item.player;
          const playerData = {
            number: player.number || 0,
            name: player.name || 'Unknown',
            position: player.pos || 'N/A',
          };
          homePlayers.push(playerData);
          homeStartingXI.push(playerData);
        });
      }

      // Add substitutes
      if (homeLineupData.substitutes && Array.isArray(homeLineupData.substitutes)) {
        homeLineupData.substitutes.forEach((item: any) => {
          const player = item.player;
          const playerData = {
            number: player.number || 0,
            name: player.name || 'Unknown',
            position: 'SUB',
          };
          homePlayers.push(playerData);
          homeSubs.push(playerData);
        });
      }

      // Process away lineup
      const awayPlayers: Player[] = [];
      const awayStartingXI: Player[] = [];
      const awaySubs: Player[] = [];

      // Add starting XI
      if (awayLineupData.startXI && Array.isArray(awayLineupData.startXI)) {
        awayLineupData.startXI.forEach((item: any) => {
          const player = item.player;
          const playerData = {
            number: player.number || 0,
            name: player.name || 'Unknown',
            position: player.pos || 'N/A',
          };
          awayPlayers.push(playerData);
          awayStartingXI.push(playerData);
        });
      }

      // Add substitutes
      if (awayLineupData.substitutes && Array.isArray(awayLineupData.substitutes)) {
        awayLineupData.substitutes.forEach((item: any) => {
          const player = item.player;
          const playerData = {
            number: player.number || 0,
            name: player.name || 'Unknown',
            position: 'SUB',
          };
          awayPlayers.push(playerData);
          awaySubs.push(playerData);
        });
      }

      return {
        home: homePlayers,
        away: awayPlayers,
        homeFormation: homeLineupData.formation || 'N/A',
        awayFormation: awayLineupData.formation || 'N/A',
        homeStartingXI,
        homeSubs,
        awayStartingXI,
        awaySubs,
      };
    }

    // Return null if no lineup data available
    return null;
  }, [lineups]);

  // Use provided lineups or template data for demonstration
  const homeTeamLineup: Team = {
    name: homeTeam,
    crest: homeCrest,
    players: apiLineups?.home ||
      propHomeLineup || [],
  };

  const awayTeamLineup: Team = {
    name: awayTeam,
    crest: awayCrest,
    players: apiLineups?.away ||
      propAwayLineup || [],
  };

  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      {/* <HeadToHeadWidget sport={sport} gameId={gameId}  /> */}
      <MatchHeader
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeScore={homeScore}
        awayScore={awayScore}
        homeCrest={homeCrest}
        awayCrest={awayCrest}
      >
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <Box>
          {activeTab === 'stats' && <MatchStats stats={stats} additionalStats={additionalStats} />}
          {activeTab === 'timeline' && (
            <MatchTimeline
              matchEvents={matchEvents}
              currentMinute={currentMinute}
              homeScore={homeScore}
              awayScore={awayScore}
            />
          )}
          {activeTab === 'table' && <MatchTable groupTable={groupTable} groupName={groupName} />}
          {activeTab === 'lineups' && (
            <MatchLineups
              homeTeamLineup={homeTeamLineup}
              awayTeamLineup={awayTeamLineup}
              apiLineups={apiLineups}
            />
          )}
        </Box>
      </MatchHeader>
    </Box>
  );
}
