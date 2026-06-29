import type { Company } from "../schemas/company.schema.js";
import type { Decision } from "../schemas/decision.schema.js";
import type { Financials } from "../schemas/financial.schema.js";
import type { NewsArticle, SourceReference } from "../schemas/news.schema.js";
import type { FinancialAnalysis, RiskAnalysis } from "../schemas/risk.schema.js";

export type ResearchProgressEvent = {
  step: string;
  status: "waiting" | "running" | "completed" | "failed";
  message?: string;
};

export type ResearchError = {
  code: string;
  message: string;
};

export type ResearchState = {
  requestId: string;
  input: {
    companyName: string;
  };
  company?: Company;
  financials?: Financials;
  news: NewsArticle[];
  financialAnalysis?: FinancialAnalysis;
  riskAnalysis?: RiskAnalysis;
  decision?: Decision;
  sources: SourceReference[];
  progress: ResearchProgressEvent[];
  errors: ResearchError[];
};

export const appendProgress = (
  state: ResearchState,
  event: ResearchProgressEvent
): ResearchProgressEvent[] => [...state.progress, event];
