import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APV — Plataforma de Cursos",
  description: "Sua plataforma de aprendizado online. Acesse cursos, acompanhe seu progresso e conquiste certificados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
