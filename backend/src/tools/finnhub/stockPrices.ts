import { z } from "zod";
import type { StockPricePoint } from "../../schemas/financial.schema.js";
import { finnhubGet } from "./client.js";

const candleSchema = z.object({
  c: z.array(z.number()).optional(),
  t: z.array(z.number()).optional(),
  s: z.string()
});

export const getFinnhubStockPrices = async (ticker: string): Promise<StockPricePoint[]> => {
  const to = Math.floor(Date.now() / 1000);
  const from = to - 365 * 24 * 60 * 60;
  const data = candleSchema.parse(
    await finnhubGet("/stock/candle", {
      symbol: ticker,
      resolution: "W",
      from: String(from),
      to: String(to)
    })
  );

  if (data.s !== "ok" || !data.c || !data.t) {
    return [];
  }

  return data.c.map((close, index) => ({
    close,
    date: new Date((data.t?.[index] ?? 0) * 1000).toISOString()
  }));
};
