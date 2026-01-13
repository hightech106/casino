import { Box, Stack, Typography, Chip } from '@mui/material';
import { Player } from './types';

interface PlayerCardProps {
  player: Player;
  index: number;
}

const getPositionColor = (position: string) => {
  switch (position.toUpperCase()) {
    case 'G':
      return '#FFD700'; // Gold for Goalkeeper
    case 'D':
      return '#4CAF50'; // Green for Defender
    case 'M':
      return '#2196F3'; // Blue for Midfielder
    case 'F':
      return '#FF5722'; // Red for Forward
    default:
      return '#757575'; // Gray for others/SUB
  }
};

export default function PlayerCard({ player, index }: PlayerCardProps) {
  return (
    <Box
      key={index}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 1,
        p: 1.5,
        mb: 1,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.2s',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} >
        <Stack direction="row" spacing={1} flex="1">
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            {player.number}
          </Typography>
          {/* Player Name */}
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            {player.name}
          </Typography>
        </Stack>

        {/* Position Badge */}
        <Chip
          label={player.position}
          size="small"
          sx={{
            bgcolor: getPositionColor(player.position),
            color: 'white',
            fontWeight: 600,
            fontSize: '0.7rem',
            height: 24,
            '& .MuiChip-label': {
              px: 1,
            },
          }}
        />
      </Stack>
    </Box>
  );
}

export { getPositionColor };
