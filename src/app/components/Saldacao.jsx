"use client";

import { useRouter } from "next/navigation";

export default function Saldacao() {
  const router = useRouter();

  return (
    <section className="relative flex flex-col items-center justify-between min-h-screen bg-black overflow-hidden">
      {/* Imagem principal */}
      <div className="relative w-full h-[50vh]">
        <img
          src="/imagens/hero-full.png"
          alt="Barbearia da Neguinha"
          className="w-full h-full object-cover opacity-80"
        />

        {/* Logo sobreposta no final da imagem */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black/80 p-5 rounded-full shadow-xl">
          <img
            src="/imagens/logo.png"
            alt="Logo Barbearia da Neguinha"
            className="w-24 md:w-28"
          />
        </div>
      </div>

      {/* Conteúdo central */}
      <div className="flex flex-col items-center text-center px-6 mt-16 space-y-4">
        {/* Título principal */}
        <h1 className="text-4xl md:text-5xl font-bebas text-white leading-tight drop-shadow-lg">
          Barbearia da{" "}
          <span className="font-bold text-orange-500">Neguinha</span>
        </h1>

        {/* Subtítulo */}
        <p className="font-poppins text-lg text-gray-300 max-w-md animate-fade-in">
          Seu estilo revela sua atitude
        </p>
      </div>

      {/* Botões */}
      <div className="flex flex-col items-center w-full px-6 space-y-4 mb-8 mt-4">
        <button
          onClick={() => router.push("/signin")}
          className="w-full max-w-md h-14 bg-black text-white rounded-2xl font-semibold hover:bg-gray-600 transition shadow-lg"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="w-full max-w-md h-14 border-2 border-gray-500 text-orange-500 rounded-2xl font-semibold hover:bg-gray-600 hover:text-white transition"
        >
          Cadastre-se
        </button>
      </div>

     
    </section>
  );
}
