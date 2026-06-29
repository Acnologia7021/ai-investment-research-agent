import { appendProgress, type ResearchState } from "../state.js";
import { resolveCompanyFromFinnhub } from "../../tools/finnhub/company.js";

export const resolveCompanyNode = async (state: ResearchState): Promise<Partial<ResearchState>> => {
  const companyName = state.input.companyName.replace(/\s+/g, " ").trim();
  const company = await resolveCompanyFromFinnhub(companyName);

  return {
    input: { companyName },
    company,
    sources: company.website
      ? [
          ...state.sources,
          {
            id: "company-website",
            title: `${company.name} website`,
            url: company.website,
            domain: new URL(company.website).hostname.replace(/^www\./, ""),
            sourceType: "COMPANY_WEBSITE"
          }
        ]
      : state.sources,
    progress: appendProgress(state, { step: "company", status: "completed", message: `Identified ${company.name}` })
  };
};
