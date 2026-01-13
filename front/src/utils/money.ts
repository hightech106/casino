/**
 * Money utility functions for LU (internal currency) handling.
 * 
 * IMPORTANT: LU is always USD-equivalent (1 LU = 1 USD).
 * All internal calculations should use LU, never branch on USD/non-USD.
 * 
 * RULES:
 * - Never check `currency.symbol === 'USD'` in business logic
 * - Never use `convertToUSD()` functions - amounts are already in LU
 * - Always use `fiatSymbol: INTERNAL_CURRENCY` in API payloads
 * - Use `meetsMinDeposit()` and `meetsMinWithdraw()` for validation
 * - UI can display user's currency symbol for UX, but internally treat as LU
 * 
 * GUARDRAIL: If you see `currency.symbol === 'USD'` or `convertToUSD()` in business logic,
 * it should be refactored to use LU directly.
 */

/**
 * Internal currency constant - LU is always USD-equivalent
 */
export const INTERNAL_CURRENCY = 'LU';

/**
 * Minimum deposit amount in LU (USD-equivalent)
 */
export const MIN_DEPOSIT_LU = 10;

/**
 * Minimum withdrawal amount in LU (USD-equivalent)
 */
export const MIN_WITHDRAW_LU = 20;

/**
 * Convert amount to LU (identity function since LU = USD)
 * This function exists for semantic clarity and future-proofing.
 * @param amount - Amount in USD-equivalent (already in LU)
 * @returns The same amount (LU = USD)
 */
export function toLU(amount: number): number {
  return amount;
}

/**
 * Format LU amount for display
 * @param amount - Amount in LU
 * @param options - Formatting options
 * @returns Formatted string
 */
export function formatLU(amount: number, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }): string {
  const defaultOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  };
  return amount.toLocaleString(undefined, defaultOptions);
}

/**
 * Check if amount meets minimum deposit requirement
 * @param amountLU - Amount in LU
 * @returns True if amount >= MIN_DEPOSIT_LU
 */
export function meetsMinDeposit(amountLU: number): boolean {
  return amountLU >= MIN_DEPOSIT_LU;
}

/**
 * Check if amount meets minimum withdrawal requirement
 * @param amountLU - Amount in LU
 * @returns True if amount >= MIN_WITHDRAW_LU
 */
export function meetsMinWithdraw(amountLU: number): boolean {
  return amountLU >= MIN_WITHDRAW_LU;
}

