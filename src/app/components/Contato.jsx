export default function Contato() {
  return (
    <section className="bg-black text-white border py-10 px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Entre em contato</h2>
      <p className="mb-2">📍 Rua Exemplo, 123 - Bairro Legal</p>
      <p className="mb-2">📱 (11) 99999-9999</p>
      <div className="flex justify-center gap-4 mt-4">
        <a href="https://wa.me/SEUNUMERO" target="_blank" className="underline">WhatsApp</a>
        <a href="https://instagram.com/SEUINSTAGRAM" target="_blank" className="underline">Instagram</a>
        <a href="/admin" className="text-blue-600 underline">
         Painel do Administrador
         </a>
      </div>
    </section>
  );
}
