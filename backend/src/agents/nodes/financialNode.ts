import { appendProgress, type ResearchState } from "../state.js";
import { AppError, isAppError } from "../../errors/appError.js";
import { getFinnhubFinancials } from "../../tools/finnhub/financials.js";
import { getFinnhubStockPrices } from "../../tools/finnhub/stockPrices.js";
import { getYahooFinancials, getYahooStockPrices, yahooSourceForTicker } from "../../tools/yahoo/marketData.js";
import { isIndianTicker } from "../../tools/yahoo/client.js";
import { enrichFinancials } from "../../calculations/financialMetrics.js";

export const financialNode = async (state: ResearchState): Promise<Partial<ResearchState>> => {
  if (!state.company) {
    throw new AppError("VALIDATION_FAILED", "Company must be resolved before financial data.", 500);
  }
  const company = state.company;

  const emptyFinancials = enrichFinancials({
    currency: company.currency,
    revenueHistory: [],
    netIncomeHistory: [],
    stockPriceHistory: [],
    missingFields: ["financials"]
  });

  const shouldUseYahoo = isIndianTicker(company.ticker);

  const [financials, stockPricesResult] = await Promise.all([
    getFinnhubFinancials(company.ticker, company.currency).catch((error: unknown) => {
      if (isAppError(error) && error.code === "MISSING_CONFIGURATION") {
        throw error;
      }
      if (shouldUseYahoo) {
        return getYahooFinancials(company.ticker, company.currency).catch(() => emptyFinancials);
      }
      return emptyFinancials;
    }),
    getFinnhubStockPrices(company.ticker).catch(() =>
      shouldUseYahoo ? getYahooStockPrices(company.ticker).catch(() => []) : []
    )
  ]);
  const yahooSource = shouldUseYahoo ? yahooSourceForTicker(company.ticker) : undefined;
  const sources = yahooSource && !state.sources.some((source) => source.id === yahooSource.id)
    ? [...state.sources, yahooSource]
    : state.sources;

  return {
    sources,
    financials: {
      ...financials,
      stockPriceHistory: stockPricesResult,
      missingFields: stockPricesResult.length
        ? financials.missingFields
        : [...new Set([...financials.missingFields, "stockPriceHistory"])]
    },
    progress: appendProgress(state, { step: "financials", status: "completed", message: "Financial data collected" })
  };
};
