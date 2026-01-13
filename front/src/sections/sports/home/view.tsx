import { useState, useCallback, useEffect } from 'react';
import { useLocales } from 'src/locales';
import { useSelector } from 'src/store';
import { useResponsive } from 'src/hooks/use-responsive';
import type { ISportsMatch } from 'src/types';

// Components
import { Box, Stack, Typography } from '@mui/material';
import SportsBanner from './components/SportsBanner';
import SportsNavigation from './components/SportsNavigation';
import SportsSearch from './components/SportsSearch';
import SportsMatchList from './components/SportsMatchList';
import SportsContent from './components/SportsContent';
import FavoriteMatches from './components/FavoriteMatches';
import TopCompetition from './top-copetition';

// Custom hooks
import { useSportsData } from 'src/hooks/use-sports-data';
import { useSportsSearch } from './hooks/useSportsSearch';

// Types
type StartInType = 'PRE' | 'TODAY' | 'HOUR' | 'LIVE' | 'ALL';

export default function SportsView() {
  const { t, currentLang } = useLocales();
  const smDown = useResponsive('down', 'md');

  // State
  const [search, setSearch] = useState<string>('');
  const [activeSport, setActiveSport] = useState<number>(1);
  const [startIn, setStartIn] = useState<StartInType>('LIVE');

  // Custom hooks - using centralized sports data
  const {
    matches,
    loading
  } = useSportsData();

  // Note: useSportsSearch expects ISportsMatch[] but we have ISportsEvent[]
  // For now, we'll use matches directly without filtering
  const filteredMatches = matches;

  return (
    <Stack spacing={2}>
      {/* <SportsBanner /> */}

      <SportsNavigation
        activeSport={activeSport}
        onSportChange={setActiveSport}
        isMobile={smDown}
      />

      <SportsSearch
        search={search}
        onSearchChange={setSearch}
        startIn={startIn}
        onStartInChange={setStartIn}
      />

      {/* SportsMatchList component expects ISportsMatch[] but we have ISportsEvent[]
          This component needs to be updated to work with the new data structure
      {activeSport !== 2 && (
        <SportsMatchList
          sportId={activeSport}
          matches={filteredMatches}
          loading={loading}
        />
      )} */}

      <FavoriteMatches />

      <SportsContent />

      <TopCompetition />
    </Stack>
  );
}
