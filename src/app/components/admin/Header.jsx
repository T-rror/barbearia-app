"use client";
import { useEffect, useState } from "react";

export default function Header({ onLogout, user }) {
  const [horaAtual, setHoraAtual] = useState(null);
  const [mounted, setMounted] = useState(false); // <- controle de montagem no cliente

  useEffect(() => {
    setMounted(true); // <- só depois do primeiro render client-side
    setHoraAtual(new Date());

    const timer = setInterval(() => setHoraAtual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted || !horaAtual) return null; // <- só mostra quando estiver montado no client

  const diaFormatado = horaAtual.toLocaleDateString("pt-BR");
  const horaFormatada = horaAtual.toLocaleTimeString("pt-BR");

  return (
    <header className="w-full p-4 bg-gray-100 border-b flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">
          Bem-vindo{user?.name ? `, ${user.name}` : ""}
        </h2>

        <p>
          {diaFormatado} - {horaFormatada}
        </p>
      </div>
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
}
