import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function container(theme: Theme) {
  return {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          paddingRight: 0,
          '&.MuiContainer-maxWidthLg': {
            paddingLeft: 0,
            paddingRight: 0,
          },
          '&.MuiContainer-maxWidthMd': {
            paddingLeft: 0,
            paddingRight: 0,
          },
          '&.MuiContainer-maxWidthSm': {
            paddingLeft: 0,
            paddingRight: 0,
          },
          '&.MuiContainer-maxWidthXl': {
            paddingLeft: 0,
            paddingRight: 0,
          },
          '&.MuiContainer-maxWidthXs': {
            paddingLeft: 0,
            paddingRight: 0,
          },
        },
      },
    },
  };
}
