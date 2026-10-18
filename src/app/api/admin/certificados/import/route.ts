import { NextRequest, NextResponse } from "next/server";
import { pool, ensureTable } from "@/lib/db";
import { TODOS_CURSOS } from "@/lib/cursos";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCode(): string {
  const year = new Date().getFullYear();
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return `ENG-${year}-${code}`;
}

function normalizeCPF(value: string): string {
  return value.replace(/\D/g, "");
}

function parseDateBR(value: string): string | null {
  if (!value) return null;
  const trimmed = value.trim();

  // Already ISO: 2026-09-20
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  // BR format: 20/09/2026 or 20/9/2026
  const brMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    const [, d, m, y] = brMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  return null;
}

function normalizeCurso(value: string): string | null {
  const trimmed = value.trim();
  // Direct match
  if (TODOS_CURSOS.includes(trimmed as typeof TODOS_CURSOS[number])) {
    return trimmed;
  }
  // Case-insensitive match
  const lower = trimmed.toLowerCase();
  for (const c of TODOS_CURSOS) {
    if (c.toLowerCase() === lower) return c;
  }
  // Partial match
  for (const c of TODOS_CURSOS) {
    if (c.toLowerCase().includes(lower) || lower.includes(c.toLowerCase())) {
      return c;
    }
  }
  return null;
}

interface ImportRow {
  nome_aluno?: string;
  cpf?: string;
  curso?: string;
  data_conclusao?: string;
  cidade?: string;
  carga_horaria?: string;
}

interface ParsedRow {
  nome_aluno: string;
  cpf: string;
  curso: string;
  data_conclusao: string;
  cidade: string;
  carga_horaria: string;
}

interface RowError {
  row: number;
  field: string;
  message: string;
}

const COLUMN_MAP: Record<string, keyof ImportRow> = {
  nome: "nome_aluno",
  nome_aluno: "nome_aluno",
  "nome aluno": "nome_aluno",
  "nome do aluno": "nome_aluno",
  aluno: "nome_aluno",
  "nome completo": "nome_aluno",
  "nome completo do aluno": "nome_aluno",
  cpf: "cpf",
  curso: "curso",
  "curso presencial": "curso",
  "nome do curso": "curso",
  data: "data_conclusao",
  dataconclusao: "data_conclusao",
  "data conclusao": "data_conclusao",
  "data de conclusao": "data_conclusao",
  "data de conclusão": "data_conclusao",
  conclusao: "data_conclusao",
  cidade: "cidade",
  "cidade estado": "cidade",
  "cidade/estado": "cidade",
  local: "cidade",
  "carga horaria": "carga_horaria",
  "carga horária": "carga_horaria",
  carga: "carga_horaria",
  horas: "carga_horaria",
  cargahoraria: "carga_horaria",
  "carga_horaria": "carga_horaria",
};

function mapColumns(row: Record<string, string>): ImportRow {
  const mapped: ImportRow = {};
  for (const [key, value] of Object.entries(row)) {
    const normalized = key.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/_/g, " ");
    const field = COLUMN_MAP[normalized] || COLUMN_MAP[key.trim().toLowerCase().replace(/_/g, " ")];
    if (field && value) {
      mapped[field] = value.trim();
    }
  }
  return mapped;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rows } = body as { rows: ImportRow[] };

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "Nenhum dado para importar." },
        { status: 400 }
      );
    }

    if (rows.length > 500) {
      return NextResponse.json(
        { error: "Limite de 500 certificados por importação." },
        { status: 400 }
      );
    }

    await ensureTable();

    const parsed: ParsedRow[] = [];
    const errors: RowError[] = [];

    rows.forEach((rawRow, idx) => {
      const row = mapColumns(rawRow as Record<string, string>);
      const rowNum = idx + 2; // +2 because row 1 is header

      // Nome
      if (!row.nome_aluno) {
        errors.push({ row: rowNum, field: "nome_aluno", message: "Nome do aluno é obrigatório" });
      }

      // CPF
      const cpf = normalizeCPF(row.cpf || "");
      if (cpf.length !== 11) {
        errors.push({ row: rowNum, field: "cpf", message: "CPF deve ter 11 dígitos" });
      }

      // Curso
      const curso = normalizeCurso(row.curso || "");
      if (!curso) {
        errors.push({ row: rowNum, field: "curso", message: `Curso não reconhecido: "${row.curso}"` });
      }

      // Data
      const data = parseDateBR(row.data_conclusao || "");
      if (!data) {
        errors.push({ row: rowNum, field: "data_conclusao", message: "Data inválida (use DD/MM/AAAA)" });
      }

      if (errors.filter((e) => e.row === rowNum).length === 0) {
        parsed.push({
          nome_aluno: row.nome_aluno!,
          cpf,
          curso: curso!,
          data_conclusao: data!,
          cidade: row.cidade || "Ribeira do Pombal - BA",
          carga_horaria: row.carga_horaria || "60",
        });
      }
    });

    if (errors.length > 0) {
      return NextResponse.json({ errors, parsed: parsed.length }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      let imported = 0;
      for (const row of parsed) {
        const codigo = generateCode();
        const regNumber = String(Math.floor(1000 + Math.random() * 9000));
        try {
          await client.query(
            `INSERT INTO certificados (codigo, nome_aluno, cpf, curso, carga_horaria, data_conclusao, cidade, numero_registro)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [codigo, row.nome_aluno, row.cpf, row.curso, `${row.carga_horaria} Horas`, row.data_conclusao, row.cidade, regNumber]
          );
          imported++;
        } catch (err: unknown) {
          if ((err as { code?: string })?.code === "23505") {
            // Duplicate code, retry with new code
            const retryCodigo = generateCode();
            await client.query(
              `INSERT INTO certificados (codigo, nome_aluno, cpf, curso, carga_horaria, data_conclusao, cidade, numero_registro)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [retryCodigo, row.nome_aluno, row.cpf, row.curso, `${row.carga_horaria} Horas`, row.data_conclusao, row.cidade, regNumber]
            );
            imported++;
          } else {
            throw err;
          }
        }
      }

      return NextResponse.json({ imported, total: parsed.length });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Erro na importação:", error);
    return NextResponse.json(
      { error: "Erro interno durante a importação." },
      { status: 500 }
    );
  }
}
