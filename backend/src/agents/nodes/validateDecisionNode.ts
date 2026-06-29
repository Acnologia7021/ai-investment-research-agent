import { decisionSchema, type Decision } from "../../schemas/decision.schema.js";
import { appendProgress, type ResearchState } from "../state.js";

const fallbackDecision: Decision = {
  recommendation: "PASS",
  confidence: 0,
  investmentHorizon: "Not available",
  reasoning: "The analysis could not be validated against the available evidence.",
  bullCase: ["Insufficient validated evidence to support an investment case."],
  bearCase: ["The recommendation failed deterministic validation."],
  keyMetrics: [],
  sourceIds: []
};

export const validateDecisionNode = async (state: ResearchState): Promise<Partial<ResearchState>> => {
  const parsed = decisionSchema.safeParse(state.decision);
  if (!parsed.success) {
    return {
      decision: fallbackDecision,
      progress: appendProgress(state, { step: "validation", status: "failed", message: "Decision failed schema validation" })
    };
  }

  const availableSourceIds = new Set(state.sources.map((source) => source.id));
  const hasUnknownSources = parsed.data.sourceIds.some((sourceId) => !availableSourceIds.has(sourceId));
  const tooMuchMissingData = (state.financials?.missingFields.length ?? 99) > 6;
  const unsupportedInvest = parsed.data.recommendation === "INVEST" && (hasUnknownSources || tooMuchMissingData);

  if (hasUnknownSources || unsupportedInvest) {
    return {
      decision: {
        ...fallbackDecision,
        reasoning: unsupportedInvest
          ? "The evidence was insufficient to validate an INVEST recommendation."
          : fallbackDecision.reasoning
      },
      progress: appendProgress(state, { step: "validation", status: "failed", message: "Decision evidence validation failed" })
    };
  }

  return {
    decision: parsed.data,
    progress: appendProgress(state, { step: "validation", status: "completed", message: "Decision validated" })
  };
};
