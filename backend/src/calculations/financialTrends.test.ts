import { describe, expect, it } from "vitest";
import { calculateGrowth } from "./financialTrends.js";
import { enrichFinancials } from "./financialMetrics.js";

describe("financial calculations", () => {
  it("calculates revenue growth", () => {
    expect(
      calculateGrowth([
        { period: "2021", value: 100 },
        { period: "2023", value: 150 }
      ])
    ).toBe(50);
  });

  it("records missing financial values without inventing zeros", () => {
    const result = enrichFinancials({
      revenueHistory: [],
      netIncomeHistory: [],
      stockPriceHistory: [],
      missingFields: []
    });

    expect(result.missingFields).toContain("revenueHistory");
    expect(result.missingFields).toContain("eps");
    expect(result.revenueGrowth).toBeUndefined();
  });
});
