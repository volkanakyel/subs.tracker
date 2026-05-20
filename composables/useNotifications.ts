import { ArrowDownLeft, Bell, CreditCard, Target, TrendingUp, type Component } from 'lucide-vue-next'

export type NotificationIconKey = 'income' | 'renewal' | 'goal' | 'portfolio' | 'bill'

export interface Notification {
  id: string
  iconKey: NotificationIconKey
  title: string
  body: string
  time: string
  read: boolean
}

const ICONS: Record<NotificationIconKey, Component> = {
  income:    ArrowDownLeft,
  renewal:   CreditCard,
  goal:      Target,
  portfolio: TrendingUp,
  bill:      Bell,
}

export const notificationIcon = (key: NotificationIconKey): Component => ICONS[key] ?? Bell

const seed = (): Notification[] => [
  { id: 'n-1', iconKey: 'income',    title: 'Salary received',   body: '$8,200 deposited from Acme Corp.',       time: '2h',  read: false },
  { id: 'n-2', iconKey: 'renewal',   title: 'Renewal upcoming',  body: 'Netflix renews in 4 days · $15.99.',     time: '5h',  read: false },
  { id: 'n-3', iconKey: 'goal',      title: 'Goal milestone',    body: 'Emergency Fund is now 80% complete.',    time: '1d',  read: false },
  { id: 'n-4', iconKey: 'portfolio', title: 'Portfolio up 2.4%', body: 'Your investments gained $592 this week.', time: '2d', read: true  },
  { id: 'n-5', iconKey: 'bill',      title: 'Bill paid',         body: 'Electric bill of $142.00 was paid.',     time: '3d',  read: true  },
]

export const useNotifications = () => {
  const notifications = useState<Notification[]>('notifications', seed)
  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

  const markAllRead = () => {
    notifications.value = notifications.value.map((n) => ({ ...n, read: true }))
  }

  const markRead = (id: string) => {
    notifications.value = notifications.value.map((n) => (n.id === id ? { ...n, read: true } : n))
  }

  return { notifications, unreadCount, markAllRead, markRead }
}
