import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Desativa a pré-renderização estática para o layout
export const dynamic = "force-dynamic";
export const revalidate = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lista de Compras",
  description: "Aplicativo para gerenciar sua lista de compras",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
