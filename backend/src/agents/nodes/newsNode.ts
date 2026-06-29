import { appendProgress, type ResearchState } from "../state.js";
import { AppError } from "../../errors/appError.js";
import { researchCompanyNews } from "../../tools/tavily/search.js";

export const newsNode = async (state: ResearchState): Promise<Partial<ResearchState>> => {
  if (!state.company) {
    throw new AppError("VALIDATION_FAILED", "Company must be resolved before news research.", 500);
  }

  const result = await researchCompanyNews(state.company.name);

  return {
    news: result.news,
    sources: [...state.sources, ...result.sources],
    progress: appendProgress(state, { step: "news", status: "completed", message: "Recent research collected" })
  };
};
