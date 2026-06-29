import { decisionSchema } from "../../schemas/decision.schema.js";
import { invokeStructuredGemini } from "../../tools/gemini/structuredOutput.js";
import { committeePrompt } from "../prompts.js";
import { appendProgress, type ResearchState } from "../state.js";

export const committeeNode = async (state: ResearchState): Promise<Partial<ResearchState>> => {
  let decision: typeof decisionSchema._type;
  try {
    decision = await invokeStructuredGemini(decisionSchema, committeePrompt(state));
  } catch {
    const score = state.financialAnalysis?.score ?? 0;
    const missingCount = state.financials?.missingFields.length ?? 99;
    const canInvest = score >= 70 && missingCount <= 4 && state.riskAnalysis?.level !== "HIGH";

    decision = {
      recommendation: canInvest ? "INVEST" : "PASS",
      confidence: canInvest ? 55 : 20,
      investmentHorizon: "3-5 years",
      reasoning:
        "The final AI committee response was unavailable or invalid, so the system used a conservative deterministic fallback based on available financial score, risk level, and missing data.",
      bullCase: state.financialAnalysis?.strengths.length
        ? state.financialAnalysis.strengths
        : ["Some company evidence was collected successfully."],
      bearCase: [
        ...(state.financialAnalysis?.concerns ?? []),
        ...(state.riskAnalysis?.topRisks ?? []),
        ...(missingCount ? ["Important financial data is missing or provider-limited."] : [])
      ],
      keyMetrics: [
        ...(state.financials?.revenueGrowth !== undefined ? [`Revenue growth: ${state.financials.revenueGrowth}%`] : []),
        ...(state.financials?.netIncomeGrowth !== undefined ? [`Net-income growth: ${state.financials.netIncomeGrowth}%`] : []),
        ...(state.financials?.peRatio !== undefined ? [`P/E ratio: ${state.financials.peRatio}`] : [])
      ],
      sourceIds: state.sources.map((source) => source.id).slice(0, 6)
    };
  }

  return {
    decision,
    progress: appendProgress(state, { step: "committee", status: "completed", message: "Recommendation prepared" })
  };
};
