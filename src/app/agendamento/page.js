"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Formulario from "../components/agendamento/Formulario";

export default function FormularioAgendamento() {
  const router = useRouter();
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [consultandoHorarios, setConsultandoHorarios] = useState(false);

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
  setConsultandoHorarios(true);
  try {
    const response = await fetch(
      `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "")}/appointment/by-date/${dataSelecionada}`
    );
    if (!response.ok) throw new Error(`Falha ao consultar horários (${response.status})`);
    const data = await response.json();
    const agendamentos = Array.isArray(data) ? data : data.appointments ?? [];

    const horariosOcupados = agendamentos.map((a) => a.time); // confere formato aqui!
    const todosHorarios = gerarHorarios();

    const agora = new Date();
    const hojeStr = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")}`;

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

    setHorariosDisponiveis(disponiveis);
  } catch (err) {
    console.error("Erro ao buscar horários:", err);
    setHorariosDisponiveis([]);
  } finally {
    setConsultandoHorarios(false);
  }
};


 const onSubmit = async (data) => {
  try {
    const agendamento = {
      date: data.date,
      time: data.time,
      service: data.service,
    };

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para agendar.");
      router.push("/signin");
      return;
    }

    const response = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "")}/appointment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(agendamento),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const errorMessage = Array.isArray(errorBody?.message)
        ? errorBody.message.join("; ")
        : errorBody?.message;
      throw new Error(errorMessage || "Erro ao enviar agendamento");
    }

    alert("Agendamento enviado com sucesso!");
    reset();
    router.push("/");
  } catch (error) {
    console.error("Erro ao enviar agendamento:", error);
    alert(error.message || "Erro ao enviar. Verifique a conexão.");
  }
};


  return (
  
      
    <Formulario
      onSubmit={onSubmit}
      register={register}
      watch={watch}
      setValue={setValue}
      handleSubmit={handleSubmit}
      errors={errors}
      verificarHorariosDisponiveis={verificarHorariosDisponiveis}
      horariosDisponiveis={horariosDisponiveis}
      consultandoHorarios={consultandoHorarios}
    />
    
  );
}
