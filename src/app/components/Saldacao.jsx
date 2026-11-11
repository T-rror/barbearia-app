"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, Scissors } from "lucide-react";

const services = ["Corte", "Barba", "Infantil", "Desenhos", "Sobrancelha"];

export default function Saldacao() {
  const router = useRouter();

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#080b10] text-[#f7f4ed]">
      <img src="/imagens/hero-full.png" alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover object-[58%_center]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,9,15,0.68)_0%,rgba(5,9,15,0.38)_34%,rgba(5,9,15,0.74)_66%,#080b10_100%)] lg:bg-[linear-gradient(90deg,#080b10_0%,rgba(8,11,16,0.94)_33%,rgba(8,11,16,0.62)_62%,rgba(8,11,16,0.28)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_42%,rgba(18,102,173,0.2),transparent_52%)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <img src="/imagens/logo.png" alt="Logo da Barbearia da Neguinha" className="h-12 w-12 rounded-full border border-white/10 object-cover" />
          <div className="leading-none">
            <p className="font-[family-name:var(--font-bebas)] text-xl tracking-[0.12em]">NEGUINHA</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-[#83b9ed]">Barbearia</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs text-[#c9c7c1] sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#f0c84b]" />
          Rua Conde de Lages, 3
        </div>
        <button onClick={() => router.push("/signin")} className="group flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold transition hover:border-[#5ba4e8] hover:bg-[#1266ad]/15 sm:text-sm">
          Acessar <ArrowUpRight size={15} className="text-[#83b9ed] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </header>

      <section className="relative mx-auto flex min-h-[calc(100svh-84px)] w-full max-w-7xl items-center px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-20 lg:pt-4">
        <div className="relative z-10 max-w-3xl">
          <a href="https://www.instagram.com/barbeariadaneguinha01/" target="_blank" rel="noreferrer" aria-label="Visitar o Instagram da Barbearia da Neguinha" className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3479b8]/35 bg-[#0d2a45]/60 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#b5d7f5] transition hover:border-[#5ba4e8]/70 hover:bg-[#0d2a45] sm:text-xs">
            <Scissors size={14} className="text-[#f0c84b]" />
            Atitude em cada detalhe
          </a>
          <h1 className="max-w-3xl font-[family-name:var(--font-bebas)] text-[clamp(4.2rem,11vw,8.8rem)] leading-[0.78] tracking-[0.015em] text-[#f7f4ed]">
            SEU ESTILO<span className="text-[#f0c84b]">.</span><br />
            <span className="text-[#5ba4e8]">SUA</span> ATITUDE<span className="text-[#f0c84b]">.</span>
          </h1>
          <div className="mt-7 flex items-start gap-4 sm:mt-9">
            <span className="mt-1 h-12 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#f0c84b] to-[#1766aa]" />
            <div>
              <p className="font-[family-name:var(--font-bebas)] text-2xl tracking-[0.08em] text-white sm:text-3xl">BARBEARIA DA NEGUINHA</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#aaaeb5] sm:text-base sm:leading-7">Corte, cuidado e personalidade. Um espaço de verdade, feito para você chegar como é e sair com a sua melhor versão.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <button onClick={() => router.push("/signup")} className="group flex h-14 items-center justify-center gap-3 rounded-xl bg-[#f0c84b] px-7 text-sm font-bold text-[#11151b] shadow-[0_10px_35px_rgba(240,200,75,0.16)] transition hover:-translate-y-0.5 hover:bg-[#ffdc65] sm:min-w-48">
              Começar agora <ArrowUpRight size={17} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <button onClick={() => router.push("/signin")} className="h-14 rounded-xl border border-white/15 px-7 text-sm font-semibold text-[#f1f0ec] transition hover:border-[#5ba4e8]/70 hover:bg-white/[0.04]">
              Já tenho cadastro
            </button>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5 sm:mt-11">
            {services.map((service, index) => <span key={service} className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#a5a9b0] sm:text-[11px]"><span className={index === 0 ? "h-1.5 w-1.5 rounded-full bg-[#f0c84b]" : "h-1.5 w-1.5 rounded-full bg-[#3479b8]"} />{service}</span>)}
          </div>
        </div>

      </section>
    </section>
  );
}
