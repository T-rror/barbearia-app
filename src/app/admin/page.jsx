"use client";

import { useEffect, useState } from "react";
import {
  fetchAgendamentos,
  concluirAgendamento,
  createAgendamentoAdmin,
} from "../../lib/api";

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
  const [novoAgendamento, setNovoAgendamento] = useState({
    nome: "",
    telefone: "",
    servico: "",
    data: "",
    hora: "",
    createdByAdmin: true,
    
  });

  const atualizarListas = async (token) => {
    const { pendentes, concluidos, historico } = await fetchAgendamentos(token);
    setAgendamentos(pendentes);
    setAgendamentosConcluidos(concluidos);
    setHistorico(historico);
  };

  const handleNovoAgendamento = async (e) => {
    e.preventDefault();
    try {


      console.log("Enviando para backend:", {
  name: novoAgendamento.nome,
  phone: novoAgendamento.telefone,
  service: novoAgendamento.servico,
  date: novoAgendamento.data,
  time: novoAgendamento.hora,
  createdByAdmin: novoAgendamento.createdByAdmin,
  
});

      // Ajusta para o formato que o backend espera
      await createAgendamentoAdmin(
        {
          name: novoAgendamento.nome,
          phone: novoAgendamento.telefone,
          service: novoAgendamento.servico,
          date: novoAgendamento.data,
          time: novoAgendamento.hora,
          createdByAdmin: true,
        },
        user.token
      );

      alert("Agendamento criado com sucesso!");
      setNovoAgendamento({
        nome: "",
        telefone: "",
        servico: "",
        data: "",
        hora: "",
        createdByAdmin: true
      });
      setAbaAtiva("agendamentos");
      await atualizarListas(user.token);
    } catch (error) {
      console.error(error);
      alert("Erro ao criar agendamento");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token encontrado:", token);
    if (!token) return (window.location.href = "/signin");
    setUser({ token });
    setLoading(true);

    atualizarListas(token)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleConcluir = async (id) => {
    try {
      await concluirAgendamento(id, user.token);
      await atualizarListas(user.token);
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
                <CardDemo
                  key={agendamento.id}
                  agendamento={agendamento}
                  onConcluir={handleConcluir}
                />
              ))}
            </div>
          </section>

          <h2 className="text-xl font-bold mt-8 mb-4">Concluídos</h2>
          <section className="sm:block overflow-x-auto">
            <div className="flex sm:grid sm:grid-cols-4 gap-4 w-max sm:w-full px-2">
              {agendamentosConcluidos.map((agendamento, index) => (
                <CardDemo
                  key={agendamento.id || index}
                  agendamento={agendamento}
                  onConcluir={handleConcluir}
                />
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

      {abaAtiva === "novo-agendamento" && (
        <section className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Novo Agendamento</h2>
          <form onSubmit={handleNovoAgendamento} className="space-y-3">
            <input
              type="text"
              placeholder="Nome do cliente"
              value={novoAgendamento.nome}
              onChange={(e) =>
                setNovoAgendamento({ ...novoAgendamento, nome: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-900"
              required
            />
            <input
              type="text"
              placeholder="Telefone"
              value={novoAgendamento.telefone}
              onChange={(e) =>
                setNovoAgendamento({
                  ...novoAgendamento,
                  telefone: e.target.value,
                })
              }
              className="w-full p-2 rounded bg-gray-900"
              required
            />
            <input
              type="text"
              placeholder="Serviço"
              value={novoAgendamento.servico}
              onChange={(e) =>
                setNovoAgendamento({
                  ...novoAgendamento,
                  servico: e.target.value,
                })
              }
              className="w-full p-2 rounded bg-gray-900"
              required
            />
            <input
              type="date"
              value={novoAgendamento.data}
              onChange={(e) =>
                setNovoAgendamento({ ...novoAgendamento, data: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-900"
              required
            />
            <input
              type="time"
              value={novoAgendamento.hora}
              onChange={(e) =>
                setNovoAgendamento({ ...novoAgendamento, hora: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-900"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
            >
              Criar Agendamento
            </button>
          </form>
        </section>
      )}
    </main>
  );
}
