import { useState } from "react";
import type { Financials } from "../../types/research.js";
import { NetIncomeChart } from "../../charts/NetIncomeChart.js";
import { RevenueChart } from "../../charts/RevenueChart.js";
import { StockPriceChart } from "../../charts/StockPriceChart.js";

type Props = {
  financials: Financials | undefined;
};

const tabs = ["Stock price", "Revenue", "Net income"] as const;
type Tab = (typeof tabs)[number];

export const MainChartPanel = ({ financials }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>("Stock price");

  return (
    <section className="dashboard-panel-raised rounded-xl p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Primary visualization</h2>
          <p className="mt-1 text-sm text-muted-foreground">Real provider data only. Empty panels mean the source did not return that series.</p>
        </div>
        <div className="flex rounded-lg border border-border bg-[#10130f] p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
                activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {activeTab === "Stock price" ? <StockPriceChart data={financials?.stockPriceHistory} currency={financials?.currency} embedded /> : null}
      {activeTab === "Revenue" ? <RevenueChart data={financials?.revenueHistory} currency={financials?.currency} embedded /> : null}
      {activeTab === "Net income" ? <NetIncomeChart data={financials?.netIncomeHistory} currency={financials?.currency} embedded /> : null}
    </section>
  );
};
