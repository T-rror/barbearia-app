"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Formulario from "../components/agendamento/Formulario";

export default function FormularioAgendamento() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  const gerarHorarios = () => {
    const horarios = [];
    const inicio = 9 * 60;
    const fim = 18 * 60;
    const intervalo = 40;

    for (let i = inicio; i <= fim; i += intervalo) {
      const h = String(Math.floor(i / 60)).padStart(2, "0");
      const m = String(i % 60).padStart(2, "0");
      horarios.push(`${h}:${m}`);
    }

    return horarios;
  };
  const verificarHorariosDisponiveis = async (dataSelecionada) => {
  try {
    const response = await fetch(
      `http://localhost:3001/appointment/by-date/${dataSelecionada}`
    );
    const data = await response.json();
    const agendamentos = Array.isArray(data) ? data : data.agendamentos ?? [];

    const horariosOcupados = agendamentos.map((a) => a.time); // confere formato aqui!
    const todosHorarios = gerarHorarios();

    const agora = new Date();
    const hojeStr = agora.toISOString().split("T")[0];

    console.log('Horários ocupados:', horariosOcupados);
    console.log('Todos horários:', todosHorarios);
    console.log('Agora:', agora.toLocaleTimeString());

    const disponiveis = todosHorarios.filter((h) => {
      if (horariosOcupados.includes(h)) return false;

      if (dataSelecionada === hojeStr) {
        const [hPart, mPart] = h.split(":");
        const horarioSelecionado = new Date();
        horarioSelecionado.setHours(Number(hPart), Number(mPart), 0, 0);

        return horarioSelecionado.getTime() > agora.getTime() + 10 * 60 * 1000;
      }

      return true;
    });

    console.log('Horários disponíveis:', disponiveis);

    setHorariosDisponiveis(disponiveis);
  } catch (err) {
    console.error("Erro ao buscar horários:", err);
  }
};


  const onSubmit = async (data) => {
    try {
      const resCheck = await fetch(
        `http://localhost:3001/appointment/check?date=${data.date}&time=${data.time}`
      );
      const { exists } = await resCheck.json();

      if (exists) {
        alert("Já existe um agendamento nesse horário!");
        return;
      }

      const agendamento = {
        name: data.name,
        phone: data.phone,
        date: data.date,
        time: data.time,
        service: data.service,
      }; 

      const token = localStorage.getItem('token'); 
      if (!token) {
      alert("Você precisa estar logado para agendar.");
      router.push("/login");
      return;
 }

      const response = await fetch("http://localhost:3001/appointment", {
        method: "POST",
       
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // <-- Aqui está a correção!
     },
        body: JSON.stringify(agendamento),
      }); 
      const responseText = await response.text();
      console.log("Resposta do backend:", responseText);

      if (!response.ok) throw new Error("Erro ao enviar agendamento");

      

      alert("Agendamento enviado com sucesso!");
      reset();
      router.push("/");
    } catch (error) {
      console.error("Erro ao enviar agendamento:", error);
      alert("Erro ao enviar. Verifique a conexão.");
    }
  };

  return (
    <Formulario
      onSubmit={onSubmit}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      verificarHorariosDisponiveis={verificarHorariosDisponiveis}
      horariosDisponiveis={horariosDisponiveis}
    />
  );
}
