export type AccountType = 'checking' | 'savings' | 'credit' | 'investment' | 'cash'

export interface Account {
  id: string
  name: string
  institution: string
  type: AccountType
  balance: number
  last4: string
  isPrimary: boolean
  updatedAt: string
}

export const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'investment', label: 'Investment' },
  { value: 'cash', label: 'Cash' },
]

const seed = (): Account[] => [
  { id: 'a-1', name: 'Everyday Checking',  institution: 'Chase',          type: 'checking',   balance: 8420.32,  last4: '4827', isPrimary: true,  updatedAt: '2026-02-08' },
  { id: 'a-2', name: 'High Yield Savings', institution: 'Marcus',         type: 'savings',    balance: 24800.00, last4: '0192', isPrimary: false, updatedAt: '2026-02-07' },
  { id: 'a-3', name: 'Sapphire Reserve',   institution: 'Chase',          type: 'credit',     balance: -1240.50, last4: '7733', isPrimary: false, updatedAt: '2026-02-08' },
  { id: 'a-4', name: 'Brokerage',          institution: 'Fidelity',       type: 'investment', balance: 24680.00, last4: '5520', isPrimary: false, updatedAt: '2026-02-06' },
  { id: 'a-5', name: 'Emergency Fund',     institution: 'Ally',           type: 'savings',    balance: 8000.00,  last4: '8814', isPrimary: false, updatedAt: '2026-02-05' },
  { id: 'a-6', name: 'Wallet',             institution: 'Cash on hand',   type: 'cash',       balance: 280.00,   last4: '——',   isPrimary: false, updatedAt: '2026-02-08' },
]

export const useAccounts = () => {
  const accounts = useState<Account[]>('accounts', seed)

  const add = (acc: Omit<Account, 'id'>) => {
    const id = `a-${Date.now().toString(36)}`
    accounts.value = [{ ...acc, id }, ...accounts.value]
  }

  const update = (id: string, patch: Partial<Omit<Account, 'id'>>) => {
    accounts.value = accounts.value.map((a) => (a.id === id ? { ...a, ...patch } : a))
  }

  const remove = (id: string) => {
    accounts.value = accounts.value.filter((a) => a.id !== id)
  }

  const setPrimary = (id: string) => {
    accounts.value = accounts.value.map((a) => ({ ...a, isPrimary: a.id === id }))
  }

  return { accounts, add, update, remove, setPrimary }
}
