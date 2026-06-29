import { z } from "zod";

export const financialPeriodSchema = z.object({
  period: z.string(),
  value: z.number()
});

export const stockPricePointSchema = z.object({
  date: z.string(),
  close: z.number()
});

export const financialsSchema = z.object({
  currency: z.string().optional(),
  revenueHistory: z.array(financialPeriodSchema),
  netIncomeHistory: z.array(financialPeriodSchema),
  stockPriceHistory: z.array(stockPricePointSchema),
  revenueGrowth: z.number().optional(),
  netIncomeGrowth: z.number().optional(),
  eps: z.number().optional(),
  operatingMargin: z.number().optional(),
  operatingCashFlow: z.number().optional(),
  freeCashFlow: z.number().optional(),
  totalDebt: z.number().optional(),
  cash: z.number().optional(),
  peRatio: z.number().optional(),
  roe: z.number().optional(),
  missingFields: z.array(z.string())
});

export type FinancialPeriod = z.infer<typeof financialPeriodSchema>;
export type StockPricePoint = z.infer<typeof stockPricePointSchema>;
export type Financials = z.infer<typeof financialsSchema>;
