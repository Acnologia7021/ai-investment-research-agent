type Props = {
  bullCase: string[];
  bearCase: string[];
};

export const BullBearCard = ({ bullCase, bearCase }: Props) => (
  <section className="grid gap-4 md:grid-cols-2">
    <CaseList title="Bull case" items={bullCase} tone="positive" />
    <CaseList title="Bear case" items={bearCase} tone="negative" />
  </section>
);

const CaseList = ({ title, items, tone }: { title: string; items: string[]; tone: "positive" | "negative" }) => (
  <div className={`rounded-xl border p-5 ${tone === "positive" ? "border-primary/30 bg-[#17200f]" : "border-[#ff6b63]/30 bg-[#241716]"}`}>
    <h2 className={`text-lg font-semibold ${tone === "positive" ? "text-primary" : "text-[#ff9c96]"}`}>{title}</h2>
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  </div>
);
