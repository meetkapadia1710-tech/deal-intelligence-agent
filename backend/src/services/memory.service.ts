import { hindsight, BANK_ID } from "../config/clients.js";
import { prisma } from "../utils/db.js";

export async function initBank(): Promise<void> {
  try {
    await hindsight.createBank(BANK_ID, {
      reflectMission: "I am a sales intelligence assistant.",
      dispositionEmpathy: 4, dispositionLiteralism: 3, dispositionSkepticism: 2,
    });
    console.log("✅ Memory bank ready:", BANK_ID);
  } catch (err: any) { console.warn("Bank init warning:", err.message); }
}

export async function retainMemory(dealId: string, dealName: string | undefined, stakeholder: string | undefined, note: string): Promise<void> {
  const name = dealName || dealId;
  const enrichedNote = `[Deal: ${name}] [DealID: ${dealId}]${stakeholder ? ` [Stakeholder: ${stakeholder}]` : ""} ${note}`;
  await hindsight.retain(BANK_ID, enrichedNote, {
    metadata: { dealId, dealName: name, ...(stakeholder && { stakeholder }), timestamp: new Date().toISOString() },
    tags: [dealId],
  });
  await prisma.deal.upsert({
    where: { dealId },
    update: { dealName: name },
    create: { dealId, dealName: name },
  });

  await prisma.interaction.create({
    data: {
      dealId,
      note,
      stakeholder,
    },
  });
}

export async function recallMemories(dealId: string, query: string, budget: "low" | "mid" | "high" = "mid"): Promise<any[]> {
  const memories = await hindsight.recall(BANK_ID, query, { tags: [dealId], tagsMatch: "all_strict", budget });
  return memories.results || [];
}

export async function reflectOnDeal(dealId: string, prompt: string): Promise<any> {
  return await hindsight.reflect(BANK_ID, prompt, { tags: [dealId], tagsMatch: "all_strict", budget: "mid" });
}
