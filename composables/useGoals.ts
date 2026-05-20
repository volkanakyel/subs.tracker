import { Car, Gift, GraduationCap, Heart, Home, Landmark, Plane, Shield, type Component } from 'lucide-vue-next'

export type GoalIconKey = 'shield' | 'plane' | 'car' | 'landmark' | 'home' | 'education' | 'heart' | 'gift'

export interface Goal {
  id: string
  name: string
  iconKey: GoalIconKey
  current: number
  target: number
  deadline?: string
  note?: string
}

export const GOAL_ICONS: { key: GoalIconKey; label: string; icon: Component }[] = [
  { key: 'shield',    label: 'Safety',     icon: Shield },
  { key: 'plane',     label: 'Travel',     icon: Plane },
  { key: 'car',       label: 'Vehicle',    icon: Car },
  { key: 'landmark',  label: 'Retirement', icon: Landmark },
  { key: 'home',      label: 'Home',       icon: Home },
  { key: 'education', label: 'Education',  icon: GraduationCap },
  { key: 'heart',     label: 'Health',     icon: Heart },
  { key: 'gift',      label: 'Gift',       icon: Gift },
]

export const goalIcon = (key: GoalIconKey): Component =>
  GOAL_ICONS.find((g) => g.key === key)?.icon ?? Shield

const seed = (): Goal[] => [
  { id: 'g-1', name: 'Emergency Fund', iconKey: 'shield',    current: 8000,   target: 10000,  deadline: '2026-06-30' },
  { id: 'g-2', name: 'Vacation',       iconKey: 'plane',     current: 2400,   target: 5000,   deadline: '2026-08-15', note: 'Lisbon, summer trip' },
  { id: 'g-3', name: 'New Car',        iconKey: 'car',       current: 12000,  target: 35000,  deadline: '2027-03-01' },
  { id: 'g-4', name: 'Retirement',     iconKey: 'landmark',  current: 45000,  target: 500000 },
  { id: 'g-5', name: 'Down Payment',   iconKey: 'home',      current: 22000,  target: 80000,  deadline: '2028-01-01', note: 'Two-bed condo' },
  { id: 'g-6', name: 'MBA Tuition',    iconKey: 'education', current: 18000,  target: 25000,  deadline: '2026-09-01' },
]

export const useGoals = () => {
  const goals = useState<Goal[]>('goals', seed)

  const add = (g: Omit<Goal, 'id'>) => {
    const id = `g-${Date.now().toString(36)}`
    goals.value = [...goals.value, { ...g, id }]
  }

  const update = (id: string, patch: Partial<Omit<Goal, 'id'>>) => {
    goals.value = goals.value.map((g) => (g.id === id ? { ...g, ...patch } : g))
  }

  const remove = (id: string) => {
    goals.value = goals.value.filter((g) => g.id !== id)
  }

  const contribute = (id: string, amount: number) => {
    goals.value = goals.value.map((g) =>
      g.id === id ? { ...g, current: Math.max(0, g.current + amount) } : g
    )
  }

  return { goals, add, update, remove, contribute }
}

export const goalPct = (g: Goal) => (g.target ? Math.min(100, (g.current / g.target) * 100) : 0)
export const goalRemaining = (g: Goal) => Math.max(0, g.target - g.current)
export const goalComplete = (g: Goal) => g.current >= g.target

export const daysUntil = (iso?: string, today: Date = new Date(2026, 1, 8)) => {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  const target = new Date(y, m - 1, d)
  const ms = target.getTime() - today.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export const monthsUntil = (iso?: string, today: Date = new Date(2026, 1, 8)) => {
  if (!iso) return null
  const [y, m] = iso.split('-').map(Number)
  return (y - today.getFullYear()) * 12 + (m - 1 - today.getMonth())
}
