import type { Client } from "@notionhq/client";
import type { INotionRepository } from "../../domain/interfaces/notion-repository.interface.ts";
import type { Heading1Block, NotionBlock } from "../../domain/types/notion.types.ts";
import { APP_CONFIG } from "../config/app-config.ts";
import { withRetry } from "../utils/retry.ts";

type AppendChildrenAtStartResponse = {
  results: Array<{ id: string }>;
};

export class NotionDiaryRepository implements INotionRepository {
  constructor(
    private readonly client: Client,
    private readonly pageId: string = APP_CONFIG.pageId,
  ) {}

  private async appendChildrenAtStart(
    blockId: string,
    children: unknown[],
  ): Promise<AppendChildrenAtStartResponse> {
    return withRetry(() =>
      this.client.request<AppendChildrenAtStartResponse>({
        path: `blocks/${blockId}/children`,
        method: "patch",
        body: {
          children,
          position: { type: "start" },
        },
      }),
    );
  }

  private async getChildren(blockId: string): Promise<NotionBlock[]> {
    const children: NotionBlock[] = [];
    let cursor: string | undefined;
    do {
      const res = await withRetry(() =>
        this.client.blocks.children.list({
          block_id: blockId,
          page_size: 100,
          start_cursor: cursor,
        }),
      );
      children.push(...(res.results as NotionBlock[]));
      cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
    } while (cursor);
    return children;
  }

  private isDayBlock(block: NotionBlock): boolean {
    if (!(block.type === "heading_1" && block.heading_1?.is_toggleable)) {
      return false;
    }
    return block.heading_1.rich_text.some(
      (rt) => rt.type === "mention" && rt.mention?.type === "date",
    );
  }

  async findYearBlock(year: number): Promise<NotionBlock | null> {
    const blocks = await this.getChildren(this.pageId);
    for (const b of blocks) {
      if (b.type === "heading_1" && b.heading_1?.is_toggleable) {
        const text = b.heading_1.rich_text.map((t) => t.plain_text).join("");
        if (text.includes(String(year))) return b;
      }
    }
    return null;
  }

  async findMonthBlock(
    yearBlockId: string,
    monthName: string,
  ): Promise<NotionBlock | null> {
    const blocks = await this.getChildren(yearBlockId);
    for (const b of blocks) {
      if (b.type === "heading_1" && b.heading_1?.is_toggleable) {
        const text = b.heading_1.rich_text.map((t) => t.plain_text).join("");
        if (text === monthName) return b;
      }
    }
    return null;
  }

  async dayExists(monthBlockId: string, isoDate: string): Promise<boolean> {
    const blocks = await this.getChildren(monthBlockId);
    for (const b of blocks) {
      if (this.isDayBlock(b)) {
        const headingBlock = b as Heading1Block;
        for (const rt of headingBlock.heading_1.rich_text) {
          if (rt.type === "mention" && rt.mention?.type === "date") {
            if (rt.mention.date.start === isoDate) return true;
          }
        }
      }
    }
    return false;
  }

  async createMonthBlock(
    yearBlockId: string,
    monthName: string,
    color: string,
  ): Promise<string> {
    const res = await withRetry(() =>
      this.client.blocks.children.append({
        block_id: yearBlockId,
        children: [
          {
            type: "heading_1",
            heading_1: {
              rich_text: [{ type: "text", text: { content: monthName } }],
              color:
                color === "default" ? "default" : (`${color}_background` as never),
              is_toggleable: true,
            },
          },
        ],
      }),
    );
    return res.results[0].id;
  }

  async createDayBlock(
    monthBlockId: string,
    isoDate: string,
    childBlocks: unknown[],
  ): Promise<string> {
    const diaBlock = await this.appendChildrenAtStart(monthBlockId, [
      {
        type: "heading_1",
        heading_1: {
          rich_text: [
            {
              type: "mention",
              mention: { date: { start: isoDate } },
            },
          ],
          is_toggleable: true,
        },
      },
    ]);

    const diaId = diaBlock.results[0].id;

    if (childBlocks.length > 0) {
      await withRetry(() =>
        this.client.blocks.children.append({
          block_id: diaId,
          children: childBlocks as never,
        }),
      );
    }

    return diaId;
  }
}
