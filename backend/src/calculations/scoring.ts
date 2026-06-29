import type { Financials } from "../schemas/financial.schema.js";

export const scoreFinancialSnapshot = (financials: Financials): number => {
  let score = 50;

  if ((financials.revenueGrowth ?? 0) > 10) score += 12;
  if ((financials.netIncomeGrowth ?? 0) > 10) score += 12;
  if ((financials.operatingMargin ?? 0) > 15) score += 10;
  if ((financials.freeCashFlow ?? 0) > 0) score += 8;
  if (financials.cash !== undefined && financials.totalDebt !== undefined && financials.cash > financials.totalDebt) {
    score += 8;
  }
  if (financials.missingFields.length > 4) score -= 20;
  if ((financials.revenueGrowth ?? 0) < 0) score -= 15;
  if ((financials.netIncomeGrowth ?? 0) < 0) score -= 15;

  return Math.max(0, Math.min(100, score));
};
