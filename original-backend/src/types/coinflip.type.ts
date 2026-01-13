/**
 * Type definitions for Coinflip game creation and betting.
 * Defines the structure for creating coinflip games with bet amount and side selection.
 * Used for type-safe coinflip game operations and validation.
 */
export type ICreateGame = {
  amount: number;
  side: boolean;
}