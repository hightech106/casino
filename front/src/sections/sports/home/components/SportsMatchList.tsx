import { Box, Stack, Skeleton } from '@mui/material';
import type { ISportsMatch } from 'src/types';
import BetCarousel from '../bet-carousel';
import BetList from '../bet-list';

interface SportsMatchListProps {
  sportId: number;
  matches: ISportsMatch[];
  loading: boolean;
}

export default function SportsMatchList({ sportId, matches, loading }: SportsMatchListProps) {
  if (loading && !matches.length) {
    return (
      <Stack gap={2} mt={{ xs: 1, sm: 2 }}>
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} sx={{ width: 1, height: 58, borderRadius: 0.5 }} />
        ))}
      </Stack>
    );
  }

  return (
    <>
      {sportId !== 2 && (
        <BetCarousel sportId={sportId} data={matches} loading={loading} />
      )}

      {matches.length > 0 && (
        <Box
          sx={{
            overflowX: 'auto',
            mt: 2,
          }}
        >
          <Stack minWidth={{ xs: 1, sm: 830 }} gap={2}>
            {matches.map((match, index) => (
              <BetList
                key={`${match.events[0]?.id || index}-${index}`}
                data={match}
                index={index}
                sportId={sportId}
                loading={loading}
              />
            ))}
          </Stack>
        </Box>
      )}
    </>
  );
} 