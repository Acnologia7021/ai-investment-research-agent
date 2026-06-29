import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecommendationCard } from "./RecommendationCard.js";
import type { ResearchReport } from "../../types/research.js";

const report: ResearchReport = {
  requestId: "1",
  news: [],
  recommendation: "PASS",
  confidence: 25,
  investmentHorizon: "3-5 years",
  reasoning: "Evidence is insufficient.",
  bullCase: ["Brand strength"],
  bearCase: ["Missing data"],
  keyMetrics: [],
  sources: [],
  researchedAt: new Date().toISOString(),
  disclaimer: "Not advice."
};

describe("RecommendationCard", () => {
  it("renders the recommendation and confidence", () => {
    render(<RecommendationCard report={report} />);
    expect(screen.getByText("PASS")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
  });
});
