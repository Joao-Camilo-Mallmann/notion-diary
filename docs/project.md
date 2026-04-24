# Project conventions

## Stack

- Bun (runtime + package manager), ESM (`import`/`export`, `"type": "module"` in package.json)
- TypeScript compiled with `tsc` to `dist/`
- `@notionhq/client` v2 for Notion API
- GitHub Actions for daily automation

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
- Use `position: { type: "start" }` when appending day blocks so newest days appear at top
- Paginate Notion list calls via `getChildren()` — never assume a single page of results
- CI should compile before running (`bun run build`, then `node dist/index.js`)

## Don't

- Don't add new top-level files without updating `agents.md`
- Don't hardcode dates or IDs outside `src/config.ts`
- Don't use `require()` — project is ESM
- Don't use `npm` or `yarn` — project uses Bun
- Don't add `@notionhq/client` workarounds; use the SDK types as-is
