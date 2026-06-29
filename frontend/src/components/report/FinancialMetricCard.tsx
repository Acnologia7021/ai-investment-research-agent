type Props = {
  label: string;
  value: string | number | undefined;
};

export const FinancialMetricCard = ({ label, value }: Props) => (
  <div className="dashboard-panel rounded-lg p-4">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="mt-2 text-xl font-bold">{value ?? "Unavailable"}</p>
  </div>
);
