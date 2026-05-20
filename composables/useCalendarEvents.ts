export type CalendarEventType = 'bill' | 'income' | 'reminder'

export interface CalendarEvent {
  id: string
  title: string
  type: CalendarEventType
  date: string
  amount: number
  note?: string
}

export const EVENT_TYPES: { value: CalendarEventType; label: string }[] = [
  { value: 'bill',     label: 'Bill' },
  { value: 'income',   label: 'Income' },
  { value: 'reminder', label: 'Reminder' },
]

const seed = (): CalendarEvent[] => [
  { id: 'e-1', title: 'Salary deposit',    type: 'income',   date: '2026-02-01', amount: 8200,   note: 'Acme Corp' },
  { id: 'e-2', title: 'Rent payment',      type: 'bill',     date: '2026-02-01', amount: 1800,   note: 'Apartment #204' },
  { id: 'e-3', title: 'Electric bill',     type: 'bill',     date: '2026-02-20', amount: 142,    note: 'ConEdison' },
  { id: 'e-4', title: 'Internet',          type: 'bill',     date: '2026-02-15', amount: 79.99,  note: 'Verizon Fios' },
  { id: 'e-5', title: 'Insurance premium', type: 'bill',     date: '2026-02-25', amount: 220,    note: 'Geico' },
  { id: 'e-6', title: 'Tax filing deadline', type: 'reminder', date: '2026-02-28', amount: 0,    note: 'Submit quarterly' },
  { id: 'e-7', title: 'Freelance payout',  type: 'income',   date: '2026-02-14', amount: 1450 },
]

export const useCalendarEvents = () => {
  const events = useState<CalendarEvent[]>('calendar-events', seed)

  const add = (event: Omit<CalendarEvent, 'id'>) => {
    const id = `e-${Date.now().toString(36)}`
    events.value = [...events.value, { ...event, id }]
  }

  const update = (id: string, patch: Partial<Omit<CalendarEvent, 'id'>>) => {
    events.value = events.value.map((e) => (e.id === id ? { ...e, ...patch } : e))
  }

  const remove = (id: string) => {
    events.value = events.value.filter((e) => e.id !== id)
  }

  return { events, add, update, remove }
}
