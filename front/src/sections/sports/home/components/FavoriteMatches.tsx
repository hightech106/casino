import { Box, Stack, Typography, Button, IconButton } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useLocales } from 'src/locales';
import { useFavorites } from 'src/hooks/use-favorites';
import { useSportsData } from 'src/hooks/use-sports-data';
import Iconify from 'src/components/iconify';
import FeaturedMatchCard from './FeaturedMatchCard';

// ----------------------------------------------------------------------

export default function FavoriteMatches() {
  const { favorites, clearFavorites } = useFavorites();
  const { matches, loading } = useSportsData();

  // Filter matches that are in favorites from centralized data
  const favoriteMatches = matches.filter(match => 
    favorites.includes(match.id)
  ).map(match => ({
    ...match,
    leagueInfo: {
      id: match.league?.id || 0,
      name: match.league?.name || 'Unknown League',
      logo: match.league?.logo || '',
    }
  }));

  if (favorites.length === 0) {
    return (
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            ⭐ Favorite Matches
          </Typography>
        </Stack>
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: '#2B2F3D',
            borderRadius: 2,
            border: '1px solid #3A3D4A',
          }}
        >
          <Iconify
            icon="material-symbols:star-outline"
            sx={{
              width: 48,
              height: 48,
              color: 'rgba(255, 255, 255, 0.3)',
              mb: 2,
            }}
          />
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            No favorite matches yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Click the star icon on any match to add it to your favorites
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
          ⭐ Favorite Matches ({favorites.length})
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={clearFavorites}
          sx={{
            borderColor: '#5A5D68',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.75rem',
            '&:hover': {
              borderColor: '#24ee89',
              color: '#24ee89',
            },
          }}
        >
          Clear All
        </Button>
      </Stack>
      
      <Box
        sx={{
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
        <Stack
          direction="row"
          spacing={2}
          sx={{
            py: 1,
          }}
        >
          {loading ? (
            // Show loading skeletons
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
          ) : (
            favoriteMatches.map((match) => (
              <FeaturedMatchCard 
                key={match.id} 
                match={match}
              />
            ))
          )}
        </Stack>
      </Box>
    </Box>
  );
}
