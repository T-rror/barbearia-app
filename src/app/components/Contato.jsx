import { Phone, Instagram, Shield } from "lucide-react";

export default function Contato() {
  return (
    <section className="bg-black text-white  py-10 px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Entre em contato</h2>
      <div className="flex justify-center gap-4 mt-4">
        
        <p className="flex items-center gap-2 text-orange-500 hover:scale-105 transition-transform duration-300">
          Rua da Lapa - 2
        </p>

        <a
          href="https://wa.me/5521995017071"
          target="_blank"
          className="flex items-center gap-2 text-green-500 hover:scale-105 transition-transform duration-300"
        >
          <Phone size={20} />
          WhatsApp
        </a>

        <a
          href="https://www.instagram.com/barbeariadaneguinha01?utm_source=ig_web_button_share_sheet&igsh=MXJveHAzajNkZGYyaA=="
          target="_blank"
          className="flex items-center gap-2 text-pink-500 hover:scale-105 transition-transform duration-300"
        >
          <Instagram size={20} />
          Instagram
        </a>

        <a
          href="/admin"
          className="flex items-center gap-2 text-blue-500 hover:scale-105 transition-transform duration-300"
        >
          <Shield size={20} />
          Painel do Administrador
        </a>

      </div>
    </section>
  );
}
