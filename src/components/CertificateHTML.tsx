'use client';

import { NR_MAP, CURRICULUM_DATA } from "@/lib/cursos";
import { formatCPF, formatDateBR, getRegistrationNumber } from "@/lib/utils";

const CERT_W = 1122;
const CERT_H = 793;

export interface CertificateData {
  studentName: string;
  cpf: string;
  completionDate: string;
  course: string;
  validationCode: string;
  city: string;
  cargaHoraria: string;
}

export { CERT_W, CERT_H };

export function CertificateFrontHTML({ data }: { data: CertificateData }) {
  const formattedDate = formatDateBR(data.completionDate);
  const reg = getRegistrationNumber(data.validationCode);
  const nrs = NR_MAP[data.course] || "NR-1 / NR-12 / NR-18";

  return (
    <div
      id="certificate-front"
      style={{
        width: CERT_W,
        height: CERT_H,
        background: "#f8fafc",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div style={{ position: "absolute", top: 12, left: 12, right: 12, bottom: 12, border: "1.5px solid #1e293b", pointerEvents: "none", zIndex: 10 }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "29.5%", background: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)", zIndex: 1, clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)" }} />
      <div style={{ width: "28%", height: "100%", background: "linear-gradient(160deg, #0b132b 0%, #1c2541 50%, #0b132b 100%)", position: "relative", zIndex: 2, clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "40px 20px", boxShadow: "5px 0 15px rgba(0,0,0,0.3)" }}>
        <div style={{ width: "100%", maxWidth: 170, margin: "0 auto" }}>
          <img src="/logo-light.svg" alt="Engrena" style={{ width: "100%", height: "auto", filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.5))" }} />
        </div>
        <div />
      </div>
      <div style={{ width: 110, height: 110, position: "absolute", top: "32%", left: "20.5%", zIndex: 5, background: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)", borderRadius: "50%", padding: 5, boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}>
        <div style={{ width: "100%", height: "100%", background: "#0b132b", borderRadius: "50%", border: "2px dashed #FCF6BA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#FCF6BA", textAlign: "center", padding: 5 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", lineHeight: 1.1 }}>QUALIDADE<br />GARANTIDA</div>
          <div style={{ color: "#BF953F", fontSize: 10, marginTop: 3 }}>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        </div>
      </div>
      <div style={{ flex: 1, height: "100%", padding: "40px 50px 30px 80px", display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "center", zIndex: 3 }}>
        <div style={{ textAlign: "right", marginBottom: 8 }}>
          <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 42, fontWeight: 900, color: "#0b132b", letterSpacing: 4, textTransform: "uppercase", lineHeight: 1 }}>Certificado</h1>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#b38728", letterSpacing: 5, textTransform: "uppercase", marginTop: 6 }}>DE CONCLUSÃO DE CURSO</div>
        </div>
        <div style={{ width: "100%", height: 1, background: "#CBD5E1", margin: "12px 0 18px 0" }} />
        <div style={{ margin: "auto 0" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
            A Engrena Cursos e Treinamentos confere a:
          </p>
          <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 52, color: "#0b132b", marginBottom: 4, lineHeight: 1.1 }}>
            {data.studentName}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 16 }}>
            CPF: {formatCPF(data.cpf)}
          </div>
          <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, maxWidth: "90%", margin: "0 auto" }}>
            Por ter concluído com êxito o curso de{" "}
            <span style={{ fontWeight: 800, color: "#0b132b", textTransform: "uppercase" }}>{data.course}</span>, com carga horária total de{" "}
            <strong>{data.cargaHoraria} horas/aulas</strong>, cumprindo todas as exigências teóricas e práticas.
          </p>
          <p style={{ fontSize: 10, color: "#64748B", marginTop: 10, lineHeight: 1.5 }}>
            Em conformidade com as NR&apos;S {nrs}.<br />
            Autorização e validade de cursos conforme a Lei nº 9.394/96, Decreto nº 5.154/04. Certificado registrado sob nº <strong>{reg}</strong>.
          </p>
        </div>
        <div style={{ width: "100%" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 20 }}>
            {data.city}, {formattedDate}.
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", gap: 40 }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ borderTop: "1.5px solid #334155", marginBottom: 6 }} />
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0b132b", textTransform: "uppercase" }}>Diretor(a)</div>
              <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", fontWeight: 600 }}>Engrena Cursos</div>
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ borderTop: "1.5px solid #334155", marginBottom: 6 }} />
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0b132b", textTransform: "uppercase" }}>Instrutor(a)</div>
              <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", fontWeight: 600 }}>Engrena Cursos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertificateBackHTML({ data }: { data: CertificateData }) {
  const curriculum = CURRICULUM_DATA[data.course] || CURRICULUM_DATA["Empilhadeira"];
  const reg = getRegistrationNumber(data.validationCode);

  return (
    <div
      id="certificate-back"
      style={{
        width: CERT_W,
        height: CERT_H,
        background: "#f8fafc",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div style={{ position: "absolute", top: 12, left: 12, right: 12, bottom: 12, border: "1.5px solid #1e293b", pointerEvents: "none", zIndex: 10 }} />
      <div style={{ padding: "40px 50px", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0b132b", borderBottom: "2px solid #B38728", paddingBottom: 8, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>
            Grade Curricular - {data.course} ({data.cargaHoraria}H)
          </h2>
          <p style={{ fontSize: 12, marginBottom: 18, fontWeight: 700, color: "#475569" }}>Modalidade: CURSO LIVRE</p>
          <div style={{ display: "flex", gap: 40, textAlign: "left" }}>
            <div style={{ flex: 1 }}>
              <div style={{ background: "#0b132b", color: "#FCF6BA", padding: "8px 14px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Conteúdo Programático</div>
              <ul style={{ listStyleType: "none", fontSize: 12, color: "#334155", lineHeight: 2.2, margin: 0, padding: 0 }}>
                {curriculum.modulos.map((m, i) => (
                  <li key={i} style={{ paddingLeft: 18, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#B38728" }}>⚙</span>
                    {m.nome}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ background: "#0b132b", color: "#FCF6BA", padding: "8px 14px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Amparo Legal</div>
              <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.7, marginBottom: 18 }}>
                Conforme a Lei nº 9.394/96, o Decreto nº 5.154/04 e deliberação CEE 14/97. Cursos livres isentos de reconhecimento do MEC.
              </div>
              <div style={{ background: "#0b132b", color: "#FCF6BA", padding: "8px 14px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Dados da Instituição</div>
              <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.7 }}>
                <p><strong>Engrena Cursos e Treinamentos</strong></p>
                <p><strong>Endereço:</strong> R Bahia, nº 213, Vila São Francisco, Estreito - MA</p>
                <p><strong>Contato:</strong> (63) 9282-8953</p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: 11, color: "#64748B", borderTop: "1px solid #CBD5E1", paddingTop: 10 }}>
          Validade em todo o território nacional. Registro interno nº {reg}.
        </div>
      </div>
    </div>
  );
}
