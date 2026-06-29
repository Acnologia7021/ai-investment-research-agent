import crypto from "node:crypto";
import { AppError } from "../errors/appError.js";
import type { ResearchState } from "../agents/state.js";
import { createResearchGraph } from "../agents/graph.js";

export type ResearchResponse = {
  requestId: string;
  profile: ResearchState["company"];
  financials: ResearchState["financials"];
  financialAnalysis: ResearchState["financialAnalysis"];
  news: ResearchState["news"];
  riskAnalysis: ResearchState["riskAnalysis"];
  recommendation: "INVEST" | "PASS";
  confidence: number;
  investmentHorizon: string;
  reasoning: string;
  bullCase: string[];
  bearCase: string[];
  keyMetrics: string[];
  sources: ResearchState["sources"];
  researchedAt: string;
  disclaimer: string;
};

export const runResearch = async (companyName: string): Promise<ResearchResponse> => {
  const initialState: ResearchState = {
    requestId: crypto.randomUUID(),
    input: { companyName },
    news: [],
    sources: [],
    progress: [{ step: "company", status: "running", message: "Resolving company" }],
    errors: []
  };

  const graph = createResearchGraph();
  const result = (await graph.invoke(initialState)) as ResearchState;

  if (!result.decision) {
    throw new AppError("VALIDATION_FAILED", "The research workflow did not produce a validated decision.", 502);
  }

  return {
    requestId: result.requestId,
    profile: result.company,
    financials: result.financials,
    financialAnalysis: result.financialAnalysis,
    news: result.news,
    riskAnalysis: result.riskAnalysis,
    recommendation: result.decision.recommendation,
    confidence: result.decision.confidence,
    investmentHorizon: result.decision.investmentHorizon,
    reasoning: result.decision.reasoning,
    bullCase: result.decision.bullCase,
    bearCase: result.decision.bearCase,
    keyMetrics: result.decision.keyMetrics,
    sources: result.sources,
    researchedAt: new Date().toISOString(),
    disclaimer: "AI-generated research summary, not personal financial advice."
  };
};
