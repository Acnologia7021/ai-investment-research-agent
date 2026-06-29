import { describe, expect, it } from "vitest";
import { validateDecisionNode } from "./validateDecisionNode.js";
import type { ResearchState } from "../state.js";

const baseState: ResearchState = {
  requestId: "test",
  input: { companyName: "Apple" },
  news: [],
  sources: [],
  progress: [],
  errors: []
};

describe("validateDecisionNode", () => {
  it("falls back to PASS when the decision is missing", async () => {
    const result = await validateDecisionNode(baseState);
    expect(result.decision?.recommendation).toBe("PASS");
    expect(result.decision?.confidence).toBe(0);
  });

  it("keeps a valid supported PASS decision", async () => {
    const result = await validateDecisionNode({
      ...baseState,
      decision: {
        recommendation: "PASS",
        confidence: 45,
        investmentHorizon: "3-5 years",
        reasoning: "Risk is high.",
        bullCase: ["Strong brand."],
        bearCase: ["Margins are under pressure."],
        keyMetrics: ["Revenue growth: -2%"],
        sourceIds: []
      }
    });

    expect(result.decision?.recommendation).toBe("PASS");
    expect(result.decision?.confidence).toBe(45);
  });
});
