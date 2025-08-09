import React, { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";
import Saldacao from "./Saldacao";
import Galeria from "./Galeria";
import Footer from "./Footer";

const imagens = [
  "/imagens/corte1.jpg",
  "/imagens/corte2.jpg",
  "/imagens/corte3.jpg",
  "/imagens/corte5.jpg",
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [corDinamica, setCorDinamica] = useState("orange");
  const imgRef = useRef(null);

  // Troca a imagem a cada 3 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagens.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, []);

  // Atualiza a cor quando a imagem muda ou carrega
  useEffect(() => {
    if (!imgRef.current) return;

    const colorThief = new ColorThief();

    function setColor() {
      try {
        const rgb = colorThief.getColor(imgRef.current);
        setCorDinamica(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
      } catch (e) {
        // Pode dar erro se a imagem não carregar direito ou CORS
        console.error("Erro ao pegar cor dominante:", e);
        setCorDinamica("orange"); // fallback
      }
    }

    if (imgRef.current.complete) {
      setColor();
    } else {
      imgRef.current.onload = setColor;
    }
  }, [index]); // toda vez que index mudar, roda

  return (
    <div className="flex-grow flex flex-col overflow-hidden relative">
      {/* Círculo com cor dinâmica */}
      <div
        className="fixed bottom-0 right-0 w-200 h-200 rounded-full translate-x-1/2 translate-y-1/2 z-10"
        style={{ backgroundColor: corDinamica }}
      ></div>

      {/* Imagem invisível para capturar cor */}
      <img
        ref={imgRef}
        src={imagens[index]}
        alt="Imagem para cor dominante"
        crossOrigin="anonymous"
        style={{ display: "none" }}
      />

      <section className="flex-grow h-screen bg-cover bg-center flex items-center justify-center text-white text-center px-4 overflow-hidden">
        <div className="pl-0 z-20">
          <Saldacao />
        </div>

        <div className="z-20">
        <Galeria currentImage={imagens[index]} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
