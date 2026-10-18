import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const [totalResult, mesResult, cursoResult, recentResult] =
        await Promise.all([
          client.query("SELECT COUNT(*) FROM certificados"),
          client.query(
            "SELECT COUNT(*) FROM certificados WHERE criado_em >= date_trunc('month', NOW())"
          ),
          client.query(
            "SELECT curso, COUNT(*) as count FROM certificados GROUP BY curso ORDER BY count DESC"
          ),
          client.query(
            "SELECT * FROM certificados ORDER BY criado_em DESC LIMIT 5"
          ),
        ]);

      return NextResponse.json({
        stats: {
          total: parseInt(totalResult.rows[0].count),
          mesAtual: parseInt(mesResult.rows[0].count),
          porCurso: cursoResult.rows.map((r) => ({
            curso: r.curso,
            count: parseInt(r.count),
          })),
        },
        recentes: recentResult.rows.map((r) => ({
          id: r.id,
          codigo: r.codigo,
          nomeAluno: r.nome_aluno,
          curso: r.curso,
          dataConclusao: r.data_conclusao,
          status: r.status,
          criadoEm: r.criado_em,
        })),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Erro ao buscar dashboard:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
