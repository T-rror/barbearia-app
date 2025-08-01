"use client";

import { useEffect, useState } from "react";
import { fetchAgendamentos, concluirAgendamento } from "../../lib/api";
import Sidebar from "../components/admin/Sidebar";
import  { CardDemo } from "../components/admin/Card";
import { MyChart } from "../components/admin/Chart";



export default function AdminPage() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosConcluidos, setAgendamentosConcluidos] = useState([]);
  const [historico, setHistorico] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("pendentes");

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/signin");
    setUser({ token });
    setLoading(true);

    fetchAgendamentos(token)
      .then(({ pendentes, concluidos, historico }) => {
        setAgendamentos(pendentes);
        setAgendamentosConcluidos(concluidos);
        setHistorico(historico);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleConcluir = async (id) => {
    try {
      await concluirAgendamento(id, user.token);
      const { pendentes, concluidos, historico } = await fetchAgendamentos(
        user.token
      );
      setAgendamentos(pendentes);
      setAgendamentosConcluidos(concluidos);
      setHistorico(historico);
    } catch (error) {
      console.error(error);
      alert("Erro ao concluir agendamento");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  console.log("Usuário logado:", user);

  return (
    
    <main className="sm:ml-14 p-4 "> 
    <div className=" flex flex-col">
      <Sidebar />
    </div>
    <section className="grid grid-colors-2 lg:grid-cols-4 gap-4">
      <CardDemo/>
      <CardDemo/>
      <CardDemo/>
      <CardDemo/>
     
    </section> 
    <MyChart data={Object.values(historico)} />
   
    </main>
  );
}
