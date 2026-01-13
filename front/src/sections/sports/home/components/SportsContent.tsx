import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Box, Typography, Pagination } from '@mui/material';
import { useSportsData } from 'src/hooks/use-sports-data';
import type { ISportsEvent } from 'src/types';
// components
import SportsBanner from './SportsBanner';
import FeaturedLiveMatches from './FeaturedLiveMatches';
import NavigationTabs from './NavigationTabs';
import SportFilters from './SportFilters';
import LeagueSection from './LeagueSection';
import LiveAccumulators from './LiveAccumulators';

// ----------------------------------------------------------------------

const ITEMS_PER_PAGE = 10;

function SportsContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedLeagues, setExpandedLeagues] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [tabCalculations, setTabCalculations] = useState({
    matches: 0,
    recommended: 0,
    upcoming: 0,
    firstPeriod: 0,
    secondPeriod: 0,
  });

  // Use Redux-based sports data management
  const {
    matches,
    leagues,
    liveMatches,
    upcomingMatches,
    loading,
    liveToggle,
    setLiveFilter,
    totalMatches,
    totalLiveMatches,
    totalUpcomingMatches,
  } = useSportsData();

  // Filter leagues based on liveToggle - only show leagues that have relevant matches
  const filteredLeagues = useMemo(() => {
    if (liveToggle) {
      return leagues.filter(
        (league) => league.events.some((event: ISportsEvent) => event.time_status === 1) === true
      );
    }
    return leagues.filter(
      (league) => league.events.some((event: ISportsEvent) => event.time_status === 1) === false
    );
  }, [leagues, liveToggle]);

  // Calculate paginated leagues
  const paginatedLeagues = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredLeagues.slice(startIndex, endIndex);
  }, [filteredLeagues, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredLeagues.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filteredLeagues changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredLeagues.length]);

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Scroll to top of league sections
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Formulation functions for each tab
  const calculateTabData = useCallback(
    (tabIndex: number) => {
      switch (tabIndex) {
        case 0: // MATCHES
          return liveToggle ? totalLiveMatches : totalUpcomingMatches;
        case 1: // RECOMMENDED
          return matches.filter((match) => {
            // Check if odds exist and are in recommended range
            if (match.odds && match.odds[0] && match.odds[0].bets) {
              const homeOdd = match.odds[0].bets.find((bet: any) => bet.name === 'Match Winner');
              if (homeOdd && homeOdd.values) {
                const homeValue = homeOdd.values.find((val: any) => val.value === 'Home');
                return (
                  homeValue && parseFloat(homeValue.odd) > 2.0 && parseFloat(homeValue.odd) < 5.0
                );
              }
            }
            return false;
          }).length;
        case 2: // UPCOMING EVENTS
          return totalUpcomingMatches;
        case 3: // 1ST PERIOD
          return liveMatches.filter((match) => match.f_status?.short === '1H').length;
        case 4: // 2ND PERIOD
          return liveMatches.filter((match) => match.f_status?.short === '2H').length;
        default:
          return 0;
      }
    },
    [matches, liveMatches, liveToggle, totalLiveMatches, totalUpcomingMatches]
  );

  // Update calculations when activeTab changes
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    const calculatedValue = calculateTabData(newValue);

    // Map tab indices to calculation keys
    const tabKeyMap: Record<number, keyof typeof tabCalculations> = {
      0: 'matches',
      1: 'recommended',
      2: 'upcoming',
      3: 'firstPeriod',
      4: 'secondPeriod',
    };

    setTabCalculations((prev) => ({
      ...prev,
      [tabKeyMap[newValue]]: calculatedValue,
    }));
  };

  const toggleLeagueExpansion = (leagueId: string) => {
    console.log('Toggling league:', leagueId, 'Current state:', expandedLeagues);
    setExpandedLeagues((prev) => ({
      ...prev,
      [leagueId]: !prev[leagueId],
    }));
  };

  // Note: Data fetching is now handled by useSportsData hook automatically

  // Update calculations when matches change or live toggle changes
  useEffect(() => {
    const newCalculations = {
      matches: calculateTabData(0),
      recommended: calculateTabData(1),
      upcoming: calculateTabData(2),
      firstPeriod: calculateTabData(3),
      secondPeriod: calculateTabData(4),
    };
    setTabCalculations(newCalculations);
  }, [matches, liveToggle, calculateTabData]);

  return (
    <Box
      sx={{
        minHeight: { xs: 'calc(100vh - 160px)', lg: 'calc(100vh - 80px)' }, // Account for mobile menu
        bgcolor: '#232626',
        width: {
          xs: '100%',
          sm: '100%',
          md: 'calc(100vw - 280px - 400px)',
          lg: 'calc(100vw - 280px - 400px)',
        },
        maxWidth: {
          xs: '100%',
          sm: '100%',
          md: 'calc(100vw - 280px - 400px)',
          lg: 'calc(100vw - 280px - 400px)',
        },
        overflow: 'auto',
        // Better mobile spacing and typography
        '& *': {
          fontSize: { xs: '14px', sm: '16px' },
        },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          fontSize: { xs: '18px', sm: '20px', md: '24px' },
          fontWeight: 600,
        },
        // Touch-friendly interactions
        '& button, & [role="button"]': {
          minHeight: { xs: 44, sm: 40 }, // Minimum touch target
          fontSize: { xs: '14px', sm: '16px' },
        },
      }}
    >
      {/* Sports Banner */}
      {/* <SportsBanner /> */}

      {/* Featured Live Matches Section */}
      <FeaturedLiveMatches />

      {/* Navigation Tabs and Search */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabCalculations={tabCalculations}
        liveToggle={liveToggle}
        onLiveToggle={setLiveFilter}
      />

      {/* Sport Filters Row */}
      <SportFilters
        footballMatchCount={tabCalculations.matches}
        liveFilter={liveToggle}
        onLiveFilterChange={setLiveFilter}
      />

      {/* League Sections - Filtered based on liveToggle */}
      {filteredLeagues.length > 0 ? (
        <>
          {paginatedLeagues.map((league) => (
            <LeagueSection
              key={league.id}
              leagueId={league.id.toString()}
              leagueName={league.name}
              leagueLogo={league.logo}
              isExpanded={expandedLeagues[league.id.toString()] || false}
              onToggleExpansion={toggleLeagueExpansion}
              matches={league.events}
              loading={loading}
              liveToggle={liveToggle}
            />
          ))}

          {/* Pagination - Show only if more than 10 leagues */}
          {filteredLeagues.length > ITEMS_PER_PAGE && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#A0A3A7',
                    '&.Mui-selected': {
                      backgroundColor: '#FFC107',
                      color: '#232626',
                      '&:hover': {
                        backgroundColor: '#FFD54F',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#A0A3A7' }}>
            {liveToggle ? 'No live matches available at the moment' : 'No matches available'}
          </Typography>
        </Box>
      )}

      {/* Live Accumulators Section */}
      <LiveAccumulators />
    </Box>
  );
}

export default memo(SportsContent);
