'use client';

export default function Formulario({
  onSubmit,
  register,
  handleSubmit,
  errors,
  verificarHorariosDisponiveis,
  horariosDisponiveis,
}) {
  return (
    <section>
      <h1 className="text-5xl text-center text-white font-semibold py-3.5">Precisão e qualidade</h1>
      <div className="bg-black max-w-md mx-auto mt-10 p-4 border rounded-xl shadow">
        <h1 className="text-white text-center text-xl font-bold mb-4">Agende seu Corte</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">      
          <input
            {...register("date", { required: "A data é obrigatória" })}
            type="date"
            className="w-full p-2 border rounded text-white bg-black"
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => verificarHorariosDisponiveis(e.target.value)}
          />
          {errors.date && <p className="text-red-500">{errors.date.message}</p>}

          <select
            {...register("time", { required: "A hora é obrigatória" })}
            className="w-full p-2 border rounded text-white bg-black"
          >
            <option value="">Selecione um horário</option>
            {horariosDisponiveis.map((hora) => (
              <option key={hora} value={hora}>{hora}</option>
            ))}
          </select>
          {horariosDisponiveis.length === 0 && (
            <p className="text-red-500">Nenhum horário disponível para essa data.</p>
          )}
          {errors.time && <p className="text-red-500">{errors.time.message}</p>} 

          <select
            {...register("service", { required: "O serviço é obrigatório" })}
            className="w-full p-2 border rounded text-white bg-black"
          >
            <option value="">Selecione um serviço</option>
            <option value="corte">Corte</option>
            <option value="barba">Barba</option>    
            </select>
          {errors.service && <p className="text-red-500">{errors.service.message}</p>}          

          <button type="submit" className="bg-black text-white px-4 py-2 rounded">
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}
