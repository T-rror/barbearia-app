"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import api from "../../../lib/api";

const schema = yup.object({
  name: yup.string().required("Informe seu nome"),
  phone: yup
    .string()
    .matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Informe um telefone válido com DDD")
    .required("Informe seu telefone"),
  email: yup.string().email("E-mail inválido").required("Informe seu e-mail"),
  password: yup.string().min(8, "Mínimo de 8 caracteres").required("Informe sua senha"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Senhas não coincidem")
    .required("Confirme a senha"),
});

export default function SignupForm() {
  const router = useRouter();
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setErroEnvio("");
    try {
      const signupData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: data.password,
      };
      await api.post("/auth/signup", signupData);
      // Login automático
      const res = await api.post("/auth/signin", {
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("token", res.data.accessToken);

      const me = await api.get("/auth/me");
      if (me.data.role === "CLIENTE") router.push("/agendamento");
      else router.push("/admin");
    } catch (error) {
      const message = error.response?.data?.message;
      setErroEnvio(Array.isArray(message) ? message.join("; ") : message || "Não foi possível criar a conta. Confira os dados e tente novamente.");
    }
  };

  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-x-hidden bg-[#080b10] px-5 py-10 text-[#f7f4ed] sm:px-6">
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-cover bg-[58%_center]" style={{ backgroundImage: "url('/imagens/hero-full.png')" }} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,9,15,0.7)_0%,rgba(5,9,15,0.78)_55%,rgba(5,9,15,0.88)_100%)]" />

      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d141de8] p-6 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-9">
        <header className="mb-7 flex flex-col items-center text-center">
          <img src="/imagens/logo.png" alt="Logo Barbearia da Neguinha" className="mb-4 h-16 w-16 rounded-full border border-white/10 object-cover" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f0c84b]">Barbearia da Neguinha</p>
          <h1 className="mt-2 font-[family-name:var(--font-bebas)] text-4xl tracking-wide text-white sm:text-5xl">Criar conta</h1>
          <p className="mt-2 text-sm text-[#c5cbd2]">Seus horários e atendimentos, sem complicação.</p>
        </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="relative"><UserRound size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#83b9ed]" /><input type="text" placeholder="Nome completo" aria-label="Nome completo" {...register("name")} autoComplete="name" className="h-12 w-full rounded-xl border border-white/15 bg-[#101721]/90 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#858d97] focus:border-[#5ba4e8]/70 focus:ring-2 focus:ring-[#2f83c9]/30" /></div>
        {errors.name && <p className="text-sm text-red-300">{errors.name.message}</p>}

        <div className="relative"><Phone size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#83b9ed]" /><input type="tel" placeholder="Telefone com DDD" aria-label="Telefone com DDD" {...register("phone")} autoComplete="tel" className="h-12 w-full rounded-xl border border-white/15 bg-[#101721]/90 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#858d97] focus:border-[#5ba4e8]/70 focus:ring-2 focus:ring-[#2f83c9]/30" /></div>
        {errors.phone && <p className="text-sm text-red-300">{errors.phone.message}</p>}

        <div className="relative"><Mail size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#83b9ed]" /><input type="email" placeholder="E-mail" aria-label="E-mail" {...register("email")} autoComplete="email" className="h-12 w-full rounded-xl border border-white/15 bg-[#101721]/90 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#858d97] focus:border-[#5ba4e8]/70 focus:ring-2 focus:ring-[#2f83c9]/30" /></div>
        {errors.email && <p className="text-sm text-red-300">{errors.email.message}</p>}

        <div className="relative"><LockKeyhole size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#83b9ed]" /><input type={senhaVisivel ? "text" : "password"} placeholder="Senha (mínimo 8 caracteres)" aria-label="Senha" {...register("password")} autoComplete="new-password" className="h-12 w-full rounded-xl border border-white/15 bg-[#101721]/90 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-[#858d97] focus:border-[#5ba4e8]/70 focus:ring-2 focus:ring-[#2f83c9]/30" /><button type="button" onClick={() => setSenhaVisivel((visivel) => !visivel)} aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#8f9aa7] transition hover:bg-white/[0.06] hover:text-white">{senhaVisivel ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        {errors.password && <p className="text-sm text-red-300">{errors.password.message}</p>}

        <div className="relative"><LockKeyhole size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#83b9ed]" /><input type={senhaVisivel ? "text" : "password"} placeholder="Confirmar senha" aria-label="Confirmar senha" {...register("confirmPassword")} autoComplete="new-password" className="h-12 w-full rounded-xl border border-white/15 bg-[#101721]/90 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-[#858d97] focus:border-[#5ba4e8]/70 focus:ring-2 focus:ring-[#2f83c9]/30" /><button type="button" onClick={() => setSenhaVisivel((visivel) => !visivel)} aria-label={senhaVisivel ? "Ocultar senhas" : "Mostrar senhas"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#8f9aa7] transition hover:bg-white/[0.06] hover:text-white">{senhaVisivel ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-300">{errors.confirmPassword.message}</p>
        )}

        {erroEnvio && <p role="alert" className="rounded-xl border border-red-300/20 bg-red-400/[0.08] px-4 py-3 text-sm leading-5 text-red-200">{erroEnvio}</p>}

        {/* Botão Criar Conta */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex h-14 w-full items-center justify-center rounded-xl bg-[#f0c84b] px-4 text-sm font-bold text-[#11151b] transition hover:bg-[#ffdc65] disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </button>

        {/* Link para login */}
        <p className="pt-1 text-center text-sm text-[#a5abb3]">
          Já tem uma conta?{" "}
          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="font-semibold text-[#f0c84b] hover:underline"
          >
            Faça login
          </button>
        </p>
        <button type="button" onClick={() => router.push("/")} className="mx-auto mt-1 inline-flex items-center gap-2 text-xs text-[#87919d] transition hover:text-white"><ArrowLeft size={14} /> Voltar ao início</button>
      </form>
      </section>
    </main>
  );
}
