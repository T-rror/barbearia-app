"use client";

export default function Saldacao() {
    return (
         <div className="p-6 rounded-xl shadow-lg shadow-black/30 ">
          <h1 className="text-6xl font-bebas ">
            Barbearia da{" "}
            <span className="font-bold text-orange-500">Neguinha</span>
          </h1>
          <p className="font-poppins text-lg animate-fade-in">
            Seu estilo Revela sua Atitude
          </p>
          <a
            href="./signin"
            className="animate-fade-in bg-black text-white px-6 py-3 pt-1 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Agende seu Corte
          </a>
        </div>
    );
}