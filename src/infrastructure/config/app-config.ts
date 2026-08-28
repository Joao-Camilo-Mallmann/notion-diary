import type { NotionColor } from "../../domain/types/notion.types.ts";

export const APP_CONFIG = {
  notionToken: process.env.NOTION_TOKEN ?? "",
  pageId: "6e8ce964-7756-429b-b36d-943040e8cce3",
  timeZone: "America/Sao_Paulo",
  monthColors: {
    0: "purple", // Jan
    1: "blue",   // Fev
    2: "green",  // Mar
    3: "pink",   // Abril
    4: "yellow", // Maio
    5: "orange", // Jun
    6: "red",    // Jul
    7: "brown",  // Ago
    8: "gray",   // Set
    9: "blue",   // Out
    10: "default", // Nov
    11: "purple",  // Dez
  } as Record<number, NotionColor>,
  monthNames: [
    "Jan",
    "Fev",
    "Mar",
    "Abril",
    "Maio",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
} as const;

