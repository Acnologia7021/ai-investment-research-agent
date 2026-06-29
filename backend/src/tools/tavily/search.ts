import { z } from "zod";
import type { NewsArticle, SourceReference } from "../../schemas/news.schema.js";
import { tavilySearch } from "./client.js";

const tavilyResultSchema = z.object({
  results: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        content: z.string().optional(),
        published_date: z.string().optional()
      })
    )
    .default([])
});

const domainFromUrl = (url: string) => new URL(url).hostname.replace(/^www\./, "");

export const researchCompanyNews = async (
  companyName: string
): Promise<{ news: NewsArticle[]; sources: SourceReference[] }> => {
  const queries = [
    `${companyName} latest earnings`,
    `${companyName} latest company news`,
    `${companyName} lawsuit regulatory risk`
  ];

  const responses = await Promise.allSettled(queries.map((query) => tavilySearch(query)));
  const seen = new Set<string>();
  const news: NewsArticle[] = [];
  const sources: SourceReference[] = [];

  for (const response of responses) {
    if (response.status !== "fulfilled") {
      continue;
    }

    const parsed = tavilyResultSchema.parse(response.value);
    for (const result of parsed.results) {
      if (seen.has(result.url) || news.length >= 8) {
        continue;
      }
      seen.add(result.url);
      const sourceId = `tavily-${sources.length + 1}`;
      const domain = domainFromUrl(result.url);
      sources.push({
        id: sourceId,
        title: result.title,
        url: result.url,
        domain,
        publishedAt: result.published_date,
        sourceType: "TAVILY"
      });
      news.push({
        title: result.title,
        url: result.url,
        domain,
        publishedAt: result.published_date,
        summary: result.content,
        sourceId
      });
    }
  }

  return { news, sources };
};
