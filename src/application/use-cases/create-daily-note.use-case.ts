import type { IDateProvider } from "../../domain/interfaces/date-provider.interface.ts";
import type { INotionRepository } from "../../domain/interfaces/notion-repository.interface.ts";
import type { IDiaryTemplate } from "../../domain/interfaces/template.interface.ts";
import type { DiaryDate } from "../../domain/models/diary-date.ts";
import { APP_CONFIG } from "../../infrastructure/config/app-config.ts";

export type CreateDailyNoteResult =
  | { status: "created"; date: DiaryDate; dayBlockId: string }
  | { status: "already_exists"; date: DiaryDate };

export class CreateDailyNoteUseCase {
  constructor(
    private readonly notionRepo: INotionRepository,
    private readonly dateProvider: IDateProvider,
    private readonly template: IDiaryTemplate,
  ) {}

  async execute(): Promise<CreateDailyNoteResult> {
    const today = this.dateProvider.getToday();

    console.log(`\n🚀 Daily Notes auto-creator — ${today.iso}`);
    console.log(`   Ano: ${today.year} | Mês: ${today.monthName} | Dia: ${today.day}\n`);

    // 1. Encontrar o bloco do ano
    const yearBlock = await this.notionRepo.findYearBlock(today.year);
    if (!yearBlock) {
      throw new Error(
        `Não encontrei o bloco do ano ${today.year} na página! Crie manualmente o toggle do ano e rode de novo.`,
      );
    }
    console.log(`✅ Ano ${today.year} encontrado: ${yearBlock.id}`);

    // 2. Encontrar ou criar o bloco do mês
    let monthBlock = await this.notionRepo.findMonthBlock(
      yearBlock.id,
      today.monthName,
    );
    let monthBlockId: string;

    if (!monthBlock) {
      if (today.day === 1) {
        console.log(`📅 Primeiro dia do mês! Criando ${today.monthName}...`);
        const color = APP_CONFIG.monthColors[today.monthIndex] ?? "default";
        monthBlockId = await this.notionRepo.createMonthBlock(
          yearBlock.id,
          today.monthName,
          color,
        );
        console.log(`✅ Mês criado: ${monthBlockId}`);
      } else {
        throw new Error(
          `Mês "${today.monthName}" não encontrado e hoje não é dia 1. Crie o mês manualmente ou aguarde o dia 1.`,
        );
      }
    } else {
      console.log(`✅ Mês ${today.monthName} encontrado: ${monthBlock.id}`);
      monthBlockId = monthBlock.id;
    }

    // 3. Verificar se o dia já existe (Idempotência)
    const exists = await this.notionRepo.dayExists(monthBlockId, today.iso);
    if (exists) {
      console.log(`ℹ️  Dia ${today.iso} já existe. Nada a fazer.`);
      return { status: "already_exists", date: today };
    }

    // 4. Construir blocos do template e criar o dia
    const childBlocks = this.template.buildChildBlocks(today);
    const dayBlockId = await this.notionRepo.createDayBlock(
      monthBlockId,
      today.iso,
      childBlocks,
    );

    console.log(`\n✨ Pronto! Daily de ${today.iso} criada no Notion (ID: ${dayBlockId}).\n`);
    return { status: "created", date: today, dayBlockId };
  }
}
