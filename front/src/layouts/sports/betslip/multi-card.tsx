import { memo } from 'react';
import { m } from 'framer-motion';
// @mui
import {
  Card,
  IconButton,
  Typography,
  CardHeader,
  CardContent,
} from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// store
import { useDispatch, useSelector } from 'src/store';
import { updateBetSlip } from 'src/store/reducers/sports';
// components
import Iconify from 'src/components/iconify';
import { varFade } from 'src/components/animate';
// utils
import { addRemoveBetslip } from 'src/utils/sports';
// types
import type { BetslipProps } from 'src/types';

// ----------------------------------------------------------------------

const CARD_STYLES = {
  header: {
    p: 1.5,
    '& .MuiCardHeader-title': {
      fontSize: '14px',
    },
    '& svg': {
      fontSize: '16px',
    },
  },
  content: {
    px: 1.5,
    pt: 0,
    pb: '8px !important',
  },
  sportIcon: {
    mt: 0.5,
    color: 'gold',
    fontSize: 14,
  },
  teamName: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  marketName: {
    color: '#999A9A',
  },
  oddsContainer: {
    fontSize: 14,
  },
} as const;

// ----------------------------------------------------------------------

interface BetSlipMultiCardProps {
  slip: BetslipProps;
}

function BetSlipMultiCard({ slip }: BetSlipMultiCardProps) {
  const dispatch = useDispatch();
  const { bet_slips } = useSelector((store) => store.sports);

  const handleDelete = () => {
    dispatch(updateBetSlip(addRemoveBetslip(bet_slips, slip)));
  };

  const replaceTeamNames = (name: string | number) =>
    name.toString().replaceAll("Home", slip.HomeTeam).replaceAll("Away", slip.AwayTeam);

  return (
    <Box component={m.div} {...varFade().inLeft}>
      <CardHeader
        sx={CARD_STYLES.header}
        action={
          <IconButton size="small" onClick={handleDelete} aria-label="remove bet">
            <Iconify icon="ic:round-close" />
          </IconButton>
        }
        title={
          <Typography sx={{ cursor: 'pointer' }}>
            {`${slip.HomeTeam} vs ${slip.AwayTeam}`}
          </Typography>
        }
      />
      <CardContent sx={CARD_STYLES.content}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Stack height={1}>
              <Box
                component="i"
                className={`sportsicons sportsicon-${slip.SportId}`}
                sx={CARD_STYLES.sportIcon}
              />
            </Stack>
            <Stack ml={0.5}>
              <Typography variant="body2" sx={CARD_STYLES.teamName}>
                {replaceTeamNames(slip.oddName)}
              </Typography>
              <Typography variant="body2" sx={CARD_STYLES.marketName}>
                {slip.marketName}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Iconify icon="ic:twotone-align-vertical-center" sx={{ color: 'gold' }} />
            <Typography sx={CARD_STYLES.oddsContainer}>
              {slip.odds}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Box>
  );
}

export default memo(BetSlipMultiCard);
