// src/components/admin/AgendamentoCard.jsx
"use client";

import { Button } from "../../../../src/shadcn/components/ui/button";

export default function AgendamentoCard({ agendamento, onConcluir }) {
  const data = new Date(agendamento.date);
  const dataFormatada = isNaN(data) ? "" : data.toLocaleDateString("pt-BR");

  return (
    <div className="border p-4 rounded-lg shadow">
      <p>
        <strong>Nome:</strong> {agendamento.name}
      </p>
      <p>
        <strong>Telefone:</strong> {agendamento.phone}
      </p>
      <p>
        <strong>Serviço:</strong> {agendamento.service}
      </p>
      <p>
        <strong>Data:</strong> {dataFormatada}
      </p>
      <p>
        <strong>Hora:</strong> {agendamento.time}
      </p>

      {!agendamento.concludedAt && (
        <Button
          variant="destructive"
          onClick={() => onConcluir(agendamento.id)}
        >
          Concluir
        </Button>
      )}
    </div>
  );
}
