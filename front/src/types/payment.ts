/**
 * TypeScript type definitions for payment, currency, balance, and transaction data structures.
 * Defines interfaces for crypto and fiat currencies, balances, transactions, and game history.
 * Note: Includes both legacy and new fiat interfaces, with support for smart contract ABIs and network configurations.
 */
export interface CurrencyProps {
  _id: string;
  symbol: string;
  name?: string;
  payment?: string;
  adminAddress?: string;
  contractAddress?: string;
  network?: string;
  abi?: any;
  betLimit?: number;
  price: number;
  maxBet?: number;
  minBet?: number;
  minDeposit?: number;
  minWithdraw?: number;
  icon?: string;
  type?: number;
  status?: boolean;
  deposit?: boolean;
  withdrawal?: boolean;
  label?: string;
  isFiat: boolean;
}

export interface ICryptoCurrency {
  currencyId: string; // transformed from _id
  id?: number;
  name: string;
  symbol: string;
  icon: string;
  payment?: string;
  price?: number;
  minDeposit?: number;
  minWithdraw?: number;
  minBet?: number;
  maxBet?: number;
  decimals?: number;
  betLimit?: number;
  adminAddress?: string;
  contractAddress?: string;
  network?: string;
  blockchain?: 'evm' | 'solana' | 'bitcoin' | 'tron' | 'ton' | string;
  chainId?: number;
  rpcUrl?: string;
  explorerUrl?: string;
  abi?: Array<{
    inputs?: Array<{
      internalType?: string;
      name?: string;
      type?: string;
    }>;
    name?: string;
    outputs?: Array<{
      internalType?: string;
      name?: string;
      type?: string;
    }>;
    stateMutability?: string;
    type?: string;
    anonymous?: boolean;
    indexed?: boolean;
  }>;
  status?: boolean;
  deposit?: boolean;
  withdrawable: boolean; // transformed from withdrawal
  officialLink?: string;
  isFiat?: boolean;
  isNative?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ICryptoToken {
  crypto_amount: string;
  crypto_symbol: string;
  crypto_currency?: string;
  fiat_amount?: number;
  fiat_symbol?: string;
}

export interface BalanceProps {
  _id: string;
  balance: number;
  currency: CurrencyProps;
  status: boolean;
  userId: string;
  label?: string;
  bonus: number | undefined;
  activeBalance: number | undefined;
}

export interface TransactionsProps {
  _id: string;
  paymentId: string;
  address: string;
  amount: number;
  actually_paid: number;
  fiat_amount?: number;
  currencyId: CurrencyProps;
  symbol: string;
  ipn_type: string;
  status_text: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameProps {
  icon: string;
  name: string;
}

export interface HistoryProps {
  _id: string;
  amount: number;
  currency: string;
  game: GameProps;
  profit: number;
  status: string;
  username: string;
  createdAt: Date;
}

export type ITxTableFilters = {
  paymentId: string;
  coin: string[];
  status: string;
};

// new fiat interface
export interface CurrencyPropsFiat {
  _id: string;
  code: string;
  name: string;
  symbol: string;
  countries: string[];
  icon?: string;
  status?: boolean;
}
// new fiat interface

// new balance interface
export interface BalancePropsFiat {
  _id: string;
  balance: number;
  currency: CurrencyPropsFiat;
  status: boolean;
  userId: string;
  label?: string;
  bonus: number;
}
// new balance interface
