import { z } from "zod";
import { AppError, isAppError } from "../../errors/appError.js";
import type { Company } from "../../schemas/company.schema.js";
import { getYahooCompanyProfile } from "../yahoo/marketData.js";
import { isIndianTicker } from "../yahoo/client.js";
import { finnhubGet } from "./client.js";

const searchResultSchema = z.object({
  count: z.number().optional(),
  result: z.array(
    z.object({
      description: z.string().optional(),
      displaySymbol: z.string().optional(),
      symbol: z.string(),
      type: z.string().optional()
    })
  )
});

const profileSchema = z.object({
  country: z.string().optional(),
  currency: z.string().optional(),
  exchange: z.string().optional(),
  finnhubIndustry: z.string().optional(),
  ipo: z.string().optional(),
  logo: z.string().optional(),
  marketCapitalization: z.number().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  shareOutstanding: z.number().optional(),
  ticker: z.string().optional(),
  weburl: z.string().optional()
});

export const resolveCompanyFromFinnhub = async (companyName: string): Promise<Company> => {
  const normalized = companyName.replace(/\s+/g, " ").trim();
  const lookupName = normalizeCompanyAlias(normalized);
  const searchData = searchResultSchema.parse(await finnhubGet("/search", { q: normalized }));
  const fallbackSearchData =
    searchData.result.length === 0 && lookupName !== normalized
      ? searchResultSchema.parse(await finnhubGet("/search", { q: lookupName }))
      : searchData;
  const candidates = searchData.result.filter((candidate) => {
    const type = candidate.type?.toLowerCase() ?? "";
    return candidate.symbol && !type.includes("fund") && !type.includes("etf");
  });
  const fallbackCandidates = fallbackSearchData.result.filter((candidate) => {
    const type = candidate.type?.toLowerCase() ?? "";
    return candidate.symbol && !type.includes("fund") && !type.includes("etf");
  });
  const usableCandidates = candidates.length ? candidates : fallbackCandidates;

  if (usableCandidates.length === 0) {
    throw new AppError("INVALID_COMPANY", "No public company match was found.", 404);
  }

  const lowerName = lookupName.toLowerCase();
  const best =
    usableCandidates.find((candidate) => candidate.description?.toLowerCase() === lowerName) ??
    usableCandidates.find((candidate) => candidate.description?.toLowerCase().includes(lowerName)) ??
    usableCandidates[0];

  if (!best) {
    throw new AppError("INVALID_COMPANY", "No public company match was found.", 404);
  }

  let profile: z.infer<typeof profileSchema>;
  try {
    profile = profileSchema.parse(await finnhubGet("/stock/profile2", { symbol: best.symbol }));
  } catch (error) {
    if (isAppError(error) && error.code === "MISSING_CONFIGURATION") {
      throw error;
    }

    if (isIndianTicker(best.symbol)) {
      return getYahooCompanyProfile(best.symbol, best.description ?? best.symbol);
    }

    return {
      name: best.description ?? best.symbol,
      ticker: best.symbol,
      exchange: best.displaySymbol,
      description: best.description
    };
  }

  if (!profile.name || !profile.ticker) {
    throw new AppError("PRIVATE_COMPANY", "The resolved company does not appear to be a supported public company.", 404);
  }

  return {
    name: profile.name,
    ticker: profile.ticker,
    exchange: profile.exchange,
    country: profile.country,
    industry: profile.finnhubIndustry,
    marketCap: profile.marketCapitalization,
    website: profile.weburl,
    currency: profile.currency
  };
};

const normalizeCompanyAlias = (companyName: string): string => {
  const aliases: Record<string, string> = {
    google: "Alphabet",
    facebook: "Meta",
    "facebook inc": "Meta",
    "amazon": "Amazon.com",
    "amazon inc": "Amazon.com"
  };

  return aliases[companyName.toLowerCase()] ?? companyName;
};
