import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function SportsLockIcon({ ...other }: BoxProps) {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box
      component="svg"
      width={24}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <path
        d="M20.41 6.96V8.79C20.41 9.43 20.11 10.03 19.59 10.4L8.58997 18.46C7.87997 18.98 6.90997 18.98 6.20997 18.45L4.76997 17.37C4.11997 16.88 3.58997 15.82 3.58997 15.01V6.96C3.58997 5.84 4.44997 4.6 5.49997 4.21L10.97 2.16C11.54 1.95 12.46 1.95 13.03 2.16L18.5 4.21C19.55 4.6 20.41 5.84 20.41 6.96Z"
        fill="#212637"
      />
      <path
        d="M18.82 12.34C19.48 11.86 20.41 12.33 20.41 13.15V15.03C20.41 15.84 19.88 16.89 19.23 17.38L13.76 21.47C13.28 21.82 12.64 22 12 22C11.36 22 10.72 21.82 10.24 21.46L9.40998 20.84C8.86998 20.44 8.86998 19.63 9.41998 19.23L18.82 12.34Z"
        fill="#212637"
      />
    </Box>
  );
}

export default memo(SportsLockIcon);
