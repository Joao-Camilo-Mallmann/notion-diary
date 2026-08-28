import type { NotionBlock } from "../types/notion.types.ts";

export interface INotionRepository {
  findYearBlock(year: number): Promise<NotionBlock | null>;
  findMonthBlock(yearBlockId: string, monthName: string): Promise<NotionBlock | null>;
  dayExists(monthBlockId: string, isoDate: string): Promise<boolean>;
  createMonthBlock(yearBlockId: string, monthName: string, color: string): Promise<string>;
  createDayBlock(monthBlockId: string, isoDate: string, childBlocks: unknown[]): Promise<string>;
}
