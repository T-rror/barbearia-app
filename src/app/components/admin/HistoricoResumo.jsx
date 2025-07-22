export default function HistoricoResumo({ historico }) {
  const totalCortes = Object.values(historico).reduce(
    (acc, qtd) => acc + qtd,
    0
  );
  const hoje = new Date();
  const doisMesesAtras = new Date();
  doisMesesAtras.setMonth(hoje.getMonth() - 2);

  const formatDate = (date) => date.toLocaleDateString("pt-BR");

  const periodo = `${formatDate(doisMesesAtras)} até ${formatDate(hoje)}`;

  return (
    <footer className="mt-16 border-t pt-6 text-center text-sm text-gray-600">
      <p className="font-semibold">📊 Histórico dos Últimos 2 Meses</p>
      <p>
        Total de cortes realizados: <strong>{totalCortes}</strong>
      </p>
      <p>
        Período: <strong>{periodo}</strong>
      </p>
    </footer>
  );
}
