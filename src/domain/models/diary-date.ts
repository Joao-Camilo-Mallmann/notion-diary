export interface DiaryDate {
  year: number;
  monthIndex: number; // 0 to 11
  day: number;
  iso: string; // YYYY-MM-DD
  monthName: string;
}
