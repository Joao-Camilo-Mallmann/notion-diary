# daily-notion — Agent Index

Central index of rules and context files for AI agents working in this repository.

## Workspace rules

| File                                     | Scope           | Description                                  |
| ---------------------------------------- | --------------- | -------------------------------------------- |
| [docs/project.md](docs/project.md)       | all             | Architecture, conventions, and do/don't list |
| [docs/notion-api.md](docs/notion-api.md) | `src/notion.js` | Notion API patterns and gotchas used here    |

## Project map

```
index.js            ← entry point, orchestrates run()
src/
  config.js         ← constants (PAGE_ID, MES_CORES, NOMES_MES) + Notion client
  helpers.js        ← pure utilities: padZero, hoje, isBlocoDia
  notion.js         ← all Notion API calls
.github/
  workflows/
    main.yml        ← daily cron at 03:00 UTC (00:00 Brasília) + workflow_dispatch
```

## Key facts

- Runtime: Node.js 22, ESM (`"type": "module"`)
- Timezone: `America/Sao_Paulo` for all date logic
- Auth: `NOTION_TOKEN` env var (GitHub Actions secret)
- Day blocks always inserted at **position start** of the month toggle
