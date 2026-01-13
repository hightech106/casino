import { Box, Stack, Typography, Button } from '@mui/material';

interface BetMatchCardProps {
  matchId: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  odds: number;
  betType: string;
  isLive?: boolean;
}

export default function BetMatchCard({
  matchId,
  league,
  homeTeam,
  awayTeam,
  score,
  odds,
  betType,
  isLive = true
}: BetMatchCardProps) {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: '#232626',
        borderRadius: 1,
        border: '1px solid #3A3F4F',
        position: 'relative',
      }}
    >
      {isLive && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            bgcolor: '#24ee89',
            color: '#232626',
            px: 1,
            py: 0.5,
            borderRadius: 0.5,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          LIVE
        </Box>
      )}
      
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, mt: isLive ? 3 : 0 }}>
        <Typography variant="body2" sx={{ color: 'white' }}>
          ⚽
        </Typography>
        <Typography variant="body2" sx={{ color: 'white', fontSize: '0.875rem' }}>
          {matchId}. {league}
        </Typography>
      </Stack>
      
      <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
        {homeTeam} - {awayTeam}
      </Typography>
      
      <Typography variant="body2" sx={{ color: '#24ee89', mb: 1 }}>
        {score}
      </Typography>
      
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Button
          sx={{
            bgcolor: '#3A3F4F',
            color: 'white',
            minWidth: 60,
            height: 32,
            borderRadius: 1,
            '&:hover': { bgcolor: '#4A4F5F' },
          }}
        >
          {odds}
        </Button>
        <Typography variant="body2" sx={{ color: 'white' }}>
          {betType}
        </Typography>
      </Stack>
    </Box>
  );
}
