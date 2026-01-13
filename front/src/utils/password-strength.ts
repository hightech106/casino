/**
 * Password strength validation utilities that check for numbers, mixed case, and special characters.
 * Returns color-coded strength indicators (poor, weak, normal, good, strong) based on password complexity.
 * Note: Strength is calculated from length, numbers, special chars, and mixed case, with max score of 5.
 */
import type { NumbColorFunc, StringBoolFunc, StringNumFunc } from 'src/types';
import value from 'src/assets/scss/_themes-vars.module.scss';

const hasNumber: StringBoolFunc = (number) => /[0-9]/.test(number);

const hasMixed: StringBoolFunc = (number) => /[a-z]/.test(number) && /[A-Z]/.test(number);

const hasSpecial: StringBoolFunc = (number) => /[!#@$%^&*)(+=._-]/.test(number);

export const strengthColor: NumbColorFunc = (count) => {
  if (count < 2) return { label: 'poor', color: value.errorMain };
  if (count < 3) return { label: 'weak', color: value.warningDark };
  if (count < 4) return { label: 'normal', color: value.orangeMain };
  if (count < 5) return { label: 'good', color: value.successMain };
  if (count < 6) return { label: 'strong', color: value.successDark };
  return { label: 'Poor', color: value.errorMain };
};

export const strengthIndicator: StringNumFunc = (number) => {
  let strengths = 0;
  if (number.length > 5) strengths += 1;
  if (number.length > 7) strengths += 1;
  if (hasNumber(number)) strengths += 1;
  if (hasSpecial(number)) strengths += 1;
  if (hasMixed(number)) strengths += 1;
  return strengths;
};
