import type { Financials } from "../../types/research.js";
import { FinancialMetricCard } from "./FinancialMetricCard.js";

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

const format = (value?: number, suffix = "") => (value === undefined ? undefined : `${numberFormat.format(value)}${suffix}`);

type Props = {
  financials: Financials | undefined;
};

export const FinancialMetricsGrid = ({ financials }: Props) => (
  <section id="financials">
    <h2 className="mb-4 text-lg font-semibold">Financial metrics</h2>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <FinancialMetricCard label="Revenue growth" value={format(financials?.revenueGrowth, "%")} />
      <FinancialMetricCard label="Net-income growth" value={format(financials?.netIncomeGrowth, "%")} />
      <FinancialMetricCard label="EPS" value={format(financials?.eps)} />
      <FinancialMetricCard label="Operating margin" value={format(financials?.operatingMargin, "%")} />
      <FinancialMetricCard label="Operating cash flow" value={format(financials?.operatingCashFlow)} />
      <FinancialMetricCard label="Free cash flow" value={format(financials?.freeCashFlow)} />
      <FinancialMetricCard label="Debt" value={format(financials?.totalDebt)} />
      <FinancialMetricCard label="Cash" value={format(financials?.cash)} />
      <FinancialMetricCard label="P/E ratio" value={format(financials?.peRatio)} />
      <FinancialMetricCard label="ROE" value={format(financials?.roe, "%")} />
    </div>
  </section>
);
