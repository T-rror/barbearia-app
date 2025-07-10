'use client';
import { useEffect, useState } from 'react';
import { Button } from '../../../src/shadcn/components/ui/button';

// Componentes reutilizáveis
import AgendamentoCard from '../../../src/app/components/admin/AgendamentoCard';
import ConcluidoCard from '../../../src/app/components/admin/ConcluidoCard';
import HistoricoResumo from '../../../src/app/components/admin/HistoricoResumo';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosConcluidos, setAgendamentosConcluidos] = useState([]);
  const [historico, setHistorico] = useState({});
  const [showConcluidos, setShowConcluidos] = useState(false);

  // Autenticação
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/signin';
    } else {
      setUser({ token });
    }
  }, []);

  if (!user) {
    return <p className="text-center mt-10">Verificando autenticação...</p>;
  }

  return (
    <section className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Painel de Agendamentos</h1>

      <p className="text-center text-gray-500">Integração com o backend NestJS em construção.</p>

      <div className="mt-10 text-center">
        <Button disabled className="opacity-50 cursor-not-allowed">
          Painel em construção
        </Button>
      </div>

      
       <div className="space-y-4">
        {agendamentos.map(agendamento => (
          <AgendamentoCard
            key={agendamento.id}
            agendamento={agendamento}
            onConcluir={concluirAgendamento}
          />
        ))}
      </div>

      {showConcluidos && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Agendamentos Concluídos</h2>
          {agendamentosConcluidos.length === 0 ? (
            <p>Nenhum agendamento concluído.</p>
          ) : (
            agendamentosConcluidos.map(a => (
              <ConcluidoCard key={a.id} agendamento={a} />
            ))
          )}
        </div>
      )}

      <HistoricoResumo historico={historico} /> 
    </section>
  );
}
