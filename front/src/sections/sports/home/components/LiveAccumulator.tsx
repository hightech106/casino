import { Box, Stack, Typography, IconButton, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import AccumulatorMatchRow from './AccumulatorMatchRow';
import { accumulatorMatches } from './data/mockData';

// ----------------------------------------------------------------------

type LiveAccumulatorProps = {
  title: string;
};

export default function LiveAccumulator({ title }: LiveAccumulatorProps) {
  return (
    <Box sx={{ flex: 1 }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          bgcolor: '#2B2F3D',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid #404040',
        }}
      >
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
          {title}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton size="small" sx={{ color: 'white', p: 0.5 }}>
            <Iconify icon="material-symbols:chevron-left" sx={{ width: 16, height: 16 }} />
          </IconButton>
          <IconButton size="small" sx={{ color: 'white', p: 0.5 }}>
            <Iconify icon="material-symbols:calendar-today" sx={{ width: 16, height: 16 }} />
          </IconButton>
          <IconButton size="small" sx={{ color: 'white', p: 0.5 }}>
            <Iconify icon="material-symbols:chevron-right" sx={{ width: 16, height: 16 }} />
          </IconButton>
        </Stack>
      </Stack>

      {/* Match Entries */}
      <Stack spacing={0}>
        {accumulatorMatches.map((match) => (
          <AccumulatorMatchRow key={match.id} match={match} />
        ))}

        {/* Bonus and Overall Odds */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            bgcolor: '#232626',
            px: 2,
            py: 1.5,
            borderBottom: '1px solid #2B2F3D',
          }}
        >
          <Typography variant="body2" sx={{ color: 'white' }}>
            BONUS From LuckVerse777
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
            5.97
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            bgcolor: '#232626',
            px: 2,
            py: 1.5,
            borderBottom: '1px solid #2B2F3D',
          }}
        >
          <Typography variant="body2" sx={{ color: 'white' }}>
            Overall Odds
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
            5.689
          </Typography>
        </Stack>
      </Stack>

      {/* ADD TO BET SLIP Button */}
      <Button
        fullWidth
        sx={{
          bgcolor: 'transparent',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `,
          color: 'white',
          height: 48,
          fontSize: '1rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          borderRadius: 0,
          '&:hover': {
            background: 'linear-gradient(135deg, #FFE55C 0%, #FFB347 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(138,43, 226, 0.3)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        ADD TO BET SLIP
      </Button>
    </Box>
  );
}
