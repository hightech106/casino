import toast from 'react-hot-toast';
import { forwardRef, useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import debounce from 'lodash/debounce';

import { useLocales } from 'src/locales';
import useApi from 'src/hooks/use-api';
import { useBoolean } from 'src/hooks/use-boolean';

import { useSelector } from 'src/store';
import Iconify from 'src/components/iconify';
import { AnimateButton } from 'src/components/animate';
import type { ICryptoCurrency, ICryptoToken, ISubmitCrypto, IWithdraw } from 'src/types';
import VerifyModal from 'src/sections/auth/verify-dialog';
import { INTERNAL_CURRENCY, MIN_WITHDRAW_LU, meetsMinWithdraw } from 'src/utils/money';

interface Props extends CardProps {
  currencies: ICryptoCurrency[];
  getTransactions: () => Promise<void>;
  getBalances: () => Promise<void>;
  onClose: () => void;
}

const WithdrawModal = forwardRef(({ currencies, getTransactions, getBalances, onClose }: Props, ref: React.Ref<HTMLDivElement>) => {
  const { t } = useLocales();

  const close = async () => {
    onClose();
    await getTransactions();
    await getBalances(); // Refresh balance to show deducted amount
  };

  return (
    <div ref={ref} tabIndex={-1}>
      <Card
        sx={{
          position: 'absolute',
          width: { xs: 1, sm: 450 },
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CardHeader
          title={t('withdrawal')}
          action={
            <IconButton onClick={onClose}>
              <Iconify icon="mdi:close" />
            </IconButton>
          }
          sx={{ py: 2 }}
        />
        <CardContent sx={{ mb: 2, pt: 0 }}>
          <CryptoComponent currencies={currencies} onClose={close} getBalances={getBalances} />
        </CardContent>
      </Card>
    </div>
  );
});

interface ICryptoProps {
  currencies: ICryptoCurrency[];
  onClose: () => Promise<void>;
  getBalances: () => Promise<void>;
}

// Reducer state for bi-directional amount calculation
interface AmountState {
  fiatAmount: number;
  coinAmount: number | null;
  source: 'fiat' | 'coin' | null; // Track which input triggered the update
}

type AmountAction =
  | { type: 'SET_FIAT'; payload: number }
  | { type: 'SET_COIN'; payload: number | null }
  | { type: 'RESET' };

const amountReducer = (state: AmountState, action: AmountAction): AmountState => {
  switch (action.type) {
    case 'SET_FIAT':
      return { ...state, fiatAmount: action.payload, source: 'fiat' };
    case 'SET_COIN':
      return { ...state, coinAmount: action.payload, source: 'coin' };
    case 'RESET':
      return { fiatAmount: 0, coinAmount: null, source: null };
    default:
      return state;
  }
};

const CryptoComponent = ({ currencies, onClose, getBalances }: ICryptoProps) => {
  const { t } = useLocales();
  const { withdrawal, send_withdrawal_verification_code, verify_email, calcUsdtToCrypto } = useApi();
  const { balance, user, currency } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');

  const [selectedCurrency, setSelectedCurrency] = useState<ICryptoCurrency | null>(null);
  
  // Use reducer for bi-directional amount calculation
  const [amountState, dispatchAmount] = useReducer(amountReducer, {
    fiatAmount: 0,
    coinAmount: null,
    source: null,
  });

  // Real-time price state
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceProgress, setPriceProgress] = useState<number>(100);
  const [priceError, setPriceError] = useState<string | null>(null);
  
  // Refs for interval cleanup
  const priceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Verification state
  const verifyStatus = useBoolean(false);
  const [verifyType, setVerifyType] = useState<any>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const coins = currencies
    .reduce((ary: ICryptoCurrency[], coin: ICryptoCurrency) => {
      if (coin.withdrawable) return [...ary, { ...coin, label: coin.name }];
      return ary;
    }, [])
    .sort((a, b) => {
      const orderA = (a as any).order ?? 0;
      const orderB = (b as any).order ?? 0;
      return orderA - orderB;
    });

  // Fetch current price for selected currency
  const fetchPrice = useCallback(async () => {
    if (!selectedCurrency) {
      setCurrentPrice(null);
      return;
    }

    try {
      setPriceError(null);
      // Use a small amount (1 unit) to get the price
      const param: ISubmitCrypto = {
        id: selectedCurrency.id || (selectedCurrency as any).id, // Use currency id (unique identifier)
        symbol: selectedCurrency.symbol, // Keep for backward compatibility
        amount: 1,
        fiatSymbol: INTERNAL_CURRENCY, // Always LU (USD-equivalent)
      };
      const res = await calcUsdtToCrypto(param);
      
      if (res?.data) {
        const cryptoAmount = parseFloat(res.data.crypto_amount);
        if (cryptoAmount > 0) {
          // Price = fiat amount / crypto amount
          const price = 1 / cryptoAmount;
          setCurrentPrice(price);
        }
      }
    } catch (error: any) {
      console.error('Error fetching price:', error);
      setPriceError('Price update failed');
      // Don't break the UI, just log the error
    }
  }, [selectedCurrency, currency, calcUsdtToCrypto]);

  // Start progress bar animation
  const startProgressBar = useCallback(() => {
    // Clear existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Reset progress to 100%
    setPriceProgress(100);
    
    // Animate from 100% to 0% over 10 seconds (100 steps of 100ms each)
    let progress = 100;
    progressIntervalRef.current = setInterval(() => {
      progress -= 1;
      setPriceProgress(progress);
      
      if (progress <= 0) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
    }, 100);
  }, []);

  // Setup price fetching interval
  useEffect(() => {
    if (!selectedCurrency) {
      setCurrentPrice(null);
      return;
    }

    // Fetch price immediately
    fetchPrice();
    startProgressBar();

    // Set up interval to fetch price every 10 seconds
    priceIntervalRef.current = setInterval(() => {
      fetchPrice();
      startProgressBar();
    }, 10000);

    // Cleanup
    return () => {
      if (priceIntervalRef.current) {
        clearInterval(priceIntervalRef.current);
        priceIntervalRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [selectedCurrency, fetchPrice, startProgressBar]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (priceIntervalRef.current) {
        clearInterval(priceIntervalRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Reset amount state when currency changes
  useEffect(() => {
    dispatchAmount({ type: 'RESET' });
    setCurrentPrice(null);
    setPriceProgress(100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency]);


  // Debounced handler for fiat amount changes
  const handleFiatChangeDebounced = useCallback(
    debounce((value: number) => {
      if (!selectedCurrency || !currentPrice || value <= 0) {
        return;
      }
      
      // Calculate coin amount from fiat amount
      const coinAmount = value / currentPrice;
      dispatchAmount({ type: 'SET_COIN', payload: coinAmount });
    }, 300),
    [selectedCurrency, currentPrice]
  );

  // Handler for fiat amount input
  const handleFiatChange = (value: number) => {
    dispatchAmount({ type: 'SET_FIAT', payload: value });
    
    if (value > 0 && currentPrice) {
      handleFiatChangeDebounced(value);
    } else {
      // Reset coin amount when fiat is cleared
      dispatchAmount({ type: 'SET_COIN', payload: null as number | null });
    }
  };

  // Debounced handler for coin amount changes
  const handleCoinChangeDebounced = useCallback(
    debounce((value: number) => {
      if (!selectedCurrency || !currentPrice || value <= 0) {
        return;
      }
      
      // Calculate fiat amount from coin amount
      const fiatAmount = value * currentPrice;
      dispatchAmount({ type: 'SET_FIAT', payload: fiatAmount });
    }, 300),
    [selectedCurrency, currentPrice]
  );

  // Handler for coin amount input
  const handleCoinChange = (value: number) => {
    dispatchAmount({ type: 'SET_COIN', payload: value });
    
    if (value > 0 && currentPrice) {
      handleCoinChangeDebounced(value);
    } else {
      dispatchAmount({ type: 'SET_FIAT', payload: 0 });
    }
  };

  // Calculate coin amount from fiat (for API call)
  const calcCoinAmount = async (): Promise<ICryptoToken | null> => {
    if (!selectedCurrency) {
      return null;
    }
    // Use fiatAmount from reducer state
    const amount = amountState.fiatAmount;
    
    if (amount <= 0) {
      return null;
    }
    
    const param: ISubmitCrypto = {
      id: selectedCurrency.id || (selectedCurrency as any).id, // Use currency id (unique identifier)
      symbol: selectedCurrency.symbol, // Keep for backward compatibility
      amount,
      fiatSymbol: INTERNAL_CURRENCY, // Always LU (USD-equivalent)
    };
    const res = await calcUsdtToCrypto(param);
    
    if (!res?.data) return null;
    
    // Update coin amount in reducer if we got a result
    if (res.data.crypto_amount) {
      dispatchAmount({ type: 'SET_COIN', payload: parseFloat(res.data.crypto_amount) });
    }
    
    return res.data;
  };

  // Send verification code
  const sendVerifyCode = async () => {
    if (!user?.email) {
      toast.error('Email not found');
      return;
    }
    
    try {
      const res = await send_withdrawal_verification_code(user.email);
      if (!res?.data) {
        toast.error('Failed to send verification code');
        return;
      }
      toast.success('Verification code sent to your email');
      const param = {
        type: 'Email',
        value: user.email,
      };
      setVerifyType(param);
      verifyStatus.onTrue();
    } catch (error: any) {
      const errorMessage = error?.response?.data || 'Failed to send verification code';
      toast.error(errorMessage);
    }
  };

  // Verify code
  const verify = async (code: string) => {
    if (!user?.email) return;
    
    try {
      const res = await verify_email({ email: user.email, code });
      if (!res?.data) {
        toast.error('Invalid verification code');
        return;
      }
      toast.success('Email verified successfully');
      setIsVerified(true);
      verifyStatus.onFalse();
      // Proceed with withdrawal
      await processWithdrawal();
    } catch (error) {
      toast.error('Verification failed');
    }
  };

  // Process withdrawal after verification
  const processWithdrawal = async () => {
    if (!selectedCurrency) return;
    
    // Validate currency ID exists
    if (!selectedCurrency.id) {
      toast.error('Invalid currency selected. Please select a valid currency.');
      return;
    }
    
    setLoading(true);
    // Use fiatAmount from reducer state (amount is already in LU, USD-equivalent)
    const param: IWithdraw = {
      currency: selectedCurrency.id, // Send currency ID (number) instead of symbol
      amount: amountState.fiatAmount,
      address,
      type: 'crypto',
      fiatSymbol: INTERNAL_CURRENCY, // Always LU (USD-equivalent)
    };
    const res = await withdrawal(param);
    setLoading(false);
    if (!res?.data) return;
    toast.success(t('success'));
    setIsVerified(false); // Reset verification status
    
    // Refresh balance immediately to show deducted amount
    // Balance is deducted on backend when withdrawal is created (status: pending)
    try {
      await getBalances();
    } catch (error) {
      console.error('Error refreshing balance:', error);
      // Don't block the flow if balance refresh fails
    }
    
    await onClose();
  };

  const onSubmit = async () => {
    if (!selectedCurrency) {
      toast.error('Please select a currency');
      return;
    }
    if (balance <= 0) {
      toast.error('You need to deposit first.');
      return;
    }
    // Use fiatAmount from reducer state (amount is already in LU, USD-equivalent)
    const amountLU = amountState.fiatAmount;
    if (amountLU > balance) {
      toast.error('Your balance is not enough!');
      return;
    }
    // Validate amount meets minimum withdrawal requirement (in LU)
    if (!meetsMinWithdraw(amountLU)) {
      toast.error(t('min_required', { label: t('amount'), num: MIN_WITHDRAW_LU }));
      return;
    }
    if (!address) {
      toast.error('Please enter a valid address');
      return;
    }
    // Removed 2 decimal place limitation - crypto amounts need higher precision
    // Validation is now handled by the backend which supports up to 18 decimal places
    
    // Trigger email verification before withdrawal
    await sendVerifyCode();
  };

  return (
    <>
      <Stack gap={2}>
        <Autocomplete
          options={coins}
          onChange={(e, row) => {
            setSelectedCurrency(row);
          }}
          renderInput={(params) => <TextField {...params} label={t('coins')} />}
          renderOption={(props, option) => {
            const { icon } = currencies.filter((e) => e.symbol === option.symbol)[0];

            if (!icon) {
              return null;
            }

            return (
              <li {...props} key={option.symbol}>
                <Box component="img" src={option.icon} alt="currency" width={20} height={20} mr={1} />
                {`${option.name} (${option.symbol})`}
              </li>
            );
          }}
        />

        {/* Real-time Price Display with Progress Bar */}
        {selectedCurrency && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {selectedCurrency.symbol} Price:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {currentPrice !== null
                  ? `${currency.symbol} ${currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}`
                  : priceError || 'Loading...'}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={priceProgress}
              sx={{
                height: 4,
                borderRadius: 1,
                backgroundColor: (theme) => theme.palette.grey[300],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: (theme) => theme.palette.success.main,
                  transition: 'none', // Disable default transition for manual animation
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Price updates every 10 seconds
            </Typography>
          </Box>
        )}

        <TextField
          fullWidth
          label={t('address')}
          variant="outlined"
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* Fiat Amount Input */}
        <TextField
          type="number"
          fullWidth
          label={`${t('Amount')} (${currency.symbol})`}
          value={amountState.fiatAmount || ''}
          onChange={(e) => {
            const value = Number(e.target.value);
            handleFiatChange(value >= 0 ? value : 0);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={calcCoinAmount} edge="end" disabled={!selectedCurrency || amountState.fiatAmount <= 0}>
                  <Box component="img" alt="currency" src={currency?.icon} width={20} height={20} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Coin Amount Input (Bi-directional) */}
        {selectedCurrency && (
          <TextField
            type="number"
            fullWidth
            label={`${selectedCurrency.symbol} Amount`}
            value={amountState.coinAmount !== null ? amountState.coinAmount : ''}
            onChange={(e) => {
              const value = Number(e.target.value);
              handleCoinChange(value >= 0 ? value : 0);
            }}
            inputProps={{
              step: '0.000001',
              min: 0,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box component="img" alt="currency" src={selectedCurrency.icon} width={20} height={20} />
                </InputAdornment>
              ),
            }}
            helperText="Enter amount in either field to calculate the other (up to 6 decimal places)"
          />
        )}

        <Alert
          variant="outlined"
          severity="warning"
          sx={{
            borderStyle: 'dashed',
            borderColor: (theme) => theme.palette.warning.main,
          }}
        >
          {t('check_address')}
        </Alert>
        <AnimateButton>
          <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            loading={loading}
            onClick={onSubmit}
          >
            {t('submit')}
          </LoadingButton>
        </AnimateButton>
      </Stack>

      {/* Verification Modal */}
      <VerifyModal
        modalStatus={verifyStatus.value}
        onClose={verifyStatus.onFalse}
        verifyType={verifyType}
        resend={sendVerifyCode}
        verify={verify}
      />
    </>
  );
};


export default WithdrawModal;