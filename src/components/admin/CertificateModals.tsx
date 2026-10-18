"use client";

import { TODOS_CURSOS } from "@/lib/cursos";

interface Certificate {
  id: number;
  codigo: string;
  nomeAluno: string;
  cpf: string;
  curso: string;
  cargaHoraria: string;
  dataConclusao: string;
  cidade: string;
  numeroRegistro: string | null;
  status: string;
  criadoEm: string;
}

interface ModalsProps {
  cert: Certificate | null;
  showDetail: boolean;
  showEdit: boolean;
  showDelete: boolean;
  editForm: {
    nomeAluno: string;
    cpf: string;
    curso: string;
    dataConclusao: string;
    cidade: string;
    status: string;
  };
  loading: boolean;
  downloadingPdf: boolean;
  onCloseDetail: () => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onEditChange: (form: ModalsProps["editForm"]) => void;
  onSave: () => void;
  onDelete: () => void;
  onDownloadPDF: () => void;
  onWhatsApp: () => void;
}

export default function CertificateModals({
  cert,
  showDetail,
  showEdit,
  showDelete,
  editForm,
  loading,
  downloadingPdf,
  onCloseDetail,
  onCloseEdit,
  onCloseDelete,
  onEditChange,
  onSave,
  onDelete,
  onDownloadPDF,
  onWhatsApp,
}: ModalsProps) {
  if (!cert) return null;

  return (
    <>
      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Detalhes do Certificado</h2>
              <button onClick={onCloseDetail} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <Row label="Código" value={cert.codigo} />
              <Row label="Nome do Aluno" value={cert.nomeAluno} />
              <Row label="CPF" value={cert.cpf} />
              <Row label="Curso" value={cert.curso} />
              <Row label="Carga Horária" value={cert.cargaHoraria} />
              <Row label="Data de Conclusão" value={cert.dataConclusao} />
              <Row label="Cidade" value={cert.cidade} />
              <Row label="Nº Registro" value={cert.numeroRegistro} />
              <Row label="Status" value={cert.status} />
              <Row label="Criado em" value={cert.criadoEm} />
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={onDownloadPDF}
                disabled={downloadingPdf}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-sm"
              >
                {downloadingPdf ? "Baixando..." : "Baixar PDF"}
              </button>
              <button
                onClick={onWhatsApp}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-sm"
              >
                WhatsApp
              </button>
              <button
                onClick={onCloseDetail}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg text-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Editar Certificado</h2>
              <button onClick={onCloseEdit} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-4">
              <FormField label="Nome do Aluno">
                <input
                  type="text"
                  value={editForm.nomeAluno}
                  onChange={(e) => onEditChange({ ...editForm, nomeAluno: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </FormField>
              <FormField label="CPF">
                <input
                  type="text"
                  value={editForm.cpf}
                  onChange={(e) => onEditChange({ ...editForm, cpf: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </FormField>
              <FormField label="Curso">
                <select
                  value={editForm.curso}
                  onChange={(e) => onEditChange({ ...editForm, curso: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Selecione um curso</option>
                  {TODOS_CURSOS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Data de Conclusão">
                <input
                  type="date"
                  value={editForm.dataConclusao}
                  onChange={(e) => onEditChange({ ...editForm, dataConclusao: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </FormField>
              <FormField label="Cidade">
                <input
                  type="text"
                  value={editForm.cidade}
                  onChange={(e) => onEditChange({ ...editForm, cidade: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </FormField>
              <FormField label="Status">
                <select
                  value={editForm.status}
                  onChange={(e) => onEditChange({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="Válido">Válido</option>
                  <option value="Inválido">Inválido</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </FormField>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={onCloseEdit}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={onSave}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-sm"
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Excluir Certificado</h2>
            <p className="text-sm text-gray-600 mb-1">
              Tem certeza que deseja excluir o certificado:
            </p>
            <p className="text-sm font-semibold text-gray-800 mb-1">{cert.codigo}</p>
            <p className="text-sm text-gray-600 mb-4">
              Aluno: <span className="font-semibold">{cert.nomeAluno}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCloseDelete}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={onDelete}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-sm"
              >
                {loading ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
