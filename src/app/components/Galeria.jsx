export default function Galeria() {
  return (
    <section className="py-16 px-4 text-center">
      <h2 className="text-3xl font-bold mb-10">Galeria de Cortes</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <img
            key={n}
            src={`/imagens/corte${n}.jpg`} // coloque suas imagens reais aqui
            alt={`Corte ${n}`}
            className="rounded-xl shadow-md object-cover w-full h-60"
          />
          
        ))}
      </div>
    </section>
  );
}
