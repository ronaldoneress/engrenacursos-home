import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const curso = searchParams.get("curso") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  try {
    const client = await pool.connect();
    try {
      let whereClause = "WHERE 1=1";
      const params: (string | number)[] = [];
      let paramIdx = 1;

      if (search) {
        whereClause += ` AND (nome_aluno ILIKE $${paramIdx} OR cpf ILIKE $${paramIdx} OR codigo ILIKE $${paramIdx})`;
        params.push(`%${search}%`);
        paramIdx++;
      }
      if (curso) {
        whereClause += ` AND curso = $${paramIdx}`;
        params.push(curso);
        paramIdx++;
      }
      if (status) {
        whereClause += ` AND status = $${paramIdx}`;
        params.push(status);
        paramIdx++;
      }

      const countResult = await client.query(
        `SELECT COUNT(*) FROM certificados ${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].count);

      const result = await client.query(
        `SELECT * FROM certificados ${whereClause} ORDER BY criado_em DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
        [...params, limit, offset]
      );

      return NextResponse.json({
        certificates: result.rows.map((r) => ({
          id: r.id,
          codigo: r.codigo,
          nomeAluno: r.nome_aluno,
          cpf: r.cpf,
          curso: r.curso,
          cargaHoraria: r.carga_horaria,
          dataConclusao: r.data_conclusao,
          cidade: r.cidade || "Ribeira do Pombal - BA",
          numeroRegistro: r.numero_registro,
          status: r.status,
          criadoEm: r.criado_em,
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Erro ao listar certificados:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
