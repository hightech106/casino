import { Stack, Typography, Button, Box } from '@mui/material';
import Iconify from 'src/components/iconify';
import { AccumulatorMatch } from './data/mockData';

// ----------------------------------------------------------------------

type AccumulatorMatchRowProps = {
  match: AccumulatorMatch;
};

export default function AccumulatorMatchRow({ match }: AccumulatorMatchRowProps) {
  return (
    <Stack
      key={match.id}
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
      <Stack spacing={0.5}>
        <Stack direction="row" spacing={0.5} sx={{ display: 'flex', alignItems: 'center' }}>
          <Stack>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              {match.date}
            </Typography>
            <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
              {match.time}
            </Typography>
          </Stack>
          <Stack sx={{ borderLeft: '1px solid #FFFFFF', pl: 0.5 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: match.homeTeam.color,
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {match.homeTeam.logo}
              </Box>
              <Typography variant="body2" sx={{ color: 'white' }}>
                {match.homeTeam.name}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: match.awayTeam.color,
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {match.awayTeam.logo}
              </Box>
              <Typography variant="body2" sx={{ color: 'white' }}>
                {match.awayTeam.name}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify
            icon="material-symbols:sports-soccer"
            sx={{ width: 12, height: 12, color: 'white' }}
          />
          <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
            {match.league}
          </Typography>
        </Stack>
      </Stack>
      <Stack alignItems="flex-end" spacing={0.5}>
        <Button
          sx={{
            bgcolor: '#404040',
            color: 'white',
            minWidth: 80,
            height: 40,
            borderRadius: 1,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: '#505050',
            },
          }}
        >
          {match.odds}
        </Button>
        <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
          {match.betType}
        </Typography>
      </Stack>
    </Stack>
  );
}
