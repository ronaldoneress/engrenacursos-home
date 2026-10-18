"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import LandingHeader from "@/components/LandingHeader";
import StudentDownloadCenter, {
  type StudentCertificate,
} from "@/components/StudentDownloadCenter";
import { formatCPF, formatDateBR } from "@/lib/utils";

type LookupState = "idle" | "loading" | "results" | "not-found" | "error";

function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export default function BaixarCertificadoPage() {
  const searchParams = useSearchParams();
  const urlCpf = searchParams.get("cpf");
  const [cpf, setCpf] = useState(urlCpf ? formatCPF(urlCpf) : "");
  const [state, setState] = useState<LookupState>("idle");
  const [results, setResults] = useState<StudentCertificate[]>([]);
  const [selected, setSelected] = useState<StudentCertificate | null>(null);
  const autoSearched = useRef<string | null>(null);

  const doSearch = useCallback(async (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 11) return;
    setState("loading");
    setSelected(null);
    try {
      const res = await fetch(`/api/consultar?cpf=${encodeURIComponent(digits)}`);
      if (res.ok) {
        const data = await res.json();
        const certs: StudentCertificate[] = data.certificates || [];
        setResults(certs);
        setState("results");
        if (certs.length === 1) setSelected(certs[0]);
      } else if (res.status === 404) {
        setResults([]);
        setState("not-found");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }, []);

  // Auto-trigger se ?cpf= estiver na URL
  useEffect(() => {
    if (!urlCpf || autoSearched.current === urlCpf) return;
    autoSearched.current = urlCpf;
    queueMicrotask(() => {
      setCpf(formatCPF(urlCpf));
      doSearch(urlCpf);
    });
  }, [urlCpf, doSearch]);

  const digits = cpf.replace(/\D/g, "");
  const canSearch = digits.length === 11;

  const handleSearch = () => {
    if (!canSearch) return;
    doSearch(digits);
  };

  const reset = () => {
    setCpf("");
    setState("idle");
    setResults([]);
    setSelected(null);
  };

  const handleBack = () => {
    if (results.length > 1) setSelected(null);
    else reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0]">
      <LandingHeader variant="home" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pt-24 sm:pt-28 pb-10">
        {state === "idle" && (
          <section>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#d4a017]/10 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-[#d4a017]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                Baixar Certificado
              </h2>
              <p className="text-gray-500">
                Digite o CPF do aluno para localizar os certificados emitidos.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CPF do aluno
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 013.17.739A2.25 2.25 0 0118 15.75v-.625A2.25 2.25 0 0115.75 13H5.5a2.25 2.25 0 01-2.25-2.25v-.625c0-.626.24-1.21.656-1.647a6.72 6.72 0 013.171-.74c.44.315.78.722.996 1.19a1.875 1.875 0 103.408 0c.216-.468.556-.875.996-1.19z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cpf}
                    onChange={(e) => setCpf(maskCPF(e.target.value))}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-mono text-sm text-gray-900 focus:ring-2 focus:ring-[#d4a017] focus:border-[#d4a017] outline-none transition bg-gray-50"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={!canSearch}
                  className="px-6 py-3 bg-[#d4a017] text-white font-semibold rounded-xl hover:bg-[#b8890f] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buscar
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Seus dados são usados apenas para localizar os certificados
                emitidos em seu nome.
              </p>
            </div>
          </section>
        )}

        {state === "loading" && (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="w-10 h-10 text-[#d4a017] animate-spin mb-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-gray-500">Buscando certificados...</p>
          </div>
        )}

        {state === "results" && !selected && (
          <div className="space-y-6">
            <div className="text-center py-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#1a1a1a]">
                {results.length === 1
                  ? "1 certificado encontrado"
                  : `${results.length} certificados encontrados`}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Selecione o certificado que deseja baixar.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {results.map((cert) => (
                <button
                  key={cert.codigo}
                  onClick={() => setSelected(cert)}
                  className="text-left bg-white rounded-2xl shadow-md border border-gray-200 p-5 hover:border-[#d4a017] hover:shadow-lg transition group"
                >
                  <p className="font-bold text-[#1a1a1a] group-hover:text-[#d4a017] transition">
                    {cert.curso}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDateBR(cert.dataConclusao)} · {cert.cargaHoraria}
                  </p>
                  <p className="text-xs text-gray-400 font-mono mt-2">
                    {cert.codigo}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-[#d4a017]">
                    Ver e baixar
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12l-7.5 7.5M3 12h17.25"
                      />
                    </svg>
                  </span>
                </button>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={reset}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                Nova busca
              </button>
            </div>
          </div>
        )}

        {state === "results" && selected && (
          <StudentDownloadCenter
            cert={selected}
            onBack={handleBack}
            onNewSearch={reset}
          />
        )}

        {state === "not-found" && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">
              Nenhum certificado encontrado
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Não localizamos certificados emitidos para este CPF. Confira os
              dígitos informados e tente novamente.
            </p>
            <button
              onClick={reset}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              Nova busca
            </button>
          </div>
        )}

        {state === "error" && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">
              Erro na busca
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Ocorreu um erro ao consultar os certificados. Tente novamente mais
              tarde.
            </p>
            <button
              onClick={reset}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              Nova busca
            </button>
          </div>
        )}
      </main>

      <footer className="bg-[#1a1a1a] text-gray-400 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-white">
            Engrena Cursos e Treinamentos
          </p>
          <p className="text-xs text-gray-400 mt-2">
            &copy; {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
