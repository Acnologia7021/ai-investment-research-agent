import type { Financials } from "../schemas/financial.schema.js";
import { calculateGrowth } from "./financialTrends.js";

export const enrichFinancials = (financials: Financials): Financials => {
  const missingFields = new Set(financials.missingFields);

  const required: Array<keyof Financials> = [
    "revenueHistory",
    "netIncomeHistory",
    "eps",
    "operatingMargin",
    "operatingCashFlow",
    "freeCashFlow",
    "totalDebt",
    "cash",
    "peRatio",
    "roe"
  ];

  for (const field of required) {
    const value = financials[field];
    const isMissingArray = Array.isArray(value) && value.length === 0;
    if (value === undefined || isMissingArray) {
      missingFields.add(field);
    }
  }

  return {
    ...financials,
    revenueGrowth: financials.revenueGrowth ?? calculateGrowth(financials.revenueHistory),
    netIncomeGrowth: financials.netIncomeGrowth ?? calculateGrowth(financials.netIncomeHistory),
    missingFields: [...missingFields].sort()
  };
};
