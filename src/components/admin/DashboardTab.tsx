"use client";

interface DashboardData {
  stats: { total: number; mesAtual: number; porCurso: { curso: string; count: number }[] };
  recentes: { id: number; codigo: string; nomeAluno: string; curso: string; dataConclusao: string; status: string; criadoEm: string }[];
}

interface DashboardTabProps { data: DashboardData | null; loading: boolean }

export default function DashboardTab({ data, loading }: DashboardTabProps) {
  if (loading) {
    return (<div className="flex items-center justify-center py-20"><svg className="animate-spin w-8 h-8 text-[#d4a017]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>);
  }
  if (!data) return null;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6"><div className="flex items-center gap-3 sm:gap-4"><div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#d4a017]/10 rounded-xl flex items-center justify-center flex-shrink-0"><svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#d4a017]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div><div><p className="text-xs sm:text-sm text-gray-500">Total</p><p className="text-2xl sm:text-3xl font-bold text-[#d4a017]">{data.stats.total}</p></div></div></div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6"><div className="flex items-center gap-3 sm:gap-4"><div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0"><svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div><div><p className="text-xs sm:text-sm text-gray-500">No Mes</p><p className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">{data.stats.mesAtual}</p></div></div></div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 col-span-2 md:col-span-1"><div className="flex items-center gap-3 sm:gap-4"><div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0"><svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div><div><p className="text-xs sm:text-sm text-gray-500">Cursos</p><p className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">{data.stats.porCurso.length}</p></div></div></div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100"><h2 className="text-base sm:text-lg font-semibold text-[#1a1a1a]">Ultimos Certificados</h2></div>
        <div className="sm:hidden divide-y divide-gray-50">
          {data.recentes.map((cert) => (<div key={cert.id} className="px-4 py-3 hover:bg-gray-50 transition-colors"><div className="flex items-start justify-between mb-1.5"><p className="text-sm font-semibold text-[#1a1a1a] truncate flex-1 mr-2">{cert.nomeAluno}</p><span className={"inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full flex-shrink-0 " + (cert.status === "ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{cert.status}</span></div><p className="text-xs text-gray-500 mb-1">{cert.curso}</p><div className="flex items-center justify-between"><span className="text-xs text-gray-400">{new Date(cert.dataConclusao).toLocaleDateString("pt-BR")}</span><span className="text-xs font-mono text-gray-400">{cert.codigo}</span></div></div>))}
          {data.recentes.length === 0 && <div className="px-4 py-8 text-center text-gray-400 text-sm">Nenhum certificado encontrado.</div>}
        </div>
        <div className="hidden sm:block overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-sm text-gray-500 border-b border-gray-100"><th className="px-6 py-3 font-medium">Aluno</th><th className="px-6 py-3 font-medium">Curso</th><th className="px-6 py-3 font-medium">Data</th><th className="px-6 py-3 font-medium">Codigo</th><th className="px-6 py-3 font-medium">Status</th></tr></thead><tbody>
          {data.recentes.map((cert) => (<tr key={cert.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors"><td className="px-6 py-4 text-sm font-medium text-[#1a1a1a]">{cert.nomeAluno}</td><td className="px-6 py-4 text-sm text-gray-600">{cert.curso}</td><td className="px-6 py-4 text-sm text-gray-600">{new Date(cert.dataConclusao).toLocaleDateString("pt-BR")}</td><td className="px-6 py-4 text-sm text-gray-600 font-mono">{cert.codigo}</td><td className="px-6 py-4"><span className={"inline-flex px-2.5 py-1 text-xs font-semibold rounded-full " + (cert.status === "ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{cert.status}</span></td></tr>))}
          {data.recentes.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">Nenhum certificado encontrado.</td></tr>}
          </tbody></table></div>
      </div>
    </div>
  );
}