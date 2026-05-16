import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import { AlertTriangle, ArrowUpRight, Bell, Boxes, CalendarClock, CheckCircle2, Clock, DollarSign, LogOut, Mail, MapPin, PackageCheck, ShieldCheck, Truck, User, Users } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import './index.css';
import { apiRequest } from './lib/api';
import { navItems } from './data/nav';

type UserInfo = { name: string; email: string; role: string };
type DashboardData = any;

const socket = io('http://localhost:5000', { autoConnect: false });

function Login({ onLogin }: { onLogin: (user: UserInfo, token: string) => void }) {
  const [email, setEmail] = useState('admin@logiflow.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiRequest<{ token: string; user: UserInfo }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('logiflow_token', res.token);
      localStorage.setItem('logiflow_user', JSON.stringify(res.user));
      onLogin(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-orange-500 p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-white">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
            <Truck className="h-5 w-5 text-orange-200" />
            <span className="text-sm font-semibold">Logistics Operations Platform</span>
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">LogiFlow Command Center</h1>
          <p className="mt-5 max-w-2xl text-lg text-blue-50">Control shipments, fleet, drivers, warehouses, customer support, billing, and delivery performance from one modern logistics dashboard.</p>
          <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              ['982', 'Active Shipments'],
              ['94%', 'On-time Delivery'],
              ['128', 'Fleet Assets']
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <div className="text-3xl font-black">{value}</div>
                <div className="mt-1 text-sm text-blue-50">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="rounded-3xl bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg">
              <ShieldCheck className="h-9 w-9" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to access the logistics control room.</p>
          </div>

          <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
          <div className="input-group mb-5">
            <Mail className="h-5 w-5 shrink-0 text-blue-600" />
            <input className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="admin@logiflow.ai" />
          </div>

          <label className="mb-2 block text-sm font-bold text-slate-700">Password</label>
          <div className="input-group mb-5">
            <User className="h-5 w-5 shrink-0 text-orange-500" />
            <input className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password123" />
          </div>

          {error && <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-bold text-slate-800">Demo accounts</p>
            <p>Admin: admin@logiflow.ai</p>
            <p>Fleet Manager: fleet@logiflow.ai</p>
            <p>Driver: driver@logiflow.ai</p>
            <p>Password: password123</p>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, tone }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-black text-slate-900">{value}</h3>
        </div>
        <div className={`rounded-2xl p-3 ${tone || 'bg-blue-50 text-blue-700'}`}><Icon className="h-6 w-6" /></div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-600"><ArrowUpRight className="h-4 w-4" /> {trend}</div>
    </div>
  );
}

function Dashboard({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active Shipments" value={data.kpis.activeShipments} icon={PackageCheck} trend="12% higher than last week" />
        <StatCard title="Fleet Utilization" value={data.kpis.fleetUtilization} icon={Truck} trend="8 vehicles added today" tone="bg-orange-50 text-orange-600" />
        <StatCard title="On-time Delivery" value={data.kpis.onTimeDelivery} icon={CheckCircle2} trend="3.4% improvement" tone="bg-emerald-50 text-emerald-600" />
        <StatCard title="Monthly Revenue" value={data.kpis.revenue} icon={DollarSign} trend="18% growth this month" tone="bg-cyan-50 text-cyan-600" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div><h3 className="text-xl font-black">Shipment Volume</h3><p className="text-sm text-slate-500">Daily order and delivery flow</p></div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.shipmentTrend}>
              <defs><linearGradient id="ship" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Area type="monotone" dataKey="shipments" stroke="#2563eb" fill="url(#ship)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-black">Delivery Status</h3>
          <p className="mb-4 text-sm text-slate-500">Current shipment distribution</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.deliveryStatus} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={4}>
                {['#2563eb', '#f97316', '#14b8a6', '#ef4444'].map((c, i) => <Cell key={c} fill={c} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {data.deliveryStatus.map((s: any) => <div key={s.name} className="rounded-xl bg-slate-50 p-3"><b>{s.name}</b><br/><span className="text-slate-500">{s.value} shipments</span></div>)}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-xl font-black">Warehouse Capacity</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.warehouses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="capacity" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-black">Fleet Performance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.fleetPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="utilization" stroke="#2563eb" strokeWidth={3} />
              <Line type="monotone" dataKey="maintenance" stroke="#f97316" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function DataTable({ title, subtitle, rows, columns }: any) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 p-6">
        <h3 className="text-xl font-black">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>{columns.map((c: string) => <th key={c} className="px-6 py-4 font-black">{c}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row: any, idx: number) => (
              <tr key={idx} className="hover:bg-slate-50">
                {columns.map((c: string) => <td key={c} className="px-6 py-4 font-semibold text-slate-700">{row[c.toLowerCase().replaceAll(' ', '')]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GenericPage({ active, data }: { active: string; data: DashboardData }) {
  const map: any = {
    shipments: { title: 'Shipment Management', subtitle: 'Track customer orders, delivery progress, and dispatch status.', rows: data.shipments, columns: ['Tracking Id', 'Customer', 'Route', 'Status', 'ETA'] },
    fleet: { title: 'Fleet Overview', subtitle: 'Monitor trucks, vans, condition, and current assignment.', rows: data.fleet, columns: ['Vehicle', 'Driver', 'Location', 'Status', 'Load'] },
    drivers: { title: 'Driver Management', subtitle: 'Manage driver availability, route assignment, and performance.', rows: data.drivers, columns: ['Name', 'Phone', 'Route', 'Status', 'Rating'] },
    warehouses: { title: 'Warehouse Operations', subtitle: 'Capacity, inbound/outbound movement, and regional hubs.', rows: data.warehousesTable, columns: ['Name', 'Region', 'Capacity', 'Inbound', 'Outbound'] },
    routes: { title: 'Route Planning', subtitle: 'Optimize delivery routes and monitor route performance.', rows: data.routes, columns: ['Route', 'Distance', 'Stops', 'Status', 'Cost'] },
    tracking: { title: 'Live Tracking', subtitle: 'Current movement of active logistics assets.', rows: data.tracking, columns: ['Vehicle', 'Location', 'Speed', 'Shipment', 'Updated'] },
    invoices: { title: 'Invoices', subtitle: 'Billing status, payment collection, and customer invoice tracking.', rows: data.invoices, columns: ['Invoice', 'Customer', 'Amount', 'Status', 'Due'] },
    support: { title: 'Customer Support', subtitle: 'Delivery issues, claims, and customer service tickets.', rows: data.support, columns: ['Ticket', 'Customer', 'Issue', 'Priority', 'Status'] },
    inventory: { title: 'Inventory Flow', subtitle: 'Warehouse item movement and stock transfer overview.', rows: data.inventory, columns: ['Item', 'Warehouse', 'Quantity', 'Movement', 'Status'] },
    analytics: { title: 'Analytics Summary', subtitle: 'Business intelligence for logistics performance.', rows: data.analytics, columns: ['Metric', 'Current', 'Target', 'Trend', 'Status'] }
  };
  const page = map[active];
  return <DataTable {...page} />;
}

function App() {
  const savedUser = localStorage.getItem('logiflow_user');
  const [user, setUser] = useState<UserInfo | null>(savedUser ? JSON.parse(savedUser) : null);
  const [active, setActive] = useState('dashboard');
  const [data, setData] = useState<DashboardData | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    apiRequest<DashboardData>('/dashboard').then(setData).catch(console.error);
    socket.connect();
    socket.on('operation-alert', (msg) => setAlerts((prev) => [msg, ...prev].slice(0, 4)));
    return () => { socket.off('operation-alert'); socket.disconnect(); };
  }, [user]);

  const currentTitle = useMemo(() => navItems.find(n => n.id === active)?.label || 'Dashboard', [active]);

  if (!user) return <Login onLogin={(u) => setUser(u)} />;
  if (!data) return <div className="flex min-h-screen items-center justify-center text-lg font-bold text-slate-700">Loading command center...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col bg-blue-950 text-white lg:flex">
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-500 p-3"><Truck className="h-7 w-7" /></div>
            <div><h1 className="text-xl font-black">LogiFlow</h1><p className="text-xs text-blue-200">Command Center</p></div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;
            return (
              <button key={item.id} onClick={() => setActive(item.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${selected ? 'bg-white text-blue-950 shadow-lg' : 'text-blue-100 hover:bg-white/10'}`}>
                <Icon className={`h-5 w-5 ${selected ? 'text-orange-500' : 'text-blue-200'}`} /> {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <button onClick={() => { localStorage.clear(); setUser(null); }} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-blue-100 hover:bg-white/10"><LogOut className="h-5 w-5" /> Logout</button>
        </div>
      </aside>

      <main className="w-full lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{currentTitle}</h2>
              <p className="text-sm text-slate-500">Welcome, {user.name} — {user.role}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700 md:block"><CalendarClock className="mr-2 inline h-4 w-4" />Today’s Dispatch: 284</div>
              <div className="relative rounded-2xl bg-blue-50 p-3 text-blue-700"><Bell className="h-5 w-5" />{alerts.length > 0 && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-orange-500" />}</div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {alerts.length > 0 && <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{alerts.map((a, i) => <div key={i} className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-bold text-orange-800"><AlertTriangle className="mr-2 inline h-4 w-4" />{a}</div>)}</div>}
          {active === 'dashboard' ? <Dashboard data={data} /> : <GenericPage active={active} data={data} />}
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
