import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import type { ResearchState } from "./state.js";
import { committeeNode } from "./nodes/committeeNode.js";
import { financialAnalysisNode } from "./nodes/financialAnalysisNode.js";
import { financialNode } from "./nodes/financialNode.js";
import { newsNode } from "./nodes/newsNode.js";
import { normalizeEvidenceNode } from "./nodes/normalizeEvidenceNode.js";
import { resolveCompanyNode } from "./nodes/resolveCompanyNode.js";
import { riskNode } from "./nodes/riskNode.js";
import { validateDecisionNode } from "./nodes/validateDecisionNode.js";

const StateAnnotation = Annotation.Root({
  requestId: Annotation<ResearchState["requestId"]>(),
  input: Annotation<ResearchState["input"]>(),
  company: Annotation<ResearchState["company"] | undefined>(),
  financials: Annotation<ResearchState["financials"] | undefined>(),
  news: Annotation<ResearchState["news"]>({
    reducer: (_left, right) => right,
    default: () => []
  }),
  financialAnalysis: Annotation<ResearchState["financialAnalysis"] | undefined>(),
  riskAnalysis: Annotation<ResearchState["riskAnalysis"] | undefined>(),
  decision: Annotation<ResearchState["decision"] | undefined>(),
  sources: Annotation<ResearchState["sources"]>({
    reducer: (_left, right) => right,
    default: () => []
  }),
  progress: Annotation<ResearchState["progress"]>({
    reducer: (_left, right) => right,
    default: () => []
  }),
  errors: Annotation<ResearchState["errors"]>({
    reducer: (_left, right) => right,
    default: () => []
  })
});

export const createResearchGraph = () => {
  return new StateGraph(StateAnnotation)
    .addNode("resolveCompany", resolveCompanyNode)
    .addNode("financialData", financialNode)
    .addNode("newsResearch", newsNode)
    .addNode("normalizeEvidence", normalizeEvidenceNode)
    .addNode("financialAnalysisStep", financialAnalysisNode)
    .addNode("riskAnalysisStep", riskNode)
    .addNode("investmentCommittee", committeeNode)
    .addNode("validateDecision", validateDecisionNode)
    .addEdge(START, "resolveCompany")
    .addEdge("resolveCompany", "financialData")
    .addEdge("financialData", "newsResearch")
    .addEdge("newsResearch", "normalizeEvidence")
    .addEdge("normalizeEvidence", "financialAnalysisStep")
    .addEdge("financialAnalysisStep", "riskAnalysisStep")
    .addEdge("riskAnalysisStep", "investmentCommittee")
    .addEdge("investmentCommittee", "validateDecision")
    .addEdge("validateDecision", END)
    .compile();
};
