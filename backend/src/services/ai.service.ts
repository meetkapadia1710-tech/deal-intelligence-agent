import { groq } from "../config/clients.js";

export async function generateChatCompletion(systemPrompt: string, userPrompt: string, maxTokens: number = 800): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    temperature: 0.7, max_tokens: maxTokens,
  });
  return completion.choices[0]?.message?.content || "No response generated.";
}
