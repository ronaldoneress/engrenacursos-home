"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import LandingHeader from "@/components/LandingHeader";

interface LandingData {
  stats: {
    totalCertificates: number;
    totalCourses: number;
    totalStudents: number;
  };
  courses: {
    id: string;
    name: string;
    hours: string;
    description: string;
    studentCount: number;
  }[];
  testimonials: {
    name: string;
    initials: string;
    course: string;
    date: string;
    city: string;
  }[];
}

const courseIcons: Record<string, ReactNode> = {
  Empilhadeira: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="20" width="18" height="14" rx="2" />
      <rect x="9" y="23" width="12" height="8" rx="1" opacity="0.3" />
      <path d="M24 34h8a3 3 0 003-3V16" />
      <path d="M35 16v-3a1.5 1.5 0 00-1.5-1.5h-6" />
      <line x1="24" y1="14" x2="24" y2="34" />
      <circle cx="12" cy="38" r="3" />
      <circle cx="36" cy="38" r="3" />
    </svg>
  ),
  Motoniveladora: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="14" width="20" height="12" rx="2" />
      <rect x="17" y="17" width="8" height="6" rx="1" opacity="0.3" />
      <line x1="8" y1="30" x2="40" y2="30" />
      <circle cx="12" cy="36" r="3.5" />
      <circle cx="36" cy="36" r="3.5" />
      <path d="M4 28l4 8" />
      <rect x="28" y="20" width="12" height="2.5" rx="1.25" opacity="0.3" />
    </svg>
  ),
  Retroescavadeira: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="15" y="12" width="18" height="14" rx="2" />
      <rect x="18" y="15" width="8" height="8" rx="1" opacity="0.3" />
      <path d="M33 18l8-4v8l-8-4" />
      <path d="M15 26l-6 6" />
      <path d="M9 32l-3 3" />
      <circle cx="12" cy="40" r="3" />
      <circle cx="36" cy="40" r="3" />
      <line x1="15" y1="40" x2="33" y2="40" />
    </svg>
  ),
  "Pá Carregadeira": (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="16" y="14" width="16" height="12" rx="2" />
      <rect x="19" y="17" width="8" height="6" rx="1" opacity="0.3" />
      <line x1="10" y1="30" x2="38" y2="30" />
      <path d="M10 30l3-5" />
      <path d="M5 27c0 0 1.5 6 6 6s6-5 6-5" />
      <circle cx="15" cy="38" r="3" />
      <circle cx="37" cy="38" r="3" />
      <rect x="32" y="22" width="10" height="3" rx="1.5" opacity="0.3" />
    </svg>
  ),
  Escavadeira: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="20" width="14" height="10" rx="2" />
      <rect x="17" y="23" width="6" height="4" rx="1" opacity="0.3" />
      <path d="M28 22l6-8h3" />
      <path d="M37 14l-3 8" />
      <path d="M34 22l-8-3" />
      <path d="M24 16c-1.5-4-1.5-9 0-12" />
      <circle cx="17" cy="36" r="3.5" />
      <circle cx="37" cy="36" r="3.5" />
      <line x1="14" y1="30" x2="40" y2="30" />
    </svg>
  ),
  Soldagem: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="18" r="8" />
      <path d="M20 26l-4 14h16l-4-14" />
      <line x1="24" y1="14" x2="24" y2="22" />
      <line x1="20" y1="18" x2="28" y2="18" />
      <path d="M16 10l2-4M32 10l-2-4" />
    </svg>
  ),
  Guindaste: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="18" y="28" width="12" height="10" rx="2" />
      <line x1="24" y1="6" x2="24" y2="28" />
      <line x1="24" y1="6" x2="38" y2="6" />
      <path d="M38 6v6" />
      <path d="M35 12l3-6" />
      <circle cx="18" cy="42" r="3" />
      <circle cx="30" cy="42" r="3" />
      <path d="M12 28h24" />
    </svg>
  ),
  Caminhão: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="14" width="24" height="16" rx="2" />
      <rect x="7" y="17" width="18" height="10" rx="1" opacity="0.3" />
      <path d="M28 20h8l4 6v4h-12V20z" />
      <path d="M32 26h4" />
      <circle cx="12" cy="34" r="3" />
      <circle cx="36" cy="34" r="3" />
    </svg>
  ),
};

function getCourseIcon(courseName: string): ReactNode {
  const lower = courseName.toLowerCase();
  if (lower.includes("empilhadeira")) return courseIcons.Empilhadeira;
  if (lower.includes("motoniveladora")) return courseIcons.Motoniveladora;
  if (lower.includes("retroescavadeira")) return courseIcons.Retroescavadeira;
  if (lower.includes("pá") || lower.includes("carregadeira")) return courseIcons["Pá Carregadeira"];
  if (lower.includes("escavadeira")) return courseIcons.Escavadeira;
  if (lower.includes("soldagem")) return courseIcons.Soldagem;
  if (lower.includes("guindaste")) return courseIcons.Guindaste;
  if (lower.includes("caminhão") || lower.includes("basculante")) return courseIcons.Caminhão;
  return courseIcons.Empilhadeira;
}

export default function Home() {
  const whatsappNumber = "5511999999999";
  const [data, setData] = useState<LandingData | null>(null);
  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState<{ found: boolean; certificate?: Record<string, string> } | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetch("/api/landing")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const handleSearch = async () => {
    if (searchCode.trim().length < 5) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const res = await fetch(`/api/consultar?codigo=${encodeURIComponent(searchCode.trim())}`);
      if (res.ok) {
        const result = await res.json();
        setSearchResult(result);
      } else {
        setSearchResult({ found: false });
      }
    } catch {
      setSearchResult({ found: false });
    } finally {
      setSearching(false);
    }
  };

  const handleWhatsAppClick = (courseName: string) => {
    const message = encodeURIComponent(
      `Olá! Tenho interesse no curso de ${courseName} da Engrena Cursos. Gostaria de mais informações sobre turmas, valores e datas.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-[#262822] bg-pattern">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[70vh] flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#262822] via-[#262822]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#262822] via-[#262822]/40 to-[#262822]/70" />

        {/* Diagonal Stripe */}
        <div className="absolute -right-20 top-0 bottom-0 w-[400px] bg-[#F5C352]/5 skew-x-[-12deg] pointer-events-none" />
        <div className="absolute -right-10 top-0 bottom-0 w-[2px] bg-[#F5C352]/20 skew-x-[-12deg] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5C352]/10 border border-[#F5C352]/30 rounded-full mb-6 sm:mb-8 animate-pulse-glow">
              <span className="w-2 h-2 bg-[#F5C352] rounded-full animate-pulse" />
              <span className="text-[#F5C352] text-xs sm:text-sm font-semibold">Inscrições Abertas</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4 sm:mb-6">
              <span className="text-white">Capacitação Profissional em</span>
              <br />
              <span className="gradient-text">Máquinas Pesadas</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-xl mb-8 sm:mb-10 leading-relaxed">
              Formação presencial com certificação reconhecida para transformar
              sua carreira operacional. Nossas turmas já estão abertas!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#cursos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F5C352] hover:bg-[#E3AA28] text-[#262822] font-bold text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-105 industrial-glow"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
                Ver Cursos Disponíveis
              </a>
              <a
                href="#depoimentos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#F5C352]/30 hover:border-[#F5C352] text-[#F5C352] font-bold text-base sm:text-lg rounded-xl transition-all duration-300 hover:bg-[#F5C352]/10"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
                Ver Depoimentos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 border-y border-[#F5C352]/10 bg-[#1E293B]/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black gradient-text">{stats?.totalStudents ?? "—"}</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Alunos Certificados</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black gradient-text">{stats?.totalCourses ?? "—"}</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Cursos Disponíveis</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black gradient-text">60h</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Carga Horária</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black gradient-text">100%</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Presencial</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-black mb-4">
            <span className="text-white">Validar </span>
            <span className="gradient-text">Certificado</span>
          </h2>
          <p className="text-gray-400 text-sm mb-6">Digite o código do seu certificado para validar.</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ex: EC-2026-00001"
              className="flex-1 px-4 py-3 bg-[#1E293B] border border-[#334155] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#F5C352] transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={searching || searchCode.trim().length < 5}
              className="px-6 py-3 bg-[#F5C352] hover:bg-[#E3AA28] text-[#262822] font-bold text-sm rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {searching ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M12 4v2m0 12v2M4 12H2m20 0h-2M6.34 6.34l-1.42-1.42m12.72 12.72l-1.42-1.42M6.34 17.66l-1.42 1.42M19.07 6.34l-1.42-1.42" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              )}
            </button>
          </div>

          {/* Search Result */}
          {searchResult && (
            <div className={`mt-6 p-4 rounded-xl border ${searchResult.found ? "bg-[#25D366]/10 border-[#25D366]/30" : "bg-red-500/10 border-red-500/30"}`}>
              {searchResult.found && searchResult.certificate ? (
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                    <span className="text-[#25D366] font-bold text-sm">Certificado Válido</span>
                  </div>
                  <div className="text-white text-sm font-semibold">{searchResult.certificate.nomeAluno}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    {searchResult.certificate.curso} • {searchResult.certificate.cargaHoraria} •{' '}
                    {new Date(searchResult.certificate.dataConclusao).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                  <span className="text-red-400 text-sm">Nenhum certificado encontrado com este código.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Courses Section */}
      <section id="cursos" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-4">
              <span className="text-white">Nossos </span>
              <span className="gradient-text">Cursos</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto">
              Formação completa e presencial com certificação reconhecida pelo mercado de trabalho.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.courses.map((course) => (
              <div
                key={course.id}
                className="card-hover group relative bg-[#1E293B] border border-[#334155] rounded-2xl p-6 sm:p-8 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F5C352]/5 to-[#E3AA28]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F5C352]/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#F5C352] mb-4 sm:mb-6 group-hover:bg-[#F5C352]/20 transition-colors duration-300">
                    {getCourseIcon(course.name)}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{course.name}</h3>

                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5C352]/10 rounded-full">
                      <svg className="w-3.5 h-3.5 text-[#F5C352]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 3" />
                      </svg>
                      <span className="text-[#F5C352] text-sm font-semibold">{course.hours}</span>
                    </div>
                    {course.studentCount > 0 && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#25D366]/10 rounded-full">
                        <svg className="w-3.5 h-3.5 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 00-3-3.87" />
                          <path d="M16 3.13a4 4 0 010 7.75" />
                        </svg>
                        <span className="text-[#25D366] text-sm font-semibold">{course.studentCount} {course.studentCount === 1 ? "formando" : "formandos"}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">{course.description}</p>

                  <button
                    onClick={() => handleWhatsAppClick(course.name)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#F5C352] hover:bg-[#E3AA28] text-[#262822] font-bold text-sm rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21" />
                      <path d="M9 10a.5.5 0 001 0V9a.5.5 0 00-1 0v1zm0 0a5 5 0 005 5m0 0a.5.5 0 000-1h-1a.5.5 0 000 1h1z" />
                    </svg>
                    Tenho Interesse
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {data?.testimonials && data.testimonials.length > 0 && (
        <section id="depoimentos" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#1E293B]/50 border-y border-[#F5C352]/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-4">
                <span className="text-white">Quem Já </span>
                <span className="gradient-text">Certificou</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto">
                Nossos alunos já estão atuando no mercado com certificação reconhecida.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.testimonials.map((t, i) => (
                <div key={i} className="bg-[#262822] border border-[#334155] rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#F5C352]/10 rounded-full flex items-center justify-center text-[#F5C352] font-bold text-sm">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{t.name}</div>
                      <div className="text-gray-500 text-xs">{t.city}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#F5C352]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <path d="M22 4L12 14.01l-3-3" />
                    </svg>
                    <span className="text-[#F5C352] text-xs font-semibold">{t.course}</span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    Certificado em {new Date(t.date).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-t border-[#334155]">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-light.svg" alt="Engrena Cursos" className="h-6 w-auto" />
            <span className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Engrena Cursos &mdash; Todos os direitos reservados.
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#25D366] transition-colors" title="WhatsApp">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 001 0V9a.5.5 0 00-1 0v1zm0 0a5 5 0 005 5m0 0a.5.5 0 000-1h-1a.5.5 0 000 1h1z" />
              </svg>
            </a>
            <a href="https://instagram.com/engrenacursos" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E4405F] transition-colors" title="Instagram">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://facebook.com/engrenacursos" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors" title="Facebook">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a href="mailto:contato@engrenacursos.com.br" className="text-gray-400 hover:text-[#F5C352] transition-colors" title="E-mail">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4L12 13 2 4" />
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link
              href="/consultar"
              className="text-[#F5C352] hover:text-[#E3AA28] text-sm font-medium transition-colors"
            >
              Validar Certificado &rarr;
            </Link>
            <Link
              href="/baixar-certificado"
              className="text-[#F5C352] hover:text-[#E3AA28] text-sm font-medium transition-colors"
            >
              Baixar Certificado &rarr;
            </Link>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 z-50"
        aria-label="Contato via WhatsApp"
      >
        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 001 0V9a.5.5 0 00-1 0v1zm0 0a5 5 0 005 5m0 0a.5.5 0 000-1h-1a.5.5 0 000 1h1z" />
        </svg>
      </a>
    </div>
  );
}
