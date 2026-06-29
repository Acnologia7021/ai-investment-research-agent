import { ShieldAlert, TrendingUp } from "lucide-react";
import type { ResearchReport } from "../../types/research.js";

type Props = {
  report: ResearchReport;
};

export const RecommendationCard = ({ report }: Props) => {
  const isInvest = report.recommendation === "INVEST";
  return (
    <section className={`rounded-xl border p-5 ${isInvest ? "border-primary/60 bg-[#18200f] text-foreground" : "border-[#ff6b63]/60 bg-[#241716] text-foreground"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${isInvest ? "bg-primary text-primary-foreground" : "bg-[#ff6b63] text-[#180807]"}`}>
            {isInvest ? <TrendingUp size={18} /> : <ShieldAlert size={18} />}
            Recommendation
          </div>
          <h2 className="mt-4 text-5xl font-black tracking-normal">{report.recommendation}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{report.profile?.name} {report.profile?.ticker ? `- ${report.profile.ticker}` : ""}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Confidence</p>
          <p className={`text-4xl font-black ${isInvest ? "text-primary" : "text-[#ff9c96]"}`}>{report.confidence}%</p>
          <p className="mt-1 text-sm text-muted-foreground">{report.investmentHorizon}</p>
        </div>
      </div>
      <p className="mt-5 line-clamp-5 text-sm leading-6 text-muted-foreground">{report.reasoning}</p>
      {report.financials?.missingFields.length ? (
        <p className="mt-4 rounded-lg border border-[#e8b84f]/30 bg-[#2a2110] px-3 py-2 text-xs text-[#f1cb75]">
          Missing data: {report.financials.missingFields.slice(0, 4).join(", ")}
        </p>
      ) : null}
    </section>
  );
};
