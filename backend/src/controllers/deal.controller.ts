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
    { dealId: "tech-002", dealName: "TechSolutions", stakeholder: "David Lee", note: "Decision maker change detected. Mither commers disconnecting content." },
    { dealId: "global-003", dealName: "Global Industries", stakeholder: "Amanda", note: "Pricing concerns raised to ar competitor entry." },
    { dealId: "omega-004", dealName: "Omega Systems", stakeholder: "Chris", note: "Pending legal review." }
  ];

  const dealStats = {
    "acme-001": { value: 50000000, probability: 45, riskLevel: "High" },
    "tech-002": { value: 800000000, probability: 85, riskLevel: "Low" },
    "global-003": { value: 400000000, probability: 74, riskLevel: "High" },
    "omega-004": { value: 200000000, probability: 68, riskLevel: "High" }
  };

  try {
    for (const item of seedData) {
      await retainMemory(item.dealId, item.dealName, item.stakeholder, item.note);
    }
    
    // Update stats so the functional dashboard looks realistic ($1.45B total, 68% avg prob, 3 high risk)
    for (const [dealId, stats] of Object.entries(dealStats)) {
      await prisma.deal.updateMany({
        where: { dealId },
        data: stats
      });
    }

    res.json({ success: true, seeded: seedData.length });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
}
