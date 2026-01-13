import { forwardRef } from 'react';
// @mui
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
// routes
import { RouterLink } from 'src/routes/components';
import { Stack, useMediaQuery } from '@mui/material';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  mini?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, mini = false, sx, ...other }, ref) => {
    // -------------------------------------------------------
    const logo = (
      <Stack
        direction={disabledLink ? 'column' : 'row'}
        sx={{ gap: 0.5, alignItems: 'center', justifyContent: 'center', ...sx }}
      >
        <Box
          component="img"
          src={`/logo/${(mini && 'logo-icon.png') || 'logo.png'}`} // => your path
          alt="logo"
          maxWidth={1}
          height="auto"
          sx={{ height: { xs: 68, sm: 42 }, cursor: 'pointer' }}
        />
      </Stack>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
