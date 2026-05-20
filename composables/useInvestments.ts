export type HoldingType = 'stock' | 'etf' | 'crypto' | 'bond' | 'cash'

export interface Holding {
  id: string
  symbol: string
  name: string
  type: HoldingType
  shares: number
  avgCost: number
  currentPrice: number
  updatedAt: string
}

export const HOLDING_TYPES: { value: HoldingType; label: string }[] = [
  { value: 'stock',  label: 'Stock' },
  { value: 'etf',    label: 'ETF' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'bond',   label: 'Bond' },
  { value: 'cash',   label: 'Cash' },
]

const seed = (): Holding[] => [
  { id: 'h-aapl', symbol: 'AAPL', name: 'Apple Inc.',           type: 'stock',  shares: 24,    avgCost: 142.50, currentPrice: 188.20, updatedAt: '2026-02-08' },
  { id: 'h-msft', symbol: 'MSFT', name: 'Microsoft Corp.',      type: 'stock',  shares: 12,    avgCost: 318.00, currentPrice: 412.40, updatedAt: '2026-02-08' },
  { id: 'h-nvda', symbol: 'NVDA', name: 'NVIDIA Corp.',         type: 'stock',  shares: 8,     avgCost: 410.00, currentPrice: 740.10, updatedAt: '2026-02-08' },
  { id: 'h-voo',  symbol: 'VOO',  name: 'Vanguard S&P 500 ETF', type: 'etf',    shares: 18,    avgCost: 380.20, currentPrice: 452.80, updatedAt: '2026-02-08' },
  { id: 'h-vti',  symbol: 'VTI',  name: 'Vanguard Total Market', type: 'etf',   shares: 14,    avgCost: 220.10, currentPrice: 258.40, updatedAt: '2026-02-07' },
  { id: 'h-btc',  symbol: 'BTC',  name: 'Bitcoin',              type: 'crypto', shares: 0.18,  avgCost: 32400,  currentPrice: 48200,  updatedAt: '2026-02-08' },
  { id: 'h-eth',  symbol: 'ETH',  name: 'Ethereum',             type: 'crypto', shares: 1.6,   avgCost: 2100,   currentPrice: 2860,   updatedAt: '2026-02-08' },
  { id: 'h-tlt',  symbol: 'TLT',  name: '20+ Year Treasury',    type: 'bond',   shares: 22,    avgCost: 98.40,  currentPrice: 92.10,  updatedAt: '2026-02-06' },
]

export const useInvestments = () => {
  const holdings = useState<Holding[]>('investments', seed)

  const add = (h: Omit<Holding, 'id'>) => {
    const id = `h-${Date.now().toString(36)}`
    holdings.value = [{ ...h, id }, ...holdings.value]
  }

  const update = (id: string, patch: Partial<Omit<Holding, 'id'>>) => {
    holdings.value = holdings.value.map((h) => (h.id === id ? { ...h, ...patch } : h))
  }

  const remove = (id: string) => {
    holdings.value = holdings.value.filter((h) => h.id !== id)
  }

  return { holdings, add, update, remove }
}

export const marketValue = (h: Holding) => h.shares * h.currentPrice
export const costBasis = (h: Holding) => h.shares * h.avgCost
export const gainLoss = (h: Holding) => marketValue(h) - costBasis(h)
export const gainPct = (h: Holding) => {
  const cost = costBasis(h)
  return cost ? (gainLoss(h) / cost) * 100 : 0
}
