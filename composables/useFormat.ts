const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const currencyFmtCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const useFormat = () => ({
  currency: (value: number) => currencyFmt.format(value),
  currencyCents: (value: number) => currencyFmtCents.format(value),
  compact: (value: number) => `$${(value / 1000).toFixed(0)}k`,
})
