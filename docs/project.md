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

## Module responsibilities

| Module           | What belongs here                                |
| ---------------- | ------------------------------------------------ |
| `src/config.ts`  | Constants and Notion client init only — no logic |
| `src/helpers.ts` | Pure functions, no API calls, no side-effects    |
| `src/notion.ts`  | All `notion.*` calls — nothing else              |
| `src/types/*`    | Shared project types only                        |
| `index.ts`       | Imports + `run()` orchestration only             |

## Naming

- Functions: camelCase in Portuguese (`criarDia`, `findAnoBlock`, `diaJaExiste`)
- Constants: UPPER_SNAKE in Portuguese (`MES_CORES`, `NOMES_MES`, `PAGE_ID`)

## Do

- Keep all date math in `helpers.ts` using `America/Sao_Paulo` timezone
- Use the `appendChildrenAtStart()` helper (raw `notion.request`) when inserting day blocks so `position: { type: "start" }` reaches the API and newest days stay at top
- Paginate Notion list calls via `getChildren()` — never assume a single page of results
- CI should compile before running (`bun run build`, then `node dist/index.js`)
- Ensure Notion page has the year toggle created, and month toggle is present (or created on day 1)

## Don't

- Don't add new top-level files without updating `agents.md`
- Don't hardcode dates or IDs outside `src/config.ts`
- Don't use `require()` — project is ESM
- Don't use `npm` or `yarn` — project uses Bun
- Don't add ad-hoc `@notionhq/client` workarounds; keep any compatibility handling centralized in `appendChildrenAtStart()`
