"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";

const schema = yup.object({
  name: yup.string().required("Informe seu nome"),
  phone: yup.string().required("Informe seu telefone"),
  email: yup.string().email("E-mail inválido").required("Informe seu e-mail"),
  password: yup.string().min(6, "Mínimo de 6 caracteres").required("Informe sua senha"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Senhas não coincidem")
    .required("Confirme a senha"),
});

export default function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/signup", data);
      // Login automático
      const res = await api.post("/auth/signin", {
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("token", res.data.accessToken);

      const me = await api.get("/auth/me");
      if (me.data.role === "CLIENTE") router.push("/agendamento");
      else router.push("/admin");
    } catch {
      alert("Erro ao criar conta");
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-between min-h-screen bg-white overflow-hidden px-6">
      {/* Status Bar / topo */}
      <div className="w-full h-10 bg-white"></div>

      {/* Logo */}
      <img
        src="/images/logo.png"
        alt="Logo Barbearia"
        className="w-16 md:w-20 mt-6 mb-6 transform scale-x-[-1]"
      />

      {/* Título */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
        Criar Conta
      </h1>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-md space-y-4"
      >
        <input
          type="text"
          placeholder="Nome"
          {...register("name")}
          className="w-full h-14 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <input
          type="tel"
          placeholder="Telefone"
          {...register("phone")}
          className="w-full h-14 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

        <input
          type="email"
          placeholder="E-mail"
          {...register("email")}
          className="w-full h-14 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Senha"
          {...register("password")}
          className="w-full h-14 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <input
          type="password"
          placeholder="Confirmar senha"
          {...register("confirmPassword")}
          className="w-full h-14 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
        )}

        {/* Botão Criar Conta */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition"
        >
          Criar Conta
        </button>

        {/* Link para login */}
        <p className="text-center text-gray-500 text-sm mt-2">
          Já tem uma conta?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-orange-500 font-semibold cursor-pointer hover:underline"
          >
            Faça login
          </span>
        </p>
      </form>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gray-300 rounded-full"></div>
    </section>
  );
}
