// ---------------------------------------------------------------------------
// Sample data for the Meridian client portal demo.
// Everything here is mock data — no backend, no real Stripe, no secrets.
// In production these shapes map 1:1 to: clients (DB), usage (metered events),
// invoices (Stripe), payment_method (Stripe PaymentMethod).
// ---------------------------------------------------------------------------

export type PlanId = 'starter' | 'growth' | 'scale'

export interface Plan {
  id: PlanId
  name: string
  priceMonthly: number
  seats: number
  blurb: string
  features: string[]
}

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 49,
    seats: 3,
    blurb: 'For small teams getting started.',
    features: ['Up to 3 seats', '1,000 work orders / mo', 'Email support', '30-day history'],
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    priceMonthly: 149,
    seats: 10,
    blurb: 'For growing service teams.',
    features: ['Up to 10 seats', '10,000 work orders / mo', 'Priority support', '1-year history', 'API access'],
  },
  scale: {
    id: 'scale',
    name: 'Scale',
    priceMonthly: 399,
    seats: 30,
    blurb: 'For established operations.',
    features: ['Up to 30 seats', 'Unlimited work orders', 'Dedicated manager', 'Unlimited history', 'SSO + audit logs'],
  },
}

export type InvoiceStatus = 'paid' | 'open' | 'past_due'

export interface Invoice {
  id: string
  number: string
  date: string // ISO
  amount: number
  status: InvoiceStatus
  period: string
}

export interface ActivityEvent {
  id: string
  ts: string // ISO
  kind: 'login' | 'work_order' | 'invoice' | 'team' | 'setting' | 'export'
  actor: string
  text: string
}

export interface UsagePoint {
  month: string // 'Jan'
  workOrders: number
  activeUsers: number
}

export interface PaymentMethod {
  brand: string
  last4: string
  expMonth: number
  expYear: number
  name: string
}

export interface Client {
  id: string
  company: string
  contactName: string
  contactEmail: string
  plan: PlanId
  status: 'active' | 'trialing' | 'past_due' | 'canceled'
  seatsUsed: number
  joinedAt: string
  // per-client detail
  usage: UsagePoint[]
  invoices: Invoice[]
  activity: ActivityEvent[]
  payment: PaymentMethod
  // headline metrics
  workOrdersThisMonth: number
  workOrdersLastMonth: number
  storageGb: number
  storageCapGb: number
}

function series(base: number, growth: number, jitter: number): UsagePoint[] {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  // deterministic pseudo-jitter so the chart looks organic but never changes
  return months.map((m, i) => {
    const wobble = ((i * 9301 + 49297) % 233) / 233 - 0.5
    const workOrders = Math.max(40, Math.round(base + growth * i + wobble * jitter))
    const activeUsers = Math.max(2, Math.round(workOrders / 26 + wobble * 2))
    return { month: m, workOrders, activeUsers }
  })
}

const invFor = (prefix: string, amount: number): Invoice[] => {
  const months = [
    { d: '2026-06-01', p: 'Jun 1 – Jun 30, 2026', s: 'open' as InvoiceStatus },
    { d: '2026-05-01', p: 'May 1 – May 31, 2026', s: 'paid' as InvoiceStatus },
    { d: '2026-04-01', p: 'Apr 1 – Apr 30, 2026', s: 'paid' as InvoiceStatus },
    { d: '2026-03-01', p: 'Mar 1 – Mar 31, 2026', s: 'paid' as InvoiceStatus },
    { d: '2026-02-01', p: 'Feb 1 – Feb 28, 2026', s: 'paid' as InvoiceStatus },
    { d: '2026-01-01', p: 'Jan 1 – Jan 31, 2026', s: 'paid' as InvoiceStatus },
  ]
  return months.map((m, i) => ({
    id: `${prefix}-${i}`,
    number: `${prefix}-${String(1042 - i).padStart(4, '0')}`,
    date: m.d,
    amount,
    status: m.s,
    period: m.p,
  }))
}

const activityFor = (name: string): ActivityEvent[] => [
  { id: 'a1', ts: '2026-06-23T14:12:00', kind: 'login', actor: name, text: 'Signed in from Boston, MA' },
  { id: 'a2', ts: '2026-06-23T11:48:00', kind: 'work_order', actor: name, text: 'Closed work order #WO-4821 — HVAC inspection' },
  { id: 'a3', ts: '2026-06-22T16:30:00', kind: 'export', actor: name, text: 'Exported June activity report (CSV)' },
  { id: 'a4', ts: '2026-06-22T09:05:00', kind: 'team', actor: 'Admin', text: 'Added teammate dana@ to the account' },
  { id: 'a5', ts: '2026-06-21T13:20:00', kind: 'invoice', actor: 'System', text: 'Invoice MER-1041 marked paid — $149.00' },
  { id: 'a6', ts: '2026-06-20T10:02:00', kind: 'setting', actor: name, text: 'Updated notification preferences' },
  { id: 'a7', ts: '2026-06-19T15:44:00', kind: 'work_order', actor: name, text: 'Opened work order #WO-4799 — quarterly maintenance' },
]

const card = (brand: string, last4: string, m: number, y: number, name: string): PaymentMethod => ({
  brand, last4, expMonth: m, expYear: y, name,
})

export const CLIENTS: Client[] = [
  {
    id: 'cl_riverside',
    company: 'Riverside Property Group',
    contactName: 'Maya Chen',
    contactEmail: 'maya@riversidepg.com',
    plan: 'growth',
    status: 'active',
    seatsUsed: 7,
    joinedAt: '2025-02-14',
    usage: series(220, 18, 60),
    invoices: invFor('MER', 149),
    activity: activityFor('Maya Chen'),
    payment: card('Visa', '4242', 8, 2027, 'Maya Chen'),
    workOrdersThisMonth: 412,
    workOrdersLastMonth: 388,
    storageGb: 6.2,
    storageCapGb: 25,
  },
  {
    id: 'cl_summit',
    company: 'Summit Facilities LLC',
    contactName: 'Derek Bowen',
    contactEmail: 'derek@summitfac.com',
    plan: 'scale',
    status: 'active',
    seatsUsed: 22,
    joinedAt: '2024-09-03',
    usage: series(620, 34, 120),
    invoices: invFor('MER', 399),
    activity: activityFor('Derek Bowen'),
    payment: card('Mastercard', '5318', 3, 2028, 'Summit Facilities'),
    workOrdersThisMonth: 1043,
    workOrdersLastMonth: 1110,
    storageGb: 41.8,
    storageCapGb: 100,
  },
  {
    id: 'cl_harbor',
    company: 'Harbor Dental Partners',
    contactName: 'Priya Nair',
    contactEmail: 'priya@harbordental.com',
    plan: 'starter',
    status: 'trialing',
    seatsUsed: 2,
    joinedAt: '2026-06-10',
    usage: series(60, 12, 30),
    invoices: invFor('MER', 49).map((iv, i) => (i === 0 ? { ...iv, amount: 0, status: 'open' } : iv)),
    activity: activityFor('Priya Nair'),
    payment: card('Visa', '1881', 11, 2026, 'Priya Nair'),
    workOrdersThisMonth: 138,
    workOrdersLastMonth: 96,
    storageGb: 1.1,
    storageCapGb: 10,
  },
  {
    id: 'cl_oakwood',
    company: 'Oakwood Landscaping',
    contactName: 'Sam Ortiz',
    contactEmail: 'sam@oakwoodland.com',
    plan: 'growth',
    status: 'past_due',
    seatsUsed: 5,
    joinedAt: '2025-07-22',
    usage: series(180, 9, 50),
    invoices: invFor('MER', 149).map((iv, i) => (i === 0 ? { ...iv, status: 'past_due' } : iv)),
    activity: activityFor('Sam Ortiz'),
    payment: card('Amex', '0005', 1, 2027, 'Sam Ortiz'),
    workOrdersThisMonth: 256,
    workOrdersLastMonth: 244,
    storageGb: 9.7,
    storageCapGb: 25,
  },
  {
    id: 'cl_beacon',
    company: 'Beacon Cleaning Co.',
    contactName: 'Tara Wells',
    contactEmail: 'tara@beaconclean.com',
    plan: 'starter',
    status: 'active',
    seatsUsed: 3,
    joinedAt: '2025-11-30',
    usage: series(90, 7, 35),
    invoices: invFor('MER', 49),
    activity: activityFor('Tara Wells'),
    payment: card('Visa', '7702', 5, 2027, 'Tara Wells'),
    workOrdersThisMonth: 174,
    workOrdersLastMonth: 169,
    storageGb: 3.4,
    storageCapGb: 10,
  },
  {
    id: 'cl_pioneer',
    company: 'Pioneer Electric',
    contactName: 'Luis Reyes',
    contactEmail: 'luis@pioneerelec.com',
    plan: 'scale',
    status: 'active',
    seatsUsed: 18,
    joinedAt: '2024-12-12',
    usage: series(540, 21, 110),
    invoices: invFor('MER', 399),
    activity: activityFor('Luis Reyes'),
    payment: card('Mastercard', '6610', 9, 2026, 'Pioneer Electric'),
    workOrdersThisMonth: 884,
    workOrdersLastMonth: 902,
    storageGb: 33.1,
    storageCapGb: 100,
  },
]

export const ADMIN_USER = { name: 'Jordan Avery', email: 'jordan@meridian.app', role: 'Owner' }

// ---- helpers ----
export const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: n % 1 === 0 ? 0 : 2 })

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const relTime = (iso: string) => {
  const diff = (new Date('2026-06-23T15:00:00').getTime() - new Date(iso).getTime()) / 1000
  if (diff < 3600) return `${Math.max(1, Math.round(diff / 60))}m ago`
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`
  return `${Math.round(diff / 86400)}d ago`
}

export const mrr = (c: Client) => PLANS[c.plan].priceMonthly
export const totalMrr = (cs: Client[]) => cs.reduce((s, c) => s + (c.status === 'canceled' ? 0 : mrr(c)), 0)
