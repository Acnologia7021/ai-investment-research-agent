import type { RiskAnalysis as Risk } from "../../types/research.js";

type Props = {
  risk: Risk | undefined;
};

export const RiskAnalysis = ({ risk }: Props) => (
  <section id="risk" className="dashboard-panel rounded-xl p-5">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold">Risk analysis</h2>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${risk?.level === "LOW" ? "bg-primary text-primary-foreground" : risk?.level === "HIGH" ? "bg-[#ff6b63] text-[#190807]" : "bg-[#e8b84f] text-[#171005]"}`}>
        {risk?.level ?? "Unavailable"}
      </span>
    </div>
    <div className="mt-4 grid gap-4 md:grid-cols-3">
      <List title="Top risks" items={risk?.topRisks ?? []} />
      <List title="Future concerns" items={risk?.futureConcerns ?? []} />
      <List title="Positive catalysts" items={risk?.positiveCatalysts ?? []} />
    </div>
  </section>
);

const List = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <h3 className="font-semibold">{title}</h3>
    {items.length ? (
      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    ) : (
      <p className="mt-2 text-sm text-muted-foreground">Unavailable</p>
    )}
  </div>
);
