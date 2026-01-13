import toast from 'react-hot-toast';
import { useLocation } from 'react-router';
import { forwardRef, useEffect, useState, useReducer, useCallback, useRef } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import { encodeFunctionData } from 'viem';
import debounce from 'lodash/debounce';
import QRCode from 'qrcode';

import { useLocales } from 'src/locales';
import useApi from 'src/hooks/use-api';

import { useSelector, dispatch } from 'src/store';
import { UpdateBalanceInfo } from 'src/store/reducers/auth';
import Iconify from 'src/components/iconify';
import { AnimateButton } from 'src/components/animate';
import type { ICryptoCurrency, ICryptoToken, ISubmitCrypto, IConfirmSmartContractPayment, IConfirmSolanaDeposit, IConfirmTronDeposit } from 'src/types';
import { INTERNAL_CURRENCY, MIN_DEPOSIT_LU, meetsMinDeposit } from 'src/utils/money';

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
    };
  }
}

interface Props extends CardProps {
  currencies: ICryptoCurrency[];
  getTransactions?: () => Promise<void>;
  onClose: () => void;
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

const DepositModal = forwardRef(
  ({ currencies, getTransactions, onClose }: Props, ref: React.Ref<HTMLDivElement>) => {
    const { t } = useLocales();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bonus = queryParams.get('bonus');

    const {
      calcUsdtToCrypto,
      confirmSmartContractPayment,
      getSolanaDepositAddress,
      confirmSolanaDeposit,
      checkSolanaDeposits,
      getTronDepositAddress,
      confirmTronDeposit,
      initialize,
    } = useApi();
    const { currency, user } = useSelector((store) => store.auth);

    // Separate loading states: calcLoading for price/calc, txLoading for transaction
    const [calcLoading, setCalcLoading] = useState<boolean>(false);
    const [txLoading, setTxLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    
    // Transaction state machine
    const [txStatus, setTxStatus] = useState<'idle' | 'wallet_confirm' | 'tx_sent' | 'confirming' | 'success' | 'error'>('idle');
    const [txHash, setTxHash] = useState<string | null>(null);
    const [txError, setTxError] = useState<string | null>(null);
    
    // Computed boolean for transaction busy state
    const isTxBusy = txStatus === 'wallet_confirm' || txStatus === 'tx_sent' || txStatus === 'confirming';
    
    // Ref lock for extra safety against double submits
    const submitLockRef = useRef(false);
    const calculatedCryptoAmountRef = useRef<number | null>(null); // Store calculated crypto amount
    
    // Use reducer for bi-directional amount calculation
    const [amountState, dispatchAmount] = useReducer(amountReducer, {
      fiatAmount: 0,
      coinAmount: null,
      source: null,
    });

    // Blockchain tab state
    const [blockchainTab, setBlockchainTab] = useState<'evm' | 'solana' | 'tron'>('evm');
    
    // Solana deposit state
    const [solanaDepositAddress, setSolanaDepositAddress] = useState<string | null>(null);
    const [solanaAddressLoading, setSolanaAddressLoading] = useState<boolean>(false);
    const [solanaSignature, setSolanaSignature] = useState<string>('');
    const [solanaConfirmLoading, setSolanaConfirmLoading] = useState<boolean>(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
    
    // TRON deposit state
    const [tronDepositAddress, setTronDepositAddress] = useState<string | null>(null);
    const [tronAddressLoading, setTronAddressLoading] = useState<boolean>(false);
    const [tronSignature, setTronSignature] = useState<string>('');
    const [tronConfirmLoading, setTronConfirmLoading] = useState<boolean>(false);
    const [tronQrCodeDataUrl, setTronQrCodeDataUrl] = useState<string>('');
    
    const [selectedCurrency, setSelectedCurrency] = useState<ICryptoCurrency | null>(null);
    const [token, setToken] = useState<ICryptoToken | null>(null);
    
    // Real-time price state
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [priceProgress, setPriceProgress] = useState<number>(100);
    const [priceError, setPriceError] = useState<string | null>(null);
    
    // Refs for interval cleanup
    const priceIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        if (successTimeoutRef.current) {
          clearTimeout(successTimeoutRef.current);
        }
        // Reset lock and refs on unmount
        submitLockRef.current = false;
        calculatedCryptoAmountRef.current = null;
      };
    }, []);

    const submitDeposit = async () => {
      // Prevent double submit
      if (isTxBusy || submitLockRef.current) {
        return;
      }

      if (!selectedCurrency) {
        toast.error('Please select a currency');
        setError(true);
        return;
      }

      // Validate that currency has required smart contract fields
      if (!selectedCurrency.contractAddress || !selectedCurrency.abi) {
        toast.error('Selected currency is not configured for deposits');
        setError(true);
        return;
      }

      // Clear previous transaction state
      setTxError(null);
      setTxHash(null);
      
      await handleSmartContractDeposit();
    };

    // Check if this is a native token deposit (adminAddress is null/empty)
    const isNativeToken = () => {
      return !selectedCurrency?.adminAddress || selectedCurrency.adminAddress === '';
    };

    // Helper function to encode function call data using viem
    const encodeFunctionCall = (abi: any[], functionName: string, params: any[]): string => {
      try {
        // Find the function in ABI
        const functionAbi = abi.find(
          (item: any) => item.name === functionName && item.type === 'function'
        );
        
        if (!functionAbi) {
          throw new Error(`Function ${functionName} not found in ABI`);
        }
        
        // Use viem to encode the function call
        return encodeFunctionData({
          abi: [functionAbi],
          functionName,
          args: params,
        });
      } catch (error) {
        console.error(`Error encoding ${functionName}:`, error);
        throw error;
      }
    };

    /**
     * Handle smart contract deposit
     * Supports two types of deposits:
     * 1. Native tokens (BNB/MATIC): When adminAddress is null/empty
     *    - Calls receive() function or depositNative() on PaymentGateway
     *    - Sends native token directly
     * 2. ERC20/BEP20 tokens (USDT, etc.): When adminAddress is set to token contract address
     *    - Step 1: Approve PaymentGateway to spend tokens
     *    - Step 2: Call depositToken(tokenAddress, amount) on PaymentGateway
     */

    const handleSmartContractDeposit = async () => {
      // Extra safety check with ref lock
      if (submitLockRef.current) {
        return;
      }

      if (!selectedCurrency) return;

      // Use fiatAmount from reducer state (amount is already in LU, USD-equivalent)
      const amountLU = amountState.fiatAmount;

      // Validate amount meets minimum deposit requirement (in LU)
      if (!meetsMinDeposit(amountLU)) {
        toast.error(`Minimum deposit: ${MIN_DEPOSIT_LU} ${INTERNAL_CURRENCY}`);
        setError(true);
        return;
      }

      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        toast.error('Please install MetaMask or another Web3 wallet');
        setError(true);
        return;
      }

      setError(false);
      
      // Set transaction status to wallet_confirm and enable lock
      setTxStatus('wallet_confirm');
      setTxLoading(true);
      submitLockRef.current = true;

      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];

        // Get the network ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const expectedChainId = `0x${selectedCurrency.chainId?.toString(16)}`;

        // Check if we're on the correct network
        if (chainId !== expectedChainId) {
          try {
            // Try to switch network
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: expectedChainId }],
            });
          } catch (switchError: any) {
            // If network doesn't exist, add it
            if (switchError.code === 4902 && selectedCurrency.rpcUrl) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: expectedChainId,
                    chainName: selectedCurrency.network || 'Custom Network',
                    nativeCurrency: {
                      name: selectedCurrency.name,
                      symbol: selectedCurrency.symbol,
                      decimals: selectedCurrency.decimals || 18,
                    },
                    rpcUrls: [selectedCurrency.rpcUrl],
                    blockExplorerUrls: selectedCurrency.explorerUrl ? [selectedCurrency.explorerUrl] : [],
                  },
                ],
              });
            } else {
              throw switchError;
            }
          }
        }

        // Calculate crypto amount
        const calculatedToken = await calcCoinAmount();
        console.log('calculatedToken:', calculatedToken);
        if (!calculatedToken || !calculatedToken.crypto_amount) {
          toast.error('Failed to calculate crypto amount');
          setTxLoading(false);
          setTxStatus('error');
          setTxError('Failed to calculate crypto amount');
          submitLockRef.current = false;
          return;
        }
        
        // Store calculated crypto amount in ref for use in confirmation
        const cryptoAmount = parseFloat(calculatedToken.crypto_amount);
        calculatedCryptoAmountRef.current = cryptoAmount;

        // Get PaymentGateway contract address and ABI
        const paymentGatewayAddress = selectedCurrency.contractAddress;
        const paymentGatewayAbi = selectedCurrency.abi;
        
        if (!paymentGatewayAddress || !paymentGatewayAbi) {
          toast.error('Contract address or ABI not found');
          setTxLoading(false);
          setTxStatus('error');
          setTxError('Contract address or ABI not found');
          submitLockRef.current = false;
          return;
        }

        // Convert amount to wei
        const decimals = selectedCurrency.decimals || 18;
        const amountInWei = BigInt(Math.floor(parseFloat(calculatedToken.crypto_amount) * Math.pow(10, decimals))).toString();
        const amountInWeiHex = `0x${BigInt(amountInWei).toString(16)}`;

        let txHash: string;

        // Check if this is a native token (BNB/MATIC) or ERC20/BEP20 token (USDT, etc.)
        if (isNativeToken()) {
          // Native token deposit: call depositNative() on PaymentGateway
          console.log('[Deposit] Processing native token deposit');
          
          // Find depositNative function in ABI
          const depositNativeFunction = paymentGatewayAbi.find(
            (item: any) => item.name === 'depositNative' && item.type === 'function'
          );
          
          if (!depositNativeFunction) {
            // Fallback to old deposit() function if depositNative doesn't exist
            const depositFunction = paymentGatewayAbi.find(
              (item: any) => item.name === 'deposit' && item.type === 'function'
            );
            
            if (!depositFunction) {
              toast.error('Deposit function not found in contract ABI');
              setTxLoading(false);
              setTxStatus('error');
              setTxError('Deposit function not found in contract ABI');
              submitLockRef.current = false;
              return;
            }
            
            // Use old deposit() function signature
            txHash = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [
                {
                  from: userAddress,
                  to: paymentGatewayAddress,
                  value: amountInWeiHex,
                  data: '0xd0e30db0', // deposit() function signature
                },
              ],
            });
          } else {
            // Use depositNative() function
            // depositNative() is payable, so we can either:
            // 1. Use receive() function (send value with empty data)
            // 2. Call depositNative() explicitly with function selector
            // For simplicity, we'll use receive() which automatically handles native deposits
            // If receive() doesn't work, we can call depositNative() with selector
            txHash = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [
                {
                  from: userAddress,
                  to: paymentGatewayAddress,
                  value: amountInWeiHex,
                  data: '0x', // Empty data triggers receive() function
                },
              ],
            });
          }
          
          // Transaction sent - update status
          setTxHash(txHash);
          setTxStatus('tx_sent');
          // Immediately move to confirming while polling receipts
          setTimeout(() => setTxStatus('confirming'), 100);
        } else {
          // ERC20/BEP20 token deposit: approve first, then call depositToken()
          console.log('[Deposit] Processing ERC20/BEP20 token deposit');
          const tokenAddress = selectedCurrency.adminAddress;
          
          if (!tokenAddress) {
            toast.error('Token address not found');
            setTxLoading(false);
            setTxStatus('error');
            setTxError('Token address not found');
            submitLockRef.current = false;
            return;
          }

          // Step 1: Approve PaymentGateway to spend tokens
          toast.success('Approving token spend...');
          
          // Get token contract ABI (standard ERC20 ABI for approve function)
          const erc20Abi = [
            {
              name: 'approve',
              type: 'function',
              stateMutability: 'nonpayable',
              inputs: [
                { name: 'spender', type: 'address' },
                { name: 'amount', type: 'uint256' },
              ],
              outputs: [{ name: '', type: 'bool' }],
            },
          ];
          
          // Encode approve(address spender, uint256 amount)
          const approveData = encodeFunctionCall(erc20Abi, 'approve', [
            paymentGatewayAddress as `0x${string}`,
            BigInt(amountInWei),
          ]);

          // Send approve transaction
          const approveTxHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: userAddress,
                to: tokenAddress,
                data: approveData,
              },
            ],
          });

          // Wait for approval confirmation
          let approveReceipt = null;
          let approveAttempts = 0;
          while (!approveReceipt && approveAttempts < 30) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            approveReceipt = await window.ethereum.request({
              method: 'eth_getTransactionReceipt',
              params: [approveTxHash],
            });
            approveAttempts++;
          }

          if (!approveReceipt || approveReceipt.status !== '0x1') {
            toast.error('Token approval failed');
            setTxLoading(false);
            setTxStatus('error');
            setTxError('Token approval failed');
            submitLockRef.current = false;
            return;
          }

          toast.success('Token approved! Processing deposit...');

          // Step 2: Call depositToken(address token, uint256 amount) on PaymentGateway
          // Find depositToken function in ABI to get correct signature
          const depositTokenFunction = paymentGatewayAbi.find(
            (item: any) => item.name === 'depositToken' && item.type === 'function'
          );
          
          if (!depositTokenFunction) {
            toast.error('depositToken function not found in contract ABI');
            setTxLoading(false);
            setTxStatus('error');
            setTxError('depositToken function not found in contract ABI');
            submitLockRef.current = false;
            return;
          }

          // Ensure tokenAddress has 0x prefix
          const tokenAddressFormatted = tokenAddress.startsWith('0x') 
            ? (tokenAddress as `0x${string}`)
            : (`0x${tokenAddress}` as `0x${string}`);

          // Encode depositToken(address,uint256) using viem
          const depositTokenData = encodeFunctionCall(paymentGatewayAbi, 'depositToken', [
            tokenAddressFormatted,
            BigInt(amountInWei),
          ]);

          console.log('[Deposit] Calling depositToken with data:', depositTokenData);
          console.log('[Deposit] Token address:', tokenAddressFormatted);
          console.log('[Deposit] Amount in wei:', amountInWei);
          txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: userAddress,
                to: paymentGatewayAddress,
                value: '0x0', // No native token sent for ERC20 deposits
                data: depositTokenData,
              },
            ],
          });
          
          // Transaction sent - update status
          setTxHash(txHash);
          setTxStatus('tx_sent');
          // Immediately move to confirming while polling receipts
          setTimeout(() => setTxStatus('confirming'), 100);
        }
        
        // Poll for transaction receipt
        let receipt = null;
        let attempts = 0;
        const maxAttempts = 60; // 5 minutes max wait
        
        while (!receipt && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
          receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash],
          });
          attempts++;
        }

        if (receipt && receipt.status === '0x1') {
          // Transaction confirmed - now call backend to confirm payment
          try {
            const fiatAmount = amountState.fiatAmount; // LU amount
            // Use crypto amount from ref (calculated earlier) or fallback to state
            const cryptoAmount = calculatedCryptoAmountRef.current || amountState.coinAmount;
            
            // Ensure we have currency id and crypto amount
            if (!selectedCurrency.id) {
              console.error('[Deposit] Selected currency missing id:', selectedCurrency);
              toast.error('Currency selection error. Please refresh and try again.');
              setTxLoading(false);
              setTxStatus('error');
              setTxError('Currency selection error. Please refresh and try again.');
              submitLockRef.current = false;
              return;
            }
            
            if (!cryptoAmount || cryptoAmount <= 0) {
              console.error('[Deposit] Invalid crypto amount:', cryptoAmount, 'Ref:', calculatedCryptoAmountRef.current, 'State:', amountState.coinAmount);
              toast.error('Invalid deposit amount. Please refresh and try again.');
              setTxLoading(false);
              setTxStatus('error');
              setTxError('Invalid deposit amount. Please refresh and try again.');
              submitLockRef.current = false;
              return;
            }

            const confirmData: IConfirmSmartContractPayment = {
              id: selectedCurrency.id, // Use currency id (unique identifier) - REQUIRED
              symbol: selectedCurrency.symbol, // Keep for backward compatibility
              amount: cryptoAmount, // Crypto amount (e.g., 0.1 BNB, 100 USDT)
              fiatAmount: fiatAmount, // LU amount (USD-equivalent, e.g., 10 LU)
              transactionHash: txHash,
              contractAddress: paymentGatewayAddress,
              from: userAddress,
            };
            if (bonus) confirmData.bonusId = bonus;
            
            // Log deposit type for debugging
            if (isNativeToken()) {
              console.log('[Deposit] Native token deposit confirmed:', {
                symbol: selectedCurrency.symbol,
                cryptoAmount: cryptoAmount,
                fiatAmount: fiatAmount,
                txHash,
              });
            } else {
              console.log('[Deposit] ERC20/BEP20 token deposit confirmed:', {
                symbol: selectedCurrency.symbol,
                tokenAddress: selectedCurrency.adminAddress,
                cryptoAmount: cryptoAmount,
                fiatAmount: fiatAmount,
                txHash,
              });
            }

            const confirmRes = await confirmSmartContractPayment(confirmData);
            
            if (confirmRes?.data) {
              // Success - update status
              setTxStatus('success');
              toast.success('Deposit successful!');
              
              // Refresh balance from backend
              try {
                const balanceRes = await initialize();
                if (balanceRes?.data?.balance) {
                  dispatch(UpdateBalanceInfo(balanceRes.data.balance));
                }
              } catch (balanceError) {
                console.error('Error refreshing balance:', balanceError);
                // Don't show error to user, balance will update via socket eventually
              }
              
              // Refresh transaction history
              if (getTransactions) {
                try {
                  await getTransactions();
                } catch (txError) {
                  console.error('Error refreshing transactions:', txError);
                  // Don't show error to user, transactions will update on next page load
                }
              }
              
              // Close modal after delay
              successTimeoutRef.current = setTimeout(() => {
                submitLockRef.current = false;
                onClose();
              }, 1000);
            } else {
              toast.error('Payment confirmation failed');
              setTxLoading(false);
              setTxStatus('error');
              setTxError('Payment confirmation failed');
              submitLockRef.current = false;
            }
          } catch (confirmError: any) {
            console.error('Error confirming payment:', confirmError);
            toast.error(confirmError.response?.data?.message || 'Failed to confirm payment');
            setTxLoading(false);
            setTxStatus('error');
            setTxError(confirmError.response?.data?.message || 'Failed to confirm payment');
            submitLockRef.current = false;
          }
        } else {
          toast.error('Transaction failed or timed out');
          setTxLoading(false);
          setTxStatus('error');
          setTxError('Transaction failed or timed out');
          submitLockRef.current = false;
        }
      } catch (error: any) {
        console.error('Smart contract deposit error:', error);
        
        // Check if user rejected the transaction
        if (error.code === 4001) {
          toast.error('Transaction cancelled in wallet');
          setTxStatus('error');
          setTxError('Transaction cancelled in wallet.');
          submitLockRef.current = false;
        } else {
          toast.error(error.message || 'Failed to process smart contract deposit');
          setTxStatus('error');
          setTxError(error.message || 'Failed to process smart contract deposit');
          submitLockRef.current = false;
        }
        setError(true);
      } finally {
        setTxLoading(false);
        // Don't reset txStatus here - let it stay in error/success state
        // Only reset lock if not in success state (success will close modal)
        if (txStatus !== 'success') {
          // Lock will be reset in error cases above
        }
      }
    };

    const calcCoinAmount = async (): Promise<ICryptoToken | null> => {
      if (!selectedCurrency) {
        toast.error('Please select a currency');
        setError(true);
        return null;
      }
      // Use fiatAmount from reducer state (amount is already in LU, USD-equivalent)
      const amountLU = amountState.fiatAmount;
      
      // Validate amount meets minimum deposit requirement (in LU)
      if (!meetsMinDeposit(amountLU)) {
        toast.error(`Min amount: ${MIN_DEPOSIT_LU} ${INTERNAL_CURRENCY}`);
        setError(true);
        return null;
      }
      setError(false);
      setCalcLoading(true);
      const param: ISubmitCrypto = {
        id: selectedCurrency.id || (selectedCurrency as any).id, // Use currency id (unique identifier)
        symbol: selectedCurrency.symbol, // Keep for backward compatibility
        amount: amountLU,
        fiatSymbol: INTERNAL_CURRENCY, // Always LU (USD-equivalent)
      };
      const res = await calcUsdtToCrypto(param);
      setCalcLoading(false);
      console.log('calcCoinAmount res:', res.data);
      if (!res?.data) return null;
      setToken(res.data);
      
      // Update coin amount in reducer if we got a result
      if (res.data.crypto_amount) {
        dispatchAmount({ type: 'SET_COIN', payload: parseFloat(res.data.crypto_amount) });
      }
      
      return res.data;
    };

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
      setToken(null); // Reset calculated token when input changes
      
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

    useEffect(() => {
      setToken(null);
      dispatchAmount({ type: 'RESET' });
      setCurrentPrice(null);
      setPriceProgress(100);
      calculatedCryptoAmountRef.current = null; // Reset calculated crypto amount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCurrency]);

    // Reset currency and signature when switching blockchain tabs
    useEffect(() => {
      setSelectedCurrency(null);
      setSolanaSignature('');
      setQrCodeDataUrl('');
      setTronSignature('');
      setTronQrCodeDataUrl('');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockchainTab]);

    // Filter currencies by blockchain
    const filteredCurrencies = currencies.filter((coin) => {
      if (blockchainTab === 'evm') {
        // EVM: blockchain === 'evm' OR has chainId/network (fallback for old currencies)
        return coin.blockchain === 'evm' || coin.chainId || (coin.network && ['ethereum', 'bsc', 'base'].includes(coin.network));
      } else if (blockchainTab === 'solana') {
        // Solana: blockchain === 'solana'
        return coin.blockchain === 'solana';
      } else if (blockchainTab === 'tron') {
        // TRON: blockchain === 'tron'
        return coin.blockchain === 'tron';
      }
      return false;
    });

    const coins = filteredCurrencies
      .map((coin) => ({ ...coin, label: coin.name }))
      .sort((a, b) => {
        const orderA = (a as any).order ?? 0;
        const orderB = (b as any).order ?? 0;
        return orderA - orderB;
      });

    // Load Solana deposit address when Solana tab is selected
    useEffect(() => {
      if (blockchainTab === 'solana' && !solanaDepositAddress && !solanaAddressLoading) {
        loadSolanaDepositAddress();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockchainTab]);

    // Load TRON deposit address when TRON tab is selected
    useEffect(() => {
      if (blockchainTab === 'tron' && !tronDepositAddress && !tronAddressLoading) {
        loadTronDepositAddress();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockchainTab]);

    const loadSolanaDepositAddress = async () => {
      setSolanaAddressLoading(true);
      try {
        const res = await getSolanaDepositAddress();
        if (res?.data?.address) {
          const address = res.data.address;
          setSolanaDepositAddress(address);
          
          // Generate QR code
          try {
            const qrDataUrl = await QRCode.toDataURL(address, { width: 200 });
            setQrCodeDataUrl(qrDataUrl);
          } catch (qrError) {
            console.error('Error generating QR code:', qrError);
            // Don't fail the whole flow if QR code generation fails
          }
        } else {
          toast.error('Failed to load deposit address');
        }
      } catch (error: any) {
        console.error('Error loading Solana deposit address:', error);
        toast.error(error.response?.data?.message || 'Failed to load deposit address');
      } finally {
        setSolanaAddressLoading(false);
      }
    };

    const loadTronDepositAddress = async () => {
      setTronAddressLoading(true);
      try {
        const res = await getTronDepositAddress();
        console.log('[loadTronDepositAddress] Response:', res);
        if (res?.data?.address) {
          const address = res.data.address;
          setTronDepositAddress(address);
          
          // Generate QR code
          try {
            const qrDataUrl = await QRCode.toDataURL(address, { width: 200 });
            setTronQrCodeDataUrl(qrDataUrl);
          } catch (qrError) {
            console.error('Error generating QR code:', qrError);
            // Don't fail the whole flow if QR code generation fails
          }
        } else {
          console.error('[loadTronDepositAddress] Invalid response:', res);
          toast.error(res?.data?.message || res?.data?.error || 'Failed to load deposit address');
        }
      } catch (error: any) {
        console.error('Error loading TRON deposit address:', error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to load deposit address';
        console.error('[loadTronDepositAddress] Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: errorMessage
        });
        toast.error(errorMessage);
      } finally {
        setTronAddressLoading(false);
      }
    };

    const handleTronConfirm = async () => {
      if (!selectedCurrency) {
        toast.error('Please select a currency');
        return;
      }
      
      if (!user?._id || !selectedCurrency.currencyId) {
        toast.error('Invalid user or currency');
        return;
      }
      
      if (!tronSignature.trim()) {
        toast.error('Please enter a transaction hash');
        return;
      }

      setTronConfirmLoading(true);
      try {
        const payload: IConfirmTronDeposit = {
          userId: user._id,
          currencyId: selectedCurrency.currencyId,
          txn_id: tronSignature.trim(),
        };
        
        if (bonus) {
          payload.bonusId = bonus;
        }

        const res = await confirmTronDeposit(payload);
        
        if (res?.data) {
          toast.success('Deposit confirmed successfully!');
          
          // Refresh balance
          try {
            const balanceRes = await initialize();
            if (balanceRes?.data?.balance) {
              dispatch(UpdateBalanceInfo(balanceRes.data.balance));
            }
          } catch (balanceError) {
            console.error('Error refreshing balance:', balanceError);
          }
          
          // Refresh transaction history
          if (getTransactions) {
            try {
              await getTransactions();
            } catch (txError) {
              console.error('Error refreshing transactions:', txError);
            }
          }
          
          // Reset and close
          setTronSignature('');
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setTronConfirmLoading(false);
          toast.error('Deposit confirmation failed');
        }
      } catch (error: any) {
        console.error('Error confirming TRON deposit:', error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to confirm deposit';
        toast.error(errorMessage);
        setTronConfirmLoading(false);
      }
    };

    const handleSolanaConfirm = async () => {
      if (!selectedCurrency) {
        toast.error('Please select a currency');
        return;
      }
      
      if (!user?._id || !selectedCurrency.currencyId) {
        toast.error('Invalid user or currency');
        return;
      }
      
      // If no signature provided, try to check for deposits automatically
      if (!solanaSignature.trim()) {
        setSolanaConfirmLoading(true);
        try {
          const depositsRes = await checkSolanaDeposits();
          if (depositsRes?.data?.depositsConfirmed && depositsRes.data.depositsConfirmed.length > 0) {
            toast.success(`Found and confirmed ${depositsRes.data.depositsConfirmed.length} deposit(s)!`);
            
            // Refresh balance
            try {
              const balanceRes = await initialize();
              if (balanceRes?.data?.balance) {
                dispatch(UpdateBalanceInfo(balanceRes.data.balance));
              }
            } catch (balanceError) {
              console.error('Error refreshing balance:', balanceError);
            }
            
            // Refresh transaction history
            if (getTransactions) {
              try {
                await getTransactions();
              } catch (txError) {
                console.error('Error refreshing transactions:', txError);
              }
            }
            
            setTimeout(() => {
              onClose();
            }, 1500);
            return;
          } else {
            toast('No new deposits found. Please send funds to your deposit address or enter a transaction signature.', { icon: 'ℹ️' });
            return;
          }
        } catch (checkError: any) {
          toast.error(checkError.response?.data?.message || 'Failed to check for deposits. Please enter transaction signature manually.');
          return;
        } finally {
          setSolanaConfirmLoading(false);
        }
      }

      setSolanaConfirmLoading(true);
      try {
        const payload: IConfirmSolanaDeposit = {
          userId: user._id,
          currencyId: selectedCurrency.currencyId,
          txn_id: solanaSignature.trim(),
        };
        
        if (bonus) {
          payload.bonusId = bonus;
        }

        const res = await confirmSolanaDeposit(payload);
        
        if (res?.data) {
          toast.success('Deposit confirmed successfully!');
          
          // Reset loading state immediately
          setSolanaConfirmLoading(false);
          
          // Also check for other deposits automatically (but don't let errors affect the success)
          try {
            const depositsRes = await checkSolanaDeposits();
            if (depositsRes?.data?.depositsConfirmed && depositsRes.data.depositsConfirmed.length > 0) {
              toast.success(`Also found ${depositsRes.data.depositsConfirmed.length} additional deposit(s)!`);
            }
          } catch (checkError: any) {
            // Silently fail - this is just a bonus check
            // Don't let errors from check-deposits affect the successful deposit
            console.log('Auto-check after manual confirmation (non-critical):', checkError?.response?.data || checkError?.message);
            // Only show error if it's not a 401 (which would have already been handled by interceptor)
            if (checkError?.response?.status !== 401) {
              // Silently ignore - this is just a convenience feature
            }
          }
          
          // Refresh balance
          try {
            const balanceRes = await initialize();
            if (balanceRes?.data?.balance) {
              dispatch(UpdateBalanceInfo(balanceRes.data.balance));
            }
          } catch (balanceError) {
            console.error('Error refreshing balance:', balanceError);
          }
          
          // Refresh transaction history
          if (getTransactions) {
            try {
              await getTransactions();
            } catch (txError) {
              console.error('Error refreshing transactions:', txError);
            }
          }
          
          // Reset and close
          setSolanaSignature('');
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setSolanaConfirmLoading(false);
          toast.error('Deposit confirmation failed');
        }
      } catch (error: any) {
        console.error('Error confirming Solana deposit:', error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to confirm deposit';
        
        // If manual confirmation fails, try to check for deposits automatically as fallback
        if (error.response?.status === 400) {
          // Try automatic check as fallback
          try {
            const depositsRes = await checkSolanaDeposits();
            if (depositsRes?.data?.depositsConfirmed && depositsRes.data.depositsConfirmed.length > 0) {
              toast.success(`Found ${depositsRes.data.depositsConfirmed.length} deposit(s) automatically!`);
              
              // Refresh balance
              try {
                const balanceRes = await initialize();
                if (balanceRes?.data?.balance) {
                  dispatch(UpdateBalanceInfo(balanceRes.data.balance));
                }
              } catch (balanceError) {
                console.error('Error refreshing balance:', balanceError);
              }
              
              // Refresh transaction history
              if (getTransactions) {
                try {
                  await getTransactions();
                } catch (txError) {
                  console.error('Error refreshing transactions:', txError);
                }
              }
              
              // Reset loading and close
              setSolanaConfirmLoading(false);
              setSolanaSignature('');
              setTimeout(() => {
                onClose();
              }, 1500);
              return;
            }
          } catch (checkError) {
            // If automatic check also fails, show the original error
            console.log('Auto-check fallback failed:', checkError);
          }
        }
        
        toast.error(errorMessage);
        
        // Keep signature so user can see what they entered, but they might want to try again
      } finally {
        setSolanaConfirmLoading(false);
      }
    };

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        toast.success('Address copied to clipboard');
      }).catch(() => {
        toast.error('Failed to copy address');
      });
    };

    const renderSubmit = blockchainTab === 'evm' ? (
      <>
        {/* Real-time Price Display with Progress Bar */}
        {selectedCurrency && (
          <Box sx={{ mb: 2 }}>
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
          disabled={isTxBusy}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={calcCoinAmount} edge="end" disabled={!selectedCurrency || amountState.fiatAmount <= 0 || isTxBusy}>
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
            disabled={isTxBusy}
            sx={{ mt: 2 }}
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

        <AnimateButton>
          <Button
            fullWidth
            variant="outlined"
            color="info"
            size="large"
            sx={{ mt: 1 }}
            onClick={submitDeposit}
            disabled={isTxBusy || calcLoading || txLoading || !selectedCurrency || amountState.fiatAmount <= 0}
          >
            {t('submit')}
          </Button>
        </AnimateButton>
      </>
    ) : blockchainTab === 'solana' ? (
      <>
        {/* Solana Deposit UI */}
        {solanaAddressLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={32} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Loading deposit address...
            </Typography>
          </Box>
        ) : solanaDepositAddress ? (
          <>
            {/* Deposit Address Display */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Your Solana Deposit Address:
              </Typography>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                  }}
                >
                  {solanaDepositAddress}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(solanaDepositAddress)}
                  sx={{ flexShrink: 0 }}
                >
                  <Iconify icon="mdi:content-copy" width={20} />
                </IconButton>
              </Box>
            </Box>

            {/* QR Code */}
            {qrCodeDataUrl && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Box
                    component="img"
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    sx={{ display: 'block', width: 200, height: 200 }}
                  />
                </Box>
              </Box>
            )}

            {/* Amount Inputs (for reference) */}
            {selectedCurrency && (
              <>
                {/* Real-time Price Display with Progress Bar */}
                <Box sx={{ mb: 2 }}>
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
                        transition: 'none',
                      },
                    }}
                  />
                </Box>

                {/* Fiat Amount Input (for reference) */}
                <TextField
                  type="number"
                  fullWidth
                  label={`${t('Amount')} (${currency.symbol})`}
                  value={amountState.fiatAmount || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    // Allow any positive value or empty input
                    if (e.target.value === '' || value >= 0) {
                      handleFiatChange(value >= 0 ? value : 0);
                    }
                  }}
                  inputProps={{
                    min: 0,
                    step: '0.01',
                  }}
                  error={amountState.fiatAmount > 0 && amountState.fiatAmount < MIN_DEPOSIT_LU}
                  helperText={
                    amountState.fiatAmount > 0 && amountState.fiatAmount < MIN_DEPOSIT_LU
                      ? `Minimum deposit is ${MIN_DEPOSIT_LU} ${INTERNAL_CURRENCY}`
                      : ''
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box component="img" alt="currency" src={currency?.icon} width={20} height={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                {/* Coin Amount Input (for reference) */}
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
                  sx={{ mb: 2 }}
                />
              </>
            )}

            {/* Transaction Signature Input (Optional - deposits are checked automatically) */}
            <TextField
              fullWidth
              label="Transaction Signature (Optional)"
              value={solanaSignature}
              onChange={(e) => setSolanaSignature(e.target.value)}
              placeholder="Optional: Paste transaction signature to manually confirm"
              sx={{ mb: 2 }}
              helperText="Deposits are checked automatically. You can also manually enter a transaction signature if needed."
            />

            {/* Confirm Button */}
            <AnimateButton>
              <Button
                fullWidth
                variant="outlined"
                color="info"
                size="large"
                onClick={handleSolanaConfirm}
                disabled={
                  solanaConfirmLoading || 
                  !selectedCurrency || 
                  (!solanaSignature.trim() && amountState.fiatAmount === 0) ||
                  (amountState.fiatAmount > 0 && amountState.fiatAmount < MIN_DEPOSIT_LU)
                }
              >
                {solanaConfirmLoading ? 'Confirming...' : "I sent the deposit"}
              </Button>
            </AnimateButton>
          </>
        ) : (
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to load deposit address. Please try again.
          </Alert>
        )}
      </>
    ) : blockchainTab === 'tron' ? (
      <>
        {/* TRON Deposit UI */}
        {tronAddressLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={32} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Loading deposit address...
            </Typography>
          </Box>
        ) : tronDepositAddress ? (
          <>
            {/* Deposit Address Display */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Your TRON Deposit Address:
              </Typography>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                  }}
                >
                  {tronDepositAddress}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(tronDepositAddress)}
                  sx={{ flexShrink: 0 }}
                >
                  <Iconify icon="mdi:content-copy" width={20} />
                </IconButton>
              </Box>
              {/* TronScan link */}
              <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                <a
                  href={`https://tronscan.org/#/address/${tronDepositAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  View on TronScan
                </a>
              </Typography>
            </Box>

            {/* QR Code */}
            {tronQrCodeDataUrl && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Box
                    component="img"
                    src={tronQrCodeDataUrl}
                    alt="QR Code"
                    sx={{ display: 'block', width: 200, height: 200 }}
                  />
                </Box>
              </Box>
            )}

            {/* Amount Inputs (for reference) */}
            {selectedCurrency && (
              <>
                {/* Real-time Price Display with Progress Bar */}
                <Box sx={{ mb: 2 }}>
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
                        transition: 'none',
                      },
                    }}
                  />
                </Box>

                {/* Fiat Amount Input (for reference) */}
                <TextField
                  type="number"
                  fullWidth
                  label={`${t('Amount')} (${currency.symbol})`}
                  value={amountState.fiatAmount || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (e.target.value === '' || value >= 0) {
                      handleFiatChange(value >= 0 ? value : 0);
                    }
                  }}
                  inputProps={{
                    min: 0,
                    step: '0.01',
                  }}
                  error={amountState.fiatAmount > 0 && amountState.fiatAmount < MIN_DEPOSIT_LU}
                  helperText={
                    amountState.fiatAmount > 0 && amountState.fiatAmount < MIN_DEPOSIT_LU
                      ? `Minimum deposit is ${MIN_DEPOSIT_LU} ${INTERNAL_CURRENCY}`
                      : ''
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box component="img" alt="currency" src={currency?.icon} width={20} height={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                {/* Coin Amount Input (for reference) */}
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
                  sx={{ mb: 2 }}
                />
              </>
            )}

            {/* Transaction ID Input */}
            <TextField
              fullWidth
              label="Transaction ID (Required)"
              value={tronSignature}
              onChange={(e) => setTronSignature(e.target.value)}
              placeholder="Enter TRON transaction hash"
              sx={{ mb: 2 }}
              helperText="Enter the transaction hash (txid) from your TRON wallet after sending the deposit"
            />

            {/* Confirm Button */}
            <AnimateButton>
              <Button
                fullWidth
                variant="outlined"
                color="info"
                size="large"
                onClick={handleTronConfirm}
                disabled={
                  tronConfirmLoading || 
                  !selectedCurrency || 
                  !tronSignature.trim() ||
                  (amountState.fiatAmount > 0 && amountState.fiatAmount < MIN_DEPOSIT_LU)
                }
              >
                {tronConfirmLoading ? 'Confirming...' : "I sent the deposit"}
              </Button>
            </AnimateButton>
          </>
        ) : (
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to load deposit address. Please try again.
          </Alert>
        )}
      </>
    ) : null;

    return (
      <div ref={ref}>
        <Card
          sx={{
            position: 'absolute',
            width: { xs: 1, sm: 400, lg: 450 },
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CardHeader
            title={`${t('deposit')} Crypto`}
            action={
              <IconButton 
                onClick={() => {
                  if (isTxBusy) {
                    toast.error('Transaction in progress. Please wait for confirmation.');
                    return;
                  }
                  onClose();
                }}
              >
                <Iconify icon="mdi:close" />
              </IconButton>
            }
            sx={{ py: 2 }}
          />
          <CardContent sx={{ mb: 2, pt: 0 }}>
            <Grid container spacing={2}>
              {/* Blockchain Tabs */}
              <Grid item xs={12}>
                <Tabs
                  value={blockchainTab === 'evm' ? 0 : blockchainTab === 'solana' ? 1 : 2}
                  onChange={(e, newValue) => {
                    if (newValue === 0) setBlockchainTab('evm');
                    else if (newValue === 1) setBlockchainTab('solana');
                    else setBlockchainTab('tron');
                  }}
                  sx={{
                    mb: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                      minWidth: 'auto',
                      px: 2,
                    },
                  }}
                >
                  <Tab label="EVM" />
                  <Tab label="Solana" />
                  <Tab label="TRON" />
                </Tabs>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Autocomplete
                  options={coins}
                  onChange={(e, row) => {
                    console.log('row:', row);
                    setSelectedCurrency(row);
                  }}
                  disabled={isTxBusy || (blockchainTab === 'solana' && solanaConfirmLoading) || (blockchainTab === 'tron' && tronConfirmLoading)}
                  renderInput={(params) => <TextField {...params} label={t('coins')} />}
                  renderOption={(props, option) => {
                    const { icon } = filteredCurrencies.find((e) => e.symbol === option.symbol) || { icon: null };

                    if (!icon) {
                      return null;
                    }

                    return (
                      <li {...props} key={option.symbol}>
                        {`${option.name} (${option.symbol})`}
                        <Box component="img" alt="currency" src={option.icon} width={20} height={20} ml={1} />
                      </li>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                {/* Transaction Status Panel - Outside blur so it remains visible */}
                {txStatus !== 'idle' && (
                  <Alert
                    severity={
                      txStatus === 'wallet_confirm' || txStatus === 'tx_sent' || txStatus === 'confirming'
                        ? 'info'
                        : txStatus === 'success'
                        ? 'success'
                        : 'error'
                    }
                    sx={{ mb: 2, mt: 1 }}
                  >
                    <Typography variant="body2">
                      {txStatus === 'wallet_confirm' && 'Open your wallet and confirm the transaction.'}
                      {txStatus === 'tx_sent' && 'Transaction sent.'}
                      {txStatus === 'confirming' && 'Waiting for blockchain confirmation...'}
                      {txStatus === 'success' && 'Confirmed! Updating your balance...'}
                      {txStatus === 'error' && (
                        <>
                          {txError || 'Transaction failed'}
                          <Button
                            size="small"
                            onClick={() => {
                              setTxStatus('idle');
                              setTxError(null);
                              setTxHash(null);
                            }}
                            sx={{ ml: 1 }}
                          >
                            Try again
                          </Button>
                        </>
                      )}
                    </Typography>
                    {txHash && selectedCurrency?.explorerUrl && (
                      <Typography variant="caption" component="div" sx={{ mt: 0.5 }}>
                        <a
                          href={`${selectedCurrency.explorerUrl}/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', textDecoration: 'underline' }}
                        >
                          View on explorer
                        </a>
                      </Typography>
                    )}
                  </Alert>
                )}

                <Box
                  sx={{
                    mt: 1,
                    ...((isTxBusy || calcLoading || txLoading) && {
                      filter: 'blur(3px)',
                    }),
                  }}
                >
                  {renderSubmit}
                </Box>
                {(isTxBusy || calcLoading || txLoading) && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '55%',
                      left: '46%',
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    );
  }
);

export default DepositModal;
