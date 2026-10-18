import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function ensureTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS certificados (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(20) UNIQUE NOT NULL,
        nome_aluno VARCHAR(255) NOT NULL,
        cpf VARCHAR(14) NOT NULL,
        curso VARCHAR(255) NOT NULL,
        carga_horaria VARCHAR(20) NOT NULL DEFAULT '60 Horas',
        data_conclusao DATE NOT NULL,
        cidade VARCHAR(255) DEFAULT 'Ribeira do Pombal - BA',
        numero_registro VARCHAR(50),
        status VARCHAR(20) NOT NULL DEFAULT 'ativo',
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);
    await client.query(`ALTER TABLE certificados ADD COLUMN IF NOT EXISTS cidade VARCHAR(255) DEFAULT 'Ribeira do Pombal - BA';`);
    await client.query(`ALTER TABLE certificados ADD COLUMN IF NOT EXISTS numero_registro VARCHAR(50);`);
  } finally {
    client.release();
  }
}
