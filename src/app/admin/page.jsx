"use client";

import { useEffect, useState } from "react";
import {
  fetchAgendamentos,
  concluirAgendamento,
  cancelarAgendamento,
  createAgendamentoAdmin,
} from "../../lib/appointment";

import { FiLogOut, FiPlus, FiClock, FiCheck, FiX, FiPhone, FiMessageSquare } from "react-icons/fi";

// Decode simples do JWT
const decodeJWT = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    return JSON.parse(atob(base64Payload));
  } catch {
    return null;
  }
};

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: "", avatar: "" });

  const [abaAtiva, setAbaAtiva] = useState("pendentes");

  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosConcluidos, setAgendamentosConcluidos] = useState([]);
  const [agendamentosCancelados, setAgendamentosCancelados] = useState([]);

  const [loading, setLoading] = useState(false);

  const [novoAgendamento, setNovoAgendamento] = useState({
    nome: "",
    telefone: "",
    servico: "",
    data: "",
    hora: "",
  });

  // Atualiza do backend
  const atualizarListas = async (token) => {
    try {
      const data = await fetchAgendamentos(token);
      setAgendamentos(data.pendentes || []);
      setAgendamentosConcluidos(data.concluidos || []);
      setAgendamentosCancelados(data.cancelados || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Inicialização
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/signin");

    const payload = decodeJWT(token);

    setUserInfo({
      name: payload?.name || "Admin",
      avatar: payload?.avatar || "",
    });

    setUser({ token });

    setLoading(true);
    atualizarListas(token).finally(() => setLoading(false));
  }, []);

  // Criar agendamento
  const handleNovoAgendamento = async (e) => {
    e.preventDefault();

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
      });

      setAbaAtiva("pendentes");
      atualizarListas(user.token);
    } catch {
      alert("Erro ao criar agendamento");
    }
  };

  // Concluir
  const handleConcluir = async (id) => {
    try {
      await concluirAgendamento(id, user.token);
      atualizarListas(user.token);
    } catch {
      alert("Erro ao concluir");
    }
  };

  // Cancelar
  const handleCancelar = async (id) => {
    try {
      await cancelarAgendamento(id, user.token);
      atualizarListas(user.token);
    } catch {
      alert("Erro ao cancelar");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen bg-black text-gray-300">
        Carregando...
      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen flex">

      {/* ------------------------------------------------------------------
          SIDEBAR
      ------------------------------------------------------------------ */}
      <aside className="w-16 bg-black border-r border-gray-800 flex flex-col items-center py-6 gap-8">

        {/* Ícones da sidebar */}
        <button
          className={`p-3 rounded-xl ${abaAtiva === "pendentes" ? "bg-orange-600" : "bg-gray-900"} text-white`}
          onClick={() => setAbaAtiva("pendentes")}
        >
          <FiClock size={20} />
        </button>

        <button
          className={`p-3 rounded-xl ${abaAtiva === "novo" ? "bg-orange-600" : "bg-gray-900"} text-white`}
          onClick={() => setAbaAtiva("novo")}
        >
          <FiPlus size={20} />
        </button>

        <button
          className={`p-3 rounded-xl ${abaAtiva === "concluidos" ? "bg-orange-600" : "bg-gray-900"} text-white`}
          onClick={() => setAbaAtiva("concluidos")}
        >
          <FiCheck size={20} />
        </button>

        <button
          className={`p-3 rounded-xl ${abaAtiva === "cancelados" ? "bg-orange-600" : "bg-gray-900"} text-white`}
          onClick={() => setAbaAtiva("cancelados")}
        >
          <FiX size={20} />
        </button>

        <div className="flex-grow" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-3 rounded-xl bg-red-600 text-white hover:bg-red-700"
        >
          <FiLogOut size={20} />
        </button>
      </aside>

      {/* ------------------------------------------------------------------
          CONTEÚDO
      ------------------------------------------------------------------ */}
      <section className="flex-1 text-white p-6">

        {/* Topbar */}
        <div className="flex justify-end items-center gap-3 mb-6">

          {userInfo.avatar ? (
            <img
              src={userInfo.avatar}
              className="w-10 h-10 rounded-full border border-gray-700 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold">
              {userInfo.name.charAt(0)}
            </div>
          )}

          <div>
            <p className="font-semibold">{userInfo.name}</p>
            <p className="text-xs text-gray-400">Administrador</p>
          </div>
        </div>


        {/* ------------------------------------------------------------------
            ABAS
        ------------------------------------------------------------------ */}

        {/* 🔥 LISTA DE PENDENTES */}
        {abaAtiva === "pendentes" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Agendamentos Pendentes</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agendamentos.map((a) => (
                <CardAgendamento
                  key={a.id}
                  ag={a}
                  onConcluir={handleConcluir}
                  onCancelar={handleCancelar}
                />
              ))}
            </div>
          </>
        )}


        {/* 🔥 LISTA DE CONCLUÍDOS */}
        {abaAtiva === "concluidos" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Concluídos</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agendamentosConcluidos.map((a) => (
                <CardAgendamento key={a.id} ag={a} concluido />
              ))}
            </div>
          </>
        )}


        {/* 🔥 LISTA DE CANCELADOS */}
        {abaAtiva === "cancelados" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Cancelados</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agendamentosCancelados.map((a) => (
                <CardAgendamento key={a.id} ag={a} cancelado />
              ))}
            </div>
          </>
        )}


        {/* 🔥 NOVO AGENDAMENTO */}
        {abaAtiva === "novo" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Criar Agendamento</h2>

            <form onSubmit={handleNovoAgendamento} className="max-w-md space-y-4">

              <input
                type="text"
                placeholder="Nome"
                className="w-full p-3 rounded bg-gray-900 border border-gray-700"
                value={novoAgendamento.nome}
                onChange={(e) => setNovoAgendamento({ ...novoAgendamento, nome: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Telefone"
                className="w-full p-3 rounded bg-gray-900 border border-gray-700"
                value={novoAgendamento.telefone}
                onChange={(e) =>
                  setNovoAgendamento({ ...novoAgendamento, telefone: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Serviço"
                className="w-full p-3 rounded bg-gray-900 border border-gray-700"
                value={novoAgendamento.servico}
                onChange={(e) =>
                  setNovoAgendamento({ ...novoAgendamento, servico: e.target.value })
                }
                required
              />

              <input
                type="date"
                className="w-full p-3 rounded bg-gray-900 border border-gray-700"
                value={novoAgendamento.data}
                onChange={(e) =>
                  setNovoAgendamento({ ...novoAgendamento, data: e.target.value })
                }
                required
              />

              <input
                type="time"
                className="w-full p-3 rounded bg-gray-900 border border-gray-700"
                value={novoAgendamento.hora}
                onChange={(e) =>
                  setNovoAgendamento({ ...novoAgendamento, hora: e.target.value })
                }
                required
              />

              <button className="w-full bg-orange-600 hover:bg-orange-700 p-3 rounded text-white font-bold">
                Criar
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}

/* ======================================================================
   COMPONENTE: CARD DE AGENDAMENTO (BONITO + PREMIUM)
====================================================================== */
function CardAgendamento({ ag, onConcluir, onCancelar, concluido, cancelado }) {
  return (
    <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-xl">

      <p className="text-lg font-bold">{ag.name}</p>
      <p className="text-gray-400 text-sm">{ag.service}</p>

      <div className="mt-2 text-gray-300">
        <p>📅 {ag.date}</p>
        <p>⏰ {ag.time}</p>
      </div>

      {/* AÇÕES */}
      <div className="flex justify-between items-center mt-4">

        {/* WhatsApp */}
        <a
          href={`https://wa.me/55${ag.phone}?text=Olá%20${ag.name},%20seu%20horário%20está%20confirmado!`}
          target="_blank"
          className="p-2 rounded bg-green-600 hover:bg-green-700"
        >
          <FiMessageSquare size={20} />
        </a>

        {/* Ligar */}
        <a href={`tel:${ag.phone}`} className="p-2 rounded bg-blue-600 hover:bg-blue-700">
          <FiPhone size={20} />
        </a>

        {/* Botões de status */}
        {!concluido && !cancelado && (
          <>
            <button
              onClick={() => onConcluir(ag.id)}
              className="p-2 rounded bg-orange-600 hover:bg-orange-700"
            >
              <FiCheck size={20} />
            </button>

            <button
              onClick={() => onCancelar(ag.id)}
              className="p-2 rounded bg-red-600 hover:bg-red-700"
            >
              <FiX size={20} />
            </button>
          </>
        )}

        {concluido && <span className="text-green-500 font-bold">Concluído</span>}
        {cancelado && <span className="text-red-500 font-bold">Cancelado</span>}
      </div>
    </div>
  );
}
