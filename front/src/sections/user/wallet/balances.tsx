import { Fragment, useEffect, useState } from 'react';
import {
  Grid,
  Card,
  Typography,
  CardHeader,
  Button,
  CardContent,
  Stack,
  CardMedia,
  Divider,
  Modal,
  CircularProgress,
  Chip,
} from '@mui/material';
// hooks
import useApi from 'src/hooks/use-api';
import { useLocales } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';
// store
import { useSelector, dispatch } from 'src/store';
import { UpdateBalanceInfo } from 'src/store/reducers/auth';
// components
import { AnimateButton } from 'src/components/animate';
import Iconify from 'src/components/iconify';

import { fCurrency } from 'src/utils/format-number';
import type { BalanceProps } from 'src/types';
import { paths } from 'src/routes/paths';
// CurrencyListModal removed - currency management no longer needed (all users use LU)

// ----------------------------------------------------------------------

type Props = {
  balances: BalanceProps[];
  getBalances: () => void;
  onDeposit?: () => void;
  onWithdraw?: () => void;
};

export default function Balances({ balances, getBalances, onDeposit, onWithdraw }: Props) {
  const { t, currentLang } = useLocales();
  const router = useRouter();

  const auth = useSelector((state) => state.auth);

  // Currency change removed - all users use LU (Luck Units)

  useEffect(() => {
    if (!balances.length) return;
    const cbalance = balances.find(
      (balance) => balance.status === true
    );
    if (!cbalance || !auth) return;
    if (auth.balanceId !== cbalance?._id || auth.currencyId !== cbalance?.currency._id) {
      // @ts-ignore
      dispatch(UpdateBalanceInfo(cbalance));
    }
  }, [balances, auth]);

  const handleViewMyShares = () => {
    router.push(`/${currentLang.value}${paths.user.myshares}`);
  };

  // Find the active balance to display its bonus separately
  const activeBalance = balances.find(
    (balance) => balance.status === true
  );

  // Check if activeBalance exists and has a non-zero, defined bonus
  const hasBonus =
    activeBalance && typeof activeBalance.bonus === 'number' && activeBalance.bonus > 0;

  return (
    <>
      <Card sx={{ 
        bgcolor: '#2B2F3D',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, #24ee89 0%, transparent 100%)',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '1px',
          background: 'linear-gradient(180deg, #24ee89 0%, transparent 100%)',
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        },
      }}>
        <CardHeader
          sx={{ py: 2 }}
          title={
            <Typography 
              variant="h5" 
              sx={{
                fontFamily: 'FONTSPRING DEMO - Blunt Con It, Impact, sans-serif !important',
                fontWeight: '400 !important',
                fontStyle: 'italic !important',
                textTransform: 'uppercase !important',
                transform: 'skewX(-5deg)',
                '& span:first-of-type': {
                  color: '#24ee89 !important'
                },
                '& span:last-of-type': {
                  color: '#FFFFFF !important'
                }
              }}
            >
              <span>Payment</span> <span>Methods</span>
            </Typography>
          }
          action={
            <Stack direction="row" gap={1}>
              <AnimateButton>
                <Button
                  onClick={onDeposit}
                  variant="contained"
                  sx={{
                    bgcolor: '#24ee89',
                    color: '#141722',
                    fontWeight: 800,
                    '&:hover': { bgcolor: '#F5DA00' },
                    textTransform: 'uppercase',
                  }}
                >
                  {t('deposit')}
                </Button>
              </AnimateButton>
              <AnimateButton>
                <Button
                  onClick={onWithdraw}
                  variant="outlined"
                  sx={{
                    border: '2px solid #24ee89',
                    color: '#24ee89',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: 'linear-gradient(to right, rgba(138, 43, 226, 0.12), rgba(138, 43, 226, 0.04))',
                    '&:hover': {
                      bgcolor: 'rgba(138, 43, 226, 0.12)'
                    }
                  }}
                >
                  {t('withdraw')}
                </Button>
              </AnimateButton>
            </Stack>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {balances.map((item: BalanceProps, index) => (
              <Fragment key={index}>
                <Grid item xs={12}>
                  <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                    <Grid item>
                      <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={1}
                      >
                        <CardMedia
                          component="img"
                          alt="payment"
                          image={item.currency?.icon}
                          title="payment"
                          sx={{ width: 30 }}
                        />
                        <Stack>
                          <Typography className="h6">
                            {item.currency.name} ({item.currency.symbol})
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: '#24ee89',
                              fontFamily: 'Geogrotesque Cyr, sans-serif',
                              fontWeight: '600',
                              fontSize: '16px'
                            }}
                          >
                            {item.balance ? fCurrency(item.balance, false) : '0.00'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item>
                      {item.status ? (
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          alignItems="center"
                          spacing={1}
>
                          <Chip
                            variant="outlined"
                            label={t('active')}
                            size="small"
                            sx={{ color: 'text.secondary', borderColor: 'rgba(255,255,255,0.24)' }}
                          />
                        </Stack>
                      ) : (
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          alignItems="center"
                          spacing={1}
                        >
                          {/* Currency change removed - all users use LU (Luck Units) */}
                        </Stack>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                {balances.length !== index + 1 && (
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                )}
              </Fragment>
            ))}
            {/* Bonus Balance Section */}
            {hasBonus && (
              <>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                    <Grid item>
                      <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={1}
                      >
                        <Iconify
                          icon="mdi:gift"
                          sx={{ width: 30, height: 30, color: 'warning.main' }}
                        />
                        <Stack>
                          <Typography className="h6">{t('bonus_balance')}</Typography>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle2" sx={{ color: 'warning.main' }}>
                              {fCurrency(activeBalance.bonus ?? 0, false)} ⭐
                            </Typography>
                            <AnimateButton>
                              <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                onClick={handleViewMyShares}
                              >
                                {t('follow_to_my_shares')}
                              </Button>
                            </AnimateButton>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item>
                      <Chip color="warning" variant="soft" label={t('bonus')} size="small" />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
      {/* Currency selection modal removed - all users use LU (Luck Units) */}
    </>
  );
}
