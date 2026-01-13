import { memo } from 'react';
// @mui
import Box, { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function StandIcon({ color, ...other }: BoxProps) {
  return (
    <Box
      component="svg"
      fill="currentColor"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className="svg-icon text-white-700/100 w-4 align-middle"
      {...other}
    >
       <path d="M59.102 14.4c0-2.666-2.134-4.534-4.534-4.534-2.666 0-4.534 2.134-4.534 4.534V32h-5.866V4.534C44.168 1.868 42.034 0 39.634 0S35.1 2.134 35.1 4.534V32h-5.6V12c0-2.666-2.134-4.534-4.534-4.534-2.666 0-4.534 2.134-4.534 4.534v30.666l-7.2-7.2c-1.866-1.866-5.066-1.866-6.934 0-1.868 1.866-1.866 5.066 0 6.934l14.4 17.6c1.6 2.666 4.534 4 7.734 4h16.266c7.734 0 14.134-6.4 14.134-14.134l.266-35.466h.004Z" />
    </Box>
  );
}

export default memo(StandIcon);
