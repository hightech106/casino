import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  fill?: string;
}

function SingleIcon({ fill, ...other }: Props) {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box
      component="svg"
      width="20"
      height="20"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <path
        d="M8.067 32l-8.067-8c0.533-0.502 0.864-1.212 0.864-2s-0.332-1.498-0.863-1.999l-0.001-0.001 20-20c0.502 0.533 1.212 0.864 2 0.864s1.498-0.332 1.999-0.863l0.001-0.001 8 8.067c-0.512 0.499-0.829 1.196-0.829 1.967s0.317 1.467 0.829 1.966l0.001 0.001-20 20c-0.499-0.512-1.196-0.829-1.967-0.829s-1.467 0.317-1.966 0.829l-0.001 0.001z"
        fill={fill || PRIMARY_MAIN}
      />
    </Box>
  );
}

export default memo(SingleIcon);
