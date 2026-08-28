import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";

export type NotionBlock = BlockObjectResponse;
export type Heading1Block = Extract<BlockObjectResponse, { type: "heading_1" }>;
export type NotionColor =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red";
