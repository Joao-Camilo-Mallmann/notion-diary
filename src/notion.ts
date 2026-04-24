import { MES_CORES, NOMES_MES, PAGE_ID, notion } from "./config.ts";
import { isBlocoDia } from "./helpers.ts";
import type { Heading1Block, NotionBlock } from "./types/index.ts";

// ─── NOTION API ───────────────────────────────────────────────────────────────

/** Busca todos os blocos filhos de um bloco (paginado) */
export async function getChildren(blockId: string): Promise<NotionBlock[]> {
  const children: NotionBlock[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });
    children.push(...(res.results as NotionBlock[]));
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return children;
}

/** Encontra o toggle do ANO dentro da página */
export async function findAnoBlock(ano: number): Promise<NotionBlock | null> {
  const blocos = await getChildren(PAGE_ID);
  for (const b of blocos) {
    if (b.type === "heading_1" && b.heading_1?.is_toggleable) {
      const texto = b.heading_1.rich_text.map((t) => t.plain_text).join("");
      if (texto.includes(String(ano))) return b;
    }
  }
  return null;
}

/** Encontra o toggle do MÊS dentro do bloco do ANO */
export async function findMesBlock(
  anoBlockId: string,
  nomeMes: string,
): Promise<NotionBlock | null> {
  const blocos = await getChildren(anoBlockId);
  for (const b of blocos) {
    if (b.type === "heading_1" && b.heading_1?.is_toggleable) {
      const texto = b.heading_1.rich_text.map((t) => t.plain_text).join("");
      if (texto === nomeMes) return b;
    }
  }
  return null;
}

/** Verifica se já existe um dia (heading_1 toggle com mention-date) dentro do mês */
export async function diaJaExiste(
  mesBlockId: string,
  isoDate: string,
): Promise<boolean> {
  const blocos = await getChildren(mesBlockId);
  for (const b of blocos) {
    if (isBlocoDia(b)) {
      const headingBlock = b as Heading1Block;
      for (const rt of headingBlock.heading_1.rich_text) {
        if (rt.type === "mention" && rt.mention?.type === "date") {
          if (rt.mention.date.start === isoDate) return true;
        }
      }
    }
  }
  return false;
}

/** Cria o bloco do MÊS dentro do bloco ANO */
export async function criarMes(
  anoBlockId: string,
  mes: number,
): Promise<string> {
  const nome = NOMES_MES[mes];
  const cor = MES_CORES[mes] ?? "default";

  console.log(`📅 Criando mês: ${nome} (cor: ${cor})`);

  const res = await notion.blocks.children.append({
    block_id: anoBlockId,
    children: [
      {
        type: "heading_1",
        heading_1: {
          rich_text: [{ type: "text", text: { content: nome } }],
          color: cor === "default" ? "default" : (`${cor}_background` as never),
          is_toggleable: true,
        },
      },
    ],
  });

  const mesId = res.results[0].id;
  console.log(`✅ Mês criado: ${mesId}`);
  return mesId;
}

/**
 * Cria o bloco do DIA dentro do mês, sempre no início da lista.
 * Estrutura:
 *   heading_1 toggle (mention-date)
 *     - Positivo:
 *     - Gratidão:
 *     - Aprendizagem:
 *     ---
 *     -
 */
export async function criarDia(
  mesBlockId: string,
  isoDate: string,
): Promise<string> {
  console.log(`📝 Criando dia: ${isoDate} em ${mesBlockId}`);

  const diaBlock = await notion.blocks.children.append({
    block_id: mesBlockId,
    children: [
      {
        type: "heading_1",
        heading_1: {
          rich_text: [
            {
              type: "mention",
              mention: { date: { start: isoDate } },
            },
          ],
          is_toggleable: true,
        },
      },
    ],
    position: { type: "start" },
  } as any);

  const diaId = diaBlock.results[0].id;

  await notion.blocks.children.append({
    block_id: diaId,
    children: [
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Positivo: " } }],
        },
      },
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Gratidão: " } }],
        },
      },
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Aprendizagem: " } }],
        },
      },
      { type: "divider", divider: {} },
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
