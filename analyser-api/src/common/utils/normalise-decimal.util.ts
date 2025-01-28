import { ServiceError } from '@common/errors';

export const normaliseDecimal = (
  value: number | string,
  precision = 2,
): number => {
  const numValue = Number(value).toFixed(precision);

  if (numValue === 'NaN') {
    throw new ServiceError(
      'Invalid input: value must be a number or a string representing a number',
    );
  }
  return parseFloat(numValue);
};
