"use client";

import { useEffect, useState } from "react";
import { fetchAgendamentos, concluirAgendamento } from "../../lib/api";
import Sidebar from "../components/admin/Sidebar";
import { CardDemo } from "../components/admin/Card";
import { MyChart } from "../components/admin/Chart";

export default function AdminPage() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosConcluidos, setAgendamentosConcluidos] = useState([]);
  const [historico, setHistorico] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("agendamentos");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/signin");
    setUser({ token });
    setLoading(true);

    fetchAgendamentos(token)
      .then(({ pendentes, concluidos, historico }) => {
        console.log("🔍 Agendamentos pendentes:", pendentes);
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

  return (
    <main className="sm:ml-14 p-4">
      <Sidebar onLogout={handleLogout} user={user} onAbaChange={setAbaAtiva} />

      {abaAtiva === "agendamentos" && (
        <>
          <section className="sm:block overflow-x-auto">
            <h2 className="text-xl font-bold mb-4">Pendentes</h2>
            <div className="flex sm:grid sm:grid-cols-4 gap-4 w-max sm:w-full px-2">
              {agendamentos.map((agendamento) => (
                <CardDemo key={agendamento._id} agendamento={agendamento} />
              ))}
            </div>
          </section>

          <h2 className="text-xl font-bold mt-8 mb-4">Concluídos</h2>
          <section className="sm:block overflow-x-auto">
            <div className="flex sm:grid sm:grid-cols-4 gap-4 w-max sm:w-full px-2">
              {agendamentosConcluidos.map((agendamento, index) => (
                <CardDemo key={agendamento._id || index} agendamento={agendamento} />
              ))}
            </div>
          </section>
        </>
      )}

      {abaAtiva === "historico" && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Histórico</h2>
          <MyChart agendamentos={agendamentos} titulo="Agendamentos" />
        </section>
      )}
    </main>
  );
}
