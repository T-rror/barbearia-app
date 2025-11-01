"use client";

import { useEffect, useState } from "react";
import {
  fetchAgendamentos,
  concluirAgendamento,
  createAgendamentoAdmin,
  cancelarAgendamento,
} from "../../lib/appointment";

import Sidebar from "../components/admin/Sidebar";
import { CardDemo } from "../components/admin/Card";
import { MyChart } from "../components/admin/Chart";

export default function AdminPage() {
  // Função utilitária (coloque no topo do arquivo)
const decodeJWT = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload; // retorna { name, avatar, role, ... } se existir
  } catch (err) {
    return null;
  }
};

  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosConcluidos, setAgendamentosConcluidos] = useState([]);
  const [agendamentosCancelados, setAgendamentosCancelados] = useState([]);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: "", avatar: "" });
  const [loading, setLoading] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("pendentes"); // mudado para padrão na aba de pendentes

  const [novoAgendamento, setNovoAgendamento] = useState({
    nome: "",
    telefone: "",
    servico: "",
    data: "",
    hora: "",
    createdByAdmin: true,
  });

  // Atualiza listas do backend
  const atualizarListas = async (token) => {
    try {
      const { pendentes = [], concluidos = [], cancelados = [] } = await fetchAgendamentos(token);
      setAgendamentos(pendentes);
      setAgendamentosConcluidos(concluidos);
      setAgendamentosCancelados(cancelados);
    } catch (error) {
      console.error("Erro ao atualizar listas:", error);
    }
  };

  // Criar agendamento
  const handleNovoAgendamento = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
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
        createdByAdmin: true,
      });
      setAbaAtiva("pendentes");
      await atualizarListas(user.token);
    } catch (error) {
      console.error(error);
      alert("Erro ao criar agendamento");
    }
  };

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "/signin");

  const payload = decodeJWT(token);

  // salva apenas dados não sensíveis
  setUserInfo({
    name: payload?.name || "Administrador",
    avatar: payload?.avatar || "",
  });

  setUser({ token });
  setLoading(true);

  atualizarListas(token)
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, []);

  // Concluir
  const handleConcluir = async (id) => {
    if (!user) return;
    try {
      await concluirAgendamento(id, user.token);
      await atualizarListas(user.token);
    } catch (error) {
      console.error(error);
      alert("Erro ao concluir agendamento");
    }
  };

  // Cancelar
  const handleCancelar = async (id) => {
    if (!user) return;
    try {
      await cancelarAgendamento(id, user.token);
      await atualizarListas(user.token);
    } catch (error) {
      console.error(error);
      alert("Erro ao cancelar agendamento");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  // Loading
  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-400">Carregando agendamentos...</p>
      </main>
    );
  }

  return (


    
    <main className="sm:ml-14 p-4">

       {/* Cabeçalho com nome e avatar */}
<div className="flex items-center justify-end gap-3 mb-6 mr-4">
  {userInfo.avatar ? (
    <img
      src={userInfo.avatar}
      alt="Avatar"
      className="w-10 h-10 rounded-full border border-gray-600 object-cover"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
      {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "A"}
    </div>
  )}

  <div>
    <p className="text-white font-medium">{userInfo.name}</p>
    <p className="text-xs text-gray-400">Admin</p>
  </div>
</div>



      <Sidebar onLogout={handleLogout} 
               user={user} 
               onAbaChange={setAbaAtiva} />
               

      {/* Abas */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setAbaAtiva("pendentes")}
          className={`px-4 py-2 rounded ${
            abaAtiva === "pendentes" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Pendentes ({agendamentos.length})
        </button>
        <button
          onClick={() => setAbaAtiva("concluidos")}
          className={`px-4 py-2 rounded ${
            abaAtiva === "concluidos" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Concluídos ({agendamentosConcluidos.length})
        </button>
        <button
          onClick={() => setAbaAtiva("cancelados")}
          className={`px-4 py-2 rounded ${
            abaAtiva === "cancelados" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Cancelados ({agendamentosCancelados.length})
        </button>
        <button
          onClick={() => setAbaAtiva("novo-agendamento")}
          className={`px-4 py-2 rounded ${
            abaAtiva === "novo-agendamento" ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Novo Agendamento
        </button>
        <button
          onClick={() => setAbaAtiva("historico")}
          className={`px-4 py-2 rounded ${
            abaAtiva === "historico" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          Histórico
        </button>
      </div>
      

      {/* Conteúdo das abas */}
      {abaAtiva === "pendentes" && (
        <section className="sm:block overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Pendentes</h2>
          <div className="flex sm:grid sm:grid-cols-4 gap-4 w-max sm:w-full px-2">
            {agendamentos.map((agendamento) => (
              <CardDemo
                key={agendamento.id}
                agendamento={agendamento}
                onConcluir={handleConcluir}
                onCancelar={handleCancelar}
              />
            ))}
          </div>
        </section>
      )}

      {abaAtiva === "concluidos" && (
        <section className="sm:block overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Concluídos</h2>
          <div className="flex sm:grid sm:grid-cols-4 gap-4 w-max sm:w-full px-2">
            {agendamentosConcluidos.map((agendamento) => (
              <CardDemo key={agendamento.id} agendamento={agendamento} isConcluido={true} />
            ))}
          </div>
        </section>
      )}

      {abaAtiva === "cancelados" && (
        <section className="sm:block overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Cancelados</h2>
          <div className="flex sm:grid sm:grid-cols-4 gap-4 w-max sm:w-full px-2">
            {agendamentosCancelados.map((agendamento) => (
              <CardDemo key={agendamento.id} agendamento={agendamento} isCancelado={true} />
            ))}
          </div>
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
                setNovoAgendamento({ ...novoAgendamento, telefone: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-900"
              required
            />
            <input
              type="text"
              placeholder="Serviço"
              value={novoAgendamento.servico}
              onChange={(e) =>
                setNovoAgendamento({ ...novoAgendamento, servico: e.target.value })
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

      {abaAtiva === "historico" && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Histórico</h2>
          <MyChart
            agendamentos={agendamentos}
            agendamentosConcluidos={agendamentosConcluidos}
            agendamentosCancelados={agendamentosCancelados}
            titulo="Agendamentos"
          />
        </section>
      )}
    </main>
  );
}

