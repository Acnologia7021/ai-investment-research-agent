import type { ResearchState } from "./state.js";

const compactState = (state: ResearchState) =>
  JSON.stringify(
    {
      company: state.company,
      financials: state.financials,
      news: state.news,
      sources: state.sources,
      financialAnalysis: state.financialAnalysis,
      riskAnalysis: state.riskAnalysis
    },
    null,
    2
  );

export const financialAnalysisPrompt = (state: ResearchState) => `
You are an investment research analyst.
Use only the supplied normalized company and financial data.
Do not invent numbers. Do not make the final INVEST/PASS decision.
Return concise evidence-backed analysis.

Data:
${compactState(state)}
`;

export const riskAnalysisPrompt = (state: ResearchState) => `
You are analyzing company-specific business risks.
Use only the supplied profile, financial analysis, news, and sources.
Avoid generic risks that could apply to every company.

Data:
${compactState(state)}
`;

export const committeePrompt = (state: ResearchState) => `
You are an investment committee creating an analytical research opinion.
Use only supplied evidence. This is not personal financial advice.
Return exactly one recommendation: INVEST or PASS.
Lower confidence when evidence is incomplete.
Explain positive and negative factors.

Data:
${compactState(state)}
`;
