"use client";

import { useEffect, useRef, useState } from "react";
import {
  downloadCertificatePdf,
  downloadCarteirinhaPdf,
} from "@/lib/downloadPdf";
import { formatCPF, formatDateBR } from "@/lib/utils";

const DOC_W = 1122;
const DOC_H = 793;

export interface StudentCertificate {
  codigo: string;
  nomeAluno: string;
  cpf: string;
  curso: string;
  cargaHoraria: string;
  dataConclusao: string;
  cidade: string;
  numeroRegistro: string | null;
  status: string;
}

interface StudentDownloadCenterProps {
  cert: StudentCertificate;
  onBack?: () => void;
  onNewSearch: () => void;
}

type Face = "front" | "back";

interface PreviewState {
  key: string;
  html: string;
  error?: boolean;
}

function PreviewFrame({
  state,
  title,
}: {
  state: PreviewState | null;
  title: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / DOC_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full">
      <div
        className="relative mx-auto bg-white overflow-hidden"
        style={{
          width: DOC_W * scale,
          height: DOC_H * scale,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: DOC_W,
            height: DOC_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {!state ? (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-500 text-sm"
              style={{ background: "#fafafa" }}
            >
              <svg
                className="w-8 h-8 text-[#d4a017] animate-spin"
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
              Carregando visualização...
            </div>
          ) : state.error || !state.html ? (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-red-600 text-sm"
              style={{ background: "#fafafa" }}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Não foi possível carregar a visualização.
            </div>
          ) : (
            <iframe
              srcDoc={state.html}
              sandbox="allow-scripts allow-same-origin"
              title={title}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "white",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentDownloadCenter({
  cert,
  onBack,
  onNewSearch,
}: StudentDownloadCenterProps) {
  const [face, setFace] = useState<Face>("front");
  const [certPreview, setCertPreview] = useState<PreviewState | null>(null);
  const [cartPreview, setCartPreview] = useState<PreviewState | null>(null);
  const [downloadingCert, setDownloadingCert] = useState(false);
  const [certDone, setCertDone] = useState(false);
  const [downloadingCart, setDownloadingCart] = useState(false);
  const [cartDone, setCartDone] = useState(false);

  const certKey = `${cert.codigo}:${face}`;
  const cartKey = cert.codigo;
  const certState = certPreview?.key === certKey ? certPreview : null;
  const cartState = cartPreview?.key === cartKey ? cartPreview : null;

  useEffect(() => {
    let cancelled = false;
    const key = `${cert.codigo}:${face}`;

    fetch("/api/certificados/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: cert.nomeAluno,
        cpf: cert.cpf,
        completionDate: cert.dataConclusao,
        course: cert.curso,
        city: cert.cidade,
        cargaHoraria: cert.cargaHoraria,
        validationCode: cert.codigo,
        regNumber: cert.numeroRegistro,
        face,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar preview");
        return res.text();
      })
      .then((html) => {
        if (!cancelled) setCertPreview({ key, html });
      })
      .catch((err) => {
        console.error("Erro ao buscar preview:", err);
        if (!cancelled) setCertPreview({ key, html: "", error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [cert, face]);

  useEffect(() => {
    let cancelled = false;
    const key = cert.codigo;

    fetch("/api/carteirinhas/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: cert.nomeAluno,
        cpf: cert.cpf,
        completionDate: cert.dataConclusao,
        course: cert.curso,
        validationCode: cert.codigo,
        regNumber: cert.numeroRegistro,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar preview");
        return res.text();
      })
      .then((html) => {
        if (!cancelled) setCartPreview({ key, html });
      })
      .catch((err) => {
        console.error("Erro ao buscar preview da carteirinha:", err);
        if (!cancelled) setCartPreview({ key, html: "", error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [cert]);

  const handleDownloadCert = async () => {
    setDownloadingCert(true);
    setCertDone(false);
    try {
      await downloadCertificatePdf(cert.codigo, cert.nomeAluno);
      setCertDone(true);
      setTimeout(() => setCertDone(false), 3500);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setDownloadingCert(false);
    }
  };

  const handleDownloadCart = async () => {
    setDownloadingCart(true);
    setCartDone(false);
    try {
      await downloadCarteirinhaPdf(cert.codigo, cert.nomeAluno);
      setCartDone(true);
      setTimeout(() => setCartDone(false), 3500);
    } catch (err) {
      console.error("Erro ao gerar PDF da carteirinha:", err);
      alert("Erro ao gerar a carteirinha. Tente novamente.");
    } finally {
      setDownloadingCart(false);
    }
  };

  const statusLabel =
    cert.status.charAt(0).toUpperCase() + cert.status.slice(1);
  const statusClasses =
    cert.status === "cancelado"
      ? "bg-red-100 text-red-700"
      : cert.status === "pendente"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700";

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">{cert.nomeAluno}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {cert.curso} · {cert.cargaHoraria} · {formatDateBR(cert.dataConclusao)}
          </p>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Código {cert.codigo} · CPF {formatCPF(cert.cpf)}
          </p>
        </div>
        <span
          className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${statusClasses}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Certificado */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-[#1a1a1a]">Certificado</h3>
              <p className="text-xs text-gray-500">A4 paisagem · frente e verso</p>
            </div>
            <div className="flex rounded-lg overflow-hidden border border-[#d4a017]/40">
              {(["front", "back"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFace(f)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                    face === f
                      ? "bg-[#d4a017] text-white"
                      : "bg-white text-[#d4a017] hover:bg-[#d4a017]/10"
                  }`}
                >
                  {f === "front" ? "Frente" : "Verso"}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 bg-gray-100 flex-1">
            <PreviewFrame
              state={certState}
              title={face === "front" ? "Frente do certificado" : "Verso do certificado"}
            />
          </div>
          <div className="px-5 py-4 border-t border-gray-100">
            <button
              onClick={handleDownloadCert}
              disabled={downloadingCert}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-[#d4a017] rounded-xl hover:bg-[#b8890f] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {downloadingCert
                ? "Gerando PDF..."
                : certDone
                  ? "PDF Baixado!"
                  : "Baixar Certificado (PDF)"}
            </button>
          </div>
        </div>

        {/* Carteirinha */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-[#1a1a1a]">Carteirinha</h3>
              <p className="text-xs text-gray-500">A4 paisagem · as duas faces</p>
            </div>
          </div>
          <div className="p-4 bg-gray-100 flex-1">
            <PreviewFrame state={cartState} title="Carteirinha de estudante" />
          </div>
          <div className="px-5 py-4 border-t border-gray-100">
            <button
              onClick={handleDownloadCart}
              disabled={downloadingCart}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-[#d4a017] rounded-xl hover:bg-[#b8890f] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {downloadingCart
                ? "Gerando PDF..."
                : cartDone
                  ? "PDF Baixado!"
                  : "Baixar Carteirinha (PDF)"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            Voltar
          </button>
        )}
        <button
          onClick={onNewSearch}
          className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          Nova busca por CPF
        </button>
      </div>
    </div>
  );
}
