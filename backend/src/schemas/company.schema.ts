import { z } from "zod";

export const companySchema = z.object({
  name: z.string(),
  ticker: z.string(),
  exchange: z.string().optional(),
  country: z.string().optional(),
  sector: z.string().optional(),
  industry: z.string().optional(),
  ceo: z.string().optional(),
  marketCap: z.number().optional(),
  description: z.string().optional(),
  website: z.string().url().optional(),
  currentPrice: z.number().optional(),
  currency: z.string().optional()
});

export type Company = z.infer<typeof companySchema>;
