import {
  ArrowDownLeft,
  ArrowLeftRight,
  Building2,
  CalendarDays,
  Car,
  Coffee,
  CreditCard,
  Landmark,
  LayoutDashboard,
  Monitor,
  PiggyBank,
  Plane,
  Receipt,
  Settings,
  Shield,
  ShoppingBag,
  Target,
  TrendingUp,
  Utensils,
  Wallet,
  Zap,
} from 'lucide-vue-next'

export const useDashboardData = () => {
  const netWorth = {
    total: 48352.68,
    trend: 5.3,
    deltaLabel: '+$2,431 from last month',
    series: [
      { month: 'Jan', netWorth: 38200 },
      { month: 'Feb', netWorth: 39100 },
      { month: 'Mar', netWorth: 37800 },
      { month: 'Apr', netWorth: 40200 },
      { month: 'May', netWorth: 41500 },
      { month: 'Jun', netWorth: 42800 },
      { month: 'Jul', netWorth: 41900 },
      { month: 'Aug', netWorth: 43600 },
      { month: 'Sep', netWorth: 44200 },
      { month: 'Oct', netWorth: 45800 },
      { month: 'Nov', netWorth: 45921 },
      { month: 'Dec', netWorth: 48352 },
    ],
  }

  const quickStats = [
    { label: 'Monthly Income', value: 8200, trend: 12.4, icon: Wallet },
    { label: 'Monthly Expenses', value: 5640, trend: -3.2, icon: CreditCard },
    { label: 'Monthly Savings', value: 2560, trend: 8.1, icon: PiggyBank },
  ]

  const spending = [
    { category: 'Housing', amount: 1800 },
    { category: 'Food', amount: 650 },
    { category: 'Transport', amount: 420 },
    { category: 'Shopping', amount: 380 },
    { category: 'Health', amount: 290 },
    { category: 'Fun', amount: 520 },
    { category: 'Bills', amount: 840 },
    { category: 'Other', amount: 740 },
  ]

  const investments = {
    total: 24680,
    holdings: [
      { name: 'Stocks', value: 11106, percentage: 45, color: '#111111' },
      { name: 'ETFs', value: 5430, percentage: 22, color: '#4a4a4a' },
      { name: 'Crypto', value: 3702, percentage: 15, color: '#7a7a7a' },
      { name: 'Bonds', value: 2468, percentage: 10, color: '#a8a8a8' },
      { name: 'Cash', value: 1974, percentage: 8, color: '#d4d4d4' },
    ],
  }

  const goals = [
    { name: 'Emergency Fund', current: 8000, target: 10000, percentage: 80, icon: Shield },
    { name: 'Vacation', current: 2400, target: 5000, percentage: 48, icon: Plane },
    { name: 'New Car', current: 12000, target: 35000, percentage: 34, icon: Car },
    { name: 'Retirement', current: 45000, target: 500000, percentage: 9, icon: Landmark },
  ]


  const calendar = {
    month: 'February',
    year: 2026,
    today: 8,
    daysInMonth: 28,
    billDays: [10, 12, 15, 20, 22, 25, 28],
    upcoming: [
      { name: 'Netflix', day: 12, amount: 15.99 },
      { name: 'GitHub Pro', day: 15, amount: 7.0 },
      { name: 'Spotify', day: 18, amount: 9.99 },
      { name: 'Utilities', day: 20, amount: 142.0 },
      { name: 'iCloud+', day: 22, amount: 2.99 },
    ],
  }

  const transactions = [
    { name: 'Salary Deposit', description: 'Acme Corp', category: 'Income', date: 'Feb 1', amount: 8200, icon: ArrowDownLeft },
    { name: 'Rent Payment', description: 'Apartment #204', category: 'Housing', date: 'Feb 1', amount: -1800, icon: Building2 },
    { name: 'Whole Foods', description: 'Groceries', category: 'Food', date: 'Feb 3', amount: -87.42, icon: ShoppingBag },
    { name: 'Blue Bottle Coffee', description: 'Morning coffee', category: 'Food', date: 'Feb 4', amount: -5.8, icon: Coffee },
    { name: 'Flight to NYC', description: 'Delta Airlines', category: 'Travel', date: 'Feb 4', amount: -342.5, icon: Plane },
    { name: 'Electric Bill', description: 'ConEdison', category: 'Bills', date: 'Feb 5', amount: -142.0, icon: Zap },
    { name: 'Dinner Out', description: 'Nobu Restaurant', category: 'Food', date: 'Feb 5', amount: -68.0, icon: Utensils },
    { name: 'Software License', description: 'JetBrains', category: 'Work', date: 'Feb 6', amount: -29.99, icon: Monitor },
  ]

  const navigation = {
    main: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
      { label: 'Accounts', icon: CreditCard, to: '/accounts', badge: '3' },
      { label: 'Transactions', icon: ArrowLeftRight, to: '/transactions' },
      { label: 'Investments', icon: TrendingUp, to: '/investments' },
    ],
    tracking: [
      { label: 'Goals', icon: Target, to: '/goals' },
      { label: 'Subscriptions', icon: Receipt, to: '/subscriptions' },
      { label: 'Budget', icon: PiggyBank, to: '/budget' },
      { label: 'Calendar', icon: CalendarDays, to: '/calendar' },
    ],
    mobile: [
      { label: 'Home', icon: LayoutDashboard, to: '/' },
      { label: 'Accounts', icon: CreditCard, to: '/accounts' },
      { label: 'Invest', icon: TrendingUp, to: '/investments' },
      { label: 'Subs', icon: Receipt, to: '/subscriptions' },
      { label: 'More', icon: Settings, to: '/settings' },
    ],
  }

  const user = { name: 'Jane Doe', email: 'jane@email.com', initials: 'JD' }

  return { netWorth, quickStats, spending, investments, goals, calendar, transactions, navigation, user }
}
