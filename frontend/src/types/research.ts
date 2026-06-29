export type Recommendation = "INVEST" | "PASS";

export type FinancialPeriod = {
  period: string;
  value: number;
};

export type StockPricePoint = {
  date: string;
  close: number;
};

export type Financials = {
  currency?: string;
  revenueHistory: FinancialPeriod[];
  netIncomeHistory: FinancialPeriod[];
  stockPriceHistory: StockPricePoint[];
  revenueGrowth?: number;
  netIncomeGrowth?: number;
  eps?: number;
  operatingMargin?: number;
  operatingCashFlow?: number;
  freeCashFlow?: number;
  totalDebt?: number;
  cash?: number;
  peRatio?: number;
  roe?: number;
  missingFields: string[];
};

export type Company = {
  name: string;
  ticker: string;
  exchange?: string;
  country?: string;
  sector?: string;
  industry?: string;
  ceo?: string;
  marketCap?: number;
  description?: string;
  website?: string;
  currentPrice?: number;
  currency?: string;
};

export type NewsArticle = {
  title: string;
  url: string;
  domain: string;
  publishedAt?: string;
  summary?: string;
  sourceId: string;
};

export type SourceReference = {
  id: string;
  title: string;
  url: string;
  domain: string;
  publishedAt?: string;
  sourceType: "FINNHUB" | "TAVILY" | "COMPANY_WEBSITE" | "YAHOO_FINANCE";
};

export type FinancialAnalysis = {
  score: number;
  summary: string;
  strengths: string[];
  concerns: string[];
  missingData: string[];
  sourceIds: string[];
};

export type RiskAnalysis = {
  level: "LOW" | "MEDIUM" | "HIGH";
  topRisks: string[];
  futureConcerns: string[];
  positiveCatalysts: string[];
  sourceIds: string[];
};

export type ResearchReport = {
  requestId: string;
  profile?: Company;
  financials?: Financials;
  financialAnalysis?: FinancialAnalysis;
  news: NewsArticle[];
  riskAnalysis?: RiskAnalysis;
  recommendation: Recommendation;
  confidence: number;
  investmentHorizon: string;
  reasoning: string;
  bullCase: string[];
  bearCase: string[];
  keyMetrics: string[];
  sources: SourceReference[];
  researchedAt: string;
  disclaimer: string;
};
