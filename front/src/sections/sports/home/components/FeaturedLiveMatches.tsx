import { Box, Button, Stack, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useSportsData } from 'src/hooks/use-sports-data';
import type { ISportsEvent } from 'src/types';
import Iconify from 'src/components/iconify';
import FeaturedMatchCard from './FeaturedMatchCard';

// ----------------------------------------------------------------------

export default function FeaturedLiveMatches() {
  // Use Redux-based sports data management
  const { liveMatches, loading } = useSportsData();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Transform live matches for FeaturedMatchCard component
  const featuredMatches = liveMatches.map((match: ISportsEvent) => ({
    ...match,
    leagueInfo: {
      id: match.league?.id || 0,
      name: match.league?.name || 'Unknown League',
      logo: match.league?.logo,
    },
  }));

  return (
    <Box sx={{ mb: { xs: 0, lg: 3 } }}>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 1, display: { xs: 'flex', sm: 'none' } }}
        >
          <Button
            sx={{
              color: 'white',
              flex: 1,
              fontSize: '8px',
              fontWeight: '400',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Iconify icon="mdi:soccer" sx={{ width: 30, height: 30 }} />
            Soccer
          </Button>
          <Button
            sx={{
              color: 'white',
              flex: 1,
              fontSize: '8px',
              fontWeight: '400',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Iconify icon="mdi:tennis" sx={{ width: 30, height: 30 }} />
            Tennis
          </Button>
          <Button
            sx={{
              color: 'white',
              flex: 1,
              fontSize: '8px',
              fontWeight: '400',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Iconify icon="mdi:basketball" sx={{ width: 30, height: 30 }} />
            Basketball
          </Button>
          <Button
            sx={{
              color: 'white',
              flex: 1,
              fontSize: '8px',
              fontWeight: '400',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Iconify icon="mdi:hockey-puck" sx={{ width: 30, height: 30 }} />
            Hockey
          </Button>
          <Button
            onClick={handleMenuClick}
            sx={{
              color: 'white',
              fontSize: '8px',
              fontWeight: '400',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Iconify icon="mdi:menu" sx={{ width: 30, height: 30 }} />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                bgcolor: '#2B2F3D',
                color: 'white',
                minWidth: 200,
              },
            }}
          >
            <MenuItem onClick={handleMenuClose} sx={{ gap: 1 }}>
              <Iconify icon="mdi:volleyball" sx={{ width: 20, height: 20 }} />
              Volleyball
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ gap: 1 }}>
              <Iconify icon="mdi:baseball" sx={{ width: 20, height: 20 }} />
              Baseball
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ gap: 1 }}>
              <Iconify icon="mdi:table-tennis" sx={{ width: 20, height: 20 }} />
              Table Tennis
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ gap: 1 }}>
              <Iconify icon="mdi:football" sx={{ width: 20, height: 20 }} />
              American Football
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ gap: 1 }}>
              <Iconify icon="mdi:handball" sx={{ width: 20, height: 20 }} />
              Handball
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ gap: 1 }}>
              <Iconify icon="mdi:cricket" sx={{ width: 20, height: 20 }} />
              Cricket
            </MenuItem>
          </Menu>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            py: 1,
            px: { xs: 1, lg: 0 },
            overflowX: 'auto',
            overflowY: 'hidden',
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: '#24ee89',
              borderRadius: 4,
              '&:hover': {
                bgcolor: '#FFD700',
              },
            },
          }}
        >
          {loading
            ? // Show loading skeletons
              [...Array(3)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    minWidth: 400,
                    height: 200,
                    bgcolor: '#2B2F3D',
                    borderRadius: 1,
                    border: '1px solid #3A3D4A',
                  }}
                />
              ))
            : featuredMatches.map((match: ISportsEvent) => (
                <FeaturedMatchCard key={match.id} match={match} />
              ))}
        </Stack>
      </Box>
    </Box>
  );
}
