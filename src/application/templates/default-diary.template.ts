import type { IDiaryTemplate } from "../../domain/interfaces/template.interface.ts";
import type { DiaryDate } from "../../domain/models/diary-date.ts";

export class DefaultDiaryTemplate implements IDiaryTemplate {
  readonly name = "Default Daily Template";

  buildChildBlocks(_date: DiaryDate): unknown[] {
    return [
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Positivo: " } }],
        },
      },
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Gratidão: " } }],
        },
      },
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Aprendizagem: " } }],
        },
      },
      {
        type: "divider",
        divider: {},
      },
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "" } }],
        },
      },
    ];
  }
}
