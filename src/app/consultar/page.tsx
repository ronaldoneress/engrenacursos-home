"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import LandingHeader from "@/components/LandingHeader";
import MobileNav from "@/components/MobileNav";
import { downloadCarteirinhaPdf } from "@/lib/downloadPdf";

interface CertificateResult {
  codigo: string;
  nomeAluno: string;
  cpf: string;
  curso: string;
  cargaHoraria: string;
  dataConclusao: string;
  status: string;
}

type LookupState = "idle" | "loading" | "found" | "not-found" | "error";

function formatDateBR(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ConsultarPage() {
  const searchParams = useSearchParams();
  const urlCode = searchParams.get("codigo");
  const [code, setCode] = useState(urlCode ? urlCode.toUpperCase() : "");
  const [state, setState] = useState<LookupState>("idle");
  const [result, setResult] = useState<CertificateResult | null>(null);
  const [downloadingCarteirinha, setDownloadingCarteirinha] = useState(false);
  const autoSearched = useRef<string | null>(null);

  const doSearch = useCallback(async (raw: string) => {
    const codigo = raw.trim();
    if (!codigo) return;
    setState("loading");
    try {
      const res = await fetch(`/api/consultar?codigo=${encodeURIComponent(codigo)}`);
      if (res.ok) {
        const data = await res.json();
        const cert = data.certificate || data;
        setResult(cert);
        setState("found");
      } else if (res.status === 404) {
        setState("not-found");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }, []);

  // Auto-trigger se ?codigo= estiver na URL
  useEffect(() => {
    if (!urlCode || autoSearched.current === urlCode) return;
    autoSearched.current = urlCode;
    queueMicrotask(() => {
      setCode(urlCode.toUpperCase());
      doSearch(urlCode);
    });
  }, [urlCode, doSearch]);

  const handleSearch = () => {
    if (!code.trim()) return;
    doSearch(code);
  };

  const reset = () => {
    setCode("");
    setState("idle");
    setResult(null);
  };

  const handleDownloadCarteirinha = async () => {
    if (!result) return;
    setDownloadingCarteirinha(true);
    try {
      await downloadCarteirinhaPdf(result.codigo, result.nomeAluno);
    } catch (err) {
      console.error("Erro ao gerar PDF da carteirinha:", err);
      alert("Erro ao gerar a carteirinha. Tente novamente.");
    } finally {
      setDownloadingCarteirinha(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0] mobile-bottom-padding">
      <LandingHeader variant="home" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-24 sm:pt-28 pb-10">
        {state === "idle" && (
          <section>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#d4a017]/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#d4a017]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Verificar Certificado</h2>
              <p className="text-gray-500">Digite o código de autenticidade impresso no seu certificado.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Ex: ENG-2026-89A4"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-mono uppercase text-sm text-gray-900 focus:ring-2 focus:ring-[#d4a017] focus:border-[#d4a017] outline-none transition bg-gray-50"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={!code.trim()}
                  className="px-6 py-3 bg-[#d4a017] text-white font-semibold rounded-xl hover:bg-[#b8890f] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consultar
                </button>
              </div>
            </div>
          </section>
        )}

        {state === "loading" && (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-10 h-10 text-[#d4a017] animate-spin mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-500">Consultando certificado...</p>
          </div>
        )}

        {state === "found" && result && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1a1a1a]">Certificado Confirmado</h2>
              <p className="text-gray-500 mt-1">Este certificado é válido e autêntico.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] px-8 py-6 text-center">
                <p className="text-[#d4a017] text-xs font-bold uppercase tracking-[0.3em] mb-2">Engrena Cursos e Treinamentos</p>
                <p className="text-white text-lg">Certificado de Conclusão</p>
              </div>

              <div className="px-8 py-8 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Certificamos que</p>
                <h3 className="text-3xl font-bold text-[#1a1a1a] mb-6">{result.nomeAluno}</h3>

                <div className="w-24 h-0.5 bg-[#d4a017] mx-auto mb-6" />

                <p className="text-sm text-gray-500 mb-1">Concluiu com êxito o curso de</p>
                <p className="text-xl font-bold text-[#d4a017] mb-6">{result.curso}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto mb-8">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase mb-1">Carga Horária</p>
                    <p className="font-bold text-[#1a1a1a]">{result.cargaHoraria}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase mb-1">Conclusão</p>
                    <p className="font-bold text-[#1a1a1a] text-sm">{formatDateBR(result.dataConclusao)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase mb-1">Código</p>
                    <p className="font-mono font-bold text-[#d4a017] text-sm">{result.codigo}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase mb-1">Status</p>
                    <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">ATIVO</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 px-4 py-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Documento Autenticado
                  </span>
                  <span className="text-xs text-gray-400">Documento protegido conforme LGPD</span>
                </div>
              </div>

              <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span className="text-xs text-gray-400">Certificado verificado em {new Date().toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleDownloadCarteirinha}
                  disabled={downloadingCarteirinha}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-[#d4a017] rounded-xl hover:bg-[#b8890f] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadingCarteirinha ? "Baixando..." : "Baixar Carteirinha"}
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  Nova Consulta
                </button>
              </div>
            </div>
          </div>
        )}

        {state === "not-found" && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Código Não Encontrado</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Nenhum certificado foi localizado com o código informado. Verifique os dígitos e tente novamente.
            </p>
            <button onClick={reset} className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              Nova Consulta
            </button>
          </div>
        )}

        {state === "error" && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Erro na Consulta</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Ocorreu um erro ao realizar a consulta. Tente novamente mais tarde.
            </p>
            <button onClick={reset} className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              Nova Consulta
            </button>
          </div>
        )}
      </main>

      <footer className="bg-[#1a1a1a] text-gray-400 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-white">Engrena Cursos e Treinamentos</p>
          <p className="text-xs text-gray-500 mt-2">&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNav isAuthenticated={true} onLogout={() => {}} />
    </div>
  );
}
