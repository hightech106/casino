import { Stack } from '@mui/material';
import LiveAccumulator from './LiveAccumulator';

// ----------------------------------------------------------------------

export default function LiveAccumulators() {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: {xs: 0, md: 3} }}>
      <LiveAccumulator title="Live Accumulator Of The Day No.1" />
      <LiveAccumulator title="Live Accumulator Of The Day No.2" />
    </Stack>
  );
}
