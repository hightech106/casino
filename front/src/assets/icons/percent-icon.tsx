import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  percent: number;
  primeryColor: string;
  secondaryColor: string;
}

function PercentIcon({ percent, primeryColor, secondaryColor, ...other }: Props) {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const PRIMARY_DARKER = theme.palette.primary.darker;

  // -223

  // -2px

  return (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      sx={{ position: 'relative', width: 120, height: 120, transform: 'rotate(-233deg)', mr: 2.8 }}
      {...other}
    >
      <circle
        cx="55"
        cy="55"
        r="45"
        style={{
          width: '100%',
          height: '100%',
          fill: 'none',
          stroke: primeryColor,
          strokeWidth: 3,
          strokeLinecap: 'round',
          strokeDasharray: 281,
        }}
      />
      <circle
        cx="55"
        cy="55"
        r="45"
        style={{
          strokeDasharray: 625,
          fill: 'none',
          strokeWidth: 3,
          strokeLinecap: 'round',
          strokeDashoffset: `calc(${percent * -223} / 100)`,
          stroke: secondaryColor,
        }}
      />
    </Box>
  );
}

export default memo(PercentIcon);
