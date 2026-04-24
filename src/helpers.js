// ─── HELPERS ──────────────────────────────────────────────────────────────────

function padZero(n) {
  return String(n).padStart(2, "0");
}

/** Data de hoje no fuso de Brasília */
function hoje() {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }),
  );
  return {
    ano: now.getFullYear(),
    mes: now.getMonth(), // 0-indexed
    dia: now.getDate(),
    iso: `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())}`,
  };
}

/** Identifica se o bloco representa um dia (heading_1 toggle com mention-date). */
function isBlocoDia(block) {
  if (!(block.type === "heading_1" && block.heading_1?.is_toggleable)) {
    return false;
  }
  return block.heading_1.rich_text.some(
    (rt) => rt.type === "mention" && rt.mention?.type === "date",
  );
}

export { hoje, isBlocoDia, padZero };

