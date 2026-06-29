import { z } from "zod";

export const analyzeRequestSchema = z.object({
  company: z.string().trim().min(1, "Company name is required").max(120)
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
