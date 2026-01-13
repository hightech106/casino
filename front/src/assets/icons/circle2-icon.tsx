import { memo } from 'react';
// @mui
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
    color: string,
}

function Circle2Icon({ color, ...other }: Props) {
    return (
        <Box
            component="svg"
            width="158"
            height="84"
            viewBox="0 0 158 84"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...other}
        >
            <path d="M79.3102 83.6198C122.604 83.6198 157.7 65.1113 157.7 42.2798C157.7 19.4484 122.604 0.939819 79.3102 0.939819C36.0166 0.939819 0.920166 19.4484 0.920166 42.2798C0.920166 65.1113 36.0166 83.6198 79.3102 83.6198Z" fill={`url(#paint0_radial_146_683_${color.replaceAll("#", "")})`} />
            <defs>
                <radialGradient id={`paint0_radial_146_683_${color.replaceAll("#", "")}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(78.5459 20.7701) scale(45.8441 57.7018)">
                    <stop stopColor={color} stopOpacity="0.7" />
                    <stop offset="1" stopColor="#333333" stopOpacity="0" />
                </radialGradient>
            </defs>
        </Box>
    );
}

export default memo(Circle2Icon);
