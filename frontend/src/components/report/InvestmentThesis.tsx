type Props = {
  reasoning: string;
  keyMetrics: string[];
  summary: string | undefined;
};

export const InvestmentThesis = ({ reasoning, keyMetrics, summary }: Props) => (
  <section className="dashboard-panel-raised rounded-xl p-5">
    <h2 className="text-lg font-semibold">Investment thesis</h2>
    {summary ? <p className="mt-3 leading-7">{summary}</p> : null}
    <p className="mt-3 leading-7">{reasoning}</p>
    <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Key metrics</h3>
    {keyMetrics.length ? (
      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm">
        {keyMetrics.map((metric) => <li key={metric}>{metric}</li>)}
      </ul>
    ) : (
      <p className="mt-2 text-sm text-muted-foreground">Unavailable</p>
    )}
  </section>
);
