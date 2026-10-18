import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/Toast";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Engrena Cursos | Capacitação em Máquinas Pesadas",
  description:
    "Cursos presenciais de máquinas pesadas com certificação reconhecida. Empilhadeira, Motoniveladora, Retroescavadeira, Pá Carregadeira e Escavadeira Hidráulica.",
  keywords: [
    "cursos máquinas pesadas",
    "capacitação operacional",
    "empilhadeira",
    "retroescavadeira",
    "pá carregadeira",
    "escavadeira hidráulica",
    "motoniveladora",
    "certificação máquinas pesadas",
  ],
  openGraph: {
    title: "Engrena Cursos | Capacitação em Máquinas Pesadas",
    description:
      "Formação presencial com certificação reconhecida para transformar sua carreira operacional.",
    url: "https://engrenacursos.com.br",
    siteName: "Engrena Cursos",
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/engrena-cursos.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#0F172A] text-white font-[family-name:var(--font-inter)]">
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
