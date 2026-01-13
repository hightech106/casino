import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Tab,
  Tabs,
  Card,
  styled,
  Button,
  Divider,
  Checkbox,
  Typography,
  OutlinedInput,
  InputAdornment,
  Switch,
  Select,
  MenuItem,
  alpha,
} from '@mui/material';
import type { CheckboxProps, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
// hooks
import useApi from 'src/hooks/use-api';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// store
import { useDispatch, useSelector } from 'src/store';
import { updateBetSlip, updateHistory } from 'src/store/reducers/sports';
import { UpdateBalance } from 'src/store/reducers/auth';
// types

// components
import Scrollbar from 'src/components/scrollbar';
import toast from 'react-hot-toast';
import { Transitions } from 'src/components/animate';
import useMessagesScroll from 'src/hooks/use-messages-scroll';
//
import { MultiIcon, SingleIcon } from 'src//assets/icons';

import { HEADER, NAV } from 'src/layouts/config-layout';
import { fShortNumber } from 'src/utils/format-number';
import type { ISportsBet, IFreeBet } from 'src/types';
import BetSlipSingleCard from './single-card';
import BetSlipMultiCard from './multi-card';
import Footer from '../../global/footer';
import {
  BetSlipButtonGroup,
  BetMatchCard,
  AccumulatorSection,
  PromotionalBanners,
} from './components';

// ----------------------------------------------------------------------

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: 3,
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#137cbd',
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#106ba3',
  },
});

// Inspired by blueprintjs
function BpCheckbox(props: CheckboxProps) {
  return (
    <Checkbox
      sx={{
        '&:hover': { bgcolor: 'transparent' },
      }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      inputProps={{ 'aria-label': 'Checkbox demo' }}
      {...props}
    />
  );
}

const BETSLIP_STYLES = {
  container: {
    py: { xs: 1.5, sm: 2 },
    px: { xs: 1, sm: 1.5 },
    height: 1,
    bgcolor: '#2B2F3D',
  },
  scrollbar: (lgUp: boolean) => ({
    pt: { xs: 0.5, sm: 1 },
    px: { xs: 0.5, sm: 1 },
    height: lgUp ? 'calc(100vh - 180px)' : '96vh',
    borderRadius: { xs: 0.25, sm: 0.5 },
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    bgcolor: '#2B2F3D',
  }),
  tabs: {
    mx: { xs: 1, sm: 2 },
    mt: { xs: 0.5, sm: 1 },
    minHeight: { xs: 48, sm: 45 },
    '& .MuiTabs-indicator': {
      bgcolor: '#24ee89',
    },
  },
  tab: {
    minHeight: { xs: 48, sm: 45 },
    minWidth: { xs: 60, sm: 74 },
    color: 'text.secondary',
    fontSize: { xs: '14px', sm: '16px' },
    '&.Mui-selected': {
      color: '#24ee89',
      fontWeight: 600,
    },
    '& svg': {
      width: { xs: '12px', sm: '14px' },
      mt: -0.2,
    },
  },
  multiTab: {
    minHeight: { xs: 48, sm: 45 },
    minWidth: { xs: 60, sm: 74 },
    color: 'text.secondary',
    fontSize: { xs: '14px', sm: '16px' },
    '&.Mui-selected': {
      color: '#24ee89',
      fontWeight: 600,
    },
    '& svg': {
      width: { xs: '12px', sm: '14px' },
      mt: -0.2,
      mr: { xs: 0.25, sm: 0.5 },
    },
  },
  stakeInput: {
    pr: 0.9,
    borderRadius: 1,
    width: 'calc(100% - 10px)',
    '& input': {
      height: 0.4,
    },
  },
  maxButton: {
    fontSize: 14,
    fontWeight: 400,
    color: 'white',
    minWidth: 43,
    height: '100%',
    bgcolor: '#2b72b17a',
  },
  freeBetSelect: {
    bgcolor: 'primary.main',
  },
} as const;

interface NavBetSlipProps {
  openNav?: boolean;
  onCloseNav?: () => void;
}

export default function NavBetSlip({ openNav, onCloseNav }: NavBetSlipProps = {}) {
  const nav = useBoolean();

  // Use external nav state if provided, otherwise use internal state
  const isNavOpen = openNav !== undefined ? openNav : nav.value;
  const handleCloseNav = onCloseNav || nav.onFalse;
  const dispatch = useDispatch();
  const lgUp = useResponsive('up', 'lg');

  const { add_sports_bet, get_purchases_free_bets } = useApi();

  const { bet_slips, active_history } = useSelector((store) => store.sports);
  const { user, currencyId, currency, isLoggedIn, balance } = useSelector((store) => store.auth);

  const { messagesEndRef } = useMessagesScroll(bet_slips);

  const [activeTab, setActiveTab] = useState<'betslip' | 'mybets'>('betslip');
  const [totalOdds, setTotalOdds] = useState<number>(1);
  const [multiStake, setMultiStake] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [freeBetOptions, setFreeBetOptions] = useState<IFreeBet[]>([]);

  const [isFreeBet, setIsFreeBet] = useState<boolean>(false);
  const [selectedFreeBet, setSelectedFreeBet] = useState<string>('');

  const handleTabChange = useCallback((tab: 'betslip' | 'mybets') => {
    setActiveTab(tab);
  }, []);

  const handleClearAll = useCallback(() => {
    dispatch(updateBetSlip([]));
  }, [dispatch]);

  const handleMultiStakeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMultiStake(Number(e.target.value));
  }, []);

  const handleMaxStake = useCallback(() => {
    // TODO: Implement max stake logic based on balance and limits
    setMultiStake(balance);
  }, [balance]);

  const handleMultiBet = async () => {
    if (!isLoggedIn || !multiStake) return;

    try {
      const betData = {
        stake: multiStake,
        bets: bet_slips,
        odds: fShortNumber(totalOdds),
        potential: fShortNumber(Number(totalOdds) * Number(multiStake), 5),
        userId: user._id,
        currency: currencyId,
        betType: 0,
        type: 'multi',
        selectedFreeBet,
        isFreeBet,
      };

      const param: ISportsBet = {
        stake: multiStake,
        type: 'multi',
        data: betData,
        selectedFreeBet,
        isFreeBet,
      };

      setLoading(true);
      const res = await add_sports_bet(param);

      if (!res?.data?.betsId) {
        throw new Error('Bet placement failed');
      }

      toast.success('Success!');
      dispatch(UpdateBalance((balance - multiStake) as never));
      const history = { ...res.data.data.data, bettings: res.data.data.data.bets };
      dispatch(updateHistory([...active_history, history]));
      dispatch(updateBetSlip([]));
    } catch (error) {
      console.error('Multi bet error:', error);
      toast.error('Failed to place bet');
    } finally {
      setLoading(false);
    }
  };

  const fetchFreeBets = useCallback(async () => {
    try {
      console.log('[Free Bets] Fetching free bets...');
      const res = await get_purchases_free_bets();
      console.log('[Free Bets] API Response:', res);
      if (res?.data) {
        console.log('[Free Bets] Free bet data:', res.data.data);
        setFreeBetOptions(res.data.data);
      }
    } catch (error) {
      console.error('[Free Bets] Failed to fetch free bets:', error);
      console.error('[Free Bets] Error details:', error.response || error.message);
    }
  }, [get_purchases_free_bets]);

  useEffect(() => {
    if (!bet_slips.length) return;
    const amount = bet_slips.reduce((num, row) => {
      num *= Number(row.odds);
      return num;
    }, 1);
    setTotalOdds(amount);
  }, [bet_slips]);

  useEffect(() => {
    if (!lgUp && bet_slips.length && openNav === undefined) {
      nav.onTrue();
    } else if (openNav === undefined) {
      nav.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp, bet_slips]);

  useEffect(() => {
    console.log('[Free Bets] useEffect triggered - isLoggedIn:', isLoggedIn);
    if (isLoggedIn) {
      fetchFreeBets();
    }
  }, [isLoggedIn, fetchFreeBets]);

  useEffect(() => {
    console.log('[Free Bets] Free bet options updated:', freeBetOptions);
  }, [freeBetOptions]);

  const handleFreeBetToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFreeBet(e.target.checked);
    if (!e.target.checked) {
      setSelectedFreeBet('');
    }
  };

  const handleFreeBetSelect = (event: SelectChangeEvent<string>) => {
    setSelectedFreeBet(event.target.value);
  };

  const handleClearAccumulator = useCallback(() => {
    dispatch(updateBetSlip([]));
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    console.log('Refresh clicked');
  }, []);

  const renderContent = (
    <Transitions in direction="left" type="fade">
      <Stack sx={BETSLIP_STYLES.container}>
        {/* Bet Slip Header with Tabs */}
        <Box sx={{ p: 2, borderBottom: '1px solid #2B2F3D' }}>
          <Stack direction="row" alignItems="center" spacing={0} sx={{ mb: 1 }}>
            <BetSlipButtonGroup activeTab={activeTab} onTabChange={handleTabChange} />
          </Stack>
        </Box>
        <Scrollbar ref={messagesEndRef} sx={BETSLIP_STYLES.scrollbar(lgUp)}>
          {/* YOUR BETS Section */}
          {/* <Box sx={{ px: 2, mb: 2 }}>
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
              YOUR BETS
            </Typography>

            <Stack spacing={2}>
              <BetMatchCard
                matchId="185089"
                league="AFC Champions League Elite"
                homeTeam="Sanfrecce Hiroshima"
                awayTeam="Shanghai Part"
                score="1:0"
                odds={5.97}
                betType="1X2: W1"
                isLive
              />
              <BetMatchCard
                matchId="185089"
                league="AFC Champions League Elite"
                homeTeam="Sanfrecce Hiroshima"
                awayTeam="Shanghai Part"
                score="1:0"
                odds={5.97}
                betType="1X2: W1"
                isLive
              />
              <BetMatchCard
                matchId="185089"
                league="AFC Champions League Elite"
                homeTeam="Sanfrecce Hiroshima"
                awayTeam="Shanghai Part"
                score="1:0"
                odds={5.97}
                betType="1X2: W1"
                isLive
              />
            </Stack>
          </Box> */}

          <Divider />

          {/* Accumulator Section */}
          <AccumulatorSection
            overallOdds={177.465}
            stake={multiStake}
            onStakeChange={setMultiStake}
            onClearAccumulator={handleClearAccumulator}
            onRefresh={handleRefresh}
            balance={balance || 0}
            maxStake={950}
            potentialWinnings={257.39}
          />
          <Stack>
            {false ? (
              <Card sx={{ mb: 1, borderRadius: 0.5, bgcolor: 'background.paper' }}>
                <AnimatePresence initial={false}>
                  {bet_slips.map((slip, index) => (
                    <BetSlipMultiCard key={index} slip={slip} />
                  ))}
                </AnimatePresence>

                <Divider />

                <Box sx={{ p: '12px' }}>
                  {/* Accumulator Details */}
                  <Stack spacing={2} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                      Overall odds: {fShortNumber(totalOdds)}
                    </Typography>

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      alignItems={{ xs: 'stretch', sm: 'center' }}
                      spacing={1}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          minWidth: { xs: 'auto', sm: 120 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        }}
                      >
                        LuckVerse777 amount (USD)
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <OutlinedInput
                          id="betamount"
                          size="small"
                          type="number"
                          sx={{
                            ...BETSLIP_STYLES.stakeInput,
                            width: { xs: 80, sm: 100 },
                          }}
                          inputProps={{ min: 0 }}
                          value={multiStake || ''}
                          onChange={handleMultiStakeChange}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ minWidth: 30, height: 32 }}
                          onClick={() => setMultiStake(Math.max(0, multiStake - 1))}
                        >
                          -
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ minWidth: 30, height: 32 }}
                          onClick={() => setMultiStake(multiStake + 1)}
                        >
                          +
                        </Button>
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {fShortNumber(totalOdds)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {fShortNumber(totalOdds)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {fShortNumber(totalOdds)}
                      </Typography>
                    </Stack>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Maximum stake: 950 USD
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Balance: {balance || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Available Advancebet: 0
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        When odds change
                      </Typography>
                      <Select value="accept-increase" size="small" sx={{ minWidth: 120 }}>
                        <MenuItem value="accept-increase">Accept if odds increase</MenuItem>
                        <MenuItem value="accept-any">Accept any change</MenuItem>
                      </Select>
                    </Stack>

                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                      Potential winnings: {Number((multiStake * totalOdds).toFixed(2))} USD
                    </Typography>
                  </Stack>

                  {/* Free Bet Section - Always show for debugging */}
                  <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Typography variant="body2" sx={{ fontSize: 14, color: 'white' }}>
                      Free bet {freeBetOptions.length > 0 && `(${freeBetOptions.length} available)`}
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
                    <Typography variant="caption" sx={{ fontSize: 11, color: '#999', mb: 2, display: 'block' }}>
                      No free bets available. Purchase from Missions Shop.
                    </Typography>
                  )}

                  {isFreeBet && (
                    <Select
                      value={selectedFreeBet}
                      color="primary"
                      fullWidth
                      sx={{ mb: 2 }}
                      onChange={handleFreeBetSelect}
                    >
                      {freeBetOptions.map((row, index) => (
                        <MenuItem key={index} value={row._id}>
                          {`${row.shopName} | ${row.payout} ${currency?.symbol}`}
                        </MenuItem>
                      ))}
                    </Select>
                  )}

                  <LoadingButton
                    fullWidth
                    sx={{
                      mt: 1,
                      bgcolor: '#24ee89',
                      color: 'text.primary',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: alpha('#24ee89', 0.9),
                      },
                    }}
                    loading={loading}
                    variant="contained"
                    disabled={multiStake <= 0 || !isLoggedIn}
                    onClick={handleMultiBet}
                  >
                    {!isLoggedIn ? 'DEPOSIT' : `Place Bet ${multiStake}`}
                  </LoadingButton>
                </Box>
              </Card>
            ) : (
              <AnimatePresence initial={false}>
                {bet_slips.map((slip, index) => (
                  <BetSlipSingleCard key={index} slip={slip} freeBetOptions={freeBetOptions} />
                ))}
              </AnimatePresence>
            )}
          </Stack>
        </Scrollbar>

        {/* Promotional Banners */}
        <PromotionalBanners />
        <Footer />
      </Stack>
    </Transitions>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
        borderLeft: { lg: '1px solid #2B2F3D' },
        position: { xs: 'fixed', lg: 'fixed' },
        right: 0,
        zIndex: { xs: 1200, lg: 'auto' },
      }}
    >
      {lgUp ? (
        <Stack
          sx={{
            position: 'sticky',
            top: HEADER.H_DESKTOP,
            width: NAV.W_VERTICAL,
            mt: `${HEADER.H_DESKTOP}px`,
            bgcolor: '#2B2F3D',
            height: `calc(100vh - ${HEADER.H_DESKTOP}px)`,
            borderLeft: `solid 1px #2B2F3D`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={isNavOpen}
          anchor="right"
          onClose={handleCloseNav}
          PaperProps={{
            sx: {
              width: { xs: '100vw', sm: NAV.W_VERTICAL },
              bgcolor: '#2B2F3D',
              height: '100vh',
              top: 0,
              // Better mobile styling
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
            },
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: { xs: '100vw', sm: NAV.W_VERTICAL },
              height: '100vh',
              top: 0,
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            // Better backdrop
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
            },
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          transitionDuration={300}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
