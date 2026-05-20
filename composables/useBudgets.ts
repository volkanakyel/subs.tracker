import { Car, Heart, Home, MoreHorizontal, Receipt, ShoppingBag, Sparkles, Utensils, type Component } from 'lucide-vue-next'

export type BudgetStatus = 'under' | 'close' | 'over'

export interface Budget {
  id: string
  name: string
  iconKey: BudgetIconKey
  limit: number
  spent: number
}

export type BudgetIconKey = 'home' | 'food' | 'transport' | 'shopping' | 'health' | 'fun' | 'bills' | 'other'

export const BUDGET_ICONS: { key: BudgetIconKey; label: string; icon: Component }[] = [
  { key: 'home',     label: 'Housing',   icon: Home },
  { key: 'food',     label: 'Food',      icon: Utensils },
  { key: 'transport',label: 'Transport', icon: Car },
  { key: 'shopping', label: 'Shopping',  icon: ShoppingBag },
  { key: 'health',   label: 'Health',    icon: Heart },
  { key: 'fun',      label: 'Fun',       icon: Sparkles },
  { key: 'bills',    label: 'Bills',     icon: Receipt },
  { key: 'other',    label: 'Other',     icon: MoreHorizontal },
]

export const iconFor = (key: BudgetIconKey): Component =>
  BUDGET_ICONS.find((i) => i.key === key)?.icon ?? MoreHorizontal

const seed = (): Budget[] => [
  { id: 'b-1', name: 'Housing',   iconKey: 'home',     limit: 2000, spent: 1800 },
  { id: 'b-2', name: 'Food',      iconKey: 'food',     limit: 700,  spent: 650 },
  { id: 'b-3', name: 'Transport', iconKey: 'transport',limit: 500,  spent: 420 },
  { id: 'b-4', name: 'Shopping',  iconKey: 'shopping', limit: 300,  spent: 380 },
  { id: 'b-5', name: 'Health',    iconKey: 'health',   limit: 400,  spent: 290 },
  { id: 'b-6', name: 'Fun',       iconKey: 'fun',      limit: 600,  spent: 520 },
  { id: 'b-7', name: 'Bills',     iconKey: 'bills',    limit: 900,  spent: 840 },
  { id: 'b-8', name: 'Other',     iconKey: 'other',    limit: 500,  spent: 740 },
]

export const useBudgets = () => {
  const budgets = useState<Budget[]>('budgets', seed)

  const add = (b: Omit<Budget, 'id'>) => {
    const id = `b-${Date.now().toString(36)}`
    budgets.value = [...budgets.value, { ...b, id }]
  }

  const update = (id: string, patch: Partial<Omit<Budget, 'id'>>) => {
    budgets.value = budgets.value.map((b) => (b.id === id ? { ...b, ...patch } : b))
  }

  const remove = (id: string) => {
    budgets.value = budgets.value.filter((b) => b.id !== id)
  }

  return { budgets, add, update, remove }
}

export const budgetPct = (b: Budget) => (b.limit ? (b.spent / b.limit) * 100 : 0)
export const budgetRemaining = (b: Budget) => b.limit - b.spent
export const budgetStatus = (b: Budget): BudgetStatus => {
  const pct = budgetPct(b)
  if (pct >= 100) return 'over'
  if (pct >= 70) return 'close'
  return 'under'
}
