import { z } from "zod";

export const financialAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string().min(1),
  strengths: z.array(z.string()),
  concerns: z.array(z.string()),
  missingData: z.array(z.string()),
  sourceIds: z.array(z.string())
});

export const riskAnalysisSchema = z.object({
  level: z.enum(["LOW", "MEDIUM", "HIGH"]),
  topRisks: z.array(z.string()),
  futureConcerns: z.array(z.string()),
  positiveCatalysts: z.array(z.string()),
  sourceIds: z.array(z.string())
});

export type FinancialAnalysis = z.infer<typeof financialAnalysisSchema>;
export type RiskAnalysis = z.infer<typeof riskAnalysisSchema>;
