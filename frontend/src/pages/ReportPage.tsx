import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Activity, BadgeDollarSign, BarChart3, CircleDollarSign, Gauge, ShieldAlert } from "lucide-react";
import { NetIncomeChart } from "../charts/NetIncomeChart.js";
import { RevenueChart } from "../charts/RevenueChart.js";
import { StockPriceChart } from "../charts/StockPriceChart.js";
import { ErrorPanel } from "../components/dashboard/ErrorPanel.js";
import { MainChartPanel } from "../components/dashboard/MainChartPanel.js";
import { MetricCard } from "../components/dashboard/MetricCard.js";
import { SkeletonPanel } from "../components/dashboard/SkeletonPanel.js";
import { DashboardHeader } from "../components/layout/DashboardHeader.js";
import { DashboardShell } from "../components/layout/DashboardShell.js";
import { BullBearCard } from "../components/report/BullBearCard.js";
import { CompanyOverview } from "../components/report/CompanyOverview.js";
import { FinancialMetricsGrid } from "../components/report/FinancialMetricsGrid.js";
import { InvestmentThesis } from "../components/report/InvestmentThesis.js";
import { NewsCard } from "../components/report/NewsCard.js";
import { ProgressTracker } from "../components/report/ProgressTracker.js";
import { RecommendationCard } from "../components/report/RecommendationCard.js";
import { RiskAnalysis } from "../components/report/RiskAnalysis.js";
import { SourcesCard } from "../components/report/SourcesCard.js";
import { useCompanyAnalysis } from "../hooks/useCompanyAnalysis.js";
import { useRecentSearches } from "../hooks/useRecentSearches.js";
import { useTheme } from "../hooks/useTheme.js";
import type { ResearchReport } from "../types/research.js";

export const ReportPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const company = params.get("company") ?? "";
  const analysis = useCompanyAnalysis();
  const { addSearch } = useRecentSearches();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (company.trim()) {
      analysis.mutate(company, {
        onSuccess: () => addSearch(company)
      });
    }
  }, [company]);

  const runSearch = (nextCompany: string) => {
    navigate(`/report?company=${encodeURIComponent(nextCompany)}`);
  };

  const report = analysis.data;
  const errorMessage = axios.isAxiosError(analysis.error)
    ? getApiErrorMessage(analysis.error.response?.data)
    : "The research request failed.";

  return (
    <DashboardShell>
      <DashboardHeader
        title="Research dashboard"
        company={report?.profile?.name ?? company}
        ticker={report?.profile?.ticker}
        theme={theme}
        onThemeChange={setTheme}
        onSearch={runSearch}
        isSearching={analysis.isPending}
        onRefresh={company ? () => analysis.mutate(company, { onSuccess: () => addSearch(company) }) : undefined}
      />
      <main className="mx-auto grid w-full max-w-[1500px] gap-5 px-4 py-5 lg:px-6">
        {report ? <ReportHeader report={report} /> : null}

        <ProgressTracker isLoading={analysis.isPending} hasReport={Boolean(report)} hasError={analysis.isError} />

        {analysis.isError ? (
          <ErrorPanel
            message={errorMessage}
            onRetry={company ? () => analysis.mutate(company, { onSuccess: () => addSearch(company) }) : undefined}
            onNewSearch={() => navigate("/")}
          />
        ) : null}

        {analysis.isPending ? <LoadingDashboard /> : null}

        {report ? (
          <>
            <TopMetrics report={report} />
            <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
              <MainChartPanel financials={report.financials} />
              <RecommendationCard report={report} />
            </section>

            <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <CompanyOverview company={report.profile} />
              <RiskAnalysis risk={report.riskAnalysis} />
            </section>

            <FinancialMetricsGrid financials={report.financials} />
            <section className="grid gap-5 xl:grid-cols-3">
              <StockPriceChart data={report.financials?.stockPriceHistory} currency={report.financials?.currency} />
              <RevenueChart data={report.financials?.revenueHistory} currency={report.financials?.currency} />
              <NetIncomeChart data={report.financials?.netIncomeHistory} currency={report.financials?.currency} />
            </section>

            <section className="dashboard-panel rounded-xl p-5">
              <h2 className="text-lg font-semibold">Financial summary</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{report.financialAnalysis?.summary ?? "Unavailable"}</p>
            </section>

            <section id="news" className="dashboard-panel rounded-xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent news</h2>
                <span className="text-xs text-muted-foreground">{report.news.length} sources</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {report.news.length ? report.news.map((article) => <NewsCard key={article.url} article={article} />) : <p className="text-sm text-muted-foreground">No useful recent news returned.</p>}
              </div>
            </section>

          <BullBearCard bullCase={report.bullCase} bearCase={report.bearCase} />
          <InvestmentThesis reasoning={report.reasoning} keyMetrics={report.keyMetrics} summary={report.financialAnalysis?.summary} />
          <SourcesCard sources={report.sources} />
          <p className="pb-6 text-sm text-muted-foreground">
            Researched at {new Date(report.researchedAt).toLocaleString()}. {report.disclaimer}
          </p>
          </>
        ) : null}
      </main>
    </DashboardShell>
  );
};

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const compactFormat = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });

const formatNumber = (value: number | undefined, suffix = "") => value === undefined ? undefined : `${numberFormat.format(value)}${suffix}`;
const formatMoney = (value: number | undefined, currency?: string) =>
  value === undefined ? undefined : `${currency ? `${currency} ` : ""}${compactFormat.format(value)}`;

const ReportHeader = ({ report }: { report: ResearchReport }) => (
  <section className="dashboard-panel-raised rounded-xl p-5">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Company research profile</p>
        <h2 className="mt-2 text-3xl font-black tracking-normal">{report.profile?.name ?? "Company"}</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-md border border-border px-2 py-1">{report.profile?.ticker ?? "Ticker unavailable"}</span>
          <span className="rounded-md border border-border px-2 py-1">{report.profile?.exchange ?? "Exchange unavailable"}</span>
          <span className="rounded-md border border-border px-2 py-1">{report.profile?.sector ?? report.profile?.industry ?? "Sector unavailable"}</span>
        </div>
      </div>
      <div className="text-sm text-muted-foreground lg:text-right">
        <p>Current price</p>
        <p className="mt-1 text-2xl font-bold text-foreground">{formatMoney(report.profile?.currentPrice, report.profile?.currency) ?? "Unavailable"}</p>
        <p className="mt-1">Researched {new Date(report.researchedAt).toLocaleString()}</p>
      </div>
    </div>
  </section>
);

const TopMetrics = ({ report }: { report: ResearchReport }) => (
  <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
    <MetricCard label="Current price" value={formatMoney(report.profile?.currentPrice, report.profile?.currency)} icon={CircleDollarSign} tone="info" />
    <MetricCard label="Market cap" value={formatMoney(report.profile?.marketCap, report.profile?.currency)} icon={BadgeDollarSign} />
    <MetricCard label="Revenue growth" value={formatNumber(report.financials?.revenueGrowth, "%")} icon={BarChart3} tone="positive" />
    <MetricCard label="P/E ratio" value={formatNumber(report.financials?.peRatio)} icon={Activity} />
    <MetricCard label="Risk" value={report.riskAnalysis?.level} icon={ShieldAlert} tone={report.riskAnalysis?.level === "HIGH" ? "danger" : report.riskAnalysis?.level === "MEDIUM" ? "warning" : "positive"} />
    <MetricCard label="AI confidence" value={`${report.confidence}%`} icon={Gauge} tone={report.recommendation === "INVEST" ? "positive" : "danger"} />
  </section>
);

const LoadingDashboard = () => (
  <div className="grid gap-5">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => <SkeletonPanel key={index} rows={2} />)}
    </div>
    <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
      <SkeletonPanel rows={7} className="min-h-[380px]" />
      <SkeletonPanel rows={6} className="min-h-[380px]" />
    </section>
    <section className="grid gap-5 xl:grid-cols-3">
      <SkeletonPanel rows={5} />
      <SkeletonPanel rows={5} />
      <SkeletonPanel rows={5} />
    </section>
  </div>
);

const getApiErrorMessage = (data: unknown): string => {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "object" &&
    data.error !== null &&
    "message" in data.error &&
    typeof data.error.message === "string"
  ) {
    return data.error.message;
  }

  return "Check the company name and try another supported public company.";
};
