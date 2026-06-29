import { CartesianGrid, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FinancialPeriod } from "../types/research.js";

type Props = {
  data: FinancialPeriod[] | undefined;
  currency: string | undefined;
  embedded?: boolean;
};

export const NetIncomeChart = ({ data = [], currency, embedded = false }: Props) => (
  <section className={embedded ? "" : "dashboard-panel rounded-xl p-5"}>
    <h2 className="text-lg font-semibold">Net-income trend</h2>
    {data.length ? (
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2f2b" />
            <XAxis dataKey="period" stroke="#989f99" tickLine={false} axisLine={false} />
            <YAxis stroke="#989f99" tickLine={false} axisLine={false} tickFormatter={(value: number) => Intl.NumberFormat("en", { notation: "compact" }).format(value)} />
            <Tooltip contentStyle={{ background: "#141715", border: "1px solid #2a2f2b", borderRadius: 8, color: "#f4f7f4" }} formatter={(value: number) => [Intl.NumberFormat("en").format(value), currency ?? "value"]} />
            <Bar dataKey="value" fill="#72a7ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <p className="mt-3 rounded-lg border border-border bg-[#10130f] p-4 text-sm text-muted-foreground">Unavailable</p>
    )}
  </section>
);
