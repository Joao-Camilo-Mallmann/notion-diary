import { CreateDailyNoteUseCase } from "./src/application/use-cases/create-daily-note.use-case.ts";
import { DefaultDiaryTemplate } from "./src/application/templates/default-diary.template.ts";
import { APP_CONFIG } from "./src/infrastructure/config/app-config.ts";
import { SaoPauloDateProvider } from "./src/infrastructure/date/sp-date-provider.ts";
import { createNotionClient } from "./src/infrastructure/notion/notion-client.ts";
import { NotionDiaryRepository } from "./src/infrastructure/notion/notion-diary.repository.ts";

async function main(): Promise<void> {
  if (!APP_CONFIG.notionToken) {
    console.error("❌ NOTION_TOKEN não definido! Exporte ele antes de rodar.");
    process.exit(1);
  }

  const notionClient = createNotionClient(APP_CONFIG.notionToken);
  const notionRepo = new NotionDiaryRepository(notionClient, APP_CONFIG.pageId);
  const dateProvider = new SaoPauloDateProvider(APP_CONFIG.timeZone);
  const template = new DefaultDiaryTemplate();

  const useCase = new CreateDailyNoteUseCase(notionRepo, dateProvider, template);
  await useCase.execute();
}

main().catch((err: Error) => {
  console.error("❌ Erro:", err.message);
  if ((err as NodeJS.ErrnoException).code === "unauthorized") {
    console.error("   Token inválido ou sem permissão na página.");
  }
  process.exit(1);
});

