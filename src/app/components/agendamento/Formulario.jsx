"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Scissors, X } from "lucide-react";

export default function Formulario({
  onSubmit,
  register,
  watch,
  setValue,
  handleSubmit,
  errors,
  verificarHorariosDisponiveis,
  horariosDisponiveis,
  consultandoHorarios,
}) {
  const agora = new Date();
  const hoje = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")}`;
  const dataSelecionada = watch("date") || hoje;
  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [mesVisivel, setMesVisivel] = useState(() => new Date(agora.getFullYear(), agora.getMonth(), 1));
  const primeiroDia = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth(), 1).getDay();
  const diasNoMes = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() + 1, 0).getDate();
  const diasCalendario = useMemo(() => [...Array(primeiroDia).fill(null), ...Array.from({ length: diasNoMes }, (_, index) => index + 1)], [primeiroDia, diasNoMes]);
  const dataLegivel = (data) => {
    const [ano, mes, dia] = data.split("-").map(Number);
    return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  };

  const selecionarData = (dia) => {
    const ano = mesVisivel.getFullYear();
    const mes = String(mesVisivel.getMonth() + 1).padStart(2, "0");
    const diaFormatado = String(dia).padStart(2, "0");
    const novaData = `${ano}-${mes}-${diaFormatado}`;
    setValue("date", novaData, { shouldDirty: true, shouldValidate: true });
    setValue("time", "", { shouldDirty: true, shouldValidate: false });
    verificarHorariosDisponiveis(novaData);
    setCalendarioAberto(false);
  };

  const abrirCalendario = () => {
    const [ano, mes] = dataSelecionada.split("-").map(Number);
    setMesVisivel(new Date(ano, mes - 1, 1));
    setCalendarioAberto(true);
  };

  useEffect(() => {
    verificarHorariosDisponiveis(hoje);
  }, []);

  return (
    <section className="relative isolate flex min-h-screen flex-col items-center overflow-hidden bg-[#080b10] px-5 pb-12 text-[#f7f4ed] sm:px-6">
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-cover bg-[58%_center]" style={{ backgroundImage: "url('/imagens/hero-full.png')" }} />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,9,15,0.76)_0%,rgba(5,9,15,0.66)_36%,rgba(5,9,15,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_38%,rgba(18,102,173,0.2),transparent_58%)]" />
      <header className="relative z-10 flex w-full max-w-md items-center justify-center gap-3 py-7">
        <img src="/imagens/logo.png" alt="Logo Barbearia da Neguinha" className="h-12 w-12 rounded-full border border-white/10 object-cover" />
        <div><p className="font-[family-name:var(--font-bebas)] text-xl tracking-[0.12em]">NEGUINHA</p><p className="mt-0.5 text-[9px] uppercase tracking-[0.28em] text-[#83b9ed]">Barbearia</p></div>
      </header>

      <div className="relative z-10 flex w-full max-w-md flex-1 flex-col justify-center pb-8">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f0c84b]">Seu próximo visual</p>
          <h1 className="mt-2 font-[family-name:var(--font-bebas)] text-5xl tracking-wide text-white sm:text-6xl">AGENDAR HORÁRIO</h1>
          <p className="mb-7 mt-1 text-sm text-[#d1d5da]">Escolha o melhor dia e horário para você.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input {...register("date", { required: "A data é obrigatória" })} type="hidden" defaultValue={hoje} />
        <div>
          <label htmlFor="booking-date-display" className="mb-1.5 block text-xs font-medium text-[#c5cbd2]">Data</label>
          <div className="relative flex h-14 items-center rounded-xl border border-white/15 bg-[#101721]/90 transition focus-within:border-[#5ba4e8]/70 focus-within:ring-2 focus-within:ring-[#2f83c9]/30">
            <CalendarDays size={18} aria-hidden="true" className="pointer-events-none absolute left-4 text-[#83b9ed]" />
            <input id="booking-date-display" type="text" readOnly value={dataLegivel(dataSelecionada)} onClick={abrirCalendario} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); abrirCalendario(); } }} aria-haspopup="dialog" aria-label="Selecionar data do agendamento" className="h-full min-w-0 flex-1 cursor-pointer rounded-l-xl bg-transparent pl-11 pr-3 text-sm font-medium text-white outline-none" />
            <button type="button" onClick={abrirCalendario} aria-label="Abrir calendário" className="grid h-full w-12 shrink-0 place-items-center rounded-r-xl text-[#83b9ed] transition hover:bg-white/[0.05]"><CalendarDays size={17} /></button>
          </div>
        </div>
        {errors.date && <p className="text-sm text-red-300">{errors.date.message}</p>}

        {/* Horário */}
        <div className="relative">
          <Clock3 size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#83b9ed]" />
          <select {...register("time", { required: "A hora é obrigatória" })} className="h-14 w-full rounded-xl border border-white/15 bg-[#101721] pl-11 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-[#2f83c9]/50">
            <option value="">{consultandoHorarios ? "Buscando horários..." : "Horários disponíveis"}</option>
            {horariosDisponiveis.map((hora) => <option key={hora} value={hora}>{hora}</option>)}
          </select>
        </div>
        {!consultandoHorarios && horariosDisponiveis.length === 0 && (
          <div className="-mt-2 flex items-center justify-between gap-3 rounded-xl border border-[#f0c84b]/20 bg-[#f0c84b]/[0.06] px-4 py-3">
            <p className="text-xs leading-5 text-[#d8c98f]">Sem horários disponíveis nesse dia.</p>
            <button type="button" onClick={abrirCalendario} className="shrink-0 text-xs font-semibold text-[#f0c84b] underline decoration-[#f0c84b]/40 underline-offset-4 hover:text-[#ffdc65]">Escolher outro dia</button>
          </div>
        )}
        {errors.time && <p className="text-sm text-red-300">{errors.time.message}</p>}

        {/* Serviço */}
        <div className="relative">
          <Scissors size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#83b9ed]" />
          <select {...register("service", { required: "O serviço é obrigatório" })} className="h-14 w-full rounded-xl border border-white/15 bg-[#101721] pl-11 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-[#2f83c9]/50">
            <option value="">Selecione o serviço</option>
            <option value="corte">Corte do Jaca</option>
            <option value="corte-americano">Corte Americano</option>
            <option value="corte-simples">Corte Simples</option>
            <option value="modelado">Corte Modelado</option>
            <option value="tesoura">Tesoura</option>
            <option value="barba">Barba Simples</option>
            <option value="barba-modelada">Barba Modelada</option>
            <option value="sobrancelha">Sobrancelha</option>
            <option value="pretinho">Pretinho</option>
            <option value="reflexo">Reflexo</option>
            <option value="nevou">Nevou</option>
          </select>
        </div>
        {errors.service && (
          <p className="text-red-500 text-sm">{errors.service.message}</p>
        )}

        {/* Botão Agendar */}
        <button
          type="submit"
          className="mt-1 h-14 w-full rounded-xl bg-[#f0c84b] text-sm font-bold text-[#11151b] transition hover:bg-[#ffdc65] disabled:opacity-60"
        >
          Agendar
        </button>

        {/* Mensagem informativa */}
        <p className="mt-2 text-center text-sm text-[#929ba5]">
          Lembre-se de chegar{" "}
          <span className="font-semibold text-[#f0c84b]">10 minutos antes</span> do horário marcado.
        </p>
      </form>

      </div>

      {calendarioAberto && <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setCalendarioAberto(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="calendar-title" className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#101721] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:p-6">
          <div className="flex items-start justify-between">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#83b9ed]">Agendamento</p><h2 id="calendar-title" className="mt-1 font-[family-name:var(--font-bebas)] text-3xl tracking-wide text-white">ESCOLHA O DIA</h2></div>
            <button type="button" onClick={() => setCalendarioAberto(false)} aria-label="Fechar calendário" className="rounded-lg p-2 text-[#929ba5] transition hover:bg-white/[0.06] hover:text-white"><X size={18} /></button>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <button type="button" aria-label="Mês anterior" disabled={mesVisivel.getFullYear() === agora.getFullYear() && mesVisivel.getMonth() === agora.getMonth()} onClick={() => setMesVisivel(new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() - 1, 1))} className="grid h-9 w-9 place-items-center rounded-lg text-[#b5d7f5] transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-30"><ChevronLeft size={18} /></button>
            <p className="text-sm font-semibold capitalize text-white">{mesVisivel.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</p>
            <button type="button" aria-label="Próximo mês" onClick={() => setMesVisivel(new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() + 1, 1))} className="grid h-9 w-9 place-items-center rounded-lg text-[#b5d7f5] transition hover:bg-white/[0.06]"><ChevronRight size={18} /></button>
          </div>
          <div className="mt-3 grid grid-cols-7 text-center text-[10px] font-semibold uppercase tracking-wide text-[#7f8a96]">{"D S T Q Q S S".split(" ").map((dia, index) => <span key={`${dia}-${index}`} className="py-2">{dia}</span>)}</div>
          <div className="grid grid-cols-7 gap-1 text-center">{diasCalendario.map((dia, index) => {
            if (!dia) return <span key={`vazio-${index}`} />;
            const chave = `${mesVisivel.getFullYear()}-${String(mesVisivel.getMonth() + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
            const passado = chave < hoje;
            const selecionado = chave === dataSelecionada;
            return <button key={chave} type="button" disabled={passado} onClick={() => selecionarData(dia)} aria-label={dataLegivel(chave)} aria-pressed={selecionado} className={`mx-auto grid h-10 w-10 place-items-center rounded-xl text-sm transition ${selecionado ? "bg-[#f0c84b] font-bold text-[#11151b]" : passado ? "cursor-not-allowed text-[#4e5863]" : "text-[#e8edf2] hover:bg-[#2f83c9]/25 hover:text-white"}`}>{dia}</button>;
          })}</div>
          <p className="mt-4 text-center text-xs text-[#84909d]">Os horários disponíveis aparecem após escolher uma data.</p>
        </section>
      </div>}
    </section>
  );
}
