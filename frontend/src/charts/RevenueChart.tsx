import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FinancialPeriod } from "../types/research.js";

type Props = {
  data: FinancialPeriod[] | undefined;
  currency: string | undefined;
  embedded?: boolean;
};

export const RevenueChart = ({ data = [], currency, embedded = false }: Props) => (
  <TrendChart title="Revenue trend" data={data} valueLabel={currency ?? "value"} embedded={embedded} />
);

const TrendChart = ({ title, data, valueLabel, embedded }: { title: string; data: FinancialPeriod[]; valueLabel: string; embedded: boolean }) => (
  <section className={embedded ? "" : "dashboard-panel rounded-xl p-5"}>
    <h2 className="text-lg font-semibold">{title}</h2>
    {data.length ? (
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2f2b" />
            <XAxis dataKey="period" stroke="#989f99" tickLine={false} axisLine={false} />
            <YAxis stroke="#989f99" tickLine={false} axisLine={false} tickFormatter={(value: number) => Intl.NumberFormat("en", { notation: "compact" }).format(value)} />
            <Tooltip contentStyle={{ background: "#141715", border: "1px solid #2a2f2b", borderRadius: 8, color: "#f4f7f4" }} formatter={(value: number) => [Intl.NumberFormat("en").format(value), valueLabel]} />
            <Line type="monotone" dataKey="value" stroke="#d8ff57" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <p className="mt-3 rounded-lg border border-border bg-[#10130f] p-4 text-sm text-muted-foreground">Unavailable</p>
    )}
  </section>
);
