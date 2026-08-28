import type { IDateProvider } from "../../domain/interfaces/date-provider.interface.ts";
import type { DiaryDate } from "../../domain/models/diary-date.ts";
import { APP_CONFIG } from "../config/app-config.ts";
import { padZero } from "../utils/date.utils.ts";

export class SaoPauloDateProvider implements IDateProvider {
  constructor(private readonly timeZone: string = APP_CONFIG.timeZone) {}

  getToday(): DiaryDate {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: this.timeZone }),
    );
    const year = now.getFullYear();
    const monthIndex = now.getMonth();
    const day = now.getDate();
    const iso = `${year}-${padZero(monthIndex + 1)}-${padZero(day)}`;
    const monthName = APP_CONFIG.monthNames[monthIndex] ?? "";

    return {
      year,
      monthIndex,
      day,
      iso,
      monthName,
    };
  }
}
