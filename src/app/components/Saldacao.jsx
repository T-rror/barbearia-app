"use client";

import { useRouter } from "next/navigation";

export default function Saldacao() {
  const router = useRouter();

  return (
    <section className="relative flex flex-col items-center justify-between min-h-screen bg-white overflow-hidden">
      {/* Imagem principal */}
      <img
        src="/imagens/hero.jpg"
        alt="Barbearia da Neguinha"
        className="w-full h-[50vh] object-cover"
      />

      {/* Conteúdo central */}
      <div className="flex flex-col items-center text-center px-6 mt-6 space-y-4">
        {/* Logo */}
        <img
          src="/imagnes/corte5.jpg"
          alt="Logo Barbearia da Neguinha"
          className="w-20 md:w-24 mb-4"
        />

        {/* Título principal */}
        <h1 className="text-4xl md:text-5xl font-bebas text-gray-900 leading-tight">
          Barbearia da{" "}
          <span className="font-bold text-orange-500">Neguinha</span>
        </h1>

        {/* Subtítulo */}
        <p className="font-poppins text-lg text-gray-600 max-w-md animate-fade-in">
          Seu estilo revela sua atitude
        </p>
      </div>

      {/* Botões */}
      <div className="flex flex-col items-center w-full px-6 space-y-4 mb-8">
        <button
          onClick={() => router.push("/signin")}
          className="w-full max-w-md h-14 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="w-full max-w-md h-14 border-2 border-black text-black rounded-2xl font-semibold hover:bg-black hover:text-white transition"
        >
          Cadastre-se
        </button>
      </div>

      {/* Home Indicator (opcional, estilo iPhone) */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gray-300 rounded-full"></div>
    </section>
  );
}
