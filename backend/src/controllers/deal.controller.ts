import { Request, Response } from "express";
import { retainMemory, recallMemories } from "../services/memory.service.js";
import { prisma } from "../utils/db.js";

export async function listDeals(req: Request, res: Response) { 
  const deals = await prisma.deal.findMany();
  res.json({ deals }); 
}

export async function logInteraction(req: Request, res: Response): Promise<void> {
  const { dealId, dealName, note, stakeholder } = req.body;
  try {
    await retainMemory(dealId, dealName, stakeholder, note);
    res.json({ success: true, message: "Interaction stored" });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
}

export async function getTimeline(req: Request, res: Response): Promise<void> {
  try {
    const entries = await recallMemories(req.params.dealId as string, "interaction call email meeting stakeholder objection timeline", "high");
    res.json({ dealId: req.params.dealId, entries });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
}

export async function getContext(req: Request, res: Response): Promise<void> {
  try {
    const entries = await recallMemories(req.params.dealId as string, (req.query.query as string) || "deal interactions objections stakeholders", "mid");
    res.json({ dealId: req.params.dealId, memories: entries });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
}

export async function seedDemoData(req: Request, res: Response): Promise<void> {
  const seedData = [
    { dealId: "acme-001", dealName: "Acme Corp", stakeholder: "Sarah Jenkins (VP Sales)", note: "[3 WEEKS AGO] Initial discovery call. Sarah is very interested in the automation features but raised a concern about implementation time. She mentioned they currently use Salesforce." },
    { dealId: "acme-001", dealName: "Acme Corp", stakeholder: "Mark (CTO)", note: "[LAST WEEK] Technical demo completed. Mark raised a hard security objection regarding our SOC2 compliance. He also mentioned their Q3 budget is extremely tight." },
    { dealId: "acme-001", dealName: "Acme Corp", stakeholder: "Sarah Jenkins (VP Sales)", note: "[YESTERDAY] Pricing negotiation email. Sarah pushed back on the $50k annual price tag, asking for a flat 20% discount if they sign this week." },
    { dealId: "acme-001", dealName: "Acme Corp", stakeholder: "System", note: "USER PREFERENCE: The user prefers all email drafts to be extremely concise (under 3 sentences), highly assertive, and structured with bullet points if listing facts." }
  ];
  try {
    for (const item of seedData) await retainMemory(item.dealId, item.dealName, item.stakeholder, item.note);
    res.json({ success: true, seeded: seedData.length });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
}
