import "./globals.css";

export const metadata = {
  title: "Barbearia da Neguinha | Seu estilo, sua atitude",
  description: "Agende seu horário na Barbearia da Neguinha. Corte, barba e cuidado com personalidade.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>

    </html>
  );
}
