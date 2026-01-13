import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function ShineIcon({ ...other }: BoxProps) {
    const theme = useTheme();

    const PRIMARY_MAIN = theme.palette.primary.main;

    const PRIMARY_DARK = theme.palette.primary.dark;

    const PRIMARY_DARKER = theme.palette.primary.darker;

    return (
        <Box
            component="svg"
            width="270" height="293" viewBox="0 0 270 293" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...other}
        >
            <g filter="url(#filter0_f_520_256)">
                <ellipse cx="135" cy="146.5" rx="60" ry="71.5" fill="#947A37" />
            </g>
            <defs>
                <filter id="filter0_f_520_256" x="0.709206" y="0.709206" width="268.582" height="291.582" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="37.1454" result="effect1_foregroundBlur_520_256" />
                </filter>
            </defs>
        </Box>
    );
}

export default memo(ShineIcon);
