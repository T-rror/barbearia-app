"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../../../@/components/ui/card";

export default function Formulario({
  onSubmit,
  register,
  handleSubmit,
  errors,
  verificarHorariosDisponiveis,
  horariosDisponiveis,
}) {
  const hoje = new Date().toISOString().split("T")[0];

  useEffect(() => {
    verificarHorariosDisponiveis(hoje);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-between min-h-screen bg-white overflow-hidden px-6">
      {/* Status Bar / topo */}
      <div className="w-full h-10 bg-white"></div>

      {/* Logo */}
      <img
        src="/imagens/corte5.jpg"
        alt="Logo Barbearia"
        className="w-16 md:w-20 mt-6 mb-6 transform scale-x-[-1]"
      />

      {/* Título */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
        Agendar Corte
      </h1>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-md space-y-4"
      >
        {/* Data */}
        <input
          {...register("date", { required: "A data é obrigatória" })}
          type="date"
          min={hoje}
          defaultValue={hoje}
          onChange={(e) => verificarHorariosDisponiveis(e.target.value)}
          className="w-full h-14 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}

        {/* Horário */}
        <select
          {...register("time", { required: "A hora é obrigatória" })}
          className="w-full h-14 px-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Horários disponíveis</option>
          {horariosDisponiveis.map((hora) => (
            <option key={hora} value={hora}>
              {hora}
            </option>
          ))}
        </select>
        {horariosDisponiveis.length === 0 && (
          <p className="text-red-500 text-sm">
            Nenhum horário disponível para essa data.
          </p>
        )}
        {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}

        {/* Serviço */}
        <select
          {...register("service", { required: "O serviço é obrigatório" })}
          className="w-full h-14 px-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Selecione o serviço</option>
          <option value="corte">Corte do Jaca</option>
          <option value="corte-americano">Corte Americano</option>
          <option value="corte-simples">Corte Simples</option>
          <option value="modelado">Corte Modelado</option>
          <option value="tesoura">Tesoura</option>
          <option value="barba">Barba Simples</option>
          <option value="barba-modelada">Barba Modelada</option>
          <option value="sobrancelha">Sobrancelha</option>
          <option value="pretinho">Pretinho</option>
          <option value="reflexo">Reflexo</option>
          <option value="nevou">Nevou</option>
        </select>
        {errors.service && (
          <p className="text-red-500 text-sm">{errors.service.message}</p>
        )}

        {/* Botão Agendar */}
        <button
          type="submit"
          className="w-full h-14 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition"
        >
          Agendar
        </button>

        {/* Mensagem informativa */}
        <p className="text-center text-gray-500 text-sm mt-2">
          Lembre-se de chegar{" "}
          <span className="font-semibold text-orange-500">10 minutos antes</span> do horário marcado.
        </p>
      </form>

     
    </section>
  );
}
