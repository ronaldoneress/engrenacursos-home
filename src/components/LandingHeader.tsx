"use client";

import Link from "next/link";
import { useState } from "react";

const whatsappNumber = "5511999999999";

interface LandingHeaderProps {
  /**
   * "landing" → âncoras locais (#cursos) — usada na própria home;
   * "home"    → /#cursos — subpáginas do domínio principal;
   * "cert"    → link absoluto para o domínio principal (usado no
   *             subdomínio de certificados, que não tem landing)
   */
  variant?: "landing" | "home" | "cert";
}

export default function LandingHeader({ variant = "landing" }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cursosHref =
    variant === "landing"
      ? "#cursos"
      : variant === "home"
        ? "/#cursos"
        : "https://engrenacursos.com.br/#cursos";
  const depoimentosHref =
    variant === "landing"
      ? "#depoimentos"
      : variant === "home"
        ? "/#depoimentos"
        : "https://engrenacursos.com.br/#depoimentos";

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#262822]/90 backdrop-blur-md border-b border-[#F5C352]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-light.svg" alt="Engrena Cursos" className="h-10 sm:h-14 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            <a href={cursosHref} className="text-gray-400 hover:text-[#F5C352] text-sm font-medium transition-colors">Cursos</a>
            <a href={depoimentosHref} className="text-gray-400 hover:text-[#F5C352] text-sm font-medium transition-colors">Depoimentos</a>
            <Link href="/consultar" className="text-gray-400 hover:text-[#F5C352] text-sm font-medium transition-colors">Validar Certificado</Link>
            <Link href="/baixar-certificado" className="text-gray-400 hover:text-[#F5C352] text-sm font-medium transition-colors">Baixar Certificado</Link>
            <div className="w-px h-5 bg-[#334155]" />
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
          </nav>

          {/* Hamburger Button - Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-[#F5C352] transition-colors p-2"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <Link
            href="/consultar"
            className="flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-[#F5C352] hover:bg-[#E3AA28] text-[#262822] font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 industrial-glow"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" />
              <path d="M12 2.944a11.955 11.955 0 00-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016" />
            </svg>
            <span className="hidden sm:inline">Validar Certificado</span>
            <span className="sm:hidden">Certificado</span>
          </Link>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-16 sm:top-20 left-0 right-0 bg-[#262822] border-b border-[#334155] shadow-2xl">
            <nav className="flex flex-col p-6 gap-1">
              <a href={cursosHref} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-[#F5C352] hover:bg-[#F5C352]/5 rounded-xl text-sm font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Cursos
              </a>
              <a href={depoimentosHref} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-[#F5C352] hover:bg-[#F5C352]/5 rounded-xl text-sm font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
                Depoimentos
              </a>
              <Link href="/consultar" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-[#F5C352] hover:bg-[#F5C352]/5 rounded-xl text-sm font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M12 2.944a11.955 11.955 0 00-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016" />
                </svg>
                Validar Certificado
              </Link>
              <Link href="/baixar-certificado" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-[#F5C352] hover:bg-[#F5C352]/5 rounded-xl text-sm font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar Certificado
              </Link>
              <div className="h-px bg-[#334155] my-2" />
              <div className="flex items-center gap-4 px-4 py-2">
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
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
