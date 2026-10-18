"use client";

import { useState, useRef, useCallback } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface ParsedRow {
  [key: string]: string;
}

interface RowError {
  row: number;
  field: string;
  message: string;
}

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  authHeaders?: Record<string, string>;
  apiUrl?: string;
}

type Step = "upload" | "preview" | "importing" | "result";

export default function BulkImportModal({
  isOpen,
  onClose,
  onComplete,
  authHeaders = {},
  apiUrl = "/api/admin/certificados/import",
}: BulkImportModalProps) {
  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState("");
  const [rawData, setRawData] = useState<ParsedRow[]>([]);
  const [previewData, setPreviewData] = useState<ParsedRow[]>([]);
  const [importResult, setImportResult] = useState<{
    imported: number;
    total: number;
    errors: RowError[];
  } | null>(null);
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setStep("upload");
    setFileName("");
    setRawData([]);
    setPreviewData([]);
    setImportResult(null);
    setImporting(false);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleComplete = useCallback(() => {
    reset();
    onComplete();
  }, [reset, onComplete]);

  const processFile = useCallback((file: File) => {
    setFileName(file.name);
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv" || ext === "txt") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as ParsedRow[];
          setRawData(data);
          setPreviewData(data.slice(0, 10));
          setStep("preview");
        },
        error: () => {
          alert("Erro ao ler o arquivo CSV.");
        },
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target?.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<ParsedRow>(ws);
        setRawData(data);
        setPreviewData(data.slice(0, 10));
        setStep("preview");
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Formato não suportado. Use CSV ou Excel (.xlsx/.xls).");
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = "";
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleImport = async () => {
    setImporting(true);
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ rows: rawData }),
      });

      const data = await res.json();

      if (res.ok) {
        setImportResult({
          imported: data.imported,
          total: data.total,
          errors: [],
        });
        setStep("result");
      } else {
        setImportResult({
          imported: data.parsed || 0,
          total: rawData.length,
          errors: data.errors || [],
        });
        setStep("result");
      }
    } catch {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setImporting(false);
    }
  };

  const getColumns = useCallback(() => {
    if (rawData.length === 0) return [];
    const first = rawData[0];
    return Object.keys(first);
  }, [rawData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Importar Certificados</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {step === "upload" && "Selecione um arquivo CSV ou Excel"}
              {step === "preview" && `${rawData.length} registro(s) encontrado(s)`}
              {step === "importing" && "Importando certificados..."}
              {step === "result" && "Resultado da importação"}
            </p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* STEP: Upload */}
          {step === "upload" && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-300 hover:border-amber-400 hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-700 font-semibold text-lg mb-2">
                Arraste o arquivo aqui ou clique para selecionar
              </p>
              <p className="text-gray-500 text-sm">
                Formatos aceitos: CSV, Excel (.xlsx, .xls)
              </p>

              <div className="mt-6 bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
                <p className="text-sm font-semibold text-gray-700 mb-2">Colunas esperadas:</p>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                  <span><strong>Nome do Aluno*</strong></span>
                  <span><strong>CPF*</strong></span>
                  <span><strong>Curso*</strong></span>
                  <span><strong>Data Conclusão*</strong></span>
                  <span>Cidade (opcional)</span>
                  <span>Carga Horária (opcional)</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">* Campos obrigatórios</p>
                <p className="text-xs text-gray-400 mt-1">Data no formato DD/MM/AAAA</p>

                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Cursos aceitos:</p>
                  <div className="text-xs text-gray-500 leading-relaxed">
                    Empilhadeira, Motoniveladora, Retroescavadeira, Pá Carregadeira, Escavadeira Hidráulica, Soldagem MIG/MAG, Soldagem TIG, Soldagem Eletrodo Revestido, Corte e Solda, Montagem e Manutenção Metalúrgica
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const csv = "Nome do Aluno,CPF,Curso,Data Conclusão,Cidade,Carga Horária\nJoão da Silva,12345678901,Empilhadeira,20/09/2026,Ribeira do Pombal - BA,60\nMaria Santos,98765432100,Soldagem TIG,15/08/2026,,60";
                    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "modelo-importacao-certificados.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Baixar modelo CSV
                </button>
              </div>
            </div>
          )}

          {/* STEP: Preview */}
          {step === "preview" && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {rawData.length} registro(s)
                </div>
                <div className="text-sm text-gray-500">
                  {fileName}
                </div>
              </div>

              <div className="overflow-auto max-h-80 border border-gray-200 rounded-xl">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">#</th>
                      {getColumns().map((col) => (
                        <th key={col} className="px-3 py-2 text-left font-semibold text-gray-600">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                        {getColumns().map((col) => (
                          <td key={col} className="px-3 py-2 text-gray-700 max-w-[200px] truncate">
                            {String(row[col] || "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rawData.length > 10 && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Mostrando 10 de {rawData.length} registros
                </p>
              )}
            </div>
          )}

          {/* STEP: Importing */}
          {step === "importing" && (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full mx-auto mb-4" />
              <p className="text-gray-700 font-semibold">Importando {rawData.length} certificados...</p>
              <p className="text-sm text-gray-500 mt-1">Aguarde, isso pode levar alguns segundos</p>
            </div>
          )}

          {/* STEP: Result */}
          {step === "result" && importResult && (
            <div className="text-center py-8">
              {importResult.errors.length === 0 ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Importação concluída!</h3>
                  <p className="text-gray-600">
                    <span className="font-bold text-green-600">{importResult.imported}</span> certificado(s) importado(s) com sucesso.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Importação com erros</h3>
                  <p className="text-gray-600 mb-4">
                    <span className="font-bold text-green-600">{importResult.imported}</span> importado(s) &bull;{" "}
                    <span className="font-bold text-red-600">{importResult.errors.length}</span> erro(s)
                  </p>

                  <div className="text-left max-h-48 overflow-auto border border-red-200 rounded-xl bg-red-50">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-red-200">
                          <th className="px-3 py-2 text-left font-semibold text-red-700">Linha</th>
                          <th className="px-3 py-2 text-left font-semibold text-red-700">Campo</th>
                          <th className="px-3 py-2 text-left font-semibold text-red-700">Erro</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.errors.map((err, i) => (
                          <tr key={i} className="border-b border-red-100">
                            <td className="px-3 py-2 text-red-700">{err.row}</td>
                            <td className="px-3 py-2 text-red-700">{err.field}</td>
                            <td className="px-3 py-2 text-red-700">{err.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          {step === "upload" && (
            <button onClick={handleClose} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              Cancelar
            </button>
          )}
          {step === "preview" && (
            <>
              <button onClick={reset} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                Voltar
              </button>
              <button
                onClick={() => { setStep("importing"); handleImport(); }}
                disabled={rawData.length === 0}
                className="px-6 py-2.5 text-sm font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                Importar {rawData.length} certificado(s)
              </button>
            </>
          )}
          {step === "result" && (
            <>
              {importResult && importResult.imported > 0 && importResult.errors.length === 0 && (
                <button onClick={handleComplete} className="px-6 py-2.5 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                  Ver Certificados
                </button>
              )}
              {importResult && importResult.errors.length > 0 && (
                <button onClick={reset} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  Tentar Novamente
                </button>
              )}
              <button onClick={handleClose} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                Fechar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
