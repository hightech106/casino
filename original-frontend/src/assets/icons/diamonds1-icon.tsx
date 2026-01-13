import { memo } from 'react';
// @mui
import Box, { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function Diamonds1Icon({ color, ...other }: BoxProps) {
  return (
    <Box
      component="svg"
      width="32" height="25" viewBox="0 0 32 25" fill="none" xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <path d="M5.61601 0.667969C5.35051 0.667969 5.10149 0.796683 4.94795 1.01328L1.10217 6.43831C0.883961 6.74613 0.904319 7.16319 1.15147 7.44829L15.4603 23.9542C15.7868 24.3309 16.3713 24.3309 16.6978 23.9542L31.0066 7.44829C31.2537 7.16319 31.2741 6.74613 31.0559 6.43831L27.2101 1.01328C27.0565 0.796683 26.8075 0.667969 26.542 0.667969H5.61601Z" fill="#3D5E8B" />
    </Box>
  );
}

export default memo(Diamonds1Icon);
