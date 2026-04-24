import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";

export type NotionBlock = BlockObjectResponse;
export type Heading1Block = Extract<BlockObjectResponse, { type: "heading_1" }>;

export interface HojeResult {
  ano: number;
  mes: number;
  dia: number;
  iso: string;
}
