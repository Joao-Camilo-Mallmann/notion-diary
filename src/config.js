import { Client } from "@notionhq/client";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const PAGE_ID = "6e8ce964-7756-429b-b36d-943040e8cce3"; // Daily notes page

// Cores dos meses (Notion): default, gray, brown, orange, yellow, green,
// blue, purple, pink, red. O script aplica como fundo: `${cor}_background`.
const MES_CORES = {
  0: "purple", // Janeiro
  1: "blue", // Fevereiro
  2: "green", // Março
  3: "pink", // Abril
  4: "yellow", // Maio
  5: "orange", // Junho
  6: "red", // Julho
  7: "brown", // Agosto
  8: "gray", // Setembro
  9: "blue", // Outubro
  10: "default", // Novembro
  11: "purple", // Dezembro
};

const NOMES_MES = [
  "Jan",
  "Fev",
  "Mar",
  "Abril",
  "Maio",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

// ─── INIT ─────────────────────────────────────────────────────────────────────

const notion = new Client({ auth: NOTION_TOKEN });

export { MES_CORES, NOMES_MES, notion, NOTION_TOKEN, PAGE_ID };

