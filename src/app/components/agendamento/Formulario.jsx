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
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <Card className="bg-gray-900 text-white max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg">
        <CardHeader className="text-white text-center text-xl font-bold">
          Agende seu Corte
        </CardHeader>
        <CardDescription className="text-center text-gray-400">
          Preencha o formulário abaixo para agendar conosco
        </CardDescription>
        <CardContent className="bg-gray-800 p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-3xl">
            <input
              {...register("date", { required: "A data é obrigatória" })}
              type="date"
              className="w-full p-2 border rounded-3xl text-white bg-black"
              min={hoje}
              defaultValue={hoje} // já inicia com a data de hoje
              onChange={(e) => verificarHorariosDisponiveis(e.target.value)}
            />
            {errors.date && (
              <p className="text-red-500">{errors.date.message}</p>
            )}

            <select
              {...register("time", { required: "A hora é obrigatória" })}
              className="w-full p-2 border rounded-3xl text-white bg-black"
            >
              <option value="">Horários Dispobiveis</option>
              {horariosDisponiveis.map((hora) => (
                <option key={hora} value={hora}>
                  {hora}
                </option>
              ))}
            </select>
            {horariosDisponiveis.length === 0 && (
              <p className="text-red-500">
                Nenhum horário disponível para essa data.
              </p>
            )}
            {errors.time && (
              <p className="text-red-500">{errors.time.message}</p>
            )}

            <select
              {...register("service", { required: "O serviço é obrigatório" })}
              className="w-full p-2 border rounded-3xl text-white bg-black"
            >
              <option>Serviço</option>
              <option value="corte">Corte do jaca</option>
              <option value="corte">Corte americano</option>
              <option value="corte">Corte simples</option>
              <option value="corte">Corte modelado</option>
              <option value="corte">Tesoura</option>
              <option value="barba">Barba siples</option>
              <option value="barba">Barba modelada</option>
              <option value="Sombracelha">Sombracelha</option>
              <option value="tinta">pretinho</option> 
              <option value="tinta">reflexo</option>
              <option value="tinta">nevou</option>
            </select>
            {errors.service && (
              <p className="text-red-500">{errors.service.message}</p>
            )}

            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-3xl hover:bg-green-300 transition-colors duration-300 w-full"
            >
              Enviar
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
