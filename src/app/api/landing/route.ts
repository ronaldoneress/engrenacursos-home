import { NextRequest, NextResponse } from "next/server";
import { pool, ensureTable } from "@/lib/db";

const courseMeta: Record<string, { name: string; hours: string; description: string }> = {
  "Empilhadeira": {
    name: "Empilhadeira",
    hours: "60h",
    description: "Operação e segurança em empilhadeiras industriais, repositores e equipamentos de movimentação.",
  },
  "Empilhadeira (60h)": {
    name: "Empilhadeira",
    hours: "60h",
    description: "Operação e segurança em empilhadeiras industriais, repositores e equipamentos de movimentação.",
  },
  "Motoniveladora": {
    name: "Motoniveladora",
    hours: "60h",
    description: "Operação de motoniveladora em obras de terraplenagem e pavimentação.",
  },
  "Motoniveladora (60h)": {
    name: "Motoniveladora",
    hours: "60h",
    description: "Operação de motoniveladora em obras de terraplenagem e pavimentação.",
  },
  "Retroescavadeira": {
    name: "Retroescavadeira",
    hours: "60h",
    description: "Operação segura de retroescavadeira em obras de infraestrutura e terraplenagem.",
  },
  "Pá Carregadeira": {
    name: "Pá Carregadeira",
    hours: "60h",
    description: "Operação de pá carregadeira em movimentação de terra e materiais a granel.",
  },
  "Escavadeira Hidráulica": {
    name: "Escavadeira Hidráulica",
    hours: "60h",
    description: "Comando de escavadeira hidráulica em escavações e obras civis.",
  },
  "Soldagem TIG": {
    name: "Soldagem TIG",
    hours: "60h",
    description: "Técnicas de soldagem TIG para metais ferrosos e não ferrosos.",
  },
  "Guindaste": {
    name: "Guindaste",
    hours: "60h",
    description: "Operação de guindastes e movimentação de cargas com segurança.",
  },
  "Caminhão Basculante": {
    name: "Caminhão Basculante",
    hours: "60h",
    description: "Operação de caminhão basculante em obras e logística pesada.",
  },
};

export async function GET(request: NextRequest) {
  try {
    await ensureTable();
    const client = await pool.connect();

    try {
      const [coursesResult, statsResult, testimonialsResult] = await Promise.all([
        client.query(
          `SELECT curso, COUNT(*) as total FROM certificados WHERE status = 'ativo' GROUP BY curso ORDER BY total DESC`
        ),
        client.query(
          `SELECT
            COUNT(*) as total_certificados,
            COUNT(DISTINCT curso) as total_cursos,
            COUNT(DISTINCT nome_aluno) as total_alunos
          FROM certificados WHERE status = 'ativo'`
        ),
        client.query(
          `SELECT nome_aluno, curso, data_conclusao, cidade
           FROM certificados WHERE status = 'ativo'
           ORDER BY criado_em DESC LIMIT 6`
        ),
      ]);

      const stats = {
        totalCertificates: parseInt(statsResult.rows[0].total_certificados),
        totalCourses: parseInt(statsResult.rows[0].total_cursos),
        totalStudents: parseInt(statsResult.rows[0].total_alunos),
      };

      const courses = coursesResult.rows.map((row) => {
        const meta = courseMeta[row.curso] || {
          name: row.curso,
          hours: "60h",
          description: `Curso presencial completo de ${row.curso} com certificação reconhecida.`,
        };
        return {
          id: row.curso,
          name: meta.name,
          hours: meta.hours,
          description: meta.description,
          studentCount: parseInt(row.total),
        };
      });

      const testimonials = testimonialsResult.rows.map((row) => {
        const parts = row.nome_aluno.split(" ").filter((n: string) => n.length > 0);
        const first = parts[0] || "";
        const last = parts.length > 1 ? parts[parts.length - 1] : "";
        const displayName = last ? `${first} ${last}` : first;
        return {
          name: displayName,
          initials: first[0] + (last[0] || ""),
          course: courseMeta[row.curso]?.name || row.curso,
          date: row.data_conclusao,
          city: row.cidade || "Ribeira do Pombal - BA",
        };
      });

      return NextResponse.json({
        stats,
        courses,
        testimonials,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Erro ao buscar dados da landing:", error);
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}
