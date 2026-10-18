"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import MobileNav from "@/components/MobileNav";
import WhatsAppModal from "@/components/WhatsAppModal";
import { generateCertificatePDF } from "@/lib/generatePDF";
import { useToast } from "@/components/Toast";
import DashboardTab from "@/components/admin/DashboardTab";
import HistoricoTab from "@/components/admin/HistoricoTab";
import CertificateModals from "@/components/admin/CertificateModals";
import BulkImportModal from "@/components/admin/BulkImportModal";

interface DashboardData {
  stats: {
    total: number;
    mesAtual: number;
    porCurso: { curso: string; count: number }[];
  };
  recentes: {
    id: number;
    codigo: string;
    nomeAluno: string;
    curso: string;
    dataConclusao: string;
    status: string;
    criadoEm: string;
  }[];
}

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

interface CertificatesResponse {
  certificates: Certificate[];
  total: number;
  page: number;
  totalPages: number;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("engrena_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"dashboard" | "historico">("dashboard");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [search, setSearch] = useState("");
  const [filterCurso, setFilterCurso] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingCertificates, setLoadingCertificates] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState("");
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const [editForm, setEditForm] = useState({
    nomeAluno: "",
    cpf: "",
    curso: "",
    dataConclusao: "",
    cidade: "",
    status: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoadingDashboard(true);
      const res = await fetch("/api/admin/dashboard", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Erro ao carregar dashboard");
      const data = await res.json();
      setDashboardData(data);
    } catch {
      setError("Erro ao carregar dados do dashboard.");
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  const fetchCertificates = useCallback(async (page: number, searchVal: string, cursoVal: string, statusVal: string) => {
    try {
      setLoadingCertificates(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (searchVal) params.set("search", searchVal);
      if (cursoVal) params.set("curso", cursoVal);
      if (statusVal) params.set("status", statusVal);

      const res = await fetch(`/api/admin/certificados?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Erro ao carregar certificados");
      const data: CertificatesResponse = await res.json();
      setCertificates(data.certificates);
      setTotalPages(data.totalPages);
    } catch {
      setError("Erro ao carregar certificados.");
    } finally {
      setLoadingCertificates(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (activeTab === "historico") {
      fetchCertificates(currentPage, search, filterCurso, filterStatus);
    }
  }, [activeTab, currentPage, search, filterCurso, filterStatus, fetchCertificates]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCertificates(1, search, filterCurso, filterStatus);
  };

  const openDetail = (cert: Certificate) => {
    setSelectedCert(cert);
    setShowDetailModal(true);
  };

  const openEdit = (cert: Certificate) => {
    setSelectedCert(cert);
    setEditForm({
      nomeAluno: cert.nomeAluno,
      cpf: cert.cpf,
      curso: cert.curso,
      dataConclusao: cert.dataConclusao,
      cidade: cert.cidade,
      status: cert.status,
    });
    setShowEditModal(true);
  };

  const openDelete = (cert: Certificate) => {
    setSelectedCert(cert);
    setShowDeleteModal(true);
  };

  const handleSave = async () => {
    if (!selectedCert) return;
    try {
      setLoadingAction(true);
      const res = await fetch(`/api/admin/certificados/${selectedCert.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      const updatedCert = { ...selectedCert, ...editForm };
      setSelectedCert(updatedCert);
      setShowEditModal(false);
      fetchCertificates(currentPage, search, filterCurso, filterStatus);
      if (activeTab === "dashboard") fetchDashboard();
      setPreviewCert(updatedCert);
      showToast("Certificado atualizado com sucesso!", "success");
    } catch {
      setError("Erro ao salvar certificado.");
      showToast("Erro ao salvar certificado.", "error");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDownloadPDF = async () => {
    const cert = previewCert || selectedCert;
    if (!cert) return;
    setDownloadingPdf(true);
    try {
      await generateCertificatePDF({
        studentName: cert.nomeAluno,
        cpf: cert.cpf,
        completionDate: cert.dataConclusao,
        course: cert.curso,
        validationCode: cert.codigo,
        city: cert.cidade || "Ribeira do Pombal - BA",
        cargaHoraria: cert.cargaHoraria || "60",
      });
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      showToast("Erro ao gerar o PDF. Tente novamente.", "error");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCert) return;
    try {
      setLoadingAction(true);
      const res = await fetch(`/api/admin/certificados/${selectedCert.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Erro ao excluir");
      setShowDeleteModal(false);
      setSelectedCert(null);
      fetchCertificates(currentPage, search, filterCurso, filterStatus);
      fetchDashboard();
      showToast("Certificado excluido com sucesso!", "success");
    } catch {
      setError("Erro ao excluir certificado.");
      showToast("Erro ao excluir certificado.", "error");
    } finally {
      setLoadingAction(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#f0f0f0] mobile-bottom-padding">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/logo.svg" alt="Engrena" className="h-8 sm:h-12 w-auto" />
            <h1 className="text-lg sm:text-2xl font-bold text-secondary">Painel Administrativo</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Voltar ao Sistema</span>
              <span className="sm:hidden">Voltar</span>
            </a>
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-emerald-600 rounded-lg sm:rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="hidden sm:inline">Importar</span>
              <span className="sm:hidden">Importar</span>
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-primary rounded-lg sm:rounded-xl hover:bg-primary-dark transition-colors"
            >
              <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Novo Certificado</span>
              <span className="sm:hidden">Novo</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {error}
            <button onClick={() => setError("")} className="ml-auto text-red-500 hover:text-red-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-2 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "dashboard"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("historico")}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "historico"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Historico
          </button>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <DashboardTab data={dashboardData} loading={loadingDashboard} />
        )}

        {/* HISTORICO TAB */}
        {activeTab === "historico" && (
          <HistoricoTab
            certificates={certificates}
            loading={loadingCertificates}
            search={search}
            filterCurso={filterCurso}
            filterStatus={filterStatus}
            currentPage={currentPage}
            totalPages={totalPages}
            onSearchChange={setSearch}
            onFilterCursoChange={(v) => { setFilterCurso(v); setCurrentPage(1); }}
            onFilterStatusChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}
            onPageChange={setCurrentPage}
            onSearch={handleSearch}
            onView={openDetail}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}
      </main>

      {/* CERTIFICATE MODALS */}
      <CertificateModals
        cert={selectedCert}
        showDetail={showDetailModal}
        showEdit={showEditModal}
        showDelete={showDeleteModal}
        editForm={editForm}
        loading={loadingAction}
        downloadingPdf={downloadingPdf}
        onCloseDetail={() => setShowDetailModal(false)}
        onCloseEdit={() => setShowEditModal(false)}
        onCloseDelete={() => setShowDeleteModal(false)}
        onEditChange={setEditForm}
        onSave={handleSave}
        onDelete={handleDelete}
        onDownloadPDF={handleDownloadPDF}
        onWhatsApp={() => {
          setPreviewCert(selectedCert);
          setShowDetailModal(false);
          setShowWhatsApp(true);
        }}
      />

      {/* Mobile Navigation */}
      <MobileNav isAuthenticated={isAuthenticated} onLogout={() => {}} />

      {/* WhatsApp Modal */}
      {previewCert && (
        <WhatsAppModal
          studentName={previewCert.nomeAluno}
          validationCode={previewCert.codigo}
          isOpen={showWhatsApp}
          onClose={() => setShowWhatsApp(false)}
        />
      )}

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onComplete={() => {
          setShowImportModal(false);
          fetchDashboard();
          if (activeTab === "historico") {
            fetchCertificates(1, search, filterCurso, filterStatus);
          }
        }}
        authHeaders={getAuthHeaders()}
      />
    </div>
  );
}
