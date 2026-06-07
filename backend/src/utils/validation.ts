import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Schemas
export const LogInteractionSchema = z.object({
  body: z.object({
    dealId: z.string().min(1, "dealId is required"),
    dealName: z.string().optional(),
    note: z.string().min(3, "note must be at least 3 characters"),
    stakeholder: z.string().optional(),
  }),
});

export const ChatRequestSchema = z.object({
  body: z.object({
    dealId: z.string().min(1, "dealId is required"),
    dealName: z.string().optional(),
    question: z.string().min(1, "question is required"),
  }),
});

export const ReflectRequestSchema = z.object({
  body: z.object({
    dealId: z.string().min(1, "dealId is required"),
    dealName: z.string().optional(),
    prompt: z.string().optional(),
  }),
});

// Reusable Middleware
export function validateRequest(schema: z.AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        res.status(400).json({ error: "Unexpected validation error" });
      }
    }
  };
}
