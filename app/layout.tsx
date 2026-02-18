import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lia Beleza - Aracaju",
  description: "Recepcionista IA para salões de beleza - Agendamentos 24h",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-50">{children}</body>
    </html>
  );
}
