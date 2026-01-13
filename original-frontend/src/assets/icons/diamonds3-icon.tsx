import { memo } from 'react';
// @mui
import Box, { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function Diamonds3Icon({ color, ...other }: BoxProps) {
  return (
    <Box
      component="svg"
      width="32" height="25" viewBox="0 0 32 25" fill="none" xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <path d="M5.70729 0.667969C5.44179 0.667969 5.19277 0.796683 5.03923 1.01328L1.19345 6.43831C0.975239 6.74613 0.995597 7.16319 1.24275 7.44829L15.5515 23.9542C15.8781 24.3309 16.4625 24.3309 16.7891 23.9542L31.0978 7.44829C31.345 7.16319 31.3653 6.74613 31.1471 6.43831L27.3014 1.01328C27.1478 0.796683 26.8988 0.667969 26.6333 0.667969H5.70729Z" fill="#0C1F3A" />
    </Box>
  );
}

export default memo(Diamonds3Icon);
