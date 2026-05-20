export type SubscriptionCycle = 'monthly' | 'yearly'
export type SubscriptionStatus = 'active' | 'paused'

export interface Subscription {
  id: string
  name: string
  price: number
  cycle: SubscriptionCycle
  category: string
  nextRenewal: string
  startedAt: string
  status: SubscriptionStatus
  icon: string
}

const seed = (): Subscription[] => [
  { id: 's-netflix',   name: 'Netflix',         price: 15.99, cycle: 'monthly', category: 'Entertainment', nextRenewal: '2026-02-12', startedAt: '2022-04-18', status: 'active',  icon: '/icons/netflix.svg' },
  { id: 's-spotify',   name: 'Spotify',         price: 9.99,  cycle: 'monthly', category: 'Entertainment', nextRenewal: '2026-02-18', startedAt: '2021-09-02', status: 'active',  icon: '/icons/spotify.svg' },
  { id: 's-icloud',    name: 'iCloud+',         price: 2.99,  cycle: 'monthly', category: 'Productivity',  nextRenewal: '2026-02-22', startedAt: '2020-11-14', status: 'active',  icon: '/icons/iCloud.svg' },
  { id: 's-github',    name: 'GitHub Pro',      price: 7.00,  cycle: 'monthly', category: 'Work',          nextRenewal: '2026-02-15', startedAt: '2019-06-30', status: 'active',  icon: '/icons/github.svg' },
  { id: 's-notion',    name: 'Notion',          price: 10.00, cycle: 'monthly', category: 'Productivity',  nextRenewal: '2026-02-28', startedAt: '2023-01-08', status: 'active',  icon: '/icons/notion.svg' },
  { id: 's-figma',     name: 'Figma',           price: 144.00, cycle: 'yearly', category: 'Work',          nextRenewal: '2026-08-04', startedAt: '2022-08-04', status: 'active',  icon: '/icons/figma.svg' },
  { id: 's-adobe',     name: 'Adobe CC',        price: 59.99, cycle: 'monthly', category: 'Work',          nextRenewal: '2026-03-02', startedAt: '2021-02-15', status: 'paused', icon: '/icons/adobe.svg' },
  { id: 's-youtube',   name: 'YouTube Premium', price: 13.99, cycle: 'monthly', category: 'Entertainment', nextRenewal: '2026-02-26', startedAt: '2023-11-26', status: 'active',  icon: '/icons/youtube.svg' },
]

export const CATEGORIES = ['Entertainment', 'Productivity', 'Work', 'Health', 'Other'] as const

export const useSubscriptions = () => {
  const subscriptions = useState<Subscription[]>('subscriptions', seed)

  const add = (sub: Omit<Subscription, 'id'>) => {
    const id = `s-${Date.now().toString(36)}`
    subscriptions.value = [{ ...sub, id }, ...subscriptions.value]
  }

  const update = (id: string, patch: Partial<Omit<Subscription, 'id'>>) => {
    subscriptions.value = subscriptions.value.map((s) => (s.id === id ? { ...s, ...patch } : s))
  }

  const remove = (id: string) => {
    subscriptions.value = subscriptions.value.filter((s) => s.id !== id)
  }

  const togglePause = (id: string) => {
    subscriptions.value = subscriptions.value.map((s) =>
      s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
    )
  }

  return { subscriptions, add, update, remove, togglePause }
}
