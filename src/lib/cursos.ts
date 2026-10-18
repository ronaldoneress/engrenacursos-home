export const CURSOS_Maquinas = [
  "Empilhadeira",
  "Motoniveladora",
  "Retroescavadeira",
  "Pá Carregadeira",
  "Escavadeira Hidráulica",
] as const;

export const CURSOS_Soldagem = [
  "Soldagem MIG/MAG",
  "Soldagem TIG",
  "Soldagem Eletrodo Revestido",
  "Corte e Solda",
  "Montagem e Manutenção Metalúrgica",
] as const;

export const TODOS_CURSOS = [...CURSOS_Maquinas, ...CURSOS_Soldagem] as const;

export type CursoMaquina = typeof CURSOS_Maquinas[number];
export type CursoSoldagem = typeof CURSOS_Soldagem[number];
export type Curso = typeof TODOS_CURSOS[number];

export const NR_MAP: Record<string, string> = {
  Empilhadeira: "NR-1 / NR-6 / NR-11 / NR-12 / NR-18.6 / NR-18.22 / NR-18.28 / NR-31",
  Motoniveladora: "NR-1 / NR-12 / NR-14 / NR-18.6 / NR-18.22 / NR-18.28 / NR-31",
  Retroescavadeira: "NR-1 / NR-12 / NR-14 / NR-18.6 / NR-18.22 / NR-18.28 / NR-31",
  "Pá Carregadeira": "NR-1 / NR-12 / NR-14 / NR-18.6 / NR-18.22 / NR-18.28 / NR-31",
  "Escavadeira Hidráulica": "NR-1 / NR-12 / NR-14 / NR-18.6 / NR-18.22 / NR-18.28 / NR-31",
  "Soldagem MIG/MAG": "NR-01, NR-12, NR-18",
  "Soldagem TIG": "NR-01, NR-12, NR-18",
  "Soldagem Eletrodo Revestido": "NR-01, NR-12, NR-18",
  "Corte e Solda": "NR-01, NR-12, NR-18",
  "Montagem e Manutenção Metalúrgica": "NR-01, NR-12, NR-18",
};

interface Module {
  nome: string;
  carga: string;
}

export const CURRICULUM_DATA: Record<string, { modulos: Module[] }> = {
  Empilhadeira: {
    modulos: [
      { nome: "Máquinas e suas aplicações", carga: "10h" },
      { nome: "Noções de Mecânica Básica", carga: "05h" },
      { nome: "Primeiros Socorros", carga: "05h" },
      { nome: "NR-1 / NR-6 / NR-11 / NR-12 / NR-18.6 / NR-18.22 / NR-18.28 / NR-31", carga: "05h" },
      { nome: "Aula em Campo Prático", carga: "10h" },
      { nome: "Estudo em casa - Material Digital", carga: "05h" },
    ],
  },
  Retroescavadeira: {
    modulos: [
      { nome: "Máquinas e suas aplicações", carga: "10h" },
      { nome: "Noções de Mecânica Básica", carga: "05h" },
      { nome: "Primeiros Socorros", carga: "05h" },
      { nome: "NR-1 / NR-12 / NR-14 / NR-18.6 / NR-18.22 / NR-18.28 / NR-31", carga: "05h" },
      { nome: "Aula em Campo Prático", carga: "10h" },
      { nome: "Estudo em casa - Material Digital", carga: "05h" },
    ],
  },
  Motoniveladora: {
    modulos: [
      { nome: "Máquinas e suas aplicações", carga: "10h" },
      { nome: "Noções de Mecânica Básica", carga: "05h" },
      { nome: "Primeiros Socorros", carga: "05h" },
      { nome: "NR-1 / NR-12 / NR-14 / NR-18.6 / NR-18.22 / NR-18.28 / NR-31", carga: "05h" },
      { nome: "Aula em Campo Prático", carga: "10h" },
      { nome: "Estudo em casa - Material Digital", carga: "05h" },
    ],
  },
  "Pá Carregadeira": {
    modulos: [
      { nome: "Máquinas e suas aplicações", carga: "10h" },
      { nome: "Noções de Mecânica Básica", carga: "05h" },
      { nome: "Primeiros Socorros", carga: "05h" },
      { nome: "NR-1 / NR-12 / NR-14 / NR-18.6 / NR-18.22 / NR-18.28 / NR-31", carga: "05h" },
      { nome: "Aula em Campo Prático", carga: "10h" },
      { nome: "Estudo em casa - Material Digital", carga: "05h" },
    ],
  },
  "Escavadeira Hidráulica": {
    modulos: [
      { nome: "Máquinas e suas aplicações", carga: "10h" },
      { nome: "Noções de Mecânica Básica", carga: "05h" },
      { nome: "Primeiros Socorros", carga: "05h" },
      { nome: "NR-1 / NR-12 / NR-14 / NR-18.6 / NR-18.22 / NR-18.28 / NR-31", carga: "05h" },
      { nome: "Aula em Campo Prático", carga: "10h" },
      { nome: "Estudo em casa - Material Digital", carga: "05h" },
    ],
  },
  "Soldagem MIG/MAG": {
    modulos: [
      { nome: "Segurança do Trabalho", carga: "10h" },
      { nome: "Fundamentos de Soldagem", carga: "10h" },
      { nome: "Processo MIG/MAG", carga: "15h" },
      { nome: "Prática em Bancada", carga: "15h" },
      { nome: "NR-01, NR-12, NR-18", carga: "05h" },
      { nome: "Avaliação Final", carga: "05h" },
    ],
  },
  "Soldagem TIG": {
    modulos: [
      { nome: "Segurança do Trabalho", carga: "10h" },
      { nome: "Fundamentos de Soldagem", carga: "10h" },
      { nome: "Processo TIG", carga: "15h" },
      { nome: "Prática em Bancada", carga: "15h" },
      { nome: "NR-01, NR-12, NR-18", carga: "05h" },
      { nome: "Avaliação Final", carga: "05h" },
    ],
  },
  "Soldagem Eletrodo Revestido": {
    modulos: [
      { nome: "Segurança do Trabalho", carga: "10h" },
      { nome: "Fundamentos de Soldagem", carga: "10h" },
      { nome: "Processo Eletrodo Revestido", carga: "15h" },
      { nome: "Prática em Bancada", carga: "15h" },
      { nome: "NR-01, NR-12, NR-18", carga: "05h" },
      { nome: "Avaliação Final", carga: "05h" },
    ],
  },
  "Corte e Solda": {
    modulos: [
      { nome: "Segurança do Trabalho", carga: "10h" },
      { nome: "Técnicas de Corte", carga: "15h" },
      { nome: "Técnicas de Solda", carga: "15h" },
      { nome: "Prática em Bancada", carga: "10h" },
      { nome: "NR-01, NR-12, NR-18", carga: "05h" },
      { nome: "Avaliação Final", carga: "05h" },
    ],
  },
  "Montagem e Manutenção Metalúrgica": {
    modulos: [
      { nome: "Segurança do Trabalho", carga: "10h" },
      { nome: "Leitura de Desenhos", carga: "10h" },
      { nome: "Técnicas de Montagem", carga: "15h" },
      { nome: "Manutenção Metalúrgica", carga: "15h" },
      { nome: "NR-01, NR-12, NR-18", carga: "05h" },
      { nome: "Avaliação Final", carga: "05h" },
    ],
  },
};

export const CURSOS_FORM = [
  "Empilhadeira (60h)",
  "Motoniveladora (60h)",
  "Retroescavadeira (60h)",
  "Pá Carregadeira (60h)",
  "Escavadeira Hidráulica (60h)",
] as const;
