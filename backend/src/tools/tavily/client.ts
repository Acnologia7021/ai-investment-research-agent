import { env } from "../../config/env.js";
import { AppError } from "../../errors/appError.js";
import { fetchJson } from "../http.js";

export const tavilySearch = async (query: string): Promise<unknown> => {
  if (!env.TAVILY_API_KEY) {
    throw new AppError("MISSING_CONFIGURATION", "Tavily API key is not configured.", 503);
  }

  return fetchJson("https://api.tavily.com/search", {
    method: "POST",
    timeoutMs: 15000,
    retries: 1,
    body: {
      api_key: env.TAVILY_API_KEY,
      query,
      search_depth: "basic",
      include_answer: false,
      max_results: 4
    }
  });
};
