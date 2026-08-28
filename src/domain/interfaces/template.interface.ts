import type { DiaryDate } from "../models/diary-date.ts";

export interface IDiaryTemplate {
  readonly name: string;
  buildChildBlocks(date: DiaryDate): unknown[];
}
