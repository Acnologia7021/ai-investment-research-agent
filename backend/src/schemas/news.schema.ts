import { z } from "zod";

export const sourceReferenceSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  domain: z.string(),
  publishedAt: z.string().optional(),
  sourceType: z.enum(["FINNHUB", "TAVILY", "COMPANY_WEBSITE", "YAHOO_FINANCE"])
});

export const newsArticleSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  domain: z.string(),
  publishedAt: z.string().optional(),
  summary: z.string().optional(),
  sourceId: z.string()
});

export type SourceReference = z.infer<typeof sourceReferenceSchema>;
export type NewsArticle = z.infer<typeof newsArticleSchema>;
