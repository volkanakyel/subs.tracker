import {
  ArrowDownLeft,
  Building2,
  Car,
  Coffee,
  Heart,
  Monitor,
  MoreHorizontal,
  Plane,
  ShoppingBag,
  Utensils,
  Zap,
  type Component,
} from 'lucide-vue-next'

export type TxIconKey =
  | 'income'
  | 'housing'
  | 'food'
  | 'coffee'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'travel'
  | 'health'
  | 'work'
  | 'other'

export type TxCategory =
  | 'Income'
  | 'Housing'
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Travel'
  | 'Health'
  | 'Work'
  | 'Other'

export interface Transaction {
  id: string
  name: string
  description?: string
  category: TxCategory
  iconKey: TxIconKey
  date: string
  amount: number
}

export const TX_CATEGORIES: TxCategory[] = [
  'Income', 'Housing', 'Food', 'Transport', 'Shopping', 'Bills', 'Travel', 'Health', 'Work', 'Other',
]

const ICONS: Record<TxIconKey, Component> = {
  income:    ArrowDownLeft,
  housing:   Building2,
  food:      Utensils,
  coffee:    Coffee,
  transport: Car,
  shopping:  ShoppingBag,
  bills:     Zap,
  travel:    Plane,
  health:    Heart,
  work:      Monitor,
  other:     MoreHorizontal,
}

export const TX_ICONS: { key: TxIconKey; label: string; icon: Component }[] = [
  { key: 'income',    label: 'Income',    icon: ArrowDownLeft },
  { key: 'housing',   label: 'Housing',   icon: Building2 },
  { key: 'food',      label: 'Food',      icon: Utensils },
  { key: 'coffee',    label: 'Coffee',    icon: Coffee },
  { key: 'transport', label: 'Transport', icon: Car },
  { key: 'shopping',  label: 'Shopping',  icon: ShoppingBag },
  { key: 'bills',     label: 'Bills',     icon: Zap },
  { key: 'travel',    label: 'Travel',    icon: Plane },
  { key: 'health',    label: 'Health',    icon: Heart },
  { key: 'work',      label: 'Work',      icon: Monitor },
  { key: 'other',     label: 'Other',     icon: MoreHorizontal },
]

export const txIcon = (key: TxIconKey): Component => ICONS[key] ?? MoreHorizontal

const seed = (): Transaction[] => [
  { id: 't-1', name: 'Salary Deposit',     description: 'Acme Corp',         category: 'Income',   iconKey: 'income',    date: '2026-02-01', amount: 8200 },
  { id: 't-2', name: 'Rent Payment',       description: 'Apartment #204',    category: 'Housing',  iconKey: 'housing',   date: '2026-02-01', amount: -1800 },
  { id: 't-3', name: 'Whole Foods',        description: 'Groceries',         category: 'Food',     iconKey: 'shopping',  date: '2026-02-03', amount: -87.42 },
  { id: 't-4', name: 'Blue Bottle Coffee', description: 'Morning coffee',    category: 'Food',     iconKey: 'coffee',    date: '2026-02-04', amount: -5.8 },
  { id: 't-5', name: 'Flight to NYC',      description: 'Delta Airlines',    category: 'Travel',   iconKey: 'travel',    date: '2026-02-04', amount: -342.5 },
  { id: 't-6', name: 'Electric Bill',      description: 'ConEdison',         category: 'Bills',    iconKey: 'bills',     date: '2026-02-05', amount: -142 },
  { id: 't-7', name: 'Dinner Out',         description: 'Nobu Restaurant',   category: 'Food',     iconKey: 'food',      date: '2026-02-05', amount: -68 },
  { id: 't-8', name: 'Software License',   description: 'JetBrains',         category: 'Work',     iconKey: 'work',      date: '2026-02-06', amount: -29.99 },
  { id: 't-9', name: 'Freelance payout',   description: 'Side project',      category: 'Income',   iconKey: 'income',    date: '2026-02-07', amount: 1450 },
  { id: 't-10', name: 'Uber',              description: 'Airport ride',      category: 'Transport',iconKey: 'transport', date: '2026-02-07', amount: -42.3 },
  { id: 't-11', name: 'Pharmacy',          description: 'Walgreens',         category: 'Health',   iconKey: 'health',    date: '2026-02-06', amount: -23.4 },
  { id: 't-12', name: 'Amazon',            description: 'Headphones',        category: 'Shopping', iconKey: 'shopping',  date: '2026-02-03', amount: -129 },
]

export const useTransactions = () => {
  const transactions = useState<Transaction[]>('transactions', seed)

  const add = (tx: Omit<Transaction, 'id'>) => {
    const id = `t-${Date.now().toString(36)}`
    transactions.value = [{ ...tx, id }, ...transactions.value]
  }

  const update = (id: string, patch: Partial<Omit<Transaction, 'id'>>) => {
    transactions.value = transactions.value.map((t) => (t.id === id ? { ...t, ...patch } : t))
  }

  const remove = (id: string) => {
    transactions.value = transactions.value.filter((t) => t.id !== id)
  }

  return { transactions, add, update, remove }
}
