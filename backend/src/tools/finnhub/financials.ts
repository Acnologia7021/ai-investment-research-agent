import { z } from "zod";
import type { FinancialPeriod, Financials } from "../../schemas/financial.schema.js";
import { enrichFinancials } from "../../calculations/financialMetrics.js";
import { finnhubGet } from "./client.js";

const metricSchema = z.object({
  metric: z.record(z.union([z.number(), z.string(), z.null()])).default({})
});

const reportedSchema = z.object({
  data: z
    .array(
      z.object({
        year: z.number().optional(),
        report: z
          .object({
            ic: z.array(z.object({ concept: z.string(), value: z.union([z.number(), z.string(), z.null()]).optional() })).optional(),
            cf: z.array(z.object({ concept: z.string(), value: z.union([z.number(), z.string(), z.null()]).optional() })).optional(),
            bs: z.array(z.object({ concept: z.string(), value: z.union([z.number(), z.string(), z.null()]).optional() })).optional()
          })
          .optional()
      })
    )
    .default([])
});

const asNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const findConcept = (
  items: Array<{ concept: string; value?: number | string | null | undefined }> | undefined,
  names: string[]
) => {
  return asNumber(items?.find((item) => names.includes(item.concept))?.value);
};

export const getFinnhubFinancials = async (ticker: string, currency?: string): Promise<Financials> => {
  const [metricData, reportedData] = await Promise.all([
    finnhubGet("/stock/metric", { symbol: ticker, metric: "all" }),
    finnhubGet("/stock/financials-reported", { symbol: ticker })
  ]);

  const metrics = metricSchema.parse(metricData).metric;
  const reported = reportedSchema.parse(reportedData).data;
  const sortedReports = [...reported].filter((item) => item.year).sort((a, b) => (a.year ?? 0) - (b.year ?? 0)).slice(-5);

  const revenueHistory: FinancialPeriod[] = sortedReports
    .map((item) => ({
      period: String(item.year),
      value: findConcept(item.report?.ic, ["us-gaap_Revenues", "ifrs-full_Revenue"]) ?? 0
    }))
    .filter((item) => item.value !== 0);

  const netIncomeHistory: FinancialPeriod[] = sortedReports
    .map((item) => ({
      period: String(item.year),
      value: findConcept(item.report?.ic, ["us-gaap_NetIncomeLoss", "ifrs-full_ProfitLoss"]) ?? 0
    }))
    .filter((item) => item.value !== 0);

  const latestReport = sortedReports.at(-1);

  return enrichFinancials({
    currency,
    revenueHistory,
    netIncomeHistory,
    stockPriceHistory: [],
    eps: asNumber(metrics.epsBasicExclExtraItemsTTM),
    operatingMargin: asNumber(metrics.operatingMarginTTM),
    operatingCashFlow: findConcept(latestReport?.report?.cf, ["us-gaap_NetCashProvidedByUsedInOperatingActivities"]),
    freeCashFlow: asNumber(metrics.freeCashFlowPerShareTTM),
    totalDebt: findConcept(latestReport?.report?.bs, ["us-gaap_LongTermDebtAndFinanceLeaseObligationsCurrent", "us-gaap_LongTermDebt"]),
    cash: findConcept(latestReport?.report?.bs, ["us-gaap_CashAndCashEquivalentsAtCarryingValue"]),
    peRatio: asNumber(metrics.peBasicExclExtraTTM),
    roe: asNumber(metrics.roeTTM),
    missingFields: []
  });
};
