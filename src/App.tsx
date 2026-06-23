import { useState } from 'react'
import {
  CLIENTS, PLANS, ADMIN_USER, money, shortDate, relTime, mrr, totalMrr,
  type Client, type PlanId, type InvoiceStatus, type ActivityEvent,
} from './data'

// ───────────────────────────── icons ─────────────────────────────
type IconProps = { className?: string }
const I = {
  grid: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" className={p.className}><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>,
  activity: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" className={p.className}><path d="M3 12h4l3 7 4-14 3 7h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  card: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" className={p.className}><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" /><path d="M3 9.5h18" stroke="currentColor" strokeWidth="1.8" /></svg>,
  gear: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" className={p.className}><circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9 19 19M19 5l-2.1 2.1M7.1 16.9 5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  users: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" className={p.className}><circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.2a3.2 3.2 0 0 1 0 6M16.5 19a5.5 5.5 0 0 0-2.2-4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  logout: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" className={p.className}><path d="M15 12H4m0 0 3.5-3.5M4 12l3.5 3.5M14 6V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  shield: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" className={p.className}><path d="M12 3 5 6v5c0 4.2 2.9 8 7 9 4.1-1 7-4.8 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  bolt: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" className={p.className}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>,
  download: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" className={p.className}><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  check: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" className={p.className}><path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  plus: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" className={p.className}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  lock: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" className={p.className}><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" /></svg>,
}

// ───────────────────────────── primitives ─────────────────────────────
function Badge({ tone, children }: { tone: 'positive' | 'warning' | 'danger' | 'neutral' | 'brand'; children: any }) {
  const map: Record<string, string> = {
    positive: 'bg-positive-soft text-positive',
    warning: 'bg-warning-soft text-warning',
    danger: 'bg-danger-soft text-danger',
    brand: 'bg-brand-50 text-brand-700',
    neutral: 'bg-slate-100 text-ink-muted',
  }
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[tone]}`}>{children}</span>
}

const statusBadge = (s: Client['status']) => {
  const m = { active: ['positive', 'Active'], trialing: ['brand', 'Trial'], past_due: ['danger', 'Past due'], canceled: ['neutral', 'Canceled'] } as const
  const [tone, label] = m[s]
  return <Badge tone={tone as any}>{label}</Badge>
}

const invoiceBadge = (s: InvoiceStatus) => {
  const m = { paid: ['positive', 'Paid'], open: ['brand', 'Open'], past_due: ['danger', 'Past due'] } as const
  const [tone, label] = m[s]
  return <Badge tone={tone as any}>{label}</Badge>
}

function Card({ children, className = '' }: { children: any; className?: string }) {
  return <div className={`rounded-xl border border-line bg-surface shadow-card ${className}`}>{children}</div>
}

function StatCard({ label, value, sub, trend }: { label: string; value: string; sub?: string; trend?: number }) {
  const up = (trend ?? 0) >= 0
  return (
    <Card className="p-5">
      <div className="text-sm font-medium text-ink-muted">{label}</div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-bold tracking-tight text-ink">{value}</div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold ${up ? 'text-positive' : 'text-danger'}`}>
            {up ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      {sub && <div className="mt-1 text-xs text-ink-soft">{sub}</div>}
    </Card>
  )
}

const kindIcon = (k: ActivityEvent['kind']) => {
  const c = 'h-4 w-4'
  if (k === 'login') return <I.logout className={c} />
  if (k === 'work_order') return <I.bolt className={c} />
  if (k === 'invoice') return <I.card className={c} />
  if (k === 'team') return <I.users className={c} />
  if (k === 'export') return <I.download className={c} />
  return <I.gear className={c} />
}

// Smooth-ish SVG area chart for the 12-month usage series.
function UsageChart({ data }: { data: { month: string; workOrders: number }[] }) {
  const W = 720, H = 220, pad = { l: 8, r: 8, t: 16, b: 26 }
  const max = Math.max(...data.map((d) => d.workOrders)) * 1.15
  const min = Math.min(...data.map((d) => d.workOrders)) * 0.7
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / (data.length - 1)
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b)
  const pts = data.map((d, i) => [x(i), y(d.workOrders)] as const)
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${x(data.length - 1).toFixed(1)},${H - pad.b} L${pad.l},${H - pad.b} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" role="img" aria-label="Work orders over the last 12 months">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={pad.l} x2={W - pad.r} y1={pad.t + g * (H - pad.t - pad.b)} y2={pad.t + g * (H - pad.t - pad.b)} stroke="#eef2f7" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#g)" />
      <path d={line} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 4 : 0} fill="#4f46e5" stroke="#fff" strokeWidth="2" />
      ))}
      {data.map((d, i) => (
        <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 11 }}>{d.month}</text>
      ))}
    </svg>
  )
}

// ───────────────────────────── login ─────────────────────────────
function Login({ onClient, onAdmin }: { onClient: (c: Client) => void; onAdmin: () => void }) {
  const [email, setEmail] = useState('maya@riversidepg.com')
  const [pw, setPw] = useState('demo1234')
  const matched = CLIENTS.find((c) => c.contactEmail.toLowerCase() === email.trim().toLowerCase())
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-brand-700 p-12 text-white">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-light/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="relative flex items-center gap-2 font-bold text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15"><I.grid className="h-5 w-5" /></span>
          Meridian
        </div>
        <div className="relative">
          <h1 className="text-3xl font-bold leading-tight">The client portal your customers actually log into.</h1>
          <p className="mt-4 max-w-md text-brand-100">Per-client data scoping, live usage, and Stripe billing — in one clean dashboard. This is an interactive demo with sample data.</p>
          <ul className="mt-8 space-y-3 text-sm text-brand-50">
            {['Each client sees only their own data', 'Usage & activity at a glance', 'Stripe billing + invoice history', 'Admin area to manage every account'].map((t) => (
              <li key={t} className="flex items-center gap-2"><I.check className="h-4 w-4 text-white" /> {t}</li>
            ))}
          </ul>
        </div>
        <div className="relative text-xs text-brand-200">Demo build · no real charges · sample data only</div>
      </div>

      {/* form */}
      <div className="flex items-center justify-center bg-canvas p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex items-center gap-2 font-bold text-xl text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white"><I.grid className="h-5 w-5" /></span>
            Meridian
          </div>
          <h2 className="text-2xl font-bold text-ink">Sign in</h2>
          <p className="mt-1 text-sm text-ink-muted">Welcome back. Pick a demo identity below.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => { e.preventDefault(); matched ? onClient(matched) : onClient(CLIENTS[0]) }}
          >
            <label className="block">
              <span className="text-sm font-medium text-ink">Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-100" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Password</span>
              <input value={pw} onChange={(e) => setPw(e.target.value)} type="password"
                className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-100" />
            </label>
            <button type="submit" className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark">Sign in to portal</button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-ink-soft"><span className="h-px flex-1 bg-line" /> or jump straight in <span className="h-px flex-1 bg-line" /></div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Demo client logins</p>
            <div className="grid grid-cols-1 gap-2">
              {CLIENTS.slice(0, 3).map((c) => (
                <button key={c.id} onClick={() => onClient(c)}
                  className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-left text-sm transition hover:border-brand hover:bg-brand-50">
                  <span><span className="font-semibold text-ink">{c.company}</span><span className="block text-xs text-ink-muted">{c.contactEmail}</span></span>
                  {statusBadge(c.status)}
                </button>
              ))}
            </div>
            <button onClick={onAdmin}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-brand-200 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100">
              <I.shield className="h-4 w-4" /> Enter as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ───────────────────────────── shell ─────────────────────────────
type View = 'overview' | 'activity' | 'billing' | 'settings' | 'admin'

function NavItem({ icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${active ? 'bg-brand-50 text-brand-700' : 'text-ink-muted hover:bg-slate-100 hover:text-ink'}`}>
      <span className="h-5 w-5">{icon}</span>{label}
    </button>
  )
}

// ───────────────────────────── client views ─────────────────────────────
function Overview({ c }: { c: Client }) {
  const plan = PLANS[c.plan]
  const trend = Math.round(((c.workOrdersThisMonth - c.workOrdersLastMonth) / c.workOrdersLastMonth) * 100)
  const storagePct = Math.round((c.storageGb / c.storageCapGb) * 100)
  const renew = c.status === 'trialing' ? 'Trial ends Jun 24, 2026' : 'Renews Jul 1, 2026'
  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Work orders · this month" value={c.workOrdersThisMonth.toLocaleString()} trend={trend} sub="vs. last month" />
        <StatCard label="Active team members" value={`${c.seatsUsed} / ${plan.seats}`} sub={`${plan.name} plan`} />
        <StatCard label="Storage used" value={`${c.storageGb} GB`} sub={`${storagePct}% of ${c.storageCapGb} GB`} />
        <StatCard label="Current plan" value={money(plan.priceMonthly) + '/mo'} sub={renew} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-ink">Work orders processed</h3>
              <p className="text-xs text-ink-muted">Last 12 months</p>
            </div>
            <Badge tone="brand">{c.usage.reduce((s, d) => s + d.workOrders, 0).toLocaleString()} total</Badge>
          </div>
          <div className="mt-4"><UsageChart data={c.usage} /></div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-ink">Storage</h3>
          <p className="text-xs text-ink-muted">{c.storageGb} GB of {c.storageCapGb} GB</p>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand" style={{ width: `${storagePct}%` }} />
          </div>
          <div className="mt-6 space-y-3">
            {[['Documents', 0.46], ['Photos & media', 0.34], ['Exports', 0.2]].map(([k, f]) => (
              <div key={k as string}>
                <div className="flex justify-between text-xs text-ink-muted"><span>{k}</span><span>{(c.storageGb * (f as number)).toFixed(1)} GB</span></div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-light" style={{ width: `${(f as number) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-ink">Recent activity</h3>
          <span className="text-xs text-ink-soft">Only your account</span>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {c.activity.slice(0, 5).map((e) => (
            <li key={e.id} className="flex items-center gap-3 py-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">{kindIcon(e.kind)}</span>
              <span className="flex-1 text-sm text-ink">{e.text}</span>
              <span className="text-xs text-ink-soft">{relTime(e.ts)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Activity({ c }: { c: Client }) {
  return (
    <Card className="p-5 animate-fadeUp">
      <h3 className="font-semibold text-ink">Account activity</h3>
      <p className="text-xs text-ink-muted">Every event scoped to {c.company}.</p>
      <ul className="mt-4 divide-y divide-line">
        {c.activity.map((e) => (
          <li key={e.id} className="flex items-center gap-3 py-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">{kindIcon(e.kind)}</span>
            <span className="flex-1"><span className="text-sm text-ink">{e.text}</span><span className="block text-xs text-ink-soft">{e.actor}</span></span>
            <span className="text-xs text-ink-soft">{shortDate(e.ts)} · {relTime(e.ts)}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function Billing({ c }: { c: Client }) {
  const plan = PLANS[c.plan]
  const pm = c.payment
  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-ink">Current plan</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-ink">{plan.name}</span>
                <span className="text-ink-muted">· {money(plan.priceMonthly)}/mo</span>
              </div>
              <p className="mt-1 text-sm text-ink-muted">{plan.blurb}</p>
            </div>
            {statusBadge(c.status)}
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-ink"><I.check className="h-4 w-4 text-positive" /> {f}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Upgrade plan</button>
            <button className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50">Manage subscription</button>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-ink">Payment method</h3>
          <div className="mt-3 rounded-xl bg-gradient-to-br from-ink to-slate-700 p-4 text-white shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold tracking-wide">{pm.brand}</span>
              <I.card className="h-6 w-6 opacity-80" />
            </div>
            <div className="mt-6 font-mono text-lg tracking-widest">•••• •••• •••• {pm.last4}</div>
            <div className="mt-3 flex justify-between text-xs text-white/70">
              <span>{pm.name}</span><span>{String(pm.expMonth).padStart(2, '0')}/{String(pm.expYear).slice(2)}</span>
            </div>
          </div>
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-line py-2 text-sm font-semibold text-ink hover:bg-slate-50">
            <I.lock className="h-4 w-4" /> Update card · Stripe
          </button>
          <p className="mt-2 text-center text-[11px] text-ink-soft">Card vaulted by Stripe — never touches our servers.</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="font-semibold text-ink">Invoice history</h3>
          <button className="flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-dark"><I.download className="h-4 w-4" /> Export all</button>
        </div>
        <div className="scroll-soft overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-line bg-slate-50 text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-5 py-2.5 font-semibold">Invoice</th>
                <th className="px-5 py-2.5 font-semibold">Date</th>
                <th className="px-5 py-2.5 font-semibold">Period</th>
                <th className="px-5 py-2.5 font-semibold">Amount</th>
                <th className="px-5 py-2.5 font-semibold">Status</th>
                <th className="px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {c.invoices.map((iv) => (
                <tr key={iv.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-ink">{iv.number}</td>
                  <td className="px-5 py-3 text-ink-muted">{shortDate(iv.date)}</td>
                  <td className="px-5 py-3 text-ink-muted">{iv.period}</td>
                  <td className="px-5 py-3 font-medium text-ink">{money(iv.amount)}</td>
                  <td className="px-5 py-3">{invoiceBadge(iv.status)}</td>
                  <td className="px-5 py-3 text-right"><button className="text-brand-700 hover:text-brand-dark"><I.download className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function Settings({ c }: { c: Client }) {
  const [name, setName] = useState(c.contactName)
  const [email, setEmail] = useState(c.contactEmail)
  const [saved, setSaved] = useState(false)
  const [notif, setNotif] = useState({ invoices: true, activity: true, product: false })
  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-brand' : 'bg-slate-300'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
  return (
    <div className="grid gap-6 lg:grid-cols-2 animate-fadeUp">
      <Card className="p-5">
        <h3 className="font-semibold text-ink">Profile</h3>
        <p className="text-xs text-ink-muted">Update your account details.</p>
        <form className="mt-4 space-y-4" onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000) }}>
          <label className="block"><span className="text-sm font-medium text-ink">Full name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-100" /></label>
          <label className="block"><span className="text-sm font-medium text-ink">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-100" /></label>
          <label className="block"><span className="text-sm font-medium text-ink">Company</span>
            <input defaultValue={c.company} disabled className="mt-1 w-full rounded-lg border border-line bg-slate-50 px-3 py-2.5 text-sm text-ink-muted" /></label>
          <div className="flex items-center gap-3">
            <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Save changes</button>
            {saved && <span className="flex items-center gap-1 text-sm font-medium text-positive"><I.check className="h-4 w-4" /> Saved</span>}
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-ink">Notifications</h3>
        <p className="text-xs text-ink-muted">Choose what we email you about.</p>
        <div className="mt-4 divide-y divide-line">
          {([['invoices', 'Billing & invoices'], ['activity', 'Account activity'], ['product', 'Product updates']] as const).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between py-3">
              <span className="text-sm text-ink">{label}</span>
              <Toggle on={notif[k]} onClick={() => setNotif({ ...notif, [k]: !notif[k] })} />
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-line bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink"><I.lock className="h-4 w-4 text-ink-muted" /> Security</div>
          <p className="mt-1 text-xs text-ink-muted">Two-factor authentication is <span className="font-semibold text-positive">on</span>. Sessions are scoped per client.</p>
        </div>
      </Card>
    </div>
  )
}

// ───────────────────────────── admin ─────────────────────────────
function Admin({ clients, onAdd, onOpen }: { clients: Client[]; onAdd: (c: Omit<Client, never>) => void; onOpen: (c: Client) => void }) {
  const [showModal, setShowModal] = useState(false)
  const active = clients.filter((c) => c.status !== 'canceled').length
  const pastDue = clients.filter((c) => c.status === 'past_due').length
  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monthly recurring revenue" value={money(totalMrr(clients))} sub="across all clients" />
        <StatCard label="Active clients" value={String(active)} sub={`${clients.length} total`} />
        <StatCard label="Past due" value={String(pastDue)} sub="needs attention" />
        <StatCard label="Seats in use" value={String(clients.reduce((s, c) => s + c.seatsUsed, 0))} sub="all accounts" />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-3">
          <div><h3 className="font-semibold text-ink">Clients</h3><p className="text-xs text-ink-muted">Manage every account from one place.</p></div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"><I.plus className="h-4 w-4" /> Add client</button>
        </div>
        <div className="scroll-soft overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-line bg-slate-50 text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-5 py-2.5 font-semibold">Client</th>
                <th className="px-5 py-2.5 font-semibold">Plan</th>
                <th className="px-5 py-2.5 font-semibold">MRR</th>
                <th className="px-5 py-2.5 font-semibold">Seats</th>
                <th className="px-5 py-2.5 font-semibold">Joined</th>
                <th className="px-5 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {clients.map((c) => (
                <tr key={c.id} onClick={() => onOpen(c)} className="cursor-pointer hover:bg-brand-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{c.company.slice(0, 2).toUpperCase()}</span>
                      <span><span className="font-medium text-ink">{c.company}</span><span className="block text-xs text-ink-muted">{c.contactEmail}</span></span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink">{PLANS[c.plan].name}</td>
                  <td className="px-5 py-3 font-medium text-ink">{money(mrr(c))}</td>
                  <td className="px-5 py-3 text-ink-muted">{c.seatsUsed}/{PLANS[c.plan].seats}</td>
                  <td className="px-5 py-3 text-ink-muted">{shortDate(c.joinedAt)}</td>
                  <td className="px-5 py-3">{statusBadge(c.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && <AddClientModal onClose={() => setShowModal(false)} onAdd={(c) => { onAdd(c); setShowModal(false) }} />}
    </div>
  )
}

function AddClientModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Client) => void }) {
  const [company, setCompany] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [plan, setPlan] = useState<PlanId>('growth')
  const valid = company.trim() && contactEmail.trim()
  function submit(e: any) {
    e.preventDefault()
    const c: Client = {
      id: 'cl_' + Math.abs(company.length * 7919 + contactEmail.length),
      company, contactName: contactName || 'New contact', contactEmail,
      plan, status: 'trialing', seatsUsed: 1, joinedAt: '2026-06-23',
      usage: CLIENTS[2].usage, invoices: [], activity: CLIENTS[2].activity.slice(0, 2),
      payment: { brand: 'Visa', last4: '0000', expMonth: 1, expYear: 2028, name: contactName || company },
      workOrdersThisMonth: 0, workOrdersLastMonth: 0, storageGb: 0, storageCapGb: PLANS[plan].seats * 3,
    }
    onAdd(c)
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-surface p-6 shadow-pop animate-fadeUp" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-ink">Add a client</h3>
        <p className="text-xs text-ink-muted">They’ll get a scoped login and start on a trial.</p>
        <form className="mt-4 space-y-3" onSubmit={submit}>
          <label className="block"><span className="text-sm font-medium text-ink">Company *</span>
            <input value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-100" placeholder="Acme Services" /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-sm font-medium text-ink">Contact</span>
              <input value={contactName} onChange={(e) => setContactName(e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-100" placeholder="Jane Doe" /></label>
            <label className="block"><span className="text-sm font-medium text-ink">Email *</span>
              <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type="email" className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-100" placeholder="jane@acme.com" /></label>
          </div>
          <div><span className="text-sm font-medium text-ink">Plan</span>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {(Object.keys(PLANS) as PlanId[]).map((p) => (
                <button type="button" key={p} onClick={() => setPlan(p)}
                  className={`rounded-lg border px-2 py-2 text-center text-sm transition ${plan === p ? 'border-brand bg-brand-50 text-brand-700 font-semibold' : 'border-line text-ink-muted hover:bg-slate-50'}`}>
                  {PLANS[p].name}<span className="block text-[11px]">{money(PLANS[p].priceMonthly)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={!valid} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-40">Create client</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ───────────────────────────── app shell ─────────────────────────────
type Session = { role: 'client'; client: Client } | { role: 'admin' } | null

export default function App() {
  const [session, setSession] = useState<Session>(null)
  const [view, setView] = useState<View>('overview')
  const [clients, setClients] = useState<Client[]>(CLIENTS)
  const [activeClient, setActiveClient] = useState<Client>(CLIENTS[0])

  if (!session) {
    return <Login onClient={(c) => { setSession({ role: 'client', client: c }); setActiveClient(c); setView('overview') }}
      onAdmin={() => { setSession({ role: 'admin' }); setView('admin') }} />
  }

  const isAdmin = session.role === 'admin'
  const c = isAdmin ? activeClient : session.client

  const nav: { id: View; label: string; icon: any; adminOnly?: boolean; clientOnly?: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: <I.grid />, clientOnly: true },
    { id: 'activity', label: 'Activity', icon: <I.activity />, clientOnly: true },
    { id: 'billing', label: 'Billing', icon: <I.card />, clientOnly: true },
    { id: 'settings', label: 'Settings', icon: <I.gear />, clientOnly: true },
    { id: 'admin', label: 'All clients', icon: <I.users />, adminOnly: true },
  ]
  const visibleNav = nav.filter((n) => (isAdmin ? n.adminOnly || n.id === 'billing' || n.id === 'activity' || n.id === 'overview' : n.clientOnly))

  const title =
    view === 'admin'
      ? 'Admin · All clients'
      : ({ overview: 'Overview', activity: 'Activity', billing: 'Billing', settings: 'Settings', admin: 'Admin' } as Record<View, string>)[view]

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto flex max-w-content">
        {/* sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface p-4 md:flex">
          <div className="flex items-center gap-2 px-2 py-2 font-bold text-lg">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white"><I.grid className="h-5 w-5" /></span>
            Meridian
          </div>
          <nav className="mt-6 space-y-1">
            {visibleNav.map((n) => <NavItem key={n.id} icon={n.icon} label={n.label} active={view === n.id} onClick={() => setView(n.id)} />)}
          </nav>
          {isAdmin && (
            <div className="mt-6 rounded-lg border border-line bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Viewing as</p>
              <select value={activeClient.id} onChange={(e) => setActiveClient(clients.find((x) => x.id === e.target.value) || clients[0])}
                className="mt-1.5 w-full rounded-md border border-line bg-white px-2 py-1.5 text-sm">
                {clients.map((x) => <option key={x.id} value={x.id}>{x.company}</option>)}
              </select>
              <p className="mt-1.5 text-[11px] text-ink-soft">Impersonate a client’s scoped view.</p>
            </div>
          )}
          <div className="mt-auto">
            <div className="flex items-center gap-2 rounded-lg p-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {isAdmin ? 'JA' : c.contactName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{isAdmin ? ADMIN_USER.name : c.contactName}</span>
                <span className="block truncate text-xs text-ink-muted">{isAdmin ? ADMIN_USER.role : c.company}</span></span>
            </div>
            <button onClick={() => { setSession(null); setView('overview') }} className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-slate-100 hover:text-ink">
              <I.logout className="h-5 w-5" /> Sign out
            </button>
          </div>
        </aside>

        {/* main */}
        <main className="min-w-0 flex-1">
          {/* topbar */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface/80 px-5 py-3.5 backdrop-blur">
            <div>
              <h1 className="text-lg font-bold tracking-tight">{title}</h1>
              <p className="text-xs text-ink-muted">{isAdmin ? `Signed in as ${ADMIN_USER.email}` : `${c.company} · ${c.contactEmail}`}</p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin ? <Badge tone="brand"><I.shield className="h-3.5 w-3.5" /> Admin</Badge> : statusBadge(c.status)}
              <button onClick={() => { setSession(null); setView('overview') }} className="md:hidden rounded-lg border border-line p-2 text-ink-muted"><I.logout className="h-4 w-4" /></button>
            </div>
          </header>

          {/* mobile nav */}
          <div className="scroll-soft flex gap-1 overflow-x-auto border-b border-line bg-surface px-3 py-2 md:hidden">
            {visibleNav.map((n) => (
              <button key={n.id} onClick={() => setView(n.id)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ${view === n.id ? 'bg-brand-50 text-brand-700' : 'text-ink-muted'}`}>{n.label}</button>
            ))}
          </div>

          <div className="p-5">
            {view === 'overview' && <Overview c={c} />}
            {view === 'activity' && <Activity c={c} />}
            {view === 'billing' && <Billing c={c} />}
            {view === 'settings' && <Settings c={c} />}
            {view === 'admin' && <Admin clients={clients} onAdd={(nc) => setClients([nc as Client, ...clients])} onOpen={(oc) => { setActiveClient(oc); setView('overview') }} />}
          </div>
        </main>
      </div>
    </div>
  )
}
