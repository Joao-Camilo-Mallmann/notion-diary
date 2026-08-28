# daily-notion — Agent Index

Central index of rules and context files for AI agents working in this repository.

## Workspace rules

| File                                     | Scope           | Description                                  |
| ---------------------------------------- | --------------- | -------------------------------------------- |
| [README.md](README.md)                   | all             | Project overview, cron schedule & setup      |
| [docs/project.md](docs/project.md)       | all             | Architecture, conventions, and do/don't list |
| [docs/notion-api.md](docs/notion-api.md) | all             | Notion API patterns and gotchas used here    |

## Project map

```
README.md                                 ← user guide, cron schedule details, local setup
index.ts                                  ← composition root (Dependency Injection) + CLI
src/
  domain/
    interfaces/
      date-provider.interface.ts          ← IDateProvider abstraction
      notion-repository.interface.ts      ← INotionRepository abstraction
      template.interface.ts               ← IDiaryTemplate abstraction
    models/
      diary-date.ts                       ← DiaryDate domain model
    types/
      notion.types.ts                     ← Notion block types & colors
  application/
    use-cases/
      create-daily-note.use-case.ts       ← CreateDailyNoteUseCase orchestration
    templates/
      default-diary.template.ts           ← Default diary template builder
  infrastructure/
    config/
      app-config.ts                       ← App configuration & environment variables
    date/
      sp-date-provider.ts                 ← Timezone provider (America/Sao_Paulo)
    notion/
      notion-client.ts                    ← Notion SDK client factory
      notion-diary.repository.ts          ← Notion repository implementation
    utils/
      retry.ts                            ← withRetry with exponential backoff
      date.utils.ts                       ← padZero and date formatting helpers
dist/                                     ← compiled JavaScript output
.github/
  workflows/
    main.yml                              ← daily cron at 03:00 UTC (00:00 Brasília) + workflow_dispatch
```

## Key facts

- Pattern: Clean Architecture / SOLID with constructor Dependency Injection
- Runtime: Bun (package manager + runner), Node.js ESM (`"type": "module"`)
- Build: TypeScript (`tsc`) compiling to `dist/`
- Timezone: `America/Sao_Paulo` managed by `SaoPauloDateProvider`
- Scheduling: GitHub Actions Cron (`0 3 * * *` = 00:00 Brasília); note that GitHub disables cron after 60 days of inactivity
- Auth: `NOTION_TOKEN` env var (GitHub Actions secret)
- Day blocks always inserted at **position start** of the month toggle via `appendChildrenAtStart`
