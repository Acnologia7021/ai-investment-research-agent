import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "../../config/env.js";
import { AppError } from "../../errors/appError.js";

export const createGeminiModel = () => {
  if (!env.GEMINI_API_KEY) {
    throw new AppError("MISSING_CONFIGURATION", "Gemini API key is not configured.", 503);
  }

  return new ChatGoogleGenerativeAI({
    apiKey: env.GEMINI_API_KEY,
    model: env.GEMINI_MODEL,
    temperature: 0.2
  });
};
