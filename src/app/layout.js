import "./globals.css";

export const metadata = {
  title: "Barbearia da Neguinha",
  description: "Seu estilo Revela sua Atitude",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <head>
        <link href='https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;600&display=swap'
        rel='stylesheet' 
        />
      </head>
      <body className="antialiased">
  {children}
</body>

    </html>
  );
}
