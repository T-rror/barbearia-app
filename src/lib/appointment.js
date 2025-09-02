import api from "./api";

// GET: buscar agendamentos
export async function fetchAgendamentos() {
  try {
    const res = await api.get("/appointment");

    const { pendentes = [], concluidos = [], cancelados = [] } = res.data;

    // historico ainda pode usar todos os agendamentos juntos
    const todosAgendamentos = [...pendentes, ...concluidos, ...cancelados];
    const historico = agruparPorData(todosAgendamentos);

    return { pendentes, concluidos, cancelados, historico };
  } catch (error) {
    console.error(
      "Erro ao buscar agendamentos:",
      error.response?.data || error.message
    );
    throw new Error("Erro ao buscar agendamentos");
  }
}


// PATCH: marcar como concluído
export async function concluirAgendamento(id) {
  console.log("Concluindo agendamento com ID:", id);
  try {
    const res = await api.patch(`/appointment/${id}/concluir`);
    return res.data;
  } catch (error) {
    console.error("Erro ao concluir agendamento:", error.response?.data || error.message);
    throw new Error("Erro ao concluir agendamento");
  }
}

// PATCH: cancelar agendamento
export async function cancelarAgendamento(id) {
  console.log("Cancelando agendamento com ID:", id);
  try {
    const res = await api.patch(`/appointment/${id}/cancelar`);
    return res.data;
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error.response?.data || error.message);
    throw new Error("Erro ao cancelar agendamento");
  }
}

// POST: criar agendamento pelo admin
export async function createAgendamentoAdmin(data) {
  try {
    const res = await api.post("/appointment/admin", data);
    return res.data;
  } catch (error) {
    let errorMessage = "Erro ao criar agendamento pelo admin";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    throw new Error(errorMessage);
  }
}

// Função auxiliar para agrupar por data
function agruparPorData(agendamentos) {
  const resultado = {};
  agendamentos.forEach(({ date }) => {
    const dataObj = new Date(date);
    if (isNaN(dataObj)) return;
    const dia = dataObj.toLocaleDateString("pt-BR");
    resultado[dia] = (resultado[dia] || 0) + 1;
  });
  return resultado;
}
