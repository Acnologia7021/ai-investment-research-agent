import type { z } from "zod";
import { AppError } from "../../errors/appError.js";
import { createGeminiModel } from "./client.js";

export const invokeStructuredGemini = async <TSchema extends z.ZodType>(
  schema: TSchema,
  prompt: string,
  timeoutMs = 20000
): Promise<z.infer<TSchema>> => {
  try {
    const model = createGeminiModel().withStructuredOutput(schema);
    const response = await Promise.race([
      model.invoke(prompt),
      new Promise<never>((_resolve, reject) => {
        setTimeout(() => {
          reject(new AppError("PROVIDER_TIMEOUT", "Gemini timed out while generating structured analysis.", 504));
        }, timeoutMs);
      })
    ]);
    return schema.parse(response);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("VALIDATION_FAILED", "Gemini returned an invalid structured response.", 502, error);
  }
};
