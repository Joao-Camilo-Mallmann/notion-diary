# daily-notion — Agent Index

Central index of rules and context files for AI agents working in this repository.

## Workspace rules

| File                                     | Scope           | Description                                  |
| ---------------------------------------- | --------------- | -------------------------------------------- |
| [README.md](README.md)                   | all             | Project overview, cron schedule & setup      |
| [docs/project.md](docs/project.md)       | all             | Architecture, conventions, and do/don't list |
| [docs/notion-api.md](docs/notion-api.md) | `src/notion.ts` | Notion API patterns and gotchas used here    |

## Project map

```
README.md           ← user guide, cron schedule details, local setup
index.ts            ← entry point, orchestrates run()
src/
  config.ts         ← constants (PAGE_ID, MES_CORES, NOMES_MES) + Notion client
  helpers.ts        ← pure utilities: padZero, hoje, isBlocoDia
  notion.ts         ← all Notion API calls
  types/
    index.ts        ← shared project types (HojeResult, NotionBlock, Heading1Block)
dist/               ← compiled JavaScript output used in CI/runtime
.github/
  workflows/
    main.yml        ← daily cron at 03:00 UTC (00:00 Brasília) + workflow_dispatch
```

## Key facts

- Runtime: Bun (package manager + runner), Node.js ESM (`"type": "module"`)
- Build: TypeScript (`tsc`) compiling to `dist/`
- Timezone: `America/Sao_Paulo` for all date logic
- Scheduling: GitHub Actions Cron (`0 3 * * *` = 00:00 Brasília); note that GitHub disables cron after 60 days of inactivity
- Auth: `NOTION_TOKEN` env var (GitHub Actions secret)
- Day blocks always inserted at **position start** of the month toggle
