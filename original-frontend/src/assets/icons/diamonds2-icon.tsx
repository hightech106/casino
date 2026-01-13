import { memo } from 'react';
// @mui
import Box, { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

function Diamonds2Icon({ color, ...other }: BoxProps) {
  return (
    <Box
      component="svg"
      width="32" height="25" viewBox="0 0 32 25" fill="none" xmlns="http://www.w3.org/2000/svg"
      {...other}
    >
      <path d="M5.70749 1.41797H26.6333C26.6443 1.41797 26.6549 1.42089 26.6645 1.42578L26.6899 1.44727L30.5356 6.87207C30.5493 6.8915 30.5518 6.91634 30.5434 6.9375L30.5307 6.95703L16.2221 23.4629C16.2015 23.4867 16.1688 23.4925 16.1421 23.4805L16.1186 23.4629L1.80905 6.95703C1.79352 6.93898 1.78898 6.9145 1.79538 6.89258L1.80515 6.87207L5.65085 1.44727C5.65723 1.43827 5.66577 1.43076 5.67526 1.42578L5.70749 1.41797Z" fill="#0C1F3A" stroke="#3F608D" strokeWidth="1.5" />
    </Box>
  );
}

export default memo(Diamonds2Icon);
