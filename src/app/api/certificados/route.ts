import { NextRequest, NextResponse } from "next/server";
import { pool, ensureTable } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { nomeAluno, cpf, curso, dataConclusao, cidade, validationCode, regNumber } = body;

  if (!nomeAluno || !cpf || !curso || !dataConclusao || !validationCode) {
    return NextResponse.json(
      { error: "Dados obrigatórios faltando." },
      { status: 400 }
    );
  }

  try {
    await ensureTable();

    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO certificados (codigo, nome_aluno, cpf, curso, data_conclusao, cidade, numero_registro)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [validationCode, nomeAluno, cpf, curso, dataConclusao, cidade || "Ribeira do Pombal - BA", regNumber]
      );

      return NextResponse.json({
        success: true,
        id: result.rows[0].id,
      });
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    console.error("Erro ao salvar certificado:", error);
    if ((error as { code?: string })?.code === "23505") {
      return NextResponse.json(
        { error: "Já existe um certificado com este código." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erro interno ao salvar certificado." },
      { status: 500 }
    );
  }
}
