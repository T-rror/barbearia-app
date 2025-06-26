const servicos = [
  { nome: 'Corte de Cabelo', descricao: 'Cortes variados pra todos os gostos e cabelos', icone: '💈' },
  { nome: 'Bar', descricao: 'Utilidade e lazer', icone: '🧔' },
  { nome: '', descricao: '', icone: '👁️' },
];

export default function Servicos() {
  return (
    <section className="py-16 px-4 text-center">
      <h2 className="text-3xl font-bold mb-10">Nossos Serviços</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {servicos.map((servico, index) => (
          <div key={index} className="bg-gray-100 p-6 rounded-xl shadow-lg">
            <div className="text-5xl mb-4">{servico.icone}</div>
            <h3 className="text-xl font-bold mb-2">{servico.nome}</h3>
            <p className="text-gray-600">{servico.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
