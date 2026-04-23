const { Client } = require("@notionhq/client");

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

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function padZero(n) {
  return String(n).padStart(2, "0");
}

/** Data de hoje no fuso de Brasília */
function hoje() {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }),
  );
  return {
    ano: now.getFullYear(),
    mes: now.getMonth(), // 0-indexed
    dia: now.getDate(),
    iso: `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())}`,
  };
}

/** Busca todos os blocos filhos de um bloco */
async function getChildren(blockId) {
  const children = [];
  let cursor;
  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });
    children.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return children;
}

/**
 * Encontra o toggle do ANO dentro da página.
 * Procura por um heading_1 toggle com texto "2026" (ou o ano atual).
 */
async function findAnoBlock(ano) {
  const blocos = await getChildren(PAGE_ID);
  for (const b of blocos) {
    if (b.type === "heading_1" && b.heading_1?.is_toggleable) {
      const textos = b.heading_1.rich_text.map((t) => t.plain_text).join("");
      if (textos.includes(String(ano))) return b;
    }
  }
  return null;
}

/**
 * Encontra o toggle do MÊS dentro do bloco do ANO.
 * Procura por heading_1 toggle cujo texto seja o nome do mês.
 */
async function findMesBlock(anoBlockId, nomeMes) {
  const blocos = await getChildren(anoBlockId);
  for (const b of blocos) {
    if (b.type === "heading_1" && b.heading_1?.is_toggleable) {
      const textos = b.heading_1.rich_text.map((t) => t.plain_text).join("");
      if (textos === nomeMes) return b;
    }
  }
  return null;
}

/**
 * Verifica se já existe um dia (heading_1 toggle com mention-date) dentro do mês.
 * Compara pelo ISO date.
 */
async function diaJaExiste(mesBlockId, isoDate) {
  const blocos = await getChildren(mesBlockId);
  for (const b of blocos) {
    if (isBlocoDia(b)) {
      for (const rt of b.heading_1.rich_text) {
        if (rt.type === "mention" && rt.mention?.type === "date") {
          if (rt.mention.date.start === isoDate) return true;
        }
      }
    }
  }
  return false;
}

/** Identifica se o bloco representa um dia (heading_1 toggle com mention-date). */
function isBlocoDia(block) {
  if (!(block.type === "heading_1" && block.heading_1?.is_toggleable)) {
    return false;
  }

  return block.heading_1.rich_text.some(
    (rt) => rt.type === "mention" && rt.mention?.type === "date",
  );
}

/**
 * Cria o bloco do MÊS novo como primeiro filho do bloco ANO.
 * Estrutura: heading_1 toggle com nome do mês + botão "Novo dia" dentro
 */
async function criarMes(anoBlockId, mes) {
  const nome = NOMES_MES[mes];
  const cor = MES_CORES[mes] || "default";

  console.log(`📅 Criando mês: ${nome} (cor: ${cor})`);

  // Cria o heading do mês
  const mesBlock = await notion.blocks.children.append({
    block_id: anoBlockId,
    children: [
      {
        type: "heading_1",
        heading_1: {
          rich_text: [{ type: "text", text: { content: nome } }],
          color: cor === "default" ? "default" : `${cor}_background`,
          is_toggleable: true,
        },
      },
    ],
  });

  const mesId = mesBlock.results[0].id;
  console.log(`✅ Mês criado: ${mesId}`);
  return mesId;
}

/**
 * Cria o bloco do DIA dentro do mês.
 * Estrutura:
 *   heading_1 toggle (mention-date)
 *     - Positivo:
 *     - Gratidão:
 *     - Aprendizagem:
 *     ---
 *     -
 */
async function criarDia(mesBlockId, isoDate) {
  console.log(`📝 Criando dia: ${isoDate} em ${mesBlockId}`);

  const filhosMes = await getChildren(mesBlockId);
  const primeiroDiaIndex = filhosMes.findIndex((b) => isBlocoDia(b));

  const position =
    primeiroDiaIndex <= 0
      ? { type: "start" }
      : {
          type: "after_block",
          after_block: { id: filhosMes[primeiroDiaIndex - 1].id },
        };

  // Cria o heading do dia com mention-date
  const diaBlock = await notion.blocks.children.append({
    block_id: mesBlockId,
    position,
    children: [
      {
        type: "heading_1",
        heading_1: {
          rich_text: [
            {
              type: "mention",
              mention: {
                type: "date",
                date: { start: isoDate },
              },
            },
          ],
          is_toggleable: true,
        },
      },
    ],
  });

  const diaId = diaBlock.results[0].id;

  // Adiciona conteúdo dentro do dia
  await notion.blocks.children.append({
    block_id: diaId,
    children: [
      // - Positivo:
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Positivo: " } }],
        },
      },
      // - Gratidão:
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Gratidão: " } }],
        },
      },
      // - Aprendizagem:
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Aprendizagem: " } }],
        },
      },
      // ---
      { type: "divider", divider: {} },
      // - (linha em branco para notas)
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "" } }],
        },
      },
    ],
  });

  console.log(`✅ Dia ${isoDate} criado!`);
  return diaId;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function run() {
  if (!NOTION_TOKEN) {
    console.error("❌ NOTION_TOKEN não definido! Exporte ele antes de rodar.");
    process.exit(1);
  }

  const { ano, mes, dia, iso } = hoje();
  const nomeMes = NOMES_MES[mes];

  console.log(`\n🚀 Daily Notes auto-creator — ${iso}`);
  console.log(`   Ano: ${ano} | Mês: ${nomeMes} | Dia: ${dia}\n`);

  // 1. Achar bloco do ano
  const anoBlock = await findAnoBlock(ano);
  if (!anoBlock) {
    console.error(`❌ Não encontrei o bloco do ano ${ano} na página!`);
    console.error("   Crie manualmente o toggle do ano e rode de novo.");
    process.exit(1);
  }
  console.log(`✅ Ano ${ano} encontrado: ${anoBlock.id}`);

  // 2. Achar (ou criar) bloco do mês
  let mesBlock = await findMesBlock(anoBlock.id, nomeMes);

  if (!mesBlock) {
    if (dia === 1) {
      console.log(`📅 Primeiro dia do mês! Criando ${nomeMes}...`);
      const mesId = await criarMes(anoBlock.id, mes);
      // Re-busca para ter o objeto completo
      mesBlock = { id: mesId };
    } else {
      console.error(`❌ Mês "${nomeMes}" não encontrado e hoje não é dia 1.`);
      console.error("   Crie o mês manualmente ou aguarde o dia 1.");
      process.exit(1);
    }
  } else {
    console.log(`✅ Mês ${nomeMes} encontrado: ${mesBlock.id}`);
  }

  // 3. Verificar se o dia já existe
  const jaExiste = await diaJaExiste(mesBlock.id, iso);
  if (jaExiste) {
    console.log(`ℹ️  Dia ${iso} já existe. Nada a fazer.`);
    return;
  }

  // 4. Criar o dia
  await criarDia(mesBlock.id, iso);

  console.log(`\n✨ Pronto! Daily de ${iso} criada no Notion.\n`);
}

run().catch((err) => {
  console.error("❌ Erro:", err.message);
  if (err.code === "unauthorized") {
    console.error("   Token inválido ou sem permissão na página.");
  }
  process.exit(1);
});
