import { useNavigate } from "react-router-dom";
import { BarChart3, BrainCircuit, DatabaseZap, ShieldCheck, type LucideIcon } from "lucide-react";
import { DashboardHeader } from "../components/layout/DashboardHeader.js";
import { DashboardShell } from "../components/layout/DashboardShell.js";
import { CompanySearch } from "../components/search/CompanySearch.js";
import { ExampleCompanies } from "../components/search/ExampleCompanies.js";
import { RecentSearches } from "../components/search/RecentSearches.js";
import { useRecentSearches } from "../hooks/useRecentSearches.js";
import { useTheme } from "../hooks/useTheme.js";

export const HomePage = () => {
  const navigate = useNavigate();
  const { recentSearches } = useRecentSearches();
  const { theme, setTheme } = useTheme();

  const runSearch = (company: string) => {
    navigate(`/report?company=${encodeURIComponent(company)}`);
  };

  return (
    <DashboardShell>
      <DashboardHeader title="Investment research" theme={theme} onThemeChange={setTheme} />
      <main className="mx-auto grid min-h-[calc(100vh-81px)] w-full max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <section className="dashboard-panel-raised grid overflow-hidden rounded-xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">InsideIIM x Altuni AI Labs</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-normal text-foreground sm:text-5xl">
              AI-powered investment research, grounded in real company data.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Enter a public company and receive an evidence-backed INVEST or PASS recommendation based on financial data,
              recent events, and business risks.
            </p>

            <div className="mt-8 max-w-3xl rounded-xl border border-border bg-[#10130f] p-4 shadow-2xl shadow-black/30">
              <CompanySearch onSubmit={runSearch} />
              <div className="mt-5">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Example companies</h2>
                <ExampleCompanies onSelect={runSearch} />
              </div>
            </div>

            <div className="mt-6">
              <RecentSearches searches={recentSearches} onSelect={runSearch} />
            </div>
          </div>

          <div className="border-t border-border bg-[#111410] p-6 lg:border-l lg:border-t-0 lg:p-8">
            <div className="grid gap-4">
              <ProcessStep icon={DatabaseZap} title="Resolve company" text="Match the company to a public ticker and source profile." />
              <ProcessStep icon={BarChart3} title="Normalize financials" text="Use structured market data and deterministic calculations." />
              <ProcessStep icon={BrainCircuit} title="Analyze evidence" text="Let Gemini interpret supplied data with validated outputs." />
              <ProcessStep icon={ShieldCheck} title="Validate decision" text="Return exactly INVEST or PASS with evidence and caveats." />
            </div>
            <div className="mt-8 rounded-xl border border-border bg-[#0d0f0e] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Responsible AI notice</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                AI-generated research summary, not personal financial advice. Sources and missing-data warnings remain visible in each report.
              </p>
            </div>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
};

const ProcessStep = ({
  icon: Icon,
  title,
  text
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) => (
  <div className="dashboard-panel flex gap-4 rounded-xl p-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon size={19} />
    </div>
    <div>
      <h2 className="font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  </div>
);
