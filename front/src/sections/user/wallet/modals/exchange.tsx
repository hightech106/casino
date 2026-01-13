import { forwardRef, useState } from 'react';
import { Alert, Autocomplete, Box, Button, Card, CardContent, CardHeader, CircularProgress, IconButton, Stack, TextField } from '@mui/material';
import type { CardProps } from '@mui/material/Card';

import useApi from 'src/hooks/use-api';

import { useSelector, dispatch } from 'src/store';
import { UpdateBalance } from 'src/store/reducers/auth';
import Iconify from 'src/components/iconify';
import { AnimateButton } from 'src/components/animate';
import type { BalanceProps, CurrencyProps } from 'src/types';


interface Props extends CardProps {
    balances: BalanceProps[],
    currencies: CurrencyProps[],
    getBalances: () => void;
    getTransactions: () => void;
    onClose: () => void;
}

const ExchangeModal = forwardRef(({ balances, currencies, getBalances, getTransactions, onClose }: Props, ref: React.Ref<HTMLDivElement>) => {
    const { exchangeNow } = useApi();
    const { currency, balance } = useSelector((store) => store.auth);

    const [loading, setLoading] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>(0);
    const [fromCurrency, setFromCurrency] = useState<BalanceProps | null>(null);
    const [toCurrency, setToCurrency] = useState<CurrencyProps | null>(null);

    const handleExchange = async () => {
        if (!fromCurrency || !toCurrency) return;
        // @ts-ignore
        if (amount > fromCurrency.balance || fromCurrency?.currency._id === toCurrency?._id) return;
        setLoading(true);
        const res = await exchangeNow({ amount, fromCurrencyId: fromCurrency?.currency._id, toCurrencyId: toCurrency?._id });
        if (!res?.data) {
            setLoading(false);
            return;
        }
        getBalances();
        setLoading(false)
        if (currency._id === fromCurrency?.currency._id) {
            // @ts-ignore
            dispatch(UpdateBalance(balance - amount));
        }
    }

    const toCoins = currencies
        .reduce((ary: CurrencyProps[], row) => {
            if (row._id === fromCurrency?.currency._id) return ary;
            ary = [...ary, { ...row, label: row.symbol }];
            return ary;
        }, [])
        .sort((a, b) => {
            const orderA = (a as any).order ?? 0;
            const orderB = (b as any).order ?? 0;
            return orderA - orderB;
        });

    const fromCoins = balances.reduce((ary: BalanceProps[], row) => {
        if (row.balance <= 0) return ary;
        ary = [...ary, { ...row, label: row.currency.symbol }];
        return ary;
    }, []);

    return (
        <div ref={ref} tabIndex={-1}>
            <Card
                sx={{
                    top: '50%',
                    left: '50%',
                    position: 'absolute',
                    width: { xs: 0.9, sm: 450 },
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <CardHeader
                    title="Exchange"
                    action={
                        <IconButton onClick={onClose} >
                            <Iconify icon="mdi:close" />
                        </IconButton>
                    }
                    sx={{ py: 2 }}
                />
                <CardContent component={Stack} sx={{ mb: 2, pt: 0, gap: 1.5 }}  >
                    <TextField
                        type="number"
                        fullWidth
                        label="Amount"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}

                    />

                    <Stack direction="row" gap={1} justifyContent="space-between" alignItems="center">
                        <Autocomplete
                            options={fromCoins}
                            onChange={(e, row) => {
                                setFromCurrency(row);
                            }}
                            renderInput={(params) => <TextField {...params} label="From" />}
                            renderOption={(props, option) => {

                                if (!option.currency) {
                                    return null;
                                }

                                return (
                                    <li {...props} key={option._id}>
                                        {option.currency.symbol}
                                        <Box
                                            component="img"
                                            alt="currency"
                                            src={option.currency.icon}
                                            width={20}
                                            height={20}
                                            ml={1}
                                        />
                                    </li>
                                );
                            }}
                            sx={{ width: 0.5 }}
                        />

                        <Iconify icon="lucide:chevrons-right" />

                        <Autocomplete
                            options={toCoins}
                            onChange={(e, row) => {
                                setToCurrency(row);
                            }}
                            renderInput={(params) => <TextField {...params} label="To" />}
                            sx={{ width: 0.5 }}
                            renderOption={(props, option) => {
                                const { icon } = currencies.filter(
                                    (e) => e._id === option._id
                                )[0];

                                if (!icon) {
                                    return null;
                                }

                                return (
                                    <li {...props} key={option._id}>
                                        {option.symbol}
                                        <Box
                                            component="img"
                                            alt="currency"
                                            src={option.icon}
                                            width={20}
                                            height={20}
                                            ml={1}
                                        />
                                    </li>
                                );
                            }}
                        />

                    </Stack>

                    <Alert
                        variant="outlined"
                        severity="warning"
                        sx={{
                            borderStyle: "dashed",
                            borderColor: (theme) => theme.palette.warning.main
                        }}
                    >
                        Your Balance: {fromCurrency?.balance || 0} {fromCurrency?.currency?.symbol || ""}
                    </Alert>

                    <AnimateButton>
                        <Button
                            fullWidth
                            size="large"
                            disableElevation
                            color='info'
                            variant="outlined"
                            disabled={
                                loading ||
                                !toCurrency ||
                                // @ts-ignore
                                Number(amount) > fromCurrency?.balance ||
                                fromCurrency?.currency._id === toCurrency._id}
                            onClick={handleExchange}
                        >
                            {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                            Exchange
                        </Button>
                    </AnimateButton>
                </CardContent>
            </Card>
        </div>
    );
});

export default ExchangeModal;
