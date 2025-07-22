// GET: buscar agendamentos
export async function fetchAgendamentos(token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointment`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erro ao buscar agendamentos");

  const data = await res.json();

  const concluidos = data.filter((a) => a.concluido === true);
  const pendentes = data.filter((a) => !a.concluido);
  const historico = agruparPorData(data);

  return { pendentes, concluidos, historico };
}

// PATCH: marcar como concluído
export async function concluirAgendamento(id, token) {
  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointment/${id}/concluir`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erro no servidor:", errorText);
    throw new Error("Erro ao concluir agendamento");
  }

  return await res.json();
}

// Função auxiliar para agrupar por data
function agruparPorData(agendamentos) {
  const resultado = {};
  agendamentos.forEach(({ date }) => {
    const dataObj = new Date(date);
    if (isNaN(dataObj)) return; // evita datas inválidas
    const dia = dataObj.toLocaleDateString("pt-BR");
    resultado[dia] = (resultado[dia] || 0) + 1;
  });
  return resultado;
}
