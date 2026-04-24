# Notion API patterns

## Block structure used in this project

```
PAGE_ID (page)
└── <year> heading_1 toggle          ← findAnoBlock()
    └── <month name> heading_1 toggle ← findMesBlock() / criarMes()
        └── <date mention> heading_1 toggle  ← criarDia()  [position: start]
            ├── bulleted_list_item "Positivo: "
            ├── bulleted_list_item "Gratidão: "
            ├── bulleted_list_item "Aprendizagem: "
            ├── divider
            └── bulleted_list_item ""
```

## Key API calls

### Append at position start

```js
await notion.blocks.children.append({
  block_id: parentId,
  children: [...],
  position: { type: "start" },   // ← keeps newest day at top
});
```

### Paginated children list

```js
// Always use getChildren() from src/notion.js — never call list() directly
const blocks = await getChildren(blockId);
```

## Month colors

Colors map is in `src/config.js` as `MES_CORES` (0–11). Applied as `${color}_background` on the `heading_1.color` field. `"default"` is passed as-is (no suffix).

## Date mention block

Day toggles use `rich_text[0].type === "mention"` with `mention.type === "date"` and `mention.date.start === "YYYY-MM-DD"`. Use `isBlocoDia()` from `src/helpers.js` to detect them.

## Idempotency

`diaJaExiste()` must be called before `criarDia()`. The GitHub Action can re-run safely.
