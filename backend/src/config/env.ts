import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const currentDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(currentDir, "../../.env") });

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    FRONTEND_ORIGIN: z.string().url().default("http://localhost:5173"),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
    GEMINI_API_KEY: z.string().optional().default(""),
    GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
    FINNHUB_API_KEY: z.string().optional().default(""),
    FINNHUB_BASE_URL: z.string().url().default("https://finnhub.io/api/v1"),
    TAVILY_API_KEY: z.string().optional().default("")
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "production") {
      for (const key of ["GEMINI_API_KEY", "FINNHUB_API_KEY", "TAVILY_API_KEY"] as const) {
        if (!env[key]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${key} is required in production`,
            path: [key]
          });
        }
      }
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid backend environment", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
