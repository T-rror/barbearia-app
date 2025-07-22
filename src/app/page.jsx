import Hero from "./components/Hero";
import Servicos from "./components/Servicos";
import Galeria from "./components/Galeria";
import Contato from "./components/Contato";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Hero />
      <Servicos />
      <Galeria />
      <Contato />
    </main>
  );
}

