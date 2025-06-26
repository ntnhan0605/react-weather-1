export function getName(city: any) {
  if (!city) {
    return 'N/A';
  }
  return `${city?.name}, ${city?.country}`;
}

export function mathRound(num: number, decimal = 2) {
  const decimalNumber = 10 ** decimal;
  return Math.round(num * decimalNumber) / decimalNumber;
}
