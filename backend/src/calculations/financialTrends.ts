import type { FinancialPeriod } from "../schemas/financial.schema.js";

export const calculateGrowth = (history: FinancialPeriod[]): number | undefined => {
  const sorted = [...history].sort((a, b) => a.period.localeCompare(b.period));
  const first = sorted[0];
  const last = sorted.at(-1);

  if (!first || !last || first.value === 0 || sorted.length < 2) {
    return undefined;
  }

  return Number((((last.value - first.value) / Math.abs(first.value)) * 100).toFixed(2));
};

export const latestValue = (history: FinancialPeriod[]): number | undefined => {
  return [...history].sort((a, b) => a.period.localeCompare(b.period)).at(-1)?.value;
};
