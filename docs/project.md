# Project conventions

## Stack

- Node.js 22, ESM (`import`/`export`, `"type": "module"` in package.json)
- `@notionhq/client` v2 for Notion API
- GitHub Actions for daily automation

## Module responsibilities

| Module           | What belongs here                                |
| ---------------- | ------------------------------------------------ |
| `src/config.js`  | Constants and Notion client init only — no logic |
| `src/helpers.js` | Pure functions, no API calls, no side-effects    |
| `src/notion.js`  | All `notion.*` calls — nothing else              |
| `index.js`       | Imports + `run()` orchestration only             |

## Naming

- Functions: camelCase in Portuguese (`criarDia`, `findAnoBlock`, `diaJaExiste`)
- Constants: UPPER_SNAKE in Portuguese (`MES_CORES`, `NOMES_MES`, `PAGE_ID`)

## Do

- Keep all date math in `helpers.js` using `America/Sao_Paulo` timezone
- Use `position: { type: "start" }` when appending day blocks so newest days appear at top
- Paginate Notion list calls via `getChildren()` — never assume a single page of results

## Don't

- Don't add new top-level files without updating `agents.md`
- Don't hardcode dates or IDs outside `src/config.js`
- Don't use `require()` — project is ESM
- Don't add `@notionhq/client` workarounds; use the SDK types as-is
