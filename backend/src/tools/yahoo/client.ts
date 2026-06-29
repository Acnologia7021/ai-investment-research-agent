import YahooFinance from "yahoo-finance2";

export const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey", "ripHistorical"]
});

export const isIndianTicker = (ticker: string) => ticker.endsWith(".NS") || ticker.endsWith(".BO");

export const yahooQuoteUrl = (ticker: string) => `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}`;
