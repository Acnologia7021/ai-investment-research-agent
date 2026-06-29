import { AppError } from "../errors/appError.js";

type FetchJsonOptions = {
  timeoutMs?: number;
  retries?: number;
  headers?: Record<string, string>;
  body?: unknown;
  method?: "GET" | "POST";
};

export const fetchJson = async (url: string, options: FetchJsonOptions = {}): Promise<unknown> => {
  const retries = options.retries ?? 1;
  let attempt = 0;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 12000);

    try {
      const requestInit: RequestInit = {
        method: options.method ?? (options.body ? "POST" : "GET"),
        headers: {
          "content-type": "application/json",
          ...options.headers
        },
        signal: controller.signal
      };

      if (options.body !== undefined) {
        requestInit.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, requestInit);

      if (response.status === 429) {
        throw new AppError("PROVIDER_RATE_LIMIT", "A data provider is currently rate limited.", 429);
      }

      if (!response.ok) {
        if (response.status >= 500 && attempt < retries) {
          attempt += 1;
          continue;
        }
        throw new AppError("PROVIDER_ERROR", "A data provider returned an error.", 502);
      }

      return (await response.json()) as unknown;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new AppError("PROVIDER_TIMEOUT", "A data provider timed out.", 504);
      }
      if (attempt < retries) {
        attempt += 1;
        continue;
      }
      throw new AppError("PROVIDER_ERROR", "A data provider request failed.", 502, error);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new AppError("PROVIDER_ERROR", "A data provider request failed.", 502);
};
