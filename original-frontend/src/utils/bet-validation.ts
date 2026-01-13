import { toast } from 'react-hot-toast';

export const validateBetAmount = (betAmount: number, balance: number): boolean => {
  if (betAmount < 0.01) {
    toast.error('Minimum bet 0.01');
    return false;
  }

  if (betAmount > balance) {
    toast.error('Your balance is not enough');
    return false;
  }

  return true;
};

export const handleBetChange = (
  value: string,
  balance: number,
  setBetAmount: (value: string) => void
) => {
  const numValue = Number(value);

  if (numValue > balance && numValue > 5) {
    setBetAmount('5.00');
    toast.error('Maximum bet limit is 5 when play with bonus balance');
    return;
  }

  setBetAmount(value);
};
