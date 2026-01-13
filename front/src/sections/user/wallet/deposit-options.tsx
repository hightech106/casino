import { useEffect, useState, forwardRef } from 'react';
// @mui
import { Box } from '@mui/material';
// hooks
import useApi from 'src/hooks/use-api';
// components
import type { ICryptoCurrency } from 'src/types';
import DepositModal from './modals/deposit';

interface Props {
  onClose: () => void;
  cryptoCurrencies?: ICryptoCurrency[];
  getTransactions?: () => Promise<void>;
}

const DepositOptions = forwardRef((props: Props, ref) => {
  const { onClose, cryptoCurrencies, getTransactions } = props;

  const { get_currencies } = useApi();

  const [loading, setLoading] = useState<boolean>(false);
  const [_cryptoCurrencies, setCryptoCurrencies] = useState<ICryptoCurrency[]>(
    cryptoCurrencies || []
  );

  const getCurrencies = async () => {
    setLoading(true);
    const res = await get_currencies();
    setLoading(false);
    if (!res?.data) return;
    setCryptoCurrencies(res?.data);
  };

  useEffect(() => {
    getCurrencies();
    // eslint-disable-next-line
  }, []);

  return (
    <Box ref={ref}>
      <DepositModal currencies={_cryptoCurrencies} getTransactions={getTransactions} onClose={onClose} />
    </Box>
  );
});

export default DepositOptions;
