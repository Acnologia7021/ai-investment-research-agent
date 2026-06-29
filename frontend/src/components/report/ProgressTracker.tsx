import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";

type StepStatus = "waiting" | "running" | "completed" | "failed";

type Step = {
  label: string;
  status: StepStatus;
};

type Props = {
  isLoading: boolean;
  hasReport: boolean;
  hasError: boolean;
};

export const ProgressTracker = ({ isLoading, hasReport, hasError }: Props) => {
  const status = (index: number): StepStatus => {
    if (hasError) return index === 0 ? "failed" : "waiting";
    if (hasReport) return "completed";
    if (isLoading) return index === 0 ? "running" : "waiting";
    return "waiting";
  };

  const steps: Step[] = [
    { label: "Company identified", status: status(0) },
    { label: "Financial data collected", status: status(1) },
    { label: "Recent events researched", status: status(2) },
    { label: "Risks assessed", status: status(3) },
    { label: "Recommendation prepared", status: status(4) }
  ];

  return (
    <div className="dashboard-panel rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Research progress</h2>
        <span className="text-xs text-muted-foreground">{hasReport ? "Completed" : isLoading ? "Running" : hasError ? "Failed" : "Waiting"}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
      {steps.map((step) => (
        <div key={step.label} className="flex items-center gap-3 rounded-lg border border-border bg-[#10130f] p-3 text-sm">
          {step.status === "completed" ? <CheckCircle2 className="text-primary" size={18} /> : null}
          {step.status === "running" ? <Loader2 className="animate-spin text-primary" size={18} /> : null}
          {step.status === "failed" ? <XCircle className="text-[#ff6b63]" size={18} /> : null}
          {step.status === "waiting" ? <Circle className="text-muted-foreground" size={18} /> : null}
          <span className="leading-5 text-muted-foreground">{step.label}</span>
        </div>
      ))}
      </div>
    </div>
  );
};
