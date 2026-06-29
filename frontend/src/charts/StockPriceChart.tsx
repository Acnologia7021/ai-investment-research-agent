import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { StockPricePoint } from "../types/research.js";

type Props = {
  data: StockPricePoint[] | undefined;
  currency: string | undefined;
  embedded?: boolean;
};

export const StockPriceChart = ({ data = [], currency, embedded = false }: Props) => (
  <section className={embedded ? "" : "dashboard-panel rounded-xl p-5"}>
    <h2 className="text-lg font-semibold">Historical stock-price trend</h2>
    {data.length ? (
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2f2b" />
            <XAxis dataKey="date" stroke="#989f99" tickLine={false} axisLine={false} tickFormatter={(value: string) => new Date(value).toLocaleDateString(undefined, { month: "short" })} />
            <YAxis stroke="#989f99" tickLine={false} axisLine={false} tickFormatter={(value: number) => Intl.NumberFormat("en", { notation: "compact" }).format(value)} />
            <Tooltip
              contentStyle={{ background: "#141715", border: "1px solid #2a2f2b", borderRadius: 8, color: "#f4f7f4" }}
              labelFormatter={(value: string) => new Date(value).toLocaleDateString()}
              formatter={(value: number) => [Intl.NumberFormat("en").format(value), currency ?? "close"]}
            />
            <Line type="monotone" dataKey="close" stroke="#d8ff57" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <p className="mt-3 rounded-lg border border-border bg-[#10130f] p-4 text-sm text-muted-foreground">Unavailable</p>
    )}
  </section>
);
