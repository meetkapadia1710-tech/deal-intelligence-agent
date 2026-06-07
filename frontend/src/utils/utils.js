// Strip the [Deal: ...] [DealID: ...] [Stakeholder: ...] prefixes we embed on retain
export function parseMemoryEntry(entry) {
  const raw = entry.text || "";
  const stakeholderMatch = raw.match(/\[Stakeholder:\s*([^\]]+)\]/);
  const stakeholder =
    entry.metadata?.stakeholder ||
    (stakeholderMatch ? stakeholderMatch[1].trim() : null);

  const cleaned = raw
    .replace(/\[Deal:[^\]]*\]/g, "")
    .replace(/\[DealID:[^\]]*\]/g, "")
    .replace(/\[Stakeholder:[^\]]*\]/g, "")
    .trim();

  const ts = entry.metadata?.timestamp || entry.mentioned_at || null;
  const date = ts
    ? new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return { stakeholder, cleaned, date, type: entry.type || "world", entities: entry.entities || [] };
}
