import { memo, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { m } from 'framer-motion';
import { LoadingButton } from '@mui/lab';
// @mui
import {
  Card,
  Button,
  IconButton,
  Typography,
  CardHeader,
  CardContent,
  OutlinedInput,
  InputAdornment,
  Switch,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// store
import { useDispatch, useSelector } from 'src/store';
import { updateBetSlip, updateHistory } from 'src/store/reducers/sports';
import { UpdateBalance } from 'src/store/reducers/auth';
// hooks
import useApi from 'src/hooks/use-api';
// components
import Iconify from 'src/components/iconify';
import { AnimateButton, varFade } from 'src/components/animate';
// utils
import { fShortNumber } from 'src/utils/format-number';
import { abbreviate, addRemoveBetslip } from 'src/utils/sports';
// types
import type { BetslipProps, IFreeBet, ISportsBet } from 'src/types';

// ----------------------------------------------------------------------

const CARD_STYLES = {
  root: {
    mb: 1,
    borderRadius: 0.5,
    bgcolor: 'background.paper',
  },
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
    p: '0 12px 12px 12px',
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
    fontSize: 12,
    color: '#999A9A',
  },
  stakeInput: {
    pr: 0.9,
    borderRadius: 1,
    width: 'calc(100% - 10px)',
    '& fieldset': {
      borderRadius: 1,
    },
    '& input': {
      height: '40%',
    },
  },
  maxButton: {
    height: 1,
    fontSize: 14,
    minWidth: 43,
    fontWeight: 400,
    color: '#FFFFFF',
    bgcolor: '#2b72b17a',
  },
  freeBetSelect: {
    bgcolor: 'primary.main',
  },
} as const;

// ----------------------------------------------------------------------

interface BetSlipSingleCardProps {
  slip: BetslipProps;
  freeBetOptions: IFreeBet[];
}

function BetSlipSingleCard({ slip, freeBetOptions }: BetSlipSingleCardProps) {
  const dispatch = useDispatch();
  const { add_sports_bet } = useApi();

  const { bet_slips, active_history } = useSelector((store) => store.sports);
  const { user, currency, currencyId, isLoggedIn, balance } = useSelector((store) => store.auth);

  const maxBet = currency?.maxBet || 0;
  const minBet = currency?.minBet || 0;
  const symbol = currency?.symbol;

  const [stake, setStake] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isFreeBet, setIsFreeBet] = useState<boolean>(false);
  const [selectedFreeBet, setSelectedFreeBet] = useState<string>('');

  useEffect(() => {
    console.log('[Single Card Free Bets] Free bet options:', freeBetOptions);
  }, [freeBetOptions]);

  const handleDelete = useCallback(() => {
    dispatch(updateBetSlip(addRemoveBetslip(bet_slips, slip)));
  }, [dispatch, bet_slips, slip]);

  const handleStakeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '') {
      setStake(0);
      return;
    }
    const numValue = Number(value);
    if (Number.isNaN(numValue)) return;
    if (numValue < 0) return;
    if (numValue > balance) {
      setStake(balance);
      return;
    }
    setStake(numValue);
  }, [balance]);

  const handleSelectChange = useCallback((event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    if (value === '') {
      setStake(0);
      return;
    }
    const numValue = Number(value);
    if (Number.isNaN(numValue)) return;
    if (numValue < 0) return;
    if (numValue > balance) {
      setStake(balance);
      return;
    }
    setStake(numValue);
  }, [balance]);

  const handleMaxStake = useCallback(() => {
    // TODO: Implement max stake logic based on balance and limits
    setStake(balance);
  }, [balance]);

  const handleFreeBetToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFreeBet(e.target.checked);
    if (!e.target.checked) {
      setSelectedFreeBet('');
    }
  };

  const handleFreeBetSelect = (event: SelectChangeEvent<string>) => {
    setSelectedFreeBet(event.target.value);
  };

  const handleSingleBet = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      const betData = {
        stake,
        bets: [slip],
        odds: slip.odds,
        potential: Number(slip.odds) * Number(stake),
        userId: user._id,
        currency: currencyId,
        betType: slip.SportId,
        selectedFreeBet,
        isFreeBet,
        type: 'single',
      };

      const param: ISportsBet = {
        stake,
        selectedFreeBet,
        isFreeBet,
        type: 'single',
        data: [betData],
      };

      setLoading(true);
      const res = await add_sports_bet(param);

      if (!res?.data?.betsId) {
        throw new Error('Bet placement failed');
      }

      toast.success('Success!');
      dispatch(UpdateBalance((balance - stake) as never));
      const history = { ...res.data.data.data[0], bettings: res.data.data.data[0].bets };
      dispatch(updateHistory([...active_history, history]));
      dispatch(updateBetSlip([]));
    } catch (err) {
      console.error('Single bet error:', err);
      toast.error('This Event has been updated! Please try again');
      handleDelete();
    } finally {
      setLoading(false);
    }
  }, [
    isLoggedIn,
    stake,
    slip,
    user._id,
    currencyId,
    selectedFreeBet,
    isFreeBet,
    add_sports_bet,
    dispatch,
    balance,
    active_history,
    handleDelete,
  ]);

  const replaceTeamNames = useCallback((name: string | number) =>
    name.toString().replaceAll("Home", slip.HomeTeam).replaceAll("Away", slip.AwayTeam),
    [slip.HomeTeam, slip.AwayTeam]);

  // Validate stake amount
  useEffect(() => {
    if (!stake || !isLoggedIn) {
      setError('');
      return;
    }

    if (stake <= maxBet && stake >= minBet) {
      setError('');
      return;
    }

    setError(
      `Maximum bet ${abbreviate(maxBet, 0)} ${symbol} minimum bet ${abbreviate(minBet, 0)} ${symbol}.`
    );
  }, [stake, minBet, maxBet, symbol, isLoggedIn]);

  const isDisabled = !isLoggedIn || (!isFreeBet && stake <= 0) || (isFreeBet && !selectedFreeBet) || !!error;

  return (
    <Card
      component={m.div}
      {...varFade().inLeft}
      sx={CARD_STYLES.root}
    >
      <CardHeader
        sx={CARD_STYLES.header}
        action={
          <IconButton size="small" onClick={handleDelete} aria-label="remove bet">
            <Iconify icon="ic:round-close" />
          </IconButton>
        }
        title={
          <Typography sx={{ cursor: 'pointer', fontSize: 14 }}>
            {`${slip.HomeTeam} vs ${slip.AwayTeam}`}
          </Typography>
        }
      />
      <CardContent sx={CARD_STYLES.content}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" justifyContent="center">
            <Stack>
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
              <Typography sx={CARD_STYLES.marketName}>
                {slip.marketName}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Iconify icon="ic:twotone-align-vertical-center" sx={{ color: 'gold' }} />
            <Typography sx={{ fontSize: 14 }}>{slip.odds}</Typography>
          </Stack>
        </Stack>

        {!isFreeBet && (
          <Stack
            gap={0.5}
            height={35}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <OutlinedInput
              size="small"
              type="number"
              color={error ? 'error' : 'primary'}
              sx={CARD_STYLES.stakeInput}
              inputProps={{ min: 0 }}
              value={stake || ''}
              onChange={handleStakeChange}
              endAdornment={
                <InputAdornment position="end" sx={{ width: '20%', height: '100%', m: 0, p: 0 }}>
                  <Button
                    variant="contained"
                    sx={CARD_STYLES.maxButton}
                    onClick={handleMaxStake}
                  >
                    max
                  </Button>
                </InputAdornment>
              }
            />
            <Box
              component="img"
              width={25}
              height={25}
              src={isLoggedIn && currency ? currency.icon : '/assets/icons/coin/usdt.png'}
              alt="currency icon"
            />
          </Stack>
        )}

        <Typography color="error" fontSize={12}>
          {error}
        </Typography>

        <Stack direction="row" justifyContent="space-between" mt="3px">
          <Typography variant="body2" sx={{ fontSize: 14, color: 'white' }}>
            Possible win
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}>
            {fShortNumber((stake * Number(slip.odds)))}
          </Typography>
        </Stack>

        {/* Free Bet Section - Always show */}
        <Stack direction="row" justifyContent="space-between" mt="3px">
          <Typography variant="body2" sx={{ fontSize: 14, color: 'white' }}>
            Free bet {freeBetOptions.length > 0 && `(${freeBetOptions.length})`}
          </Typography>
          <Switch
            checked={isFreeBet}
            onChange={handleFreeBetToggle}
            name="freebet"
            disabled={freeBetOptions.length === 0}
            sx={{ mr: -1.5 }}
          />
        </Stack>
        {freeBetOptions.length === 0 && (
          <Typography variant="caption" sx={{ fontSize: 10, color: '#999', mt: 0.5, display: 'block' }}>
            Get free bets from Missions
          </Typography>
        )}

        {isFreeBet && (
          <Select
            value={selectedFreeBet}
            color="primary"
            fullWidth
            sx={CARD_STYLES.freeBetSelect}
            onChange={handleFreeBetSelect}
          >
            {freeBetOptions.map((row) => (
              <MenuItem key={row._id} value={row._id}>
                {`${row.shopName} | ${row.payout} ${symbol}`}
              </MenuItem>
            ))}
          </Select>
        )}

        <AnimateButton>
          <LoadingButton
            fullWidth
            sx={{ mt: 1 }}
            color="success"
            loading={loading}
            variant="contained"
            disabled={isDisabled}
            onClick={handleSingleBet}
          >
            {`Place Bet ${!isFreeBet ? (fShortNumber(stake) || '') : ''}`}
          </LoadingButton>
        </AnimateButton>
      </CardContent>
    </Card>
  );
}

export default memo(BetSlipSingleCard);
