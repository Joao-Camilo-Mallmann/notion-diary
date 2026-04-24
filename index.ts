import { NOMES_MES, NOTION_TOKEN } from "./src/config.ts";
import { hoje } from "./src/helpers.ts";
import {
    criarDia,
    criarMes,
    diaJaExiste,
    findAnoBlock,
    findMesBlock,
} from "./src/notion.ts";

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function run(): Promise<void> {
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
  let mesBlockId: string;

  if (!mesBlock) {
    if (dia === 1) {
      console.log(`📅 Primeiro dia do mês! Criando ${nomeMes}...`);
      const mesId = await criarMes(anoBlock.id, mes);
      mesBlockId = mesId;
    } else {
      console.error(`❌ Mês "${nomeMes}" não encontrado e hoje não é dia 1.`);
      console.error("   Crie o mês manualmente ou aguarde o dia 1.");
      process.exit(1);
    }
  } else {
    console.log(`✅ Mês ${nomeMes} encontrado: ${mesBlock.id}`);
    mesBlockId = mesBlock.id;
  }

  // 3. Verificar se o dia já existe
  const jaExiste = await diaJaExiste(mesBlockId, iso);
  if (jaExiste) {
    console.log(`ℹ️  Dia ${iso} já existe. Nada a fazer.`);
    return;
  }

  // 4. Criar o dia
  await criarDia(mesBlockId, iso);

  console.log(`\n✨ Pronto! Daily de ${iso} criada no Notion.\n`);
}

run().catch((err: Error) => {
  console.error("❌ Erro:", err.message);
  if ((err as NodeJS.ErrnoException).code === "unauthorized") {
    console.error("   Token inválido ou sem permissão na página.");
  }
  process.exit(1);
});
