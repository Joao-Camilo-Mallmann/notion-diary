import type { HojeResult, NotionBlock } from "./types/index.ts";

// ─── RETRY ────────────────────────────────────────────────────────────────────

const RETRYABLE_MESSAGES = [
  "premature close",
  "fetch failed",
  "econnreset",
  "socket hang up",
  "etimedout",
  "enotfound",
];

function isRetryable(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return RETRYABLE_MESSAGES.some((m) => msg.includes(m));
}

/**
 * Executa `fn` com retry + backoff exponencial.
 * Tenta `maxAttempts` vezes antes de lançar o último erro.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  { maxAttempts = 4, baseDelayMs = 1500 }: { maxAttempts?: number; baseDelayMs?: number } = {},
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isRetryable(err) || attempt === maxAttempts) throw err;
      const delay = baseDelayMs * 2 ** (attempt - 1); // 1.5s, 3s, 6s
      console.warn(
        `⚠️  Tentativa ${attempt}/${maxAttempts} falhou (${(err as Error).message}). Aguardando ${delay}ms...`,
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function padZero(n: number): string {
  return String(n).padStart(2, "0");
}

/** Data de hoje no fuso de Brasília */
export function hoje(): HojeResult {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }),
  );
  return {
    ano: now.getFullYear(),
    mes: now.getMonth(),
    dia: now.getDate(),
    iso: `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())}`,
  };
}

/** Identifica se o bloco representa um dia (heading_1 toggle com mention-date). */
export function isBlocoDia(block: NotionBlock): boolean {
  if (!(block.type === "heading_1" && block.heading_1?.is_toggleable)) {
    return false;
  }
  return block.heading_1.rich_text.some(
    (rt) => rt.type === "mention" && rt.mention?.type === "date",
  );
}
