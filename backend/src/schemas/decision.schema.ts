import { z } from "zod";

export const recommendationSchema = z.enum(["INVEST", "PASS"]);

export const decisionSchema = z.object({
  recommendation: recommendationSchema,
  confidence: z.number().min(0).max(100),
  investmentHorizon: z.string().min(1),
  reasoning: z.string().min(1),
  bullCase: z.array(z.string()).min(1),
  bearCase: z.array(z.string()).min(1),
  keyMetrics: z.array(z.string()),
  sourceIds: z.array(z.string())
});

export type Recommendation = z.infer<typeof recommendationSchema>;
export type Decision = z.infer<typeof decisionSchema>;
