import React from 'react';
import { TODOS_CURSOS } from '@/lib/cursos';

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

interface HistoricoTabProps {
  certificates: Certificate[];
  loading: boolean;
  search: string;
  filterCurso: string;
  filterStatus: string;
  currentPage: number;
  totalPages: number;
  onSearchChange: (v: string) => void;
  onFilterCursoChange: (v: string) => void;
  onFilterStatusChange: (v: string) => void;
  onPageChange: (v: number) => void;
  onSearch: () => void;
  onView: (cert: Certificate) => void;
  onEdit: (cert: Certificate) => void;
  onDelete: (cert: Certificate) => void;
}

export default function HistoricoTab({
  certificates,
  loading,
  search,
  filterCurso,
  filterStatus,
  currentPage,
  totalPages,
  onSearchChange,
  onFilterCursoChange,
  onFilterStatusChange,
  onPageChange,
  onSearch,
  onView,
  onEdit,
  onDelete,
}: HistoricoTabProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por nome, CPF, código..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-[#2a2a2a] text-white rounded-xl px-4 py-2.5 border border-gray-700 focus:border-[#d4a017] focus:outline-none transition-colors placeholder:text-gray-500"
          />
          <button
            onClick={onSearch}
            className="bg-[#d4a017] hover:bg-[#b8890f] text-black font-semibold rounded-xl px-6 py-2.5 transition-colors"
          >
            Buscar
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterCurso}
            onChange={(e) => onFilterCursoChange(e.target.value)}
            className="flex-1 bg-[#2a2a2a] text-white rounded-xl px-4 py-2.5 border border-gray-700 focus:border-[#d4a017] focus:outline-none transition-colors"
          >
            <option value="">Todos os Cursos</option>
            {TODOS_CURSOS.map((curso) => (
              <option key={curso} value={curso}>
                {curso}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="flex-1 bg-[#2a2a2a] text-white rounded-xl px-4 py-2.5 border border-gray-700 focus:border-[#d4a017] focus:outline-none transition-colors"
          >
            <option value="">Todos os Status</option>
            <option value="emitido">Emitido</option>
            <option value="pendente">Pendente</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#1a1a1a] rounded-2xl p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#d4a017] border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-gray-400">Carregando certificados...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-2xl p-12 text-center">
          <p className="text-gray-400">Nenhum certificado encontrado.</p>
        </div>
      ) : (
        <>
          <div className="hidden sm:block bg-[#1a1a1a] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Código</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Aluno</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">CPF</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Curso</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Conclusão</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-[#222222] transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-300 font-mono">{cert.codigo}</td>
                      <td className="px-4 py-3 text-sm text-white font-medium">{cert.nomeAluno}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{cert.cpf}</td>
                      <td className="px-4 py-3 text-sm text-gray-300 max-w-[200px] truncate">{cert.curso}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{cert.dataConclusao}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                            cert.status === 'emitido'
                              ? 'bg-green-900/50 text-green-400'
                              : cert.status === 'pendente'
                              ? 'bg-yellow-900/50 text-yellow-400'
                              : 'bg-red-900/50 text-red-400'
                          }`}
                        >
                          {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onView(cert)}
                            className="p-2 text-gray-400 hover:text-[#d4a017] hover:bg-[#2a2a2a] rounded-lg transition-colors"
                            title="Visualizar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => onEdit(cert)}
                            className="p-2 text-gray-400 hover:text-[#d4a017] hover:bg-[#2a2a2a] rounded-lg transition-colors"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => onDelete(cert)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sm:hidden space-y-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-[#1a1a1a] rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-white font-medium">{cert.nomeAluno}</p>
                    <p className="text-xs text-gray-400 font-mono">{cert.codigo}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      cert.status === 'emitido'
                        ? 'bg-green-900/50 text-green-400'
                        : cert.status === 'pendente'
                        ? 'bg-yellow-900/50 text-yellow-400'
                        : 'bg-red-900/50 text-red-400'
                    }`}
                  >
                    {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">
                    <span className="text-gray-500">CPF:</span> {cert.cpf}
                  </p>
                  <p className="text-gray-300 truncate">
                    <span className="text-gray-500">Curso:</span> {cert.curso}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Conclusão:</span> {cert.dataConclusao}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-gray-800">
                  <button
                    onClick={() => onView(cert)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-gray-300 hover:text-[#d4a017] bg-[#2a2a2a] hover:bg-[#333] rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver
                  </button>
                  <button
                    onClick={() => onEdit(cert)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-gray-300 hover:text-[#d4a017] bg-[#2a2a2a] hover:bg-[#333] rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(cert)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-gray-300 hover:text-red-400 bg-[#2a2a2a] hover:bg-[#333] rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-2 text-sm rounded-xl bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-9 h-9 text-sm rounded-xl transition-colors ${
                    page === currentPage
                      ? 'bg-[#d4a017] text-black font-semibold'
                      : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-2 text-sm rounded-xl bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Próximo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
