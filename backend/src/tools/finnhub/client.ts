import { z } from "zod";
import { env } from "../../config/env.js";
import { AppError } from "../../errors/appError.js";
import { fetchJson } from "../http.js";

export const requireFinnhubKey = () => {
  if (!env.FINNHUB_API_KEY) {
    throw new AppError("MISSING_CONFIGURATION", "Finnhub API key is not configured.", 503);
  }
};

export const finnhubGet = async (path: string, params: Record<string, string>) => {
  requireFinnhubKey();
  const url = new URL(`${env.FINNHUB_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("token", env.FINNHUB_API_KEY);
  return fetchJson(url.toString(), { timeoutMs: 12000, retries: 1 });
};

export const finnhubErrorSchema = z.object({
  error: z.string()
});
