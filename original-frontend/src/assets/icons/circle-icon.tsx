import { memo } from 'react';
// @mui
import Box, { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function CircleIcon({ color, ...other }: BoxProps) {
  return (
    <Box
      component="svg"
      width="9"
      height="9"
      fill="none"
      viewBox="0 0 9 9"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <circle cx="4.93127" cy="4.5" r="4.05627" fill={String(color) || 'white'} />
    </Box>
  );
}

export default memo(CircleIcon);
