import { Request, Response } from "express";
import { recallMemories, reflectOnDeal } from "../services/memory.service.js";
import { generateChatCompletion } from "../services/ai.service.js";

export async function handleChat(req: Request, res: Response): Promise<void> {
  const { dealId, dealName, question } = req.body;
  try {
    const memories = await recallMemories(dealId, question, "mid");
    const memoryText = memories.map((m: any) => m.text).join("\n---\n") || "No prior interactions.";
    const systemPrompt = `You are a sales coach for ${dealName || dealId}.`;
    const userPrompt = `Deal history:\n${memoryText}\n\nQuestion: ${question}`;
    const answer = await generateChatCompletion(systemPrompt, userPrompt);
    res.json({ answer, memoryUsed: memories.length > 0, memoriesCount: memories.length, dealId });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
}

export async function handleChatNoMemory(req: Request, res: Response): Promise<void> {
  try {
    const answer = await generateChatCompletion("You are a generic sales assistant.", req.body.question, 400);
    res.json({ answer, memoryUsed: false, memoriesCount: 0 });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
}

export async function handleCompare(req: Request, res: Response): Promise<void> {
  const { dealId, dealName, question } = req.body;
  try {
    const memories = await recallMemories(dealId, question, "mid");
    const memoryText = memories.map((m: any) => m.text).join("\n---\n") || "No prior interactions.";
    const [noMemAnswer, withMemAnswer] = await Promise.all([
      generateChatCompletion("You are a generic assistant.", question, 350),
      generateChatCompletion(`Sales coach for ${dealName || dealId}.`, `History:\n${memoryText}\n\nQ: ${question}`, 350)
    ]);
    res.json({ noMemory: noMemAnswer, withMemory: withMemAnswer, memoriesCount: memories.length });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
}

export async function handleReflect(req: Request, res: Response): Promise<void> {
  const { dealId, dealName, prompt } = req.body;
  try {
    const reflectPrompt = prompt || `Summarize objections, stakeholders, and risks for ${dealName || dealId}.`;
    const result = await reflectOnDeal(dealId, reflectPrompt);
    res.json({ reflection: result.text, dealId });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
}
