import type { Company } from "../../schemas/company.schema.js";
import type { Financials, StockPricePoint } from "../../schemas/financial.schema.js";
import type { SourceReference } from "../../schemas/news.schema.js";
import { enrichFinancials } from "../../calculations/financialMetrics.js";
import { yahooFinance, yahooQuoteUrl } from "./client.js";

const numberOrUndefined = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const textOrUndefined = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value : undefined;

export const getYahooCompanyProfile = async (ticker: string, fallbackName: string): Promise<Company> => {
  const [quote, summary] = await Promise.all([
    yahooFinance.quote(ticker),
    yahooFinance
      .quoteSummary(ticker, { modules: ["price", "summaryProfile"] })
      .catch(() => undefined)
  ]);

  const profile = summary?.summaryProfile;
  const price = summary?.price;

  return {
    name: textOrUndefined(price?.longName) ?? textOrUndefined(quote.longName) ?? textOrUndefined(quote.shortName) ?? fallbackName,
    ticker,
    exchange: textOrUndefined(quote.fullExchangeName) ?? textOrUndefined(quote.exchange),
    country: textOrUndefined(profile?.country) ?? "IN",
    sector: textOrUndefined(profile?.sector),
    industry: textOrUndefined(profile?.industry),
    marketCap: numberOrUndefined(quote.marketCap),
    description: textOrUndefined(profile?.longBusinessSummary),
    website: textOrUndefined(profile?.website),
    currentPrice: numberOrUndefined(quote.regularMarketPrice),
    currency: textOrUndefined(quote.currency) ?? "INR"
  };
};

export const getYahooFinancials = async (ticker: string, currency?: string): Promise<Financials> => {
  const summary = await yahooFinance.quoteSummary(ticker, {
    modules: ["financialData", "defaultKeyStatistics", "summaryDetail"]
  });

  const financialData = summary.financialData;
  const keyStats = summary.defaultKeyStatistics;
  const summaryDetail = summary.summaryDetail;

  return enrichFinancials({
    currency,
    revenueHistory: [],
    netIncomeHistory: [],
    stockPriceHistory: [],
    eps: numberOrUndefined(keyStats?.trailingEps),
    operatingMargin: percentage(numberOrUndefined(financialData?.operatingMargins)),
    operatingCashFlow: numberOrUndefined(financialData?.operatingCashflow),
    freeCashFlow: numberOrUndefined(financialData?.freeCashflow),
    totalDebt: numberOrUndefined(financialData?.totalDebt),
    cash: numberOrUndefined(financialData?.totalCash),
    peRatio: numberOrUndefined(summaryDetail?.trailingPE),
    roe: percentage(numberOrUndefined(financialData?.returnOnEquity)),
    missingFields: ["revenueHistory", "netIncomeHistory"]
  });
};

export const getYahooStockPrices = async (ticker: string): Promise<StockPricePoint[]> => {
  const period2 = new Date();
  const period1 = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const chart = await yahooFinance.chart(ticker, {
    period1,
    period2,
    interval: "1mo"
  });

  return chart.quotes
    .map((point) => ({
      date: point.date.toISOString(),
      close: numberOrUndefined(point.close) ?? 0
    }))
    .filter((point) => point.close > 0);
};

export const yahooSourceForTicker = (ticker: string): SourceReference => ({
  id: `yahoo-${ticker.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
  title: `${ticker} market data`,
  url: yahooQuoteUrl(ticker),
  domain: "finance.yahoo.com",
  sourceType: "YAHOO_FINANCE"
});

const percentage = (value: number | undefined) => (value === undefined ? undefined : Number((value * 100).toFixed(2)));
