import { Box, Stack, Typography, Button, OutlinedInput, Select, MenuItem } from '@mui/material';
import TrashIcon from '../../../../assets/sports/trashbin.png';
import RefreshIcon from '../../../../assets/sports/refresh.png';

interface AccumulatorSectionProps {
  overallOdds: number;
  stake: number;
  onStakeChange: (value: number) => void;
  onClearAccumulator: () => void;
  onRefresh: () => void;
  balance: number;
  maxStake: number;
  potentialWinnings: number;
}

export default function AccumulatorSection({
  overallOdds,
  stake,
  onStakeChange,
  onClearAccumulator,
  onRefresh,
  balance,
  maxStake,
  potentialWinnings
}: AccumulatorSectionProps) {
  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        {/* Accumulator Dropdown with Trash Icon */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button
            sx={{
              color: 'white',
              fontWeight: 600,
              fontSize: '16px',
              textTransform: 'none',
              justifyContent: 'flex-start',
              bgcolor: '#232626',
              p: 0.5,
              minWidth: 'auto',
            }}
            onClick={() => {
              console.log('Accumulator dropdown clicked');
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                Accumulator
              </Typography>
              <Box sx={{ color: 'white' }}>▼</Box>
            </Stack>
          </Button>
          <Button
            sx={{
              color: '#24ee89',
              minWidth: 'auto',
              p: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(138, 43, 226, 0.1)',
              },
            }}
            onClick={onClearAccumulator}
          >
            <img src={TrashIcon} alt="Trash" />
          </Button>
        </Stack>

        {/* Overall Odds */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'white' }}>
            Overall odds:
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
            {overallOdds}
          </Typography>
        </Stack>

        {/* Stake Amount */}
        <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
          LuckVerse777 amount [USD]
        </Typography>

        {/* Amount Input with +/- buttons */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            sx={{
              bgcolor: '#3A3F4F',
              color: '#24ee89',
              minWidth: 32,
              height: 32,
              borderRadius: 1,
              '&:hover': { bgcolor: '#4A4F5F' },
            }}
            onClick={() => onStakeChange(Math.max(0, stake - 1))}
          >
            -
          </Button>
          <OutlinedInput
            value={stake}
            size="small"
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-input': {
                color: 'white',
                textAlign: 'center',
                py: 1,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3A3F4F',
              },
            }}
            onChange={(e) => onStakeChange(Number(e.target.value))}
          />
          <Button
            sx={{
              bgcolor: '#3A3F4F',
              color: '#24ee89',
              minWidth: 32,
              height: 32,
              borderRadius: 1,
              '&:hover': { bgcolor: '#4A4F5F' },
            }}
            onClick={() => onStakeChange(stake + 1)}
          >
            +
          </Button>
        </Stack>

        {/* Maximum Stake */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'white' }}>
            Maximum stake:
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
            {maxStake} USD
          </Typography>
        </Stack>

        {/* Balance */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'white' }}>
            Balance:
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
            {balance}
          </Typography>
        </Stack>

        {/* Available Advancebet */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'white' }}>
            Available Advancebet
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
              0
            </Typography>
            <Button sx={{ minWidth: 'auto', p: 0.5 }} onClick={onRefresh}>
              <img src={RefreshIcon} alt="Refresh" />
            </Button>
          </Stack>
        </Stack>

        {/* When odds change */}
        <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
          When odds change
        </Typography>
        <Select
          value="accept-increase"
          size="small"
          sx={{
            bgcolor: '#232626',
            '& .MuiOutlinedInput-input': { color: 'white' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3A3F4F' },
            '& .MuiSvgIcon-root': { color: 'white' },
          }}
        >
          <MenuItem value="accept-increase">Accept if odds increase</MenuItem>
          <MenuItem value="accept-any">Accept any change</MenuItem>
        </Select>

        {/* Potential winnings */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'white' }}>
            Potential winnings:
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
            {potentialWinnings} USD
          </Typography>
        </Stack>

        {/* DEPOSIT Button */}
        <Button
          fullWidth
          sx={{
            bgcolor: '#24ee89',
            color: '#232626',
            fontWeight: 700,
            py: 1.5,
            borderRadius: 1,
            '&:hover': {
              bgcolor: '#E6D417',
            },
          }}
        >
          DEPOSIT
        </Button>
      </Stack>
    </Box>
  );
}
