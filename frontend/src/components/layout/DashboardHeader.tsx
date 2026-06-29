import { Menu, Moon, RefreshCw, Sun } from "lucide-react";
import { CompanySearch } from "../search/CompanySearch.js";

type Props = {
  title: string;
  eyebrow?: string | undefined;
  company?: string | undefined;
  ticker?: string | undefined;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  onSearch?: ((company: string) => void) | undefined;
  isSearching?: boolean;
  onRefresh?: (() => void) | undefined;
};

export const DashboardHeader = ({
  title,
  eyebrow = "AI investment terminal",
  company,
  ticker,
  theme,
  onThemeChange,
  onSearch,
  isSearching = false,
  onRefresh
}: Props) => (
  <header className="sticky top-0 z-20 border-b border-border bg-[#0d0f0e]/90 px-4 py-4 backdrop-blur-xl lg:px-6">
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-normal text-foreground sm:text-3xl">{title}</h1>
            {ticker ? <span className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-primary">{ticker}</span> : null}
            {company ? <span className="text-sm text-muted-foreground">{company}</span> : null}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {onSearch ? (
          <div className="min-w-0 md:w-[440px]">
            <CompanySearch onSubmit={onSearch} isLoading={isSearching} initialValue={company ?? ""} compact />
          </div>
        ) : null}
        <div className="flex gap-2">
          {onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              aria-label="Rerun analysis"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-[#202420] hover:text-foreground"
            >
              <RefreshCw size={17} />
            </button>
          ) : null}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-[#202420] hover:text-foreground"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </div>
  </header>
);
