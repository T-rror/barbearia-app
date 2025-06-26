export default function Hero() {
  return (
    <section
      className="h-screen bg-cover bg-center flex items-center justify-center text-white text-center px-4"
      style={{ backgroundImage: "url('/imagens/hero.jpg')" }}
    >
      <div className="bg-black/60 p-6 rounded-xl shadow-lg shadow-black/30">
        <h1 className="text-6xl font-bebas tracking-widest">Barbearia da Neguinha</h1>
        <p className="font-poppins text-lg animate-fade-in">Seu estilo Revela sua Atitude</p>
        <a
          href="./agendamento"
          className="animate-fade-in bg-black text-white text-center px-6 py-3 pt-1 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Agende seu Corte
        </a>
      </div>
      
    </section>
  );
}



