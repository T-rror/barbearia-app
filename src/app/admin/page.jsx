"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Sparkles,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../lib/api";
import { fetchAgendamentos, createAgendamentoAdmin, cancelarAgendamento } from "../../lib/appointment";
import { confirmPayment, createPayment, fetchAllPayments } from "../../lib/payment";
import { createExpense, fetchExpenses } from "../../lib/finance";

const navItems = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "financeiro", label: "Financeiro", icon: Wallet },
];

const services = ["corte", "corte-americano", "corte-simples", "modelado", "tesoura", "barba", "barba-modelada", "sobrancelha", "pretinho", "reflexo", "nevou"];
const expenseCategories = ["Aluguel", "Contas", "Produtos", "Manutenção", "Transporte", "Outros"];
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateLabel = (value, options = { day: "2-digit", month: "short" }) => {
  if (!value) return "—";
  const date = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR", options);
};
const localDateKey = (value = new Date()) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const appointmentDateKey = (value) => typeof value === "string" ? value.slice(0, 10) : localDateKey(value);
const monthKey = (value = new Date()) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
const titleCase = (value = "") => value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function Metric({ icon: Icon, label, value, note, accent = false }) {
  return (
    <article className={`rounded-2xl border p-5 ${accent ? "border-[#2f83c9]/35 bg-[#2f83c9]/[0.09]" : "border-white/[0.07] bg-[#151d27]"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#aaa49c]">{label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-[#f5f1ea]">{value}</p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${accent ? "bg-[#2f83c9] text-[#09131e]" : "bg-white/[0.06] text-[#2f83c9]"}`}>
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-4 text-xs text-[#77726c]">{note}</p>
    </article>
  );
}

function AppointmentRow({ appointment, onCancel, onReceive, compact = false }) {
  const pending = appointment.status === "PENDENTE";
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/[0.06] py-4 last:border-0 sm:grid-cols-[1.2fr_1fr_0.8fr_0.7fr_auto]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#102d48] text-sm font-semibold text-[#83b9ed]">
          {(appointment.name || "C").slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#eee9e2]">{appointment.name || "Cliente"}</p>
          <p className="truncate text-xs text-[#89837b] sm:hidden">{titleCase(appointment.service)}</p>
          <p className="hidden truncate text-xs text-[#89837b] sm:block">{appointment.phone || "—"}</p>
        </div>
      </div>
      <p className="hidden text-sm text-[#c7c0b7] sm:block">{titleCase(appointment.service)}</p>
      <p className="hidden text-sm text-[#c7c0b7] sm:block">{dateLabel(appointment.date, { day: "2-digit", month: "short", year: "numeric" })}</p>
      <div className="text-right sm:text-left">
        <p className="text-sm font-medium text-[#eee9e2]">{appointment.time || "—"}</p>
        <p className={`mt-1 text-[11px] ${pending ? "text-[#83b9ed]" : appointment.status === "CONCLUIDO" ? "text-[#89c7a0]" : "text-[#8b8580]"}`}>
          {pending ? "Pendente" : appointment.status === "CONCLUIDO" ? "Concluído" : "Cancelado"}
        </p>
      </div>
      {pending ? (
        <div className="hidden items-center gap-2 sm:flex"><button onClick={() => onReceive(appointment)} className="rounded-lg bg-[#2f83c9]/10 px-3 py-2 text-xs font-medium text-[#83b9ed] transition hover:bg-[#2f83c9]/20">Receber</button><button onClick={() => onCancel(appointment.id)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[#b7b0a8] transition hover:border-red-400/40 hover:text-red-300">Cancelar</button></div>
      ) : <span className="hidden sm:block" />}
      {compact && pending && <div className="flex items-center gap-1 sm:hidden"><button aria-label="Receber pagamento" onClick={() => onReceive(appointment)} className="rounded-lg p-2 text-[#83b9ed] hover:bg-[#2f83c9]/10"><Check size={16} /></button><button aria-label="Cancelar agendamento" onClick={() => onCancel(appointment.id)} className="rounded-lg p-2 text-[#847e76] hover:bg-white/5 hover:text-red-300"><X size={16} /></button></div>}
    </div>
  );
}

function EmptyState({ title, description }) {
  return <div className="grid min-h-48 place-items-center px-5 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.05] text-[#f0c84b]"><CalendarDays size={20} /></span><p className="mt-4 text-sm font-medium text-[#ded8d0]">{title}</p><p className="mt-1 text-sm text-[#827c75]">{description}</p></div></div>;
}

export default function AdminPage() {
  const [activePage, setActivePage] = useState("overview");
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("");
  const [paymentTarget, setPaymentTarget] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", service: "corte", date: localDateKey(), time: "" });
  const [expenseForm, setExpenseForm] = useState({ description: "", category: "Produtos", amount: "", date: localDateKey() });

  const refresh = useCallback(async () => {
    setLoadError("");
    try {
      const [appointmentData, paymentData, expenseData] = await Promise.all([fetchAgendamentos(), fetchAllPayments(), fetchExpenses(monthKey())]);
      setAppointments([
        ...(appointmentData.pendentes || []),
        ...(appointmentData.concluidos || []),
        ...(appointmentData.cancelados || []),
      ].sort((a, b) => new Date(a.date) - new Date(b.date) || (a.time || "").localeCompare(b.time || "")));
      setPayments(Array.isArray(paymentData) ? paymentData : paymentData.payments || []);
      setExpenses(Array.isArray(expenseData) ? expenseData : expenseData.expenses || []);
    } catch (error) {
      console.error("Falha ao carregar painel:", error);
      setLoadError(error.message || "Não foi possível carregar os dados do painel.");
    }
  }, []);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/signin"; return; }
    api.get("/auth/me").then(async ({ data }) => {
      if (!active) return;
      if (!["ADMIN", "BARBEIRO"].includes(data.role)) {
        localStorage.removeItem("token");
        window.location.href = "/signin";
        return;
      }
      setUser(data);
      await refresh();
    }).catch((error) => {
      console.error("Falha ao validar a sessão administrativa:", error);
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refresh]);

  const now = new Date();
  const today = localDateKey(now);
  const currentMonth = monthKey(now);
  const pending = appointments.filter((item) => item.status === "PENDENTE");
  const nextPending = pending.filter((item) => {
    const day = appointmentDateKey(item.date);
    if (day > today) return true;
    if (day < today) return false;
    return (item.time || "00:00") >= `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });
  const todayAppointments = appointments.filter((item) => appointmentDateKey(item.date) === today && item.status !== "CANCELADO").sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  const confirmedPayments = payments.filter((item) => item.status === "PAGO");
  const monthPayments = confirmedPayments.filter((item) => (item.confirmedAt || item.createdAt || "").slice(0, 7) === currentMonth);
  const monthExpenses = expenses.filter((item) => String(item.date || "").slice(0, 7) === currentMonth);
  const monthlyRevenue = monthPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const monthlyExpenseTotal = monthExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const monthlyBalance = monthlyRevenue - monthlyExpenseTotal;
  const chartData = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - 6 + index);
    const key = localDateKey(day);
    const total = confirmedPayments.filter((payment) => localDateKey(payment.confirmedAt || payment.createdAt) === key).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    return { day: day.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""), total };
  }), [payments]);
  const filteredAppointments = appointments.filter((item) => {
    const matches = `${item.name || ""} ${item.phone || ""} ${item.service || ""}`.toLowerCase().includes(search.toLowerCase());
    return matches && item.status !== "CANCELADO";
  });
  const recentPayments = [...monthPayments].sort((a, b) => new Date(b.confirmedAt || b.createdAt) - new Date(a.confirmedAt || a.createdAt)).slice(0, 6);

  const handleCancel = async (id) => {
    try { await cancelarAgendamento(id); await refresh(); setNotice("Agendamento cancelado."); }
    catch (error) { setNotice(error.message || "Não foi possível cancelar o agendamento."); }
  };
  const handleReceive = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !paymentTarget) return;
    setPaying(true);
    try {
      const payment = await createPayment({ appointmentId: paymentTarget.id, method: paymentMethod }, token);
      await confirmPayment(payment.id, token);
      setPaymentTarget(null);
      await refresh();
      setNotice("Pagamento confirmado e atendimento concluído.");
    } catch (error) { setNotice(error.message || "Não foi possível confirmar o pagamento."); }
    finally { setPaying(false); }
  };
  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createAgendamentoAdmin({ ...form, time: form.time });
      setShowNew(false);
      setForm({ name: "", phone: "", service: "corte", date: localDateKey(), time: "" });
      await refresh();
      setNotice("Agendamento adicionado à agenda.");
    } catch (error) { setNotice(error.message || "Não foi possível criar o agendamento."); }
    finally { setSaving(false); }
  };
  const handleCreateExpense = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createExpense({ ...expenseForm, amount: Number(expenseForm.amount) });
      setShowExpense(false);
      setExpenseForm({ description: "", category: "Produtos", amount: "", date: localDateKey() });
      await refresh();
      setNotice("Despesa registrada no financeiro.");
    } catch (error) { setNotice(error.message || "Não foi possível registrar a despesa."); }
    finally { setSaving(false); }
  };
  const logout = () => { localStorage.removeItem("token"); window.location.href = "/signin"; };

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#0a0e14] text-[#c9c1b7]"><div className="flex items-center gap-3"><span className="h-2 w-2 animate-pulse rounded-full bg-[#2f83c9]" />Carregando seu painel...</div></main>;

  const displayName = user?.name || (user?.role === "BARBEIRO" ? "Barbeiro" : "Administrador");
  return (
    <main className="min-h-screen bg-[#0a0e14] text-[#f1ede7]">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-white/[0.07] bg-[#101721] px-5 py-6 transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-2">
          <img src="/imagens/logo.png" alt="Barbearia da Neguinha" className="h-11 w-11 rounded-full bg-black object-contain p-1" />
          <div><p className="font-[family-name:var(--font-bebas)] text-xl tracking-wide text-white">NEGUINHA</p><p className="-mt-1 text-[10px] uppercase tracking-[0.22em] text-[#f0c84b]">Barbearia</p></div>
          <button className="ml-auto text-[#858078] lg:hidden" onClick={() => setMobileNav(false)} aria-label="Fechar menu"><X size={18} /></button>
        </div>
        <div className="mt-11 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#625e59]">Menu principal</div>
        <nav className="mt-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setActivePage(id); setMobileNav(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${activePage === id ? "bg-[#2f83c9]/10 text-[#83b9ed]" : "text-[#979188] hover:bg-white/[0.04] hover:text-white"}`}><Icon size={18} /><span>{label}</span>{id === "agenda" && <span className="ml-auto rounded-full bg-white/[0.07] px-2 py-0.5 text-[10px]">{pending.length}</span>}</button>)}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
          <div className="flex items-center gap-2 text-[#f0c84b]"><Sparkles size={15} /><span className="text-xs font-medium">Seu negócio, em dia</span></div>
          <p className="mt-2 text-xs leading-5 text-[#827c74]">Agenda e entradas do mês reunidas em um só lugar.</p>
        </div>
        <button onClick={logout} className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#969087] hover:bg-white/[0.04] hover:text-red-300"><LogOut size={17} />Sair da conta</button>
      </aside>
      {mobileNav && <button className="fixed inset-0 z-30 bg-black/65 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Fechar menu" />}

      <div className="min-h-screen lg:pl-[248px]">
        <header className="flex h-[76px] items-center justify-between border-b border-white/[0.07] px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3"><button className="text-[#c8c0b5] lg:hidden" onClick={() => setMobileNav(true)} aria-label="Abrir menu"><Menu size={21} /></button><div><p className="text-xs text-[#888279]">{dateLabel(now, { weekday: "long", day: "numeric", month: "long" })}</p><p className="hidden text-[11px] text-[#615c56] sm:block">Barbearia da Neguinha <span className="mx-1 text-[#f0c84b]">/</span> Painel</p></div></div>
          <div className="flex items-center gap-3"><button onClick={() => activePage === "financeiro" ? setShowExpense(true) : setShowNew(true)} className="flex items-center gap-2 rounded-xl bg-[#2f83c9] px-3.5 py-2.5 text-xs font-semibold text-[#09131e] transition hover:bg-[#64a9e4] sm:px-4 sm:text-sm"><Plus size={16} /><span className="hidden sm:inline">{activePage === "financeiro" ? "Nova despesa" : "Novo agendamento"}</span><span className="sm:hidden">Novo</span></button><span className="hidden h-7 w-px bg-white/10 sm:block" /><div className="grid h-9 w-9 place-items-center rounded-full border border-[#2f83c9]/30 bg-[#102d48] text-sm font-semibold text-[#83b9ed]">{displayName.slice(0, 1).toUpperCase()}</div><div className="hidden sm:block"><p className="text-xs font-medium text-[#eee9e2]">{displayName}</p><p className="text-[10px] text-[#837d74]">{user?.role === "BARBEIRO" ? "Barbeiro" : "Administrador"}</p></div><ChevronDown size={14} className="hidden text-[#777168] sm:block" /></div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          {loadError && <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.07] p-4 text-sm text-red-200 sm:flex-row sm:items-center sm:justify-between"><span>{loadError}</span><button onClick={refresh} className="font-semibold underline underline-offset-4">Tentar novamente</button></div>}
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f0c84b]">{activePage === "overview" ? "Seu negócio hoje" : activePage === "agenda" ? "Organização" : "Movimento do caixa"}</p><h1 className="mt-2 font-[family-name:var(--font-bebas)] text-4xl tracking-wide text-[#f4f0e9] sm:text-5xl">{activePage === "overview" ? "Visão geral" : activePage === "agenda" ? "Agenda" : "Financeiro"}</h1><p className="mt-1 text-sm text-[#89837a]">{activePage === "overview" ? "Um resumo claro do que está acontecendo na barbearia." : activePage === "agenda" ? "Acompanhe os próximos horários e cuide dos atendimentos." : "Entradas confirmadas e pagamentos registrados neste mês."}</p></div>{activePage === "agenda" && <div className="relative w-full sm:w-64"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777169]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar cliente ou serviço" className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#151d27] pl-9 pr-3 text-sm text-[#eee9e2] outline-none placeholder:text-[#69645d] focus:border-[#2f83c9]/50" /></div>}</div>

          {activePage === "overview" && <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={DollarSign} label="Entradas no mês" value={currency.format(monthlyRevenue)} note="Pagamentos confirmados neste mês" accent />
            <Metric icon={CalendarDays} label="Atendimentos hoje" value={todayAppointments.length} note={`${todayAppointments.filter((item) => item.status === "PENDENTE").length} aguardando atendimento`} />
            <Metric icon={Clock3} label="Na fila" value={pending.length} note="Agendamentos aguardando conclusão" />
            <Metric icon={Users} label="Pagamentos recebidos" value={monthPayments.length} note="Transações confirmadas neste mês" />
          </section>}

          {activePage === "overview" && <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
            <section className="rounded-2xl border border-white/[0.07] bg-[#151d27] p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><h2 className="text-sm font-semibold text-[#eee9e2]">Entradas recentes</h2><p className="mt-1 text-xs text-[#817b73]">Pagamentos confirmados nos últimos 7 dias</p></div><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#2f83c9]/10 text-[#83b9ed]"><Wallet size={17} /></span></div><div className="mt-6 h-[220px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f83c9" stopOpacity={0.28} /><stop offset="95%" stopColor="#2f83c9" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#817b73", fontSize: 11 }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#817b73", fontSize: 10 }} tickFormatter={(value) => value === 0 ? "R$ 0" : `R$${value}`} /><Tooltip formatter={(value) => [currency.format(Number(value)), "Entradas"]} contentStyle={{ background: "#1d2733", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, color: "#f1ede7", fontSize: 12 }} labelStyle={{ color: "#aaa49c" }} /><Area type="monotone" dataKey="total" stroke="#2f83c9" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{ r: 5, fill: "#f0c84b", stroke: "#09131e", strokeWidth: 2 }} /></AreaChart></ResponsiveContainer></div><div className="mt-1 flex items-center gap-2 text-xs text-[#807a72]"><span className="h-2 w-2 rounded-full bg-[#2f83c9]" />Valor recebido por dia</div></section>
            <section className="rounded-2xl border border-white/[0.07] bg-[#151d27] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#eee9e2]">Agenda de hoje</h2><p className="mt-1 text-xs text-[#817b73]">{dateLabel(now, { day: "numeric", month: "long" })}</p></div><button onClick={() => setActivePage("agenda")} className="text-xs font-medium text-[#83b9ed] hover:text-[#b5d7f5]">Ver agenda <ArrowUpRight size={13} className="ml-1 inline" /></button></div><div className="mt-3">{todayAppointments.length ? todayAppointments.slice(0, 5).map((item) => <div key={item.id} className="flex items-center gap-3 border-b border-white/[0.06] py-3 last:border-0"><div className="w-12 shrink-0 text-sm font-semibold text-[#ef9a61]">{item.time}</div><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#102d48] text-xs font-semibold text-[#83b9ed]">{(item.name || "C").slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm text-[#e5dfd7]">{item.name}</p><p className="truncate text-xs text-[#817b73]">{titleCase(item.service)}</p></div><span className={`h-2 w-2 shrink-0 rounded-full ${item.status === "PENDENTE" ? "bg-[#83b9ed]" : "bg-emerald-400"}`} /></div>) : <EmptyState title="Agenda livre por enquanto" description="Os próximos agendamentos vão aparecer aqui." />}</div></section>
            <section className="rounded-2xl border border-white/[0.07] bg-[#151d27] p-5 sm:p-6 xl:col-span-2"><div className="mb-2 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#eee9e2]">Próximos atendimentos</h2><p className="mt-1 text-xs text-[#817b73]">Agendamentos pendentes mais próximos</p></div><button onClick={() => setActivePage("agenda")} className="text-xs font-medium text-[#83b9ed] hover:text-[#b5d7f5]">Abrir agenda <ArrowUpRight size={13} className="ml-1 inline" /></button></div>{nextPending.length ? nextPending.slice(0, 5).map((item) => <AppointmentRow key={item.id} appointment={item} onCancel={handleCancel} onReceive={(appointment) => setPaymentTarget(appointment)} compact />) : <EmptyState title="Tudo em dia" description="Não há atendimentos pendentes nos próximos horários." />}</section>
          </div>}

          {activePage === "agenda" && <section className="rounded-2xl border border-white/[0.07] bg-[#151d27] px-5 py-2 sm:px-6"><div className="grid grid-cols-[1fr_auto] border-b border-white/[0.06] py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6d6860] sm:grid-cols-[1.2fr_1fr_0.8fr_0.7fr_auto]"><span>Cliente</span><span className="hidden sm:block">Serviço</span><span className="hidden sm:block">Data</span><span>Horário</span><span className="hidden sm:block">Ação</span></div>{filteredAppointments.length ? filteredAppointments.map((item) => <AppointmentRow key={item.id} appointment={item} onCancel={handleCancel} onReceive={(appointment) => setPaymentTarget(appointment)} compact />) : <EmptyState title="Nenhum agendamento encontrado" description="Ajuste a busca ou adicione um novo horário." />}</section>}

          {activePage === "financeiro" && <><section className="grid gap-3 sm:grid-cols-3"><Metric icon={ArrowDownLeft} label="Entradas confirmadas" value={currency.format(monthlyRevenue)} note={`${monthPayments.length} pagamentos no mês`} accent /><Metric icon={ArrowUpRight} label="Despesas lançadas" value={currency.format(monthlyExpenseTotal)} note={`${monthExpenses.length} lançamentos no mês`} /><Metric icon={Wallet} label="Saldo do mês" value={currency.format(monthlyBalance)} note="Entradas menos despesas" /></section><div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]"><section className="rounded-2xl border border-white/[0.07] bg-[#151d27] p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#eee9e2]">Entradas do mês</h2><p className="mt-1 text-xs text-[#817b73]">Pagamentos confirmados · {now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</p></div><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#2f83c9]/10 text-[#83b9ed]"><ArrowDownLeft size={18} /></span></div><div className="mt-6 h-[220px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id="financeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f83c9" stopOpacity={0.25} /><stop offset="100%" stopColor="#2f83c9" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#817b73", fontSize: 11 }} dy={9} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#817b73", fontSize: 10 }} tickFormatter={(value) => `R$${value}`} /><Tooltip formatter={(value) => [currency.format(Number(value)), "Entradas"]} contentStyle={{ background: "#1d2733", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, color: "#f1ede7", fontSize: 12 }} /><Area type="monotone" dataKey="total" stroke="#2f83c9" strokeWidth={2.5} fill="url(#financeFill)" /></AreaChart></ResponsiveContainer></div><div className="mt-2 flex items-center gap-2 text-xs text-[#807a72]"><span className="h-2 w-2 rounded-full bg-[#2f83c9]" />Valor recebido por dia</div></section><section className="rounded-2xl border border-white/[0.07] bg-[#151d27] p-5 sm:p-6"><div><h2 className="text-sm font-semibold text-[#eee9e2]">Movimentações do mês</h2><p className="mt-1 text-xs text-[#817b73]">Entradas e despesas registradas</p></div><div className="mt-3 max-h-[390px] overflow-y-auto">{[...recentPayments.map((payment) => ({ id: payment.id, kind: "income", label: payment.appointment?.name || titleCase(payment.appointment?.service || "Atendimento"), detail: `${(payment.method || "").replace("PIX", "Pix")} · ${dateLabel(payment.confirmedAt || payment.createdAt, { day: "2-digit", month: "short" })}`, amount: Number(payment.amount || 0), date: new Date(payment.confirmedAt || payment.createdAt) })), ...monthExpenses.map((expense) => ({ id: expense.id, kind: "expense", label: expense.description, detail: `${expense.category} · ${dateLabel(appointmentDateKey(expense.date), { day: "2-digit", month: "short" })}`, amount: Number(expense.amount || 0), date: new Date(expense.date) }))].sort((a, b) => b.date - a.date).map((item) => <div key={item.id} className="flex items-center gap-3 border-b border-white/[0.06] py-4 last:border-0"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.kind === "income" ? "bg-emerald-400/[0.09] text-emerald-300" : "bg-red-400/[0.09] text-red-300"}`}>{item.kind === "income" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[#e5dfd7]">{item.label}</p><p className="mt-0.5 text-xs text-[#817b73]">{item.detail}</p></div><p className={`text-sm font-semibold ${item.kind === "income" ? "text-[#d7eadc]" : "text-[#e7b1a8]"}`}>{item.kind === "income" ? "+ " : "− "}{currency.format(item.amount)}</p></div>)}{!recentPayments.length && !monthExpenses.length && <EmptyState title="Sem movimentações neste mês" description="Recebimentos e despesas aparecerão aqui." />}</div></section></div></>}
        </div>
      </div>

      {showNew && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowNew(false); }}><form onSubmit={handleCreate} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#151d27] p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f0c84b]">Agenda</p><h2 className="mt-1 font-[family-name:var(--font-bebas)] text-3xl tracking-wide">Novo agendamento</h2><p className="mt-1 text-xs text-[#89837a]">Adicione um horário reservado pelo balcão.</p></div><button type="button" onClick={() => setShowNew(false)} className="rounded-lg p-2 text-[#858078] hover:bg-white/5" aria-label="Fechar"><X size={18} /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-xs text-[#aaa49c] sm:col-span-2">Nome do cliente<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0a0e14] px-3 text-sm text-white outline-none focus:border-[#2f83c9]/60" placeholder="Ex.: João Silva" /></label><label className="text-xs text-[#aaa49c]">Telefone<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0a0e14] px-3 text-sm text-white outline-none focus:border-[#2f83c9]/60" placeholder="(11) 98765-4321" /></label><label className="text-xs text-[#aaa49c]">Serviço<select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0a0e14] px-3 text-sm text-white outline-none focus:border-[#2f83c9]/60">{services.map((service) => <option key={service} value={service}>{titleCase(service)}</option>)}</select></label><label className="text-xs text-[#aaa49c]">Data<input required type="date" min={localDateKey()} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0a0e14] px-3 text-sm text-white outline-none focus:border-[#2f83c9]/60" /></label><label className="text-xs text-[#aaa49c]">Horário<input required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0a0e14] px-3 text-sm text-white outline-none focus:border-[#2f83c9]/60" /></label></div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setShowNew(false)} className="rounded-xl px-4 py-2.5 text-sm text-[#b2aba2] hover:bg-white/[0.05]">Voltar</button><button disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#2f83c9] px-4 py-2.5 text-sm font-semibold text-[#09131e] hover:bg-[#64a9e4] disabled:opacity-60"><Plus size={15} />{saving ? "Salvando..." : "Adicionar à agenda"}</button></div></form></div>}
      {paymentTarget && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setPaymentTarget(null); }}><form onSubmit={handleReceive} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151d27] p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f0c84b]">Finalizar atendimento</p><h2 className="mt-1 font-[family-name:var(--font-bebas)] text-3xl tracking-wide">Receber pagamento</h2><p className="mt-1 text-xs text-[#89837a]">{paymentTarget.name} · {titleCase(paymentTarget.service)}</p></div><button type="button" onClick={() => setPaymentTarget(null)} className="rounded-lg p-2 text-[#858078] hover:bg-white/5" aria-label="Fechar"><X size={18} /></button></div><label className="mt-6 block text-xs text-[#aaa49c]">Forma de pagamento<select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0a0e14] px-3 text-sm text-white outline-none focus:border-[#2f83c9]/60"><option value="PIX">Pix</option><option value="CARD">Cartão</option><option value="CASH">Dinheiro</option></select></label><p className="mt-3 rounded-xl bg-white/[0.035] p-3 text-xs leading-5 text-[#8e887f]">O valor é calculado pelo preço do serviço configurado na API. Ao confirmar, o pagamento será registrado e o atendimento marcado como concluído.</p><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setPaymentTarget(null)} className="rounded-xl px-4 py-2.5 text-sm text-[#b2aba2] hover:bg-white/[0.05]">Voltar</button><button disabled={paying} className="flex items-center gap-2 rounded-xl bg-[#2f83c9] px-4 py-2.5 text-sm font-semibold text-[#09131e] hover:bg-[#64a9e4] disabled:opacity-60"><Check size={15} />{paying ? "Processando..." : "Confirmar e concluir"}</button></div></form></div>}
      {showExpense && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowExpense(false); }}><form onSubmit={handleCreateExpense} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151d27] p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f0c84b]">Financeiro</p><h2 className="mt-1 font-[family-name:var(--font-bebas)] text-3xl tracking-wide">Nova despesa</h2><p className="mt-1 text-xs text-[#89837a]">Registre uma saída da barbearia.</p></div><button type="button" onClick={() => setShowExpense(false)} className="rounded-lg p-2 text-[#858078] hover:bg-white/5" aria-label="Fechar"><X size={18} /></button></div><div className="mt-6 space-y-4"><label className="block text-xs text-[#aaa49c]">Descrição<input required maxLength={120} value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0a0e14] px-3 text-sm text-white outline-none focus:border-[#2f83c9]/60" placeholder="Ex.: reposição de produtos" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs text-[#aaa49c]">Categoria<select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0a0e14] px-3 text-sm text-white outline-none focus:border-[#2f83c9]/60">{expenseCategories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label><label className="text-xs text-[#aaa49c]">Valor<input required type="number" min="0.01" step="0.01" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0a0e14] px-3 text-sm text-white outline-none focus:border-[#2f83c9]/60" placeholder="0,00" /></label></div><label className="block text-xs text-[#aaa49c]">Data<input required type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0a0e14] px-3 text-sm text-white outline-none focus:border-[#2f83c9]/60" /></label></div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setShowExpense(false)} className="rounded-xl px-4 py-2.5 text-sm text-[#b2aba2] hover:bg-white/[0.05]">Voltar</button><button disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#2f83c9] px-4 py-2.5 text-sm font-semibold text-[#09131e] hover:bg-[#64a9e4] disabled:opacity-60"><Plus size={15} />{saving ? "Salvando..." : "Registrar despesa"}</button></div></form></div>}
      {notice && <div role="status" className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-xl border border-white/10 bg-[#1d2733] px-4 py-3 text-sm text-[#e8e2d9] shadow-xl"><span className="h-2 w-2 rounded-full bg-[#2f83c9]" />{notice}<button onClick={() => setNotice("")} className="ml-1 text-[#817b73] hover:text-white" aria-label="Fechar aviso"><X size={15} /></button></div>}
    </main>
  );
}
