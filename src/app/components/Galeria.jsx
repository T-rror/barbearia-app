"use client";

import { useState, useEffect } from "react";

export default function AlternadorImagens() {
  // Lista de imagens (pode ser local ou URL)
  const imagens = [
    "/imagens/corte1.jpg",
    "/imagens/corte2.jpg",
    "/imagens/corte3.jpg",
    "/imagens/corte5.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagens.length); 
      // "% imagens.length" garante que volte pro início
    }, 3000); // troca a cada 3 segundos

    return () => clearInterval(intervalo); // limpa o intervalo quando o componente sai da tela
  }, []);

  return (
    <div className="flex justify-center items-center h-screen z-20">
      <img
        src={imagens[index]}
        alt="Imagem alternando"
        className="w-64 h-64 object-contain transition-all duration-500"
      />
    </div>
  );
}

