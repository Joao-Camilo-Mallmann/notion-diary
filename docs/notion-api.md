# Notion API patterns

## Block structure used in this project

```
PAGE_ID (page)
└── <year> heading_1 toggle          ← NotionDiaryRepository.findYearBlock()
    └── <month name> heading_1 toggle ← NotionDiaryRepository.findMonthBlock() / createMonthBlock()
        └── <date mention> heading_1 toggle  ← NotionDiaryRepository.createDayBlock()  [position: start]
            ├── bulleted_list_item "Positivo: "
            ├── bulleted_list_item "Gratidão: "
            ├── bulleted_list_item "Aprendizagem: "
            ├── divider
            └── bulleted_list_item ""
```

## Key API calls

### Append at position start

```ts
await client.request({
  path: `blocks/${parentId}/children`,
  method: "patch",
  body: {
    children: [...],
    position: { type: "start" }, // keeps newest day at top
  },
});
```

Note: `client.blocks.children.append()` filters request fields and only sends `children`/`after` in this SDK version. `NotionDiaryRepository` centralizes this raw request in `appendChildrenAtStart()`.

### Paginated children list

All listing operations in `NotionDiaryRepository` use paginated cursor iteration via `withRetry` to guarantee complete block traversal.

## Month colors

Color mapping is defined in `src/infrastructure/config/app-config.ts` (`APP_CONFIG.monthColors`). Applied as `${color}_background` on the `heading_1.color` field. `"default"` is passed as-is (no suffix).

## Date mention block

Day toggles use `rich_text[0].type === "mention"` with `mention.type === "date"` and `mention.date.start === "YYYY-MM-DD"`. Detected via `isDayBlock()` inside `NotionDiaryRepository`.

## Idempotency

`NotionDiaryRepository.dayExists()` is checked by `CreateDailyNoteUseCase` before creating a day note. The GitHub Action can re-run safely at any time.
