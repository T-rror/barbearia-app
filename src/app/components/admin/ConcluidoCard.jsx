export default function ConcluidoCard({ agendamento }) {
  const data = new Date(agendamento.date);
  const dataFormatada = isNaN(data) ? '' : data.toLocaleDateString('pt-BR');
  const hora = agendamento.time;

  let concluidoAt = 'Data não disponível';
  if (agendamento.concludedAt) {
    const concluidoDate = new Date(agendamento.concludedAt);
    concluidoAt = isNaN(concluidoDate) ? 'Data inválida' : concluidoDate.toLocaleString('pt-BR');
  }

  return (
    <div className="border p-3 rounded mb-2">
      <p><strong>Nome:</strong> {agendamento.name}</p>
      <p><strong>Serviço:</strong> {agendamento.service}</p>
      <p><strong>Data:</strong> {dataFormatada} às {hora}</p>
      <p className="text-sm text-gray-500">
        Concluído em: {concluidoAt}
      </p>
    </div>
  );
}
