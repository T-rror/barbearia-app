import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body className={cn(geistSans.variable, geistMono.variable, "antialiased")}>
  {children}
</body>

    </html>
  );
}
