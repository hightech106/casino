import { useState, useMemo, memo } from 'react';
import { Box, Stack, Typography, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import type { ISportsEvent } from 'src/types';
import premierLeagueLogo from '../../../../assets/sports/england premier.png';
import MatchRow from './MatchRow';

// ----------------------------------------------------------------------

type LeagueSectionProps = {
  leagueId: string;
  leagueName: string;
  leagueLogo?: string;
  isExpanded: boolean;
  onToggleExpansion: (leagueId: string) => void;
  matches: ISportsEvent[];
  loading: boolean;
  liveToggle?: boolean; // Add liveToggle prop
};

function LeagueSection({
  leagueId,
  leagueName,
  leagueLogo,
  isExpanded,
  onToggleExpansion,
  matches,
  loading,
  liveToggle = false,
}: LeagueSectionProps) {
  // Get live matches
  const liveMatches = useMemo(() => matches.filter((match) => match.time_status === 1), [matches]);

  // Get upcoming matches
  const upcomingMatches = useMemo(
    () => matches.filter((match) => match.time_status === 0),
    [matches]
  );

  return (
    <Box sx={{ mb: 1 }}>
      {/* League Header - Clickable Dropdown */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          mb: 1,
          px: 2,
          py: 1,
          bgcolor: '#2B2F3D',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: alpha('#24ee89', 0.05),
          },
          transition: 'all 0.2s ease',
        }}
        onClick={() => {
          console.log('LeagueSection clicked, leagueId:', leagueId, 'isExpanded:', isExpanded);
          onToggleExpansion(leagueId);
        }}
      >
        <Iconify
          icon={
            isExpanded
              ? 'material-symbols:keyboard-arrow-down'
              : 'material-symbols:keyboard-arrow-right'
          }
          sx={{ width: 16, height: 16, color: '#24ee89', display: { md: 'block' } }}
        />
        <Iconify
          icon="material-symbols:sports-soccer"
          sx={{ width: 20, height: 20, color: '#24ee89', display: { md: 'block' } }}
        />
        <Box
          component="img"
          src={leagueLogo || premierLeagueLogo}
          onError={(e) => {
            e.currentTarget.src = premierLeagueLogo;
          }}
          sx={{ width: 16, height: 16, display: { md: 'block' } }}
        />
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, flex: 1 }}>
          {leagueName}
        </Typography>

        {/* Global Betting Markets Header - Matches API structure */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={2}
          sx={{ flex: 1, ml: 2, display: { xs: 'none', md: 'flex' } }}
        >
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, minWidth: 50 }}>
            1
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, minWidth: 50 }}>
            X
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, minWidth: 50 }}>
            2
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, minWidth: 50 }}>
            O 2.5
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, minWidth: 50 }}>
            U 2.5
          </Typography>
        </Stack>
      </Stack>

      {/* Children Content - Only show when expanded */}
      {isExpanded && (
        <>
          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#A0A3A7' }}>
                Loading matches...
              </Typography>
            </Box>
          ) : (
            <>
              {liveToggle ? (
                <>
                  {liveMatches.length > 0 &&
                    liveMatches
                      .slice(0, 5)
                      .map((match: ISportsEvent) => (
                        <MatchRow key={match.id} match={match} oddsData={match.odds} />
                      ))}
                </>
              ) : (
                <>
                  {upcomingMatches.length > 0 &&
                    upcomingMatches.map((match: ISportsEvent) => (
                      <MatchRow key={match.id} match={match} oddsData={match.odds} />
                    ))}
                </>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
}

export default memo(LeagueSection);
