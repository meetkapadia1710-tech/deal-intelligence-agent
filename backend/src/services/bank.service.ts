import { PrismaClient } from "@prisma/client";
import { HindsightClient } from "@vectorize-io/hindsight-client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const hindsight = new HindsightClient({
  baseUrl: process.env.HINDSIGHT_BASE_URL || "https://api.hindsight.vectorize.io",
  apiKey: process.env.HINDSIGHT_API_KEY || "",
});

export async function getOrProvisionBank(orgId: string): Promise<string> {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) return "deal-intelligence-agent";
  if (org.vectorBankId) return org.vectorBankId;

  const safeName = `org-${orgId}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, "");
  try {
    await hindsight.createBank(safeName, {
      reflectMission: "I am a sales intelligence assistant. I help reps close deals by remembering every interaction, objection, and stakeholder detail.",
      dispositionEmpathy: 4,
      dispositionLiteralism: 3,
      dispositionSkepticism: 2,
    });
    await prisma.organization.update({ where: { id: orgId }, data: { vectorBankId: safeName } });
    return safeName;
  } catch (err) {
    console.error("Bank creation error:", err);
    return "deal-intelligence-agent";
  }
}

export async function getBankForDeal(dealId: string): Promise<string> {
  if (!dealId) return "deal-intelligence-agent";
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) return "deal-intelligence-agent";
  return await getOrProvisionBank(deal.organizationId);
}
