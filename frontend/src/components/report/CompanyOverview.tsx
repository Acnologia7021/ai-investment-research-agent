import type { Company } from "../../types/research.js";

type Props = {
  company: Company | undefined;
};

export const CompanyOverview = ({ company }: Props) => {
  if (!company) return null;

  return (
    <section id="company" className="dashboard-panel rounded-xl p-5">
      <h2 className="text-lg font-semibold">Company overview</h2>
      {company.description ? <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">{company.description}</p> : null}
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div><dt className="text-sm text-muted-foreground">Name</dt><dd className="font-medium">{company.name}</dd></div>
        <div><dt className="text-sm text-muted-foreground">Ticker</dt><dd className="font-medium">{company.ticker}</dd></div>
        <div><dt className="text-sm text-muted-foreground">Exchange</dt><dd className="font-medium">{company.exchange ?? "Data unavailable"}</dd></div>
        <div><dt className="text-sm text-muted-foreground">Sector</dt><dd className="font-medium">{company.sector ?? "Data unavailable"}</dd></div>
        <div><dt className="text-sm text-muted-foreground">Industry</dt><dd className="font-medium">{company.industry ?? "Data unavailable"}</dd></div>
        <div><dt className="text-sm text-muted-foreground">Country</dt><dd className="font-medium">{company.country ?? "Data unavailable"}</dd></div>
        <div><dt className="text-sm text-muted-foreground">Market cap</dt><dd className="font-medium">{company.marketCap ? Intl.NumberFormat("en", { notation: "compact" }).format(company.marketCap) : "Data unavailable"}</dd></div>
        <div>
          <dt className="text-sm text-muted-foreground">Website</dt>
          <dd className="font-medium">
            {company.website ? <a className="text-primary hover:underline" href={company.website} target="_blank" rel="noopener noreferrer">{new URL(company.website).hostname}</a> : "Data unavailable"}
          </dd>
        </div>
      </dl>
    </section>
  );
};
