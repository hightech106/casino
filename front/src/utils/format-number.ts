/**
 * Number formatting utilities using numeral.js for currency, percentages, and data sizes.
 * Handles edge cases like very small numbers (< 0.00001) and removes trailing zeros from formatted output.
 * Note: fShortNumber uses regex matching to truncate decimals, which may cause precision loss.
 */
import numeral from 'numeral';

// ----------------------------------------------------------------------

type InputValue = string | number | null;

export function fNumber(number: InputValue) {
  return numeral(number).format();
}

export function fCurrency(number: InputValue, symbol: boolean = true) {
  if (Number(number) > 0 && Number(number) < 0.00001) return 0;
  const format = number ? numeral(number).format(`${symbol ? '$' : ''}0,0.00`) : '';

  return result(format, '.00');
}

export function fPercent(number: InputValue) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number: InputValue) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number: InputValue) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

export function fShortNumber(number: string | number, num: number = 3) {
  if (Number(number) < 0.00001) return 0;
  // not raise
  if (num === 2) return Number(number.toString().match(/^\d+(?:\.\d{0,2})?/));
  if (num === 3) return Number(number.toString().match(/^\d+(?:\.\d{0,3})?/));
  if (num === 5) return Number(number.toString().match(/^\d+(?:\.\d{0,5})?/));
  return Number(number.toString().match(/^\d+(?:\.\d{0,6})?/));
}

function result(format: string, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}
