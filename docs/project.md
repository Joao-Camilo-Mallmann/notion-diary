# Project conventions

## Stack

- Bun (runtime + package manager), ESM (`import`/`export`, `"type": "module"` in package.json)
- TypeScript compiled with `tsc` to `dist/`
- `@notionhq/client` v2 for Notion API
- GitHub Actions for daily automation (Cron: `0 3 * * *` = 00:00 UTC-3 America/Sao_Paulo)

## Automation & Scheduling (Cron)

- Workflow: `.github/workflows/main.yml`
- Schedule: Runs daily at `03:00 UTC` (which corresponds to `00:00` America/Sao_Paulo Brasília Time).
- Trigger: Also supports manual trigger (`workflow_dispatch`).
- **GitHub Inactivity Caveat**: GitHub automatically suspends scheduled workflows if the repository has no commits for 60 consecutive days. If it stops, re-enable via Actions UI.

## Architecture & SOLID Principles

The codebase follows Clean Architecture and SOLID design patterns:

- **Domain (`src/domain/`)**: Pure domain models (`DiaryDate`), types (`NotionBlock`), and contract interfaces (`INotionRepository`, `IDateProvider`, `IDiaryTemplate`). Zero external framework dependencies.
- **Application (`src/application/`)**: Use cases (`CreateDailyNoteUseCase`) orchestrating the business workflow, and note templates (`DefaultDiaryTemplate`).
- **Infrastructure (`src/infrastructure/`)**: External integrations and implementations (`NotionDiaryRepository`, `SaoPauloDateProvider`, `createNotionClient`, `APP_CONFIG`, `withRetry`).
- **Entry Point (`index.ts`)**: Pure composition root wiring dependencies and managing execution lifecycle.

## Module responsibilities

| Layer / Directory                 | What belongs here                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `src/domain/interfaces/`          | Abstractions (`INotionRepository`, `IDateProvider`, `IDiaryTemplate`)              |
| `src/domain/models/`              | Domain value objects and models (`DiaryDate`)                                      |
| `src/domain/types/`               | Notion block types (`NotionBlock`, `Heading1Block`, `NotionColor`)                  |
| `src/application/use-cases/`      | Business workflows (`CreateDailyNoteUseCase`)                                      |
| `src/application/templates/`      | Diary note templates implementing `IDiaryTemplate` (`DefaultDiaryTemplate`)         |
| `src/infrastructure/config/`      | Configuration and environment variables (`APP_CONFIG`)                            |
| `src/infrastructure/date/`        | Date providers (`SaoPauloDateProvider`)                                            |
| `src/infrastructure/notion/`      | Notion SDK client & repository (`NotionDiaryRepository`, `createNotionClient`)    |
| `src/infrastructure/utils/`       | General infrastructure utilities (`withRetry`, `padZero`)                          |
| `index.ts`                        | Composition root (Dependency Injection) + CLI exit handling                       |

## Naming & Conventions

- Classes: PascalCase (`CreateDailyNoteUseCase`, `NotionDiaryRepository`, `DefaultDiaryTemplate`)
- Interfaces: `I` prefix + PascalCase (`INotionRepository`, `IDateProvider`, `IDiaryTemplate`)
- Methods & functions: camelCase (`findYearBlock`, `createDayBlock`, `execute`, `getToday`)
- Constants: UPPER_SNAKE (`APP_CONFIG`)

## Do

- Maintain clear separation between domain abstractions and infrastructure implementations
- Program to interfaces, injecting dependencies through constructors
- Keep all timezone handling inside `IDateProvider` implementations (`America/Sao_Paulo`)
- Use `NotionDiaryRepository.appendChildrenAtStart` so `position: { type: "start" }` keeps newest days at top
- Paginate Notion list calls via `getChildren()` — never assume a single page of results
- CI compiles before running (`bun run build`, then `node dist/index.js` or `bun dist/index.js`)

## Don't

- Don't import concrete infrastructure classes into domain models or interfaces
- Don't hardcode config values outside `src/infrastructure/config/app-config.ts`
- Don't use `require()` — project is pure ESM
- Don't use `npm` or `yarn` — project uses Bun
