// src/components/admin/AgendamentoCard.jsx
'use client'

import { Button } from '../../../../src/shadcn/components/ui/button'

export default function AgendamentoCard({ agendamento, onConcluir }) {
  return (
    <div className="border p-4 rounded-lg shadow">
      <p><strong>Nome:</strong> {agendamento.nome}</p>
      <p><strong>Telefone:</strong> {agendamento.telefone}</p>
      <p><strong>Data:</strong> {agendamento.data}</p>
      <p><strong>Hora:</strong> {agendamento.hora}</p>
      <Button variant="destructive" onClick={() => onConcluir(agendamento.id)}>
        Concluir
      </Button>
    </div>
  )
}
