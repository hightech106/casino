import { useEffect, useState, useCallback, Fragment } from 'react';
import toast from 'react-hot-toast';
// @mui
import {
  Grid,
  Card,
  Button,
  CardContent,
  Modal,
  Typography,
  Alert,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Container from '@mui/material/Container';
// hooks
import { useSelector, dispatch } from 'src/store';
import useApi from 'src/hooks/use-api';
import { useLocales } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import type { BalanceProps, TransactionsProps, ICryptoCurrency } from 'src/types';
import Transactions from './transactions';
import Balances from './balances';
import WithdrawModal from './modals/withdraw';
import DepositOptions from './deposit-options';
// store
import { UpdateBalance, UpdateBonus, UpdateBalanceInfo, UpdateActiveBonus } from 'src/store/reducers/auth';
// utils
import { fShortNumber } from 'src/utils/format-number';
import { mainSocket } from 'src/utils/socket';

export default function WalletView() {
  const { t } = useLocales();

  const { get_currencies, get_balances, verify_password, get_transactions } =
    useApi();
  const { activeBonus, isLoggedIn, balance, bonus } = useSelector((store) => store.auth);

  const selectOpen = useBoolean();
  const withdrawOpen = useBoolean();
  const confirm = useBoolean(false);
  const cancelBonus = useBoolean(false);
  const [password, setPassword] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<TransactionsProps[]>([]);
  const [cryptoCurrencies, setCryptoCurrencies] = useState<ICryptoCurrency[]>([]);
  const [balances, setBalances] = useState<BalanceProps[]>([]);

  const getBalances = useCallback(async () => {
    setLoading(true);
    const res = await get_balances();
    setLoading(false);
    if (!res?.data) return;
    setBalances(res?.data);
    
    // CRITICAL: Sync Redux store with fetched balance data
    // Find the active balance (same logic as Balances component)
    const activeBalance = res.data.find(
      (balance: BalanceProps) => balance.status === true
    );
    if (activeBalance) {
      // Update Redux store to keep header and wallet page in sync
      dispatch(UpdateBalanceInfo(activeBalance));
      console.log('[WALLET] ✅ Synced Redux store with active balance:', activeBalance.balance);
    }
  }, [get_balances]);

  const getCurrencies = useCallback(async () => {
    setLoading(true);
    const res = await get_currencies();
    setLoading(false);
    if (!res?.data) return;
    setCryptoCurrencies(res?.data);
  }, [get_currencies]);

  const getTransactions = useCallback(async () => {
    setLoading(true);
    const res = await get_transactions();
    setLoading(false);
    if (!res?.data) return;
    const data = res.data.map((row: TransactionsProps) => ({
      ...row,
      symbol: row.currencyId?.symbol || 'N/A',
    }));

    setTransactions(data);
  }, [get_transactions]);

  useEffect(() => {
    // getFiatCurrencies();
    getBalances();
    getCurrencies();
    getTransactions();
    // eslint-disable-next-line
  }, []);

  // Sync local balances state with Redux store when balance/bonus changes from socket
  // Note: Socket balance updates are already handled in header.tsx and update Redux store
  // We update the local balances array to reflect socket updates without making API calls
  useEffect(() => {
    if (!isLoggedIn) return;
    
    // Update the active balance in local state to match Redux store
    // This keeps the wallet page UI in sync with socket updates without making API calls
    setBalances((prevBalances) => {
      if (!prevBalances.length) return prevBalances;
      
      const activeBalanceIndex = prevBalances.findIndex((bal) => bal.status === true);
      if (activeBalanceIndex === -1) return prevBalances;
      
      // Only update if the values actually changed to avoid unnecessary re-renders
      const activeBalance = prevBalances[activeBalanceIndex];
      if (activeBalance.balance === balance && activeBalance.bonus === bonus) {
        return prevBalances;
      }
      
      const updatedBalances = [...prevBalances];
      updatedBalances[activeBalanceIndex] = {
        ...activeBalance,
        balance: balance, // Use balance from Redux (updated by socket)
        bonus: bonus,     // Use bonus from Redux (updated by socket)
      };
      return updatedBalances;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, bonus, isLoggedIn]); // Only update when balance/bonus changes (from socket via Redux)

  const openWithdraw = () => {
    if (activeBonus) {
      confirm.onTrue();
      return;
    }
    withdrawOpen.onTrue();
  };

  const verifyPassword = async () => {
    if (!password) return;
    setLoading(true);
    const res = await verify_password(password);
    setLoading(false);
    if (!res?.data) return;
    toast.success('success');
    withdrawOpen.onTrue();
    if (confirm.value) confirm.onFalse();
  };

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <CustomBreadcrumbs
        heading={t('wallet')}
        links={[{ name: t('user') }, { name: t('wallet') }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />


      <Card sx={{ bgcolor: '#2B2F3D' }}>
        <CardContent sx={{ p: { xs: 1 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Balances balances={balances} getBalances={getBalances} onDeposit={selectOpen.onTrue} onWithdraw={openWithdraw} />
            </Grid>

            <Grid item xs={12}>
              <Transactions transactions={transactions} loading={loading} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Modal
        open={selectOpen.value}
        onClose={selectOpen.onFalse}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          },
        }}
        sx={{
          '& .MuiModal-root': {
            bgcolor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <DepositOptions
          cryptoCurrencies={cryptoCurrencies}
          getTransactions={getTransactions}
          onClose={selectOpen.onFalse}
        />
      </Modal>

      <Modal open={withdrawOpen.value} onClose={withdrawOpen.onFalse}>
        <WithdrawModal
          currencies={cryptoCurrencies}
          getTransactions={getTransactions}
          getBalances={getBalances}
          onClose={withdrawOpen.onFalse}
        />
      </Modal>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={
          <Typography variant="h4" sx={{ textTransform: 'uppercase' }}>
            {t('active')}
          </Typography>
        }
        content={
          <>
            <Typography>
              {t('cancel_bonus_wd_desc')
                .split('<br/>')
                .map((text, ind) => (
                  <Fragment key={ind}>
                    {text}
                    <br />
                  </Fragment>
                ))}
            </Typography>
            {cancelBonus.value && (
              <>
                <Alert
                  variant="outlined"
                  severity="warning"
                  sx={{
                    my: 2,
                    borderStyle: 'dashed',
                    borderColor: (theme) => theme.palette.warning.main,
                  }}
                >
                  {t('cancel_bonus_wd_warning')
                    .split('<br/>')
                    .map((text, ind) => (
                      <Fragment key={ind}>
                        {text}
                        <br />
                      </Fragment>
                    ))}
                </Alert>
                <TextField
                  type="password"
                  variant="outlined"
                  label={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                />
              </>
            )}
          </>
        }
        action={
          !cancelBonus.value ? (
            <Button variant="contained" color="error" onClick={cancelBonus.onTrue}>
              {t('agree')}
            </Button>
          ) : (
            <LoadingButton
              variant="contained"
              color="success"
              loading={loading}
              disabled={!password}
              onClick={verifyPassword}
            >
              {t('verify')}
            </LoadingButton>
          )
        }
      />
    </Container>
  );
}
