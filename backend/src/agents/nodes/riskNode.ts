import { riskAnalysisSchema } from "../../schemas/risk.schema.js";
import { invokeStructuredGemini } from "../../tools/gemini/structuredOutput.js";
import { riskAnalysisPrompt } from "../prompts.js";
import { appendProgress, type ResearchState } from "../state.js";

export const riskNode = async (state: ResearchState): Promise<Partial<ResearchState>> => {
  let riskAnalysis: typeof riskAnalysisSchema._type;
  try {
    riskAnalysis = await invokeStructuredGemini(riskAnalysisSchema, riskAnalysisPrompt(state));
  } catch {
    riskAnalysis = {
      level: state.news.length ? "MEDIUM" : "HIGH",
      topRisks: state.news.length
        ? ["Risk analysis could not be generated from the model; review the listed sources manually."]
        : ["Recent source coverage was unavailable."],
      futureConcerns: ["Important company-specific risks may be missing from this automated report."],
      positiveCatalysts: [],
      sourceIds: state.news.map((article) => article.sourceId).slice(0, 3)
    };
  }

  return {
    riskAnalysis,
    progress: appendProgress(state, { step: "risk", status: "completed", message: "Risks assessed" })
  };
};
