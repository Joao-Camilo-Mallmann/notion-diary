import type { DiaryDate } from "../models/diary-date.ts";

export interface IDateProvider {
  getToday(): DiaryDate;
}
