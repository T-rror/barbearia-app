"use client";


import {useRouter} from "next/navigation";

export default function Saldacao() {
  const router = useRouter();
    return (
         <div className="p-6 rounded-xl shadow-lg shadow-black/30 ">
          <h1 className="text-6xl font-bebas ">
            Barbearia da{" "}
            <span className="font-bold text-orange-500">Neguinha</span>
          </h1>

          
          <p className="font-poppins text-lg animate-fade-in">
            Seu estilo Revela sua Atitude
          </p>
          
          <button
           onClick={() => router.push("/signin")}
          className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
          login
          </button>

          <button
           onClick={() => router.push("/signup")}
          className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
          cadastre-se
          </button>
          
         
        </div>
      
    );
}