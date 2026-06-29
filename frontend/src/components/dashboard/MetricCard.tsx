import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number | undefined;
  helper?: string;
  tone?: "neutral" | "positive" | "warning" | "danger" | "info";
  icon?: LucideIcon;
};

const toneClasses = {
  neutral: "text-foreground",
  positive: "text-[#d8ff57]",
  warning: "text-[#e8b84f]",
  danger: "text-[#ff6b63]",
  info: "text-[#72a7ff]"
};

export const MetricCard = ({ label, value, helper, tone = "neutral", icon: Icon }: Props) => (
  <div className="dashboard-panel rounded-lg p-4 transition hover:-translate-y-0.5 hover:bg-[#202420]">
    <div className="flex items-center justify-between gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      {Icon ? <Icon aria-hidden="true" size={16} className={toneClasses[tone]} /> : null}
    </div>
    <p className={`mt-3 truncate text-2xl font-bold tracking-normal ${toneClasses[tone]}`}>
      {value ?? "Unavailable"}
    </p>
    {helper ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{helper}</p> : null}
  </div>
);
