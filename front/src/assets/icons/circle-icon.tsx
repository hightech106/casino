import { memo } from 'react';
// @mui
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
    color: string,
}

function CircleIcon({ color, ...other }: Props) {
    return (
        <Box
            component="svg"
            width="257" height="87" 
            viewBox="0 0 257 87"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            {...other}
        >

            <path d="M128.7 86.6198C208.825 86.6198 273.78 21.6652 273.78 -58.4603C273.78 -138.586 208.825 -203.54 128.7 -203.54C48.5744 -203.54 -16.3801 -138.586 -16.3801 -58.4603C-16.3801 21.6652 48.5744 86.6198 128.7 86.6198Z"
                fill={`url(#paint0_radial_146_678_${color.replaceAll("#", "")})`}
            />
            <defs>
                <radialGradient id={`paint0_radial_146_678_${color.replaceAll("#", "")}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(129.385 109.021) scale(160 160)">
                    <stop stopColor={color} stopOpacity="0.7" />
                    <stop offset="1" stopColor="#333333" stopOpacity="0" />
                </radialGradient>
            </defs>
        </Box>
    );
}

export default memo(CircleIcon);
