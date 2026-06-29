import { financialAnalysisSchema } from "../../schemas/risk.schema.js";
import { scoreFinancialSnapshot } from "../../calculations/scoring.js";
import { invokeStructuredGemini } from "../../tools/gemini/structuredOutput.js";
import { financialAnalysisPrompt } from "../prompts.js";
import { appendProgress, type ResearchState } from "../state.js";

export const financialAnalysisNode = async (state: ResearchState): Promise<Partial<ResearchState>> => {
  if (!state.financials) {
    return {
      financialAnalysis: {
        score: 0,
        summary: "Financial data was unavailable.",
        strengths: [],
        concerns: ["Financial history could not be collected."],
        missingData: ["financials"],
        sourceIds: []
      }
    };
  }

  const deterministicScore = scoreFinancialSnapshot(state.financials);
  let modelOutput: typeof financialAnalysisSchema._type;
  try {
    modelOutput = await invokeStructuredGemini(financialAnalysisSchema, financialAnalysisPrompt(state));
  } catch {
    modelOutput = {
      score: deterministicScore,
      summary: "The AI financial interpretation was unavailable, so this summary is based on deterministic financial checks only.",
      strengths: deterministicScore >= 60 ? ["Available financial metrics are broadly supportive."] : [],
      concerns: [
        ...(deterministicScore < 60 ? ["Available financial metrics are weak or incomplete."] : []),
        ...(state.financials.missingFields.length ? ["Some important financial fields are unavailable."] : [])
      ],
      missingData: state.financials.missingFields,
      sourceIds: []
    };
  }

  return {
    financialAnalysis: {
      ...modelOutput,
      score: Math.round((modelOutput.score + deterministicScore) / 2)
    },
    progress: appendProgress(state, { step: "financial-analysis", status: "completed", message: "Financials interpreted" })
  };
};
