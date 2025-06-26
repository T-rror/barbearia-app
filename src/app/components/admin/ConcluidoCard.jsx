// src/components/admin/ConcluidoCard.jsx

export default function ConcluidoCard({ agendamento }) {
  return (
    <div className="border p-3 rounded mb-2">
      <p><strong>Nome:</strong> {agendamento.nome}</p>
      <p><strong>Data:</strong> {agendamento.data} às {agendamento.hora}</p>
      <p className="text-sm text-gray-500">
        Concluído em: {agendamento.concluidoEm?.toDate?.().toLocaleString()}
      </p>
    </div>
  )
}
