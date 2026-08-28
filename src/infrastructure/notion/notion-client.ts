import { Client } from "@notionhq/client";
import { APP_CONFIG } from "../config/app-config.ts";

export function createNotionClient(token: string = APP_CONFIG.notionToken): Client {
  return new Client({ auth: token });
}
