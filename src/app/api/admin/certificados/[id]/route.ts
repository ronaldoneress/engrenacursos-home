import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM certificados WHERE id = $1",
        [id]
      );
      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
      }
      const r = result.rows[0];
      return NextResponse.json({
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
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Erro ao buscar certificado:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE certificados SET
          nome_aluno = COALESCE($1, nome_aluno),
          cpf = COALESCE($2, cpf),
          curso = COALESCE($3, curso),
          data_conclusao = COALESCE($4, data_conclusao),
          cidade = COALESCE($5, cidade),
          status = COALESCE($6, status)
        WHERE id = $7 RETURNING *`,
        [
          body.nomeAluno,
          body.cpf,
          body.curso,
          body.dataConclusao,
          body.cidade,
          body.status,
          id,
        ]
      );
      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Erro ao atualizar certificado:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "DELETE FROM certificados WHERE id = $1 RETURNING id",
        [id]
      );
      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Erro ao excluir certificado:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
