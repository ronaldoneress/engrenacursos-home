# ⚙️ Engrena Cursos — Plataforma & Sistema de Certificados

Plataforma web institucional e sistema de validação e emissão de certificados da **Engrena Cursos**, especializada em capacitação profissional e formação de operadores de máquinas pesadas.

---

## 📌 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Módulos da Aplicação](#-módulos-da-aplicação)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração de Ambiente](#-configuração-de-ambiente)
- [Como Executar Localmente](#-como-executar-localmente)
- [Deploy com Docker](#-deploy-com-docker)
- [Rotas e Endpoints da Aplicação](#-rotas-e-endpoints-da-aplicação)
- [Banco de Dados](#-banco-de-dados)
- [Licença](#-licença)

---

## 🚀 Visão Geral

A **Engrena Cursos** oferece cursos presenciais com foco prático em maquinário pesado (Retroescavadeira, Pá Carregadeira, Escavadeira Hidráulica, Empilhadeira, Caminhão Munck, entre outros).

Esta plataforma centraliza tanto a presença digital de captação de alunos e apresentação da grade curricular quanto a infraestrutura de controle, validação e entrega digital dos certificados e carteirinhas profissionais de conclusão de curso.

---

## ✨ Funcionalidades Principais

- 🚜 **Landing Page de Alta Conversão:**
  - Apresentação visual moderna com estética industrial e paleta escura (`#262822` e `#F5C352`).
  - Catálogo completo de cursos de máquinas pesadas com ementa, fotos e especificações.
  - Seções de depoimentos reais, diferenciais do método presencial e FAQ interativo.
  - Integração direta com WhatsApp para pré-matrículas e suporte.

- 🔍 **Validação Pública de Autenticidade (`/consultar`):**
  - Consulta rápida de autenticidade por **Código de Registro** ou **CPF** do aluno.
  - Exibição de dados oficiais: nome completo, curso realizado, carga horária, data de conclusão, cidade e status.
  - Verificação de segurança via QR Code impresso no verso dos certificados e carteirinhas.

- 🎓 **Central de Download do Aluno (`/baixar-certificado`):**
  - Portal para o próprio aluno localizar suas certificações pelo CPF.
  - Visualização prévia e download instantâneo do **Certificado Oficial (PDF)** e da **Carteirinha de Operador (PDF)**.

- 🛡️ **Painel Administrativo (`/admin`):**
  - Dashboard de controle com métricas de alunos formados, certificados emitidos e cursos ativos.
  - Cadastro unitário de certificados com geração automática de código único.
  - Importação em lote a partir de planilhas **Excel (.xlsx, .xls)** ou arquivos **CSV**.
  - Gerenciamento de status (ativo/inativo), edição e exclusão de registros.

---

## 🧭 Módulos da Aplicação

| Rota | Descrição |
| :--- | :--- |
| `/` | Landing page institucional e catálogo de cursos |
| `/consultar` | Validador público de autenticidade de certificados |
| `/baixar-certificado` | Central do aluno para consulta e download de documentos |
| `/admin` | Painel de controle e emissão administrativa |

---

## 🛠️ Tecnologias Utilizadas

- **Framework Web:** [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Biblioteca de Interface:** [React 19](https://react.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) com driver nativo [`pg`](https://node-postgres.com/)
- **Geração de Documentos:** [`jspdf`](https://github.com/parallax/jsPDF) e [`html2canvas`](https://html2canvas.hertzen.com/)
- **Processamento de Planilhas:** [`xlsx`](https://sheetjs.com/) e [`papaparse`](https://www.papaparse.com/)
- **Containerização:** [Docker](https://www.docker.com/) (Build Multi-stage otimizado) & [Docker Compose](https://docs.docker.com/compose/)
- **Proxy Reverso & SSL:** Traefik com suporte nativo a Let's Encrypt

---

## 📁 Estrutura do Projeto

```text
engrenacursos-home/
├── .env.example              # Exemplo das variáveis de ambiente
├── .gitignore                # Arquivos e pastas ignorados pelo Git
├── Dockerfile                # Configuração de build de produção Docker
├── docker-compose.yml        # Orquestração do contêiner com Traefik
├── next.config.ts            # Configurações do Next.js (standalone & rewrites)
├── package.json              # Dependências e scripts do projeto
├── tsconfig.json             # Configurações do TypeScript
├── public/                   # Recursos estáticos (imagens, logos, favicon)
│   ├── hero.jpg              # Imagem de destaque da seção Hero
│   └── cursos/               # Fotos e imagens dos maquinários
├── src/
│   ├── app/                  # Rotas do Next.js (App Router)
│   │   ├── admin/            # Painel administrativo
│   │   ├── api/              # Endpoints REST (consultas, métricas, admin)
│   │   ├── baixar-certificado/# Central de download do aluno
│   │   ├── consultar/        # Página de validação pública
│   │   ├── globals.css       # Estilos globais e tokens da marca
│   │   ├── layout.tsx        # Layout base da aplicação
│   │   └── page.tsx          # Landing page principal
│   ├── components/           # Componentes reutilizáveis
│   │   ├── CertificateForm.tsx
│   │   ├── CertificateHTML.tsx
│   │   ├── CertificatePreview.tsx
│   │   ├── LandingHeader.tsx
│   │   └── StudentDownloadCenter.tsx
│   └── lib/                  # Utilitários, regras de negócio e conexão com banco
│       ├── cursos.ts         # Lista e dados dos cursos disponíveis
│       ├── db.ts             # Pool de conexão e auto-migração do PostgreSQL
│       └── generatePDF.tsx   # Utilitário de renderização de PDF
```

---

## 📋 Pré-requisitos

- **Node.js:** Versão 20.x ou superior recomendada.
- **Gerenciador de Pacotes:** `npm`, `yarn` ou `pnpm`.
- **Banco de Dados:** Instância de PostgreSQL (local ou remota).
- *(Opcional)* **Docker & Docker Compose:** Para execução em contêineres.

---

## ⚙️ Configuração de Ambiente

1. Crie o seu arquivo `.env` a partir do modelo `.env.example`:

   ```bash
   cp .env.example .env
   ```

2. Preencha as credenciais do seu banco de dados:

   ```env
   DATABASE_URL=postgres://seu_usuario:sua_senha@localhost:5432/engrena?sslmode=disable
   PORT=3022
   ```

---

## 💻 Como Executar Localmente

1. **Instale as dependências:**

   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

3. Acesse a aplicação no navegador em:
   - **Landing Page:** [http://localhost:3000](http://localhost:3000)
   - **Validação de Certificados:** [http://localhost:3000/consultar](http://localhost:3000/consultar)
   - **Download de Certificados:** [http://localhost:3000/baixar-certificado](http://localhost:3000/baixar-certificado)
   - **Painel Administrativo:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🐳 Deploy com Docker

A aplicação conta com um `Dockerfile` multi-stage com compilação standalone para máxima performance e baixo consumo de recursos.

1. **Subir com Docker Compose:**

   ```bash
   docker compose up -d --build
   ```

2. **Verificar os logs:**

   ```bash
   docker compose logs -f app
   ```

3. **Parar os contêineres:**

   ```bash
   docker compose down
   ```

> **Nota de Produção:** O arquivo `docker-compose.yml` está pré-configurado com labels para roteamento automático via **Traefik**, integrado com a rede externa `easypanel` e certificado SSL automático Let's Encrypt no domínio `engrenacursos.com.br`.

---

## 🔌 Rotas e Endpoints da Aplicação

### Páginas
- `GET /` — Landing page principal
- `GET /consultar` — Tela de validação de certificados
- `GET /baixar-certificado` — Tela de download do aluno
- `GET /admin` — Painel administrativo de controle

### API
- `GET /api/consultar?termo={codigo_ou_cpf}` — Consulta a autenticidade de um certificado
- `GET /api/landing/stats` — Retorna os números totais (alunos certificados, cursos ativos)
- `GET /api/admin/certificados` — Listagem e filtro de certificados emitidos
- `POST /api/admin/certificados` — Cadastro individual de certificado
- `POST /api/admin/certificados/import` — Importação em lote (CSV/Excel)
- `DELETE /api/admin/certificados/:id` — Remoção de certificado

---

## 🗄️ Banco de Dados

A inicialização e garantia das tabelas necessárias ocorre de forma automática via script em [src/lib/db.ts](src/lib/db.ts).

### Estrutura da Tabela `certificados`

```sql
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
```

---

## 📄 Licença

Este projeto é de propriedade privada e uso exclusivo da **Engrena Cursos**. Todos os direitos reservados.
