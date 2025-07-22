'use client';

import { useEffect, useState } from 'react';
import { fetchAgendamentos, concluirAgendamento } from '../../lib/api';
import AgendamentoCard from '../components/admin/AgendamentoCard';
import ConcluidoCard from '../components/admin/ConcluidoCard';
import HistoricoResumo from '../components/admin/HistoricoResumo';
import SidebarFiltro from '../components/admin/SidebarFiltro';
import Header from '../components/admin/Header';


export default function AdminPage() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosConcluidos, setAgendamentosConcluidos] = useState([]);
  const [historico, setHistorico] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('pendentes');


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return (window.location.href = '/signin');
    setUser({ token });
    setLoading(true);

    fetchAgendamentos(token)
      .then(({ pendentes, concluidos, historico }) => {
        setAgendamentos(pendentes);
        setAgendamentosConcluidos(concluidos);
        setHistorico(historico);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleConcluir = async (id) => {
    try {
      await concluirAgendamento(id, user.token);
      const { pendentes, concluidos, historico } = await fetchAgendamentos(user.token);
      setAgendamentos(pendentes);
      setAgendamentosConcluidos(concluidos);
      setHistorico(historico);
    } catch (error) {
      console.error(error);
      alert('Erro ao concluir agendamento');
    }
  };

   const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/signin';
  };

  console.log('Usuário logado:', user);

  return (
       <div className="h-screen flex flex-col">
      <Header onLogout={handleLogout} user={user} />
      <div className="flex flex-1">
        <SidebarFiltro filtro={filtro} setFiltro={setFiltro} />

        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Painel do Admin</h1>

          {loading && <p>Carregando agendamentos...</p>}

          {!loading && (
            <>
              {filtro === 'pendentes' && (
                <>
                  <h2 className="text-xl">Agendamentos Pendentes</h2>
                  {agendamentos.map((a) => (
                    <AgendamentoCard key={a.id} agendamento={a} onConcluir={handleConcluir} />
                  ))}
                </>
              )}

              {filtro === 'concluidos' && (
                <>
                  <h2 className="text-xl">Concluídos Recentes</h2>
                  {agendamentosConcluidos.map((a) => (
                    <ConcluidoCard key={a.id} agendamento={a} />
                  ))}
                  <h2 className="text-xl mt-6">Resumo por Dia</h2>
                  <HistoricoResumo historico={historico} />
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
