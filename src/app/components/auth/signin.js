"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";

const schema = yup.object({
  email: yup.string().email("E-mail inválido").required("Informe seu e-mail"),
  password: yup.string().required("Informe sua senha"),
});

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/signin", data);
      localStorage.setItem("token", res.data.accessToken);

      const me = await api.get("/auth/me");
      if (me.data.role === "CLIENTE") router.push("/agendamento");
      else router.push("/admin");
    } catch {
      alert("E-mail ou senha incorretos");
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-between min-h-screen bg-black overflow-hidden px-6">
      {/* Status Bar / top background */}
      <div className="w-full h-10 bg-black text-white"></div>

      {/* Logo */}
      <img
        src="/imagens/logo.png"
        alt="Logo Barbearia"
        className="w-16 md:w-20 mt-6 mb-6 transform scale-x-[-1]"
      />

      {/* Título */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
        O que vai ser hoje?
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Faça login para agendar um horário
      </p>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-md space-y-4"
      >
        {/* Email */}
        <input
          type="email"
          placeholder="Nome ou e-mail"
          {...register("email")}
          className="w-full h-14 px-4 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-600"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        {/* Senha */}
        <input
          type="password"
          placeholder="Senha"
          {...register("password")}
          className="w-full h-14 px-4 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-600"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        {/* Botão login */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition"
        >
          Entrar
        </button>

        {/* Link para cadastro */}
        <p className="text-center text-gray-500 text-sm mt-2">
          Não tem uma conta?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-orange-500 font-semibold cursor-pointer hover:underline"
          >
            Cadastre-se
          </span>
        </p>
      </form>

     
    </section>
  );
}
