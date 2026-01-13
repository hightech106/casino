import { memo } from 'react';
// @mui
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
    color: string,
}

function CircleDialogIcon({ color, ...other }: Props) {
    return (
        <Box
            component="svg"
            width="291" height="82"
            viewBox="0 0 291 82"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            {...other}
        >
            <path d="M145.08 81.16C225.205 81.16 290.16 16.2055 290.16 -63.92C290.16 -144.045 225.205 -209 145.08 -209C64.9545 -209 0 -144.045 0 -63.92C0 16.2055 64.9545 81.16 145.08 81.16Z" fill={`url(#paint0_radial_211_310_${color.replaceAll("#", "")})`} />
            <defs>
                <radialGradient id={`paint0_radial_211_310_${color.replaceAll("#", "")}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(145.765 103.561) scale(250 250)">
                    <stop stopColor="#46C4AC" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#333333" stopOpacity="0" />
                </radialGradient>
            </defs>
        </Box>
    );
}

export default memo(CircleDialogIcon);
